"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

import {
  FAN,
  HAND,
  HERO,
  IntroCard,
  STACK,
  SuitDefs,
  stageVars,
  Z,
} from "./intro-cards";
import {
  INTRO_EXIT_ATTRIBUTE,
  INTRO_LOCK_ID,
  SHELL_ID,
} from "./intro-config";

/**
 * The first-visit ident.
 *
 * Why it exists: the catalogue is nineteen traditional card and board games, and
 * this is the one moment on the site where the studio gets to say that before a
 * word is read. A deck squares up, spreads into a hand, and turns over. The Ace
 * of Spades is the card printers have signed their decks on for three hundred
 * years, so it takes the middle, and at the end it comes at the viewer until its
 * face is the whole screen and dissolves into the page.
 *
 * It is not page-transition UI. It runs once per tab, on the route the visitor
 * actually asked for, and it has no opinion about which route that is: the
 * overlay lives in the root layout, so a direct arrival at `/careers/` gets its
 * own page behind the intro rather than a detour through home.
 *
 * ## What guarantees it goes away
 *
 * Four independent stops, in the order they would fire:
 *
 *   1. the normal path — the exit timeline's `onComplete`;
 *   2. `catch` around every step of setup, which calls the same `finish`;
 *   3. this island's own watchdog, if a tween somehow never completes;
 *   4. the gate script's failsafe, which needs no bundle to have loaded at all.
 *
 * All four do the same single thing: remove the gate's `<style>` element. That
 * element is both the overlay's `display` and the scroll lock, so there is no
 * ordering in which the page ends up covered, or scrollable but covered, or
 * uncovered but locked.
 *
 * ## What it will not do
 *
 * Wait for the whole page. Readiness is `load` plus `document.fonts.ready`, both
 * of which ignore lazily-loaded images, raced against a hard deadline. The
 * percentage is honest about it: it eases toward the high nineties and stops
 * there, because a loader that reads 100% while the page is still arriving is
 * lying.
 */

/**
 * Milliseconds since navigation start, not since mount. Every deadline here is
 * measured against the visitor's wait, which began long before React did.
 */
const since = () => performance.now();

/**
 * Hydration later than this means the visitor has been looking at the resting
 * deck for a while already. Running a 1.6 second choreography at them now would
 * add to a wait that is already too long, so the short form takes over: the
 * readout completes and the panel goes.
 */
const LATE_MOUNT_MS = 2600;

/** However slow the route is, the exit begins by here. */
const READY_DEADLINE_MS = 4200;

/** A tween that never completes cannot hold the screen past this. */
const HARD_STOP_MS = 6600;

/** The short form still has a floor, so it reads as a beat rather than a blink. */
const QUICK_FLOOR = 0.5;

export function SiteIntro({ lockup }: { lockup: ReactNode }) {
  const [showing, setShowing] = useState(true);
  const dismiss = useCallback(() => setShowing(false), []);

  if (!showing) return null;
  return <IntroOverlay lockup={lockup} onDone={dismiss} />;
}

