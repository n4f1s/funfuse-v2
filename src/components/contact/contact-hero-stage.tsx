"use client";

import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The hero stage: a deck being idly shuffled.
 *
 * Why it animates: it is the only thing on a contact page that can say "there
 * is somebody here" before a word has been exchanged. The gesture is somebody
 * turning a deck over in their hands while they wait for you to speak, which
 * is a different sentence from the fan on the careers page (an offer) and from
 * the table below (progress). Three card scenes on this site, three things
 * being said.
 *
 * It costs a loop, so it is paid for carefully: desktop only, and paused the
 * moment it leaves the viewport or the tab goes to the background. An idle
 * tween behind a scrolled-past section is exactly the cost that never shows up
 * in a screenshot.
 *
 * The resting spread is an inline transform in the server HTML, so reduced
 * motion, no JavaScript and a failed chunk all get a fanned deck rather than a
 * pile of rectangles.
 */

/** Fractions of the stage. Every card starts life stacked on this point. */
const CARD_W = 0.29;
const STAGE_ASPECT = 5 / 4;
const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;
const ORIGIN = { x: 0.5, y: 0.5 };

/** The spread. Percentages of a card, which is how GSAP will read them back. */
const FAN = [
  { x: -152, y: 24, r: -26 },
  { x: -92, y: -6, r: -15 },
  { x: -31, y: -22, r: -5 },
  { x: 31, y: -22, r: 5 },
  { x: 92, y: -6, r: 15 },
  { x: 152, y: 24, r: 26 },
];

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

export function ContactHeroStage({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const tiltEl = tilt.current;
      if (!stageEl || !tiltEl) return;

      registerGsap();

      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", stageEl);
      if (cards.length !== FAN.length) return;

      const media = gsap.matchMedia();

      media.add(
        {
          ok: MOTION_QUERY.ok,
          // The shuffle is an infinite timeline. On a phone the stage is a
          // third of the size and the loop would be a compositor layer per
          // card for as long as the page is open.
          desktop: MOTION_QUERY.desktop,
          // Tilt is a pointer affordance. On touch a tap reports as a hover
          // and leaves the deck stuck mid-lean, so it is gated, not scaled.
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { ok, desktop, pointer } = context.conditions as {
            ok: boolean;
            desktop: boolean;
            pointer: boolean;
          };

          // Reduced motion: the deck is already fanned. There is nothing to
          // schedule, because a static spread is the correct end state.
          if (!ok) return;

          const cleanups: (() => void)[] = [];

          if (desktop) {
            const loop = gsap.timeline({
              paused: true,
              repeat: -1,
              repeatDelay: 1.4,
            });

            loop
              // Gather. The fan closes into a squared stack.
              .to(cards, {
                xPercent: 0,
                yPercent: 0,
                rotation: (index: number) => (index - 2.5) * 1.6,
                duration: 0.5,
                ease: ease.out,
                stagger: { each: 0.035, from: "edges" },
              })
              // Riffle. The top of the stack springs apart and snaps back,
              // which is the gesture that says a hand is about to start.
              .to(
                cards,
                {
                  xPercent: (index: number) => (index - 2.5) * 12,
                  rotation: (index: number) => (index - 2.5) * 3.4,
                  duration: 0.26,
                  ease: "power2.out",
                  stagger: 0.022,
                },
                "+=0.12",
              )
              .to(cards, {
                xPercent: 0,
                rotation: (index: number) => (index - 2.5) * 1.6,
                duration: 0.36,
                ease: "back.out(1.9)",
                stagger: { each: 0.02, from: "end" },
              })
              // Squared up, then fanned back out. The loop ends exactly where
              // it began, so the repeat has nothing to hide.
              .to(cards, { scale: 0.96, duration: 0.16, ease: "power2.in" })
              .to(cards, { scale: 1, duration: 0.28, ease: "back.out(2.2)" })
              .to(
                cards,
                {
                  xPercent: (index: number) => FAN[index].x,
                  yPercent: (index: number) => FAN[index].y,
                  rotation: (index: number) => FAN[index].r,
                  duration: 0.62,
                  ease: ease.entrance,
                  stagger: 0.045,
                },
                "+=0.1",
              );

            let onScreen = false;

            const sync = () => {
              if (onScreen && !document.hidden) {
                gsap.set(cards, { willChange: "transform" });
                loop.play();
                return;
              }
              loop.pause();
              gsap.set(cards, { clearProps: "willChange" });
            };

            const observer = new IntersectionObserver(
              ([entry]) => {
                onScreen = entry.isIntersecting;
                sync();
              },
              { threshold: 0.25 },
            );

            observer.observe(stageEl);
            document.addEventListener("visibilitychange", sync);

            cleanups.push(() => {
              observer.disconnect();
              document.removeEventListener("visibilitychange", sync);
              loop.kill();
            });
          }

          if (pointer) {
            // `quickTo` writes straight to the element with its own
            // interpolation: no React state, no rAF loop of ours, and it
            // retargets smoothly instead of restarting.
            const rotateX = gsap.quickTo(tiltEl, "rotationX", {
              duration: 0.6,
              ease: ease.out,
            });
            const rotateY = gsap.quickTo(tiltEl, "rotationY", {
              duration: 0.6,
              ease: ease.out,
            });

            const onMove = (event: PointerEvent) => {
              const box = stageEl.getBoundingClientRect();
              rotateX(-((event.clientY - box.top) / box.height - 0.5) * 12);
              rotateY(((event.clientX - box.left) / box.width - 0.5) * 12);
            };

            const onLeave = () => {
              rotateX(0);
              rotateY(0);
            };

            stageEl.addEventListener("pointermove", onMove);
            stageEl.addEventListener("pointerleave", onLeave);

            cleanups.push(() => {
              stageEl.removeEventListener("pointermove", onMove);
              stageEl.removeEventListener("pointerleave", onLeave);
            });
          }

          return () => {
            for (const cleanup of cleanups) cleanup();
          };
        },
      );

      return () => media.revert();
    },
    { scope: stage },
  );

  const board = {
    // The half-card offset is taken out here, so a card needs no transform of
    // its own to sit centred. Same rule as the table: GSAP owns `transform`.
    "--hero-card-x": pct(ORIGIN.x - CARD_W / 2),
    "--hero-card-y": pct(ORIGIN.y - CARD_H / 2),
    "--hero-card-w": pct(CARD_W),
  } as CSSProperties;

  return (
    <div
      ref={stage}
      aria-hidden
      style={board}
      className={cn(
        "relative aspect-[5/4] w-full [perspective:1400px]",
        className,
      )}
    >
      <div ref={tilt} className="absolute inset-0 [transform-style:preserve-3d]">
        {FAN.map((pose, index) => (
          <div
            key={index}
            data-card
            className="contact-hero-card"
            // The resting spread lives in the markup, so the deck is already a
            // deck before GSAP runs, or if it never does.
            style={{
              transform: `translate(${pose.x}%, ${pose.y}%) rotate(${pose.r}deg)`,
              zIndex: index,
            }}
          >
            <div className="bg-accent-strong absolute inset-0 rounded-[8%/6%] shadow-lg">
              <span className="border-surface/30 absolute inset-[7%] rounded-[6%/4%] border" />
              <span className="absolute inset-0 rounded-[8%/6%] bg-[radial-gradient(var(--color-brand-300)_0.9px,transparent_0.9px)] opacity-45 [background-size:8px_8px]" />
              <span className="text-surface/85 absolute inset-0 grid place-items-center text-2xl">
                ♠
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
