"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { SuitIcon, SUITS, type SuitName } from "@/components/ui/suits";
import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

import { isSamePath } from "./paths";
import {
  getServerTransitionRequest,
  getTransitionRequest,
  subscribeToTransitions,
} from "./transition-store";

/**
 * Internal page transitions.
 *
 * ## The idea
 *
 * The first-visit intro is a hand of cards on a light table, converging on one
 * card that rushes the viewer. This is the same vocabulary pointed the other
 * way: **a deck dealt across the viewport**. Columns of red felt rise from
 * below in a stagger, each carrying a pile of card backs — the dotted field,
 * the inset hairline and the single suit the contact hero's hand is drawn with
 * — so what covers the page reads as cards being laid down rather than as a
 * curtain coming across.
 *
 * The felt is what actually covers the outgoing page. That is what frees the
 * cards to sit at angles, overlap, and run out at the bottom of a very tall
 * phone without ever opening a gap onto the page underneath.
 *
 * They never reverse. The columns keep travelling up and off, so the cover and
 * the reveal are one pass of the same hand — which is why the whole thing reads
 * as fast even though it is two animations.
 *
 * ## The machine
 *
 *     idle → cover → covered ─(pathname changed)→ reveal → idle
 *                       ↑ waiting
 *
 * Two signals, no timers doing the real work. `onNavigate` on a link opens the
 * transition; `usePathname()` moving away from the pathname recorded at click
 * time is the commit. If the route commits during the cover — which is what
 * prefetching buys — the reveal begins the moment the cover finishes, and
 * nothing is ever delayed waiting for an animation to catch up.
 *
 * ## Slow routes
 *
 * The animation never stretches. If the route has not committed by the end of
 * the cover the machine simply parks, the piles settle, and the reveal starts
 * the instant the pathname moves. No progress figure: this system has no idea
 * how far along a navigation is, and inventing one would be a lie.
 *
 * ## What it deliberately does not do
 *
 * Lock scrolling. The intro locks because it holds the screen for four and a
 * half seconds; this holds it for about a third of one, and every scroll lock
 * is a chance to leave the document stuck. Blocking pointer events on the
 * covering overlay is enough to keep the outgoing page from being clicked, and
 * it cannot fail closed. The two systems therefore share no state at all, only
 * an agreed z-order: header 50, this 90, skip link 100, intro 110.
 *
 * Animate history traversal. `onNavigate` does not fire for back and forward,
 * and covering from a `popstate` listener would race the router's own commit —
 * a cover that loses that race is a flash of the destination, which is worse
 * than no animation. Traversal stays instant, which is also what keeps the
 * browser's scroll restoration intact.
 */

/** Seconds. */
const COVER = 0.2;
const COVER_STAGGER = 0.025;
/** Guarantees at least one frame where the outgoing page is completely gone. */
const HOLD = 0.07;
const REVEAL = 0.24;
const REVEAL_STAGGER = 0.025;

/** Reduced motion: the same machine, a plain wash instead of a deal. */
const QUIET_COVER = 0.11;
const QUIET_HOLD = 0.04;
const QUIET_REVEAL = 0.14;

/**
 * Last resort only. A navigation that never commits — a route that throws, a
 * chunk that will not arrive — must not leave the viewport covered. Generous,
 * because the covered wait is a designed state and a slow route is allowed to
 * take its time; this is for the case where nothing is coming.
 */
const WATCHDOG_MS = 8000;

/** Five columns, the last two only from `md`. See the markup for why. */
const COLUMNS = [0, 1, 2, 3, 4];

/**
 * Enough that a column looks like a pile rather than a short stack, on the
 * tallest phone anyone is holding. A card advances the stack by 106cqw, so
 * eight of them reach 855% of a column's width: 1026px down a 120px-wide
 * column on a 360x932 phone, and 2189px down a 256px one on a 1280 desktop.
 *
 * Running out at the bottom of some future letterbox is a cosmetic problem
 * rather than a correctness one — the felt underneath is what covers the page.
 */
const CARDS_PER_COLUMN = 8;

/**
 * A pile of cards is never square and never random. Both cycles are prime-ish
 * against `CARDS_PER_COLUMN`, so the pattern does not line up with itself down
 * a column or across the row of columns.
 */