function IntroOverlay({
  lockup,
  onDone,
}: {
  lockup: ReactNode;
  onDone: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const fan = fanRef.current;
      const caption = captionRef.current;
      const bar = barRef.current;
      const percent = percentRef.current;
      if (!overlay || !fan || !caption || !bar || !percent) return;

      // Either this tab has seen the intro and the overlay was never displayed,
      // or the gate's failsafe got here before hydration did. Both mean the
      // markup is already invisible, so the only job left is to remove it.
      const lock = document.getElementById(INTRO_LOCK_ID);
      if (!lock) {
        onDone();
        return;
      }

      const shell = document.getElementById(SHELL_ID);
      let finished = false;
      let watchdog = 0;
      let deadline = 0;

      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(watchdog);
        window.clearTimeout(deadline);
        // Removing this one node puts back the scroll, the overlay's
        // `display: none` and, with `inert` below, every tab stop on the page.
        lock.remove();
        shell?.removeAttribute("inert");
        onDone();
      };

      try {
        registerGsap();

        // The overlay is opaque and covers everything, so pointers are already
        // handled. This is for the keyboard: without it, tab moves focus
        // through a page nobody can see.
        shell?.setAttribute("inert", "");

        watchdog = window.setTimeout(
          finish,
          Math.max(1500, HARD_STOP_MS - since()),
        );

        const cards = gsap.utils.toArray<HTMLElement>("[data-intro-card]", fan);
        const flips = gsap.utils.toArray<HTMLElement>("[data-intro-flip]", fan);
        const heroInk =
          cards[HERO]?.querySelector<HTMLElement>("[data-intro-ink]");

        // The markup is ours, so this only fails if it has been changed out
        // from under the choreography. Leaving rather than animating half a
        // composition, and rather than handing GSAP a null target.
        if (
          cards.length !== HAND.length ||
          flips.length !== HAND.length ||
          !heroInk
        ) {
          finish();
          return;
        }

        const hero = cards[HERO];
        const heroFlip = flips[HERO];
        const wings = cards.filter((_, index) => index !== HERO);
        const wingFlips = flips.filter((_, index) => index !== HERO);

        /**
         * The readout. A plain object rather than React state: this changes
         * sixty times a second and only two nodes care, so it never goes
         * through a render.
         */
        const readout = { value: 0 };
        // Declared rather than parsed back off a degenerate scaleX(0) matrix.
        gsap.set(bar, { scaleX: 0 });
        const setBar = gsap.quickSetter(bar, "scaleX");
        const paint = () => {
          percent.textContent = `${Math.round(readout.value)}%`;
          setBar(readout.value / 100);
        };

        const late = since() > LATE_MOUNT_MS;

        let ready = false;
        let choreographed = false;
        let leave = () => {};

        const reveal = () => {
          if (finished || !ready || !choreographed) return;
          // Tells the gate's failsafe that something is alive and running the
          // exit, so it does not pull the overlay out mid-animation.
          lock.setAttribute(INTRO_EXIT_ATTRIBUTE, "");
          leave();
        };

        const markReady = () => {
          if (ready) return;
          ready = true;
          reveal();
        };

        whenReady().then(markReady, markReady);
        deadline = window.setTimeout(
          markReady,
          Math.max(0, READY_DEADLINE_MS - since()),
        );

        const media = gsap.matchMedia();

        media.add({ ok: MOTION_QUERY.ok }, (context) => {
          if (finished) return;

          const { ok } = context.conditions as { ok: boolean };
          const full = ok && !late;

          choreographed = false;

          const progress = gsap.timeline();
          const outro = gsap.timeline({ paused: true, onComplete: finish });
          let entrance: gsap.core.Timeline;
          let idle: gsap.core.Tween | null = null;

          if (full) {
            // GSAP has to own the transform outright, declared in its own
            // units. The pose in the markup is percentages of a card; GSAP
            // reads it back off the computed matrix, which is pixels, and
            // parks it in `x`/`y`. Setting those to zero in the same call is
            // what stops the deck being offset twice — once by the pose it was
            // painted with and again by the pose it is being given.
            cards.forEach((card, index) => {
              gsap.set(card, {
                x: 0,
                y: 0,
                xPercent: STACK[index].x,
                yPercent: STACK[index].y,
                rotation: STACK[index].r,
                willChange: "transform",
              });
            });

            entrance = gsap.timeline();

            // 1. The deck squares up, and the whole stage takes the tap.
            entrance
              .to(
                cards,
                {
                  xPercent: 0,
                  yPercent: 0,
                  rotation: 0,
                  duration: 0.32,
                  ease: ease.out,
                  stagger: 0.015,
                },
                0,
              )
              .to(fan, { scale: 1.03, duration: 0.16, ease: "power2.out" }, 0.04)
              .to(fan, { scale: 1, duration: 0.28, ease: ease.out }, 0.2);

            // 2. The spread, from the middle out. That is the direction a fan
            //    opens in, and it puts the hero card in place first so the rest
            //    of the hand arranges itself around a card that is already
            //    there.
            entrance
              .to(
                cards,
                {
                  xPercent: (index: number) => FAN[index].x,
                  yPercent: (index: number) => FAN[index].y,
                  rotation: (index: number) => FAN[index].r,
                  duration: 0.6,
                  ease: ease.out,
                  stagger: { each: 0.07, from: "center" },
                },
                0.22,
              )
              .to(hero, { scale: 1.06, duration: 0.6, ease: ease.out }, 0.22);

            // 3. The turn, outside in, so the reveal closes on the middle. The
            //    hero turns last and alone: it is the one the composition has
            //    been building toward.
            entrance
              .to(
                wingFlips,
                {
                  rotationY: 180,
                  duration: 0.44,
                  ease: ease.inOut,
                  stagger: { each: 0.07, from: "edges" },
                },
                0.62,
              )
              .to(
                heroFlip,
                { rotationY: 180, duration: 0.5, ease: ease.inOut },
                0.84,
              )
              // Set down with a little more weight than it was carried with.
              .to(hero, { scale: 1.11, duration: 0.16, ease: "power2.out" }, 1.14)
              .to(hero, { scale: 1.06, duration: 0.3, ease: ease.out }, 1.3);

            // While the route finishes arriving. Small enough to read as the
            // hand being held rather than as an animation still playing.
            idle = gsap.to(fan, {
              yPercent: -1.1,
              rotation: 0.5,
              duration: 2.4,
              ease: ease.loop,
              yoyo: true,
              repeat: -1,
              paused: true,
            });

            progress
              .to(readout, {
                value: 86,
                duration: 1.4,
                ease: ease.out,
                onUpdate: paint,
              })
              // Approaches, never arrives. The last few points belong to the
              // route, not to a timer.
              .to(readout, {
                value: 97,
                duration: 4.4,
                ease: "power2.out",
                onUpdate: paint,
              });

            outro
              .to(
                readout,
                { value: 100, duration: 0.3, ease: ease.out, onUpdate: paint },
                0,
              )
              .to(fan, { yPercent: 0, rotation: 0, duration: 0.26, ease: ease.out }, 0)
              // The hand gathers back under the ace. They land a shade smaller
              // than it, so they end up behind a card rather than beside one
              // and never need to be faded out.
              .to(
                wings,
                {
                  xPercent: 0,
                  yPercent: 0,
                  rotation: 0,
                  scale: 0.97,
                  duration: 0.34,
                  ease: ease.inOut,
                  stagger: { each: 0.03, from: "edges" },
                },
                0.08,
              )
              // Drawn back before it is thrown. Without it the first frame of
              // the rush is a frame where nothing moves, and that is the frame
              // being watched.
              .to(hero, { scale: 1, duration: 0.14, ease: ease.out }, 0.4)
              // The readout has said 100 and the card is about to be the whole
              // screen. It leaves under its own steam rather than being
              // covered: the caption is a later sibling of the stage, so it
              // paints over the growing card no matter what z the card carries.
              .to(caption, { autoAlpha: 0, duration: 0.22, ease: ease.out }, 0.4)
              // The ink goes early, while the card is still small enough for
              // the loss to be invisible. What grows is a plain white sheet.
              .to(heroInk, { autoAlpha: 0, duration: 0.16, ease: "none" }, 0.54)
              // Toward the eye, so it accelerates. This is the one easing on
              // the site allowed to start slow: it describes an object moving
              // in depth, not a control answering a press.
              .to(
                hero,
                { scale: coverScale(hero), duration: 0.46, ease: "power2.in" },
                0.54,
              )
              // By now the card's face is the entire screen, so this fades
              // white into the page rather than the intro into the page.
              .to(overlay, { autoAlpha: 0, duration: 0.28, ease: ease.out }, 0.94);
          } else {
            // Reduced motion, or a hydration late enough that choreography
            // would be an imposition. The deck stays exactly as painted; only
            // the readout moves, and then the panel goes.
            entrance = gsap.timeline().to({}, { duration: QUICK_FLOOR });

            progress
              .to(readout, {
                value: 90,
                duration: 0.5,
                ease: ease.out,
                onUpdate: paint,
              })
              .to(readout, {
                value: 97,
                duration: 3.2,
                ease: "power2.out",
                onUpdate: paint,
              });

            outro
              .to(
                readout,
                { value: 100, duration: 0.26, ease: ease.out, onUpdate: paint },
                0,
              )
              .to(overlay, { autoAlpha: 0, duration: 0.3, ease: ease.out }, 0.22);
          }

          entrance.eventCallback("onComplete", () => {
            choreographed = true;
            idle?.play();
            reveal();
          });

          // `ready` may already be true here — a cached route resolves `load`
          // before hydration finishes. Nothing to do about it at this point:
          // `choreographed` was just reset, so the entrance's own callback
          // above is what will pick the reveal up.
          leave = () => {
            idle?.pause();
            progress.kill();
            outro.play();
          };

          return () => {
            entrance.kill();
            idle?.kill();
            progress.kill();
            outro.kill();
          };
        });

        return () => {
          window.clearTimeout(watchdog);
          window.clearTimeout(deadline);
          media.revert();
          // Deliberately not removing the lock here. There are only two ways
          // this unmounts: after `finish`, which already removed it, or with
          // the whole app, where the gate script's failsafe is the backstop.
          // Removing it on every unmount breaks the one case that does happen
          // — StrictMode's mount, unmount, mount — because the second mount
          // would find no lock and dismiss an intro that never played.
        };
      } catch {
        // Registration, plugin loading or a selector failed. Nothing about the
        // site depends on this overlay, so it leaves without ceremony.
        finish();
      }
    },
    { scope: overlayRef },
  );

  return (
    <div
      ref={overlayRef}
      className="intro-overlay bg-canvas fixed inset-0 z-[110] place-items-center overflow-hidden"
    >
      {/* Said once, quietly. The percentage below is `aria-hidden`: a readout
          that changes sixty times a second inside a live region is not
          information, it is an interruption. */}
      <p role="status" className="sr-only">
        Loading FunFuse Games
      </p>

      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(38%_34%_at_50%_44%,var(--color-brand-50),transparent_70%)]" />
      </div>

      {/* One width for the whole composition, so the readout is always a
          proportion of the hand above it rather than of the viewport. The
          middle term is a width bounded by the *height*: the stage is 3:2, so
          90vh of width is 60vh of stage, which leaves the readout room on a
          landscape phone that is 390px tall. */}
      <div
        aria-hidden
        className="relative flex w-[min(86vw,90vh,34rem)] flex-col items-center gap-8 sm:gap-10"
      >
        <div
          style={stageVars}
          className="intro-stage relative aspect-[3/2] w-full"
        >
          <SuitDefs />
          <div ref={fanRef} className="absolute inset-0">
            {HAND.map((face, index) => (
              <IntroCard
                key={`${face.rank}-${face.suit}`}
                face={face}
                pose={STACK[index]}
                z={Z[index]}
              />
            ))}
          </div>
        </div>

        <div ref={captionRef} className="w-[76%]">
          <div className="bg-line relative h-0.5 overflow-hidden rounded-full">
            {/* An inline transform, not Tailwind's `scale-x-0`. That utility
                compiles to the standalone `scale` property in v4, which
                multiplies against the `transform` GSAP writes here — an empty
                bar that stays empty however far the readout gets. */}
            <div
              ref={barRef}
              style={{ transform: "scaleX(0)" }}
              className="bg-accent absolute inset-0 origin-left rounded-full"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            {lockup}
            <span
              ref={percentRef}
              className="text-heading tabular text-sm font-medium"
            >
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * How far the hero card has to grow before its face is the whole viewport.
 *
 * Measured rather than guessed: the stage is capped at 30rem, so the same fixed
 * number would leave a border of page showing on a wide desktop and overshoot by
 * a factor of four on a phone. Resolved by GSAP when the tween first renders,
 * which is the instant the card is back at scale 1.
 */
function coverScale(hero: HTMLElement) {
  return () => {
    const box = hero.getBoundingClientRect();
    if (!box.width || !box.height) return 18;

    return (
      Math.max(window.innerWidth / box.width, window.innerHeight / box.height) *
      1.3
    );
  };
}

/**
 * Ready enough to hand the screen over.
 *
 * `load` rather than `DOMContentLoaded`, because a hero image that pops in one
 * frame after the intro leaves is the thing the intro exists to prevent. Lazy
 * images below the fold do not hold `load`, which is the whole reason it is
 * usable here. Fonts get their own signal: the page swapping typeface behind a
 * dissolving overlay is the same jolt by a different route.
 *
 * Neither can hang the visitor — the caller races this against a deadline.
 */
function whenReady(): Promise<unknown> {
  const documentReady =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });

  const fontsReady =
    "fonts" in document
      ? document.fonts.ready.catch(() => undefined)
      : Promise.resolve();

  return Promise.all([documentReady, fontsReady]);
}
