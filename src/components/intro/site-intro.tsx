"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

import {
  BEAT,
  COUNT,
  FULL_SECONDS,
  QUIET,
  QUIET_SECONDS,
  WATCHDOG_SLACK_MS,
} from "./intro-beats";
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
  INTRO_CLAIM_ATTRIBUTE,
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
 * ## A brand animation, not a loading indicator
 *
 * One master timeline of fixed length, built entirely from the literals in
 * `intro-beats.ts`. Nothing here consults `load`, `readyState`, `fonts.ready` or
 * any resource, and nothing pauses. The route renders behind the overlay at
 * whatever pace the connection allows and is revealed in whatever state it has
 * reached when the animation ends.
 *
 * That is a deliberate reversal. Tying the choreography to real readiness meant
 * a slow connection got a half-played animation and a readout stuck in the high
 * eighties, which is the opposite of what an identity moment is for. The count
 * is now choreography: it belongs to the cards, not to the network, and it
 * always reaches 100.
 *
 * ## What it is not
 *
 * Route-transition UI. It runs once per tab, on the route the visitor actually
 * asked for — the overlay lives in the root layout, so a direct arrival at
 * `/careers/` gets its own page behind the intro rather than a detour through
 * home. It never touches the router, and leaving does no more than unmount a
 * fixed overlay, so it cannot set a page transition going on its way out.
 *
 * ## What guarantees it goes away
 *
 * Four independent stops:
 *
 *   1. the normal path — the master timeline's `onComplete`, at a known time;
 *   2. `catch` around every step of setup, which calls the same `finish`;
 *   3. this island's watchdog, for a timeline stalled by a backgrounded tab;
 *   4. the gate script's failsafe, for a bundle that never ran at all. Once
 *      this island claims the lock, that one stands down for good.
 *
 * All four do the same single thing: remove the gate's `<style>` element. That
 * element is both the overlay's `display` and the scroll lock, so there is no
 * ordering in which the page ends up covered, or scrollable but covered, or
 * uncovered but locked.
 */

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

      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(watchdog);
        // Removing this one node puts back the scroll, the overlay's
        // `display: none` and, with `inert` below, every tab stop on the page.
        lock.remove();
        shell?.removeAttribute("inert");
        onDone();
      };

      try {
        registerGsap();

        // Claim it. From here the gate's twenty-second failsafe stands down and
        // this island owns the lifecycle, however long the bundle took to
        // arrive. Set before a single tween is built, so a throw below still
        // leaves the `catch` in charge rather than the gate.
        lock.setAttribute(INTRO_CLAIM_ATTRIBUTE, "");

        // The overlay is opaque and covers everything, so pointers are already
        // handled. This is for the keyboard: without it, tab moves focus
        // through a page nobody can see.
        shell?.setAttribute("inert", "");

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

        const media = gsap.matchMedia();

        media.add({ ok: MOTION_QUERY.ok }, (context) => {
          if (finished) return;

          const { ok } = context.conditions as { ok: boolean };

          const master = gsap.timeline({ onComplete: finish });

          if (ok) {
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

            // ---- The deck arrives ------------------------------------------
            master
              .to(
                cards,
                {
                  xPercent: 0,
                  yPercent: 0,
                  rotation: 0,
                  duration: BEAT.square.duration,
                  ease: ease.out,
                  stagger: BEAT.square.stagger,
                },
                BEAT.square.at,
              )
              .to(
                fan,
                {
                  scale: 1.03,
                  duration: BEAT.tapIn.duration,
                  ease: "power2.out",
                },
                BEAT.tapIn.at,
              )
              .to(
                fan,
                { scale: 1, duration: BEAT.tapOut.duration, ease: ease.out },
                BEAT.tapOut.at,
              );

            // ---- The spread, from the middle out ---------------------------
            // That is the direction a fan opens in, and it puts the hero card
            // in place first so the rest of the hand arranges itself around a
            // card that is already there.
            master
              .to(
                cards,
                {
                  xPercent: (index: number) => FAN[index].x,
                  yPercent: (index: number) => FAN[index].y,
                  rotation: (index: number) => FAN[index].r,
                  duration: BEAT.spread.duration,
                  ease: ease.out,
                  stagger: { each: BEAT.spread.stagger, from: "center" },
                },
                BEAT.spread.at,
              )
              .to(
                hero,
                { scale: 1.06, duration: BEAT.lift.duration, ease: ease.out },
                BEAT.lift.at,
              );

            // ---- The turn, outside in --------------------------------------
            // So the reveal closes on the middle. The hero turns last and
            // alone: it is the one the composition has been building toward.
            master
              .to(
                wingFlips,
                {
                  rotationY: 180,
                  duration: BEAT.turn.duration,
                  ease: ease.inOut,
                  stagger: { each: BEAT.turn.stagger, from: "edges" },
                },
                BEAT.turn.at,
              )
              .to(
                heroFlip,
                {
                  rotationY: 180,
                  duration: BEAT.heroTurn.duration,
                  ease: ease.inOut,
                },
                BEAT.heroTurn.at,
              )
              // Set down with a little more weight than it was carried with.
              .to(
                hero,
                {
                  scale: 1.11,
                  duration: BEAT.landIn.duration,
                  ease: "power2.out",
                },
                BEAT.landIn.at,
              )
              .to(
                hero,
                { scale: 1.06, duration: BEAT.landOut.duration, ease: ease.out },
                BEAT.landOut.at,
              );

            // ---- Presented -------------------------------------------------
            // The ace lifts clear while the hand settles under it. This is the
            // beat that used to be an open-ended idle loop waiting on the
            // network; it is now a held moment of a known length, which is what
            // it always looked like on a fast connection anyway.
            master
              .to(
                hero,
                {
                  yPercent: -4,
                  duration: BEAT.present.duration,
                  ease: ease.out,
                },
                BEAT.present.at,
              )
              .to(
                fan,
                {
                  yPercent: 1.6,
                  rotation: 0.4,
                  duration: BEAT.present.duration,
                  ease: ease.loop,
                },
                BEAT.present.at,
              )
              .to(
                fan,
                {
                  yPercent: 0,
                  rotation: 0,
                  duration: BEAT.level.duration,
                  ease: ease.out,
                },
                BEAT.level.at,
              );

            // ---- The hand closes, and the ace leaves ------------------------
            master
              // They land a shade smaller than the ace, so they end up behind a
              // card rather than beside one and never need to be faded out.
              .to(
                wings,
                {
                  xPercent: 0,
                  yPercent: 0,
                  rotation: 0,
                  scale: 0.97,
                  duration: BEAT.gather.duration,
                  ease: ease.inOut,
                  stagger: { each: BEAT.gather.stagger, from: "edges" },
                },
                BEAT.gather.at,
              )
              // Drawn back before it is thrown. Without it the first frame of
              // the rush is a frame where nothing moves, and that is the frame
              // being watched.
              .to(
                hero,
                {
                  yPercent: 0,
                  scale: 1,
                  duration: BEAT.drawBack.duration,
                  ease: ease.out,
                },
                BEAT.drawBack.at,
              )
              // The readout has said 100 for a quarter second by now. The
              // caption leaves under its own steam rather than being covered:
              // it is a later sibling of the stage, so it paints over the
              // growing card no matter what z the card carries.
              .to(
                caption,
                {
                  autoAlpha: 0,
                  duration: BEAT.caption.duration,
                  ease: ease.out,
                },
                BEAT.caption.at,
              )
              // The ink goes early, while the card is still small enough for
              // the loss to be invisible. What grows is a plain white sheet.
              .to(
                heroInk,
                { autoAlpha: 0, duration: BEAT.ink.duration, ease: "none" },
                BEAT.ink.at,
              )
              // Toward the eye, so it accelerates. This is the one easing on
              // the site allowed to start slow: it describes an object moving
              // in depth, not a control answering a press.
              .to(
                hero,
                {
                  scale: coverScale(hero),
                  duration: BEAT.rush.duration,
                  ease: "power2.in",
                },
                BEAT.rush.at,
              )
              // By now the card's face is the entire screen, so this fades
              // white into the page rather than the intro into the page.
              .to(
                overlay,
                {
                  autoAlpha: 0,
                  duration: BEAT.reveal.duration,
                  ease: ease.out,
                },
                BEAT.reveal.at,
              );

            // The count, one segment per act. `power1.inOut` rather than the
            // site's usual `ease.out`: five consecutive segments each starting
            // at full tilt reads as five separate surges, and this is meant to
            // be one continuous count that happens to breathe at the act
            // breaks. The few frames of gap between segments do that breathing.
            for (const step of COUNT) {
              master.to(
                readout,
                {
                  value: step.to,
                  duration: step.duration,
                  ease: "power1.inOut",
                  onUpdate: paint,
                },
                step.at,
              );
            }
          } else {
            // Reduced motion. The deck stays exactly as the server painted it;
            // only the count runs, and then the panel goes.
            master
              .to(
                readout,
                {
                  value: 100,
                  duration: QUIET.count.duration,
                  ease: ease.out,
                  onUpdate: paint,
                },
                QUIET.count.at,
              )
              .to(
                overlay,
                {
                  autoAlpha: 0,
                  duration: QUIET.reveal.duration,
                  ease: ease.out,
                },
                QUIET.reveal.at,
              );
          }

          // The beat map is what gets reviewed and checked; this is what
          // actually plays. If they ever disagree, the map is lying about the
          // length of the animation and every check written against it is
          // measuring the wrong thing. Development only — stripped from the
          // production bundle.
          if (process.env.NODE_ENV !== "production") {
            const declared = ok ? FULL_SECONDS : QUIET_SECONDS;
            if (Math.abs(master.duration() - declared) > 0.001) {
              console.warn(
                `Intro timeline runs ${master.duration()}s but intro-beats declares ${declared}s.`,
              );
            }
          }

          // Derived from the timeline that was actually built, so it can never
          // drift from the beats. It is insurance against a stalled playhead —
          // a backgrounded tab stops serving frames — and never fires on a page
          // the visitor is looking at.
          watchdog = window.setTimeout(
            finish,
            master.duration() * 1000 + WATCHDOG_SLACK_MS,
          );

          return () => {
            window.clearTimeout(watchdog);
            master.kill();
          };
        });

        return () => {
          window.clearTimeout(watchdog);
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
        FunFuse Games
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
 * Measured rather than guessed: the stage is capped at 34rem, so the same fixed
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