const TILT = [-2.6, 1.8, -1.2, 2.4, -3, 1.2, -1.8];
/** Percentages of a card's own width. */
const SHIFT = [-2, 1.5, -1, 2, -1.5, 1, -2.5];

type Phase = "idle" | "cover" | "reveal";

export function RouteTransition() {
  const pathname = usePathname();
  const request = useSyncExternalStore(
    subscribeToTransitions,
    getTransitionRequest,
    getServerTransitionRequest,
  );

  /**
   * The last request this overlay finished. Whether it is on screen is derived
   * from that and the store, rather than held as its own state — there is no
   * moment where "a request is outstanding" and "the overlay is mounted" are
   * allowed to disagree, so making them one value removes the class of bug
   * where they do.
   */
  const [completed, setCompleted] = useState(0);
  const active = request !== null && request.id !== completed;

  const stage = useRef<HTMLDivElement>(null);
  const machine = useRef<{
    from: string;
    phase: Phase;
    covered: boolean;
    arrived: boolean;
    reveal: (() => void) | null;
    recover: (() => void) | null;
  }>({
    from: "",
    phase: "idle",
    covered: false,
    arrived: false,
    reveal: null,
    recover: null,
  });

  // A click arms the machine. Mounting is already handled by `active` above;
  // this only records where the navigation started from, and catches the one
  // case the derived value cannot see — a second click while a transition is
  // still on screen, where `active` was true before and stays true.
  useEffect(() => {
    if (!request) return;

    const state = machine.current;
    state.from = request.from;
    state.arrived = false;

    // Clicked something while the panels were on their way out. They are still
    // on screen, so bring them back down rather than starting from nothing.
    if (state.phase === "reveal") state.recover?.();
  }, [request]);

  // The commit. Not "the pathname is the one we asked for" but "the pathname is
  // no longer the one we left", which is immune to how the router normalises
  // trailing slashes and correct even if the destination redirects.
  useEffect(() => {
    const state = machine.current;
    if (!active || !state.from) return;
    if (isSamePath(pathname, state.from)) return;

    state.arrived = true;
    if (state.covered) state.reveal?.();
  }, [pathname, active]);

  useGSAP(
    () => {
      if (!active) return;

      const root = stage.current;
      if (!root) return;

      const state = machine.current;
      let watchdog = 0;

      const done = () => {
        window.clearTimeout(watchdog);
        state.phase = "idle";
        state.covered = false;
        state.reveal = null;
        state.recover = null;
        // Read at completion, not captured at the start: after a mid-reveal
        // click this same effect is serving a newer request, and retiring the
        // older id would leave the overlay mounted with nothing driving it.
        // Unmounts the overlay — nothing of this system is left in the document
        // between navigations, so there is no invisible layer to get wrong.
        setCompleted(getTransitionRequest()?.id ?? 0);
      };

      try {
        registerGsap();

        // Only the panels this breakpoint actually shows. Including the two
        // hidden below `md` would pad the stagger with a tenth of a second of
        // nothing happening on precisely the devices that can least afford it.
        const panels = gsap.utils
          .toArray<HTMLElement>("[data-route-panel]", root)
          .filter((panel) => panel.offsetWidth > 0);
        const sheet = root.querySelector<HTMLElement>("[data-route-sheet]");
        // Taken from the columns that are actually on screen rather than
        // queried off the root, so the two hidden below `md` are never animated.
        // These are the card stacks, not the cards: eight cards times five
        // columns is forty elements, and forty is not a number to hand a tween
        // for scenery. Moving the stack moves every card in it for the price of
        // one transform.
        const drifts = panels.flatMap((panel) => {
          const drift = panel.querySelector<HTMLElement>("[data-route-drift]");
          return drift ? [drift] : [];
        });

        if (!panels.length || !sheet) {
          done();
          return;
        }

        state.phase = "cover";
        state.covered = false;

        /**
         * Per cover, not per mount. Reaching it means the router never
         * committed — a route that threw, a chunk that will not arrive — and
         * the least bad answer is to give the page back. It is insurance, not
         * the mechanism: on every navigation that works, the pathname beats it
         * by three orders of magnitude.
         */
        const armWatchdog = () => {
          window.clearTimeout(watchdog);
          watchdog = window.setTimeout(() => {
            if (state.reveal) state.reveal();
            else done();
          }, WATCHDOG_MS);
        };

        const media = gsap.matchMedia();

        media.add({ ok: MOTION_QUERY.ok }, (context) => {
          const { ok } = context.conditions as { ok: boolean };

          let cover: gsap.core.Timeline | null = null;
          let waiting: gsap.core.Timeline | null = null;
          let leaving: gsap.core.Timeline | null = null;

          const reveal = () => {
            if (state.phase === "reveal") return;
            state.phase = "reveal";

            waiting?.kill();
            cover?.kill();

            // The destination is behind a layer that is now only leaving. Hand
            // the page back before the animation is over rather than after: it
            // is what makes a 700ms transition feel like a 370ms one.
            root.style.pointerEvents = "none";

            leaving = gsap.timeline({ onComplete: done });

            if (!ok) {
              leaving.to(sheet, {
                autoAlpha: 0,
                duration: QUIET_REVEAL,
                ease: "none",
              });
              return;
            }

            // The cards belong to the columns and leave with them; the only
            // thing to undo is a drift caught mid-breath.
            if (drifts.length) gsap.set(drifts, { y: 0 });

            // Up and out, the way they came in. A panel that reversed would
            // read as a mistake being undone.
            leaving.to(
              panels,
              {
                yPercent: -110,
                duration: REVEAL,
                ease: ease.out,
                stagger: REVEAL_STAGGER,
              },
              0,
            );
          };

          const covered = () => {
            state.covered = true;

            if (state.arrived) {
              reveal();
              return;
            }

            // Only now, and only because the route is genuinely not here yet.
            // The cards are already on screen, so waiting is the pile settling
            // rather than something arriving. Six pixels, in `y` rather than a
            // percentage: the stack is eight cards tall, so 1% of it would be a
            // lurch. On a prefetched navigation this never runs at all.
            if (!ok || !drifts.length) return;

            waiting = gsap.timeline().to(drifts, {
              y: -6,
              duration: 1.1,
              ease: ease.loop,
              yoyo: true,
              repeat: -1,
              stagger: { each: 0.09, from: "center" },
            });
          };

          /**
           * `opening` is the difference between the first cover of a
           * transition and one that interrupts a reveal.
           *
           * Opening, the panels have to be *placed* off screen: the markup's
           * inline `translateY(110%)` is what stops them flashing before GSAP
           * exists, and GSAP reads that back off the computed matrix as pixels,
           * so `y: 0` has to go with `yPercent: 110` or they start a screen and
           * a bit away.
           *
           * Interrupting, they are already halfway out of frame and GSAP
           * already owns the transform. Placing them again would snap them
           * below the fold and re-run the whole entrance, which is a jump the
           * visitor would see. They simply come back down from where they are.
           */
          const startCover = (opening: boolean) => {
            state.phase = "cover";
            state.covered = false;
            root.style.pointerEvents = "auto";
            armWatchdog();

            cover = gsap.timeline({ onComplete: covered });

            if (!ok) {
              // Reduced motion gets the machine and none of the choreography:
              // a wash in the page's own colour, there to hide a half-built
              // destination rather than to be looked at.
              cover
                .to(
                  sheet,
                  { autoAlpha: 1, duration: QUIET_COVER, ease: "none" },
                  0,
                )
                .to({}, { duration: QUIET_HOLD });
              return;
            }

            cover
              .to(
                panels,
                {
                  yPercent: 0,
                  duration: COVER,
                  ease: ease.drawer,
                  stagger: COVER_STAGGER,
                  ...(opening ? { startAt: { y: 0, yPercent: 110 } } : {}),
                },
                0,
              )
              .to({}, { duration: HOLD });
          };

          state.reveal = reveal;
          state.recover = () => {
            leaving?.kill();
            if (drifts.length) gsap.set(drifts, { y: 0 });
            startCover(false);
          };

          startCover(true);

          return () => {
            cover?.kill();
            waiting?.kill();
            leaving?.kill();
          };
        });

        return () => {
          window.clearTimeout(watchdog);
          media.revert();
        };
      } catch {
        // Registration or a selector failed. Nothing about the site depends on
        // this overlay existing, so it leaves and the navigation stands.
        done();
      }
    },
    { scope: stage, dependencies: [active] },
  );

  if (!active) return null;

  return (
    // Decorative in full: the destination is painted over, never hidden from
    // assistive technology, and there is nothing in here to focus or announce.
    <div
      ref={stage}
      aria-hidden
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{ pointerEvents: "auto" }}
    >
      {/* Reduced motion's whole visual. Canvas-coloured, so it reads as the
          page holding still rather than as a thing that arrived. */}
      <div
        data-route-sheet
        className="bg-canvas absolute inset-0"
        style={{ opacity: 0, visibility: "hidden" }}
      />

      <div className="absolute inset-0 flex">
        {COLUMNS.map((column) => (
          <div
            key={column}
            data-route-panel
            // Off screen in the first painted frame, before GSAP exists. A
            // column that flashes at rest is the one bug this whole overlay
            // would be remembered for.
            style={{ transform: "translateY(110%)" }}
            className={cn(
              // The felt, not a card. It is what actually covers the outgoing
              // page — the cards are laid on top of it and are free to sit at
              // angles, overlap and run out at the bottom of a very tall phone
              // without ever opening a gap. brand-800 against brand-600 cards
              // is the same hue two steps apart, which is what lets a pile of
              // red cards read as a pile rather than as one red shape.
              "bg-brand-800 relative -mr-px h-full flex-1 overflow-hidden",
              // The negative margin closes the subpixel seam between columns;
              // the stage clips whatever hangs off the last one.
              // Makes cqw a percentage of this column, so a card is the same
              // proportion of it at every width.
              "[container-type:inline-size]",
              // Three columns on a phone, five from md. A fifth of a 1280px
              // screen is a card; a fifth of a 375px one is a splinter.
              column > 2 && "hidden md:block",
            )}
          >
            {/* The deal. Cards overlap by a seventh of their height, so the
                column reads as a pile being squared rather than a list. */}
            <div
              data-route-drift
              className="absolute inset-x-0 -top-[10cqw] flex flex-col items-center"
            >
              {Array.from({ length: CARDS_PER_COLUMN }, (_, row) => (
                <TransitionCard
                  key={row}
                  // Both indices, so neither the columns nor the rows repeat a
                  // suit in step with each other.
                  suit={SUITS[(column + row) % SUITS.length]}
                  row={row}
                />
              ))}
            </div>

            {/* The leading edge. The bright lines sweeping up are the whole
                reason the cover reads as movement rather than as a colour. */}
            <span className="bg-brand-300 absolute inset-x-0 top-0 h-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * One card back, drawn the way the contact hero draws its hand: the dotted
 * field, the inset hairline, one suit in the middle. Percentage radii rather
 * than a fixed one, so the corners stay in proportion from a 108px card on a
 * phone to a 220px card on a desktop.
 *
 * Not a GSAP target — the column above it is the only thing that moves — so the
 * pose is a plain inline transform with nothing to argue with.
 */
function TransitionCard({ suit, row }: { suit: SuitName; row: number }) {
  return (
    <div
      style={{
        transform: `rotate(${TILT[row % TILT.length]}deg) translateX(${SHIFT[row % SHIFT.length]}%)`,
        // The overlap. Every card after the first is pulled up into the one
        // before it, which is what makes a column a pile rather than a list.
        marginTop: row === 0 ? undefined : "-14cqw",
      }}
      className="bg-accent-strong relative aspect-[5/7] w-[86cqw] shrink-0 rounded-[8%/6%] shadow-sm"
    >
      <span className="absolute inset-0 rounded-[8%/6%] bg-[radial-gradient(var(--color-brand-300)_1px,transparent_1px)] opacity-45 [background-size:9px_9px]" />
      <span className="border-surface/30 absolute inset-[7%] rounded-[6%/4%] border" />
      <span className="absolute inset-0 grid place-items-center">
        <SuitIcon suit={suit} className="text-surface/85 h-[14cqw] w-[14cqw]" />
      </span>
    </div>
  );
}
