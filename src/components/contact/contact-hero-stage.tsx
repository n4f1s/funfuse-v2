"use client";

import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The hero stage: a fanned hand turning itself over.
 *
 * Why it animates: it is the only thing a contact page can say before a word
 * has been exchanged. Somebody is at the table, turning cards.
 *
 * **The fan never moves.** A wave of turns runs down the hand and back up it,
 * and every card ends the loop in the exact position and on the exact face it
 * started. Nothing gathers, nothing re-spreads, so there is no seam at the
 * repeat and no arrangement to drift out of place.
 *
 * That guarantee is structural rather than careful arithmetic. Three nested
 * elements, three owners, and no two ever writing the same property:
 *
 *   - `.contact-hero-card` — the fan pose. An inline transform from the server,
 *     which GSAP is never given a reason to touch.
 *   - `[data-turn]` — the scale pop as a card comes off the table.
 *   - `[data-flip]` — `rotationY`, the turn itself.
 *
 * The loop costs an infinite timeline, so it is paid for carefully: desktop
 * only, and paused the moment it leaves the viewport or the tab goes to the
 * background. An idle tween behind a scrolled-past section is exactly the cost
 * that never shows up in a screenshot.
 *
 * Reduced motion, no JavaScript and a failed chunk all get the fan face down
 * and still, which is the composition the loop returns to anyway.
 */

/** Fractions of the stage. Every card starts life stacked on this point. */
const CARD_W = 0.29;
const STAGE_ASPECT = 5 / 4;
const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;
const ORIGIN = { x: 0.5, y: 0.5 };

type HeroCard = {
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
  /** Percentages of a card's own size, so the fan scales with the stage. */
  x: number;
  y: number;
  rotate: number;
};

/** Left to right, which is also the order the turn travels in. */
const HAND: HeroCard[] = [
  { rank: "9", suit: "♥", x: -152, y: 24, rotate: -26 },
  { rank: "10", suit: "♠", x: -92, y: -6, rotate: -15 },
  { rank: "J", suit: "♣", x: -31, y: -22, rotate: -5 },
  { rank: "Q", suit: "♦", x: 31, y: -22, rotate: 5 },
  { rank: "K", suit: "♥", x: 92, y: -6, rotate: 15 },
  { rank: "A", suit: "♠", x: 152, y: 24, rotate: 26 },
];

/** Seconds between one card starting its turn and the next one starting. */
const WAVE = 0.11;

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

      const flips = gsap.utils.toArray<HTMLElement>("[data-flip]", stageEl);
      const turns = gsap.utils.toArray<HTMLElement>("[data-turn]", stageEl);
      if (flips.length !== HAND.length) return;

      const media = gsap.matchMedia();

      media.add(
        {
          ok: MOTION_QUERY.ok,
          // The turn is an infinite timeline. On a phone the stage is a third
          // of the size and the loop would hold a compositor layer per card
          // for as long as the page is open.
          desktop: MOTION_QUERY.desktop,
          // Tilt is a pointer affordance. On touch a tap reports as a hover
          // and leaves the hand stuck mid-lean, so it is gated, not scaled.
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { ok, desktop, pointer } = context.conditions as {
            ok: boolean;
            desktop: boolean;
            pointer: boolean;
          };

          // Reduced motion: the hand is already fanned and already face down.
          // A still composition is the correct end state, so there is nothing
          // to schedule.
          if (!ok) return;

          const cleanups: (() => void)[] = [];

          if (desktop) {
            const loop = gsap.timeline({
              paused: true,
              repeat: -1,
              repeatDelay: 0.7,
            });

            /**
             * One pass of the wave.
             *
             * `rotationY` only ever counts upward, so a card turns the same
             * way every time instead of unwinding the way it came. The final
             * `set` back to zero is invisible at a multiple of 360 and leaves
             * the timeline able to repeat from a clean start.
             *
             * The pop is on a different element from the turn, so a card
             * lifting and a card turning are two tweens that never argue.
             */
            const pass = (to: number, from: "start" | "end", at: string) => {
              const stagger = { each: WAVE, from } as const;

              loop
                .to(
                  flips,
                  { rotationY: to, duration: 0.55, ease: ease.inOut, stagger },
                  at,
                )
                .to(
                  turns,
                  { scale: 1.07, duration: 0.26, ease: "power2.out", stagger },
                  "<",
                )
                .to(
                  turns,
                  { scale: 1, duration: 0.32, ease: "power2.in", stagger },
                  "<0.26",
                );
            };

            // Down the hand face up, back up it face down. The second pass
            // runs from the far end, so the two read as one sweep returning
            // rather than as the same animation played twice.
            pass(180, "start", "0");
            pass(360, "end", "+=0.95");

            loop.set(flips, { rotationY: 0 });

            let onScreen = false;

            const sync = () => {
              if (onScreen && !document.hidden) {
                gsap.set(turns, { willChange: "transform" });
                loop.play();
                return;
              }
              loop.pause();
              gsap.set(turns, { clearProps: "willChange" });
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
    // Decorative in full. The heading beside it carries every fact this
    // section has, and a screen reader reading out six playing cards is noise.
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
        {HAND.map((card, index) => (
          <div
            key={`${card.rank}${card.suit}`}
            className="contact-hero-card"
            // The fan lives in the markup and GSAP never touches it, so the
            // hand is a hand before any script runs and cannot drift after.
            style={{
              transform: `translate(${card.x}%, ${card.y}%) rotate(${card.rotate}deg)`,
              zIndex: index,
            }}
          >
            <div data-turn className="absolute inset-0">
              <div
                data-flip
                className="relative h-full w-full [transform-style:preserve-3d]"
              >
                {/* Back. The face the hand rests on. */}
                <div className="bg-accent-strong absolute inset-0 rounded-[8%/6%] shadow-lg [backface-visibility:hidden]">
                  <span className="border-surface/30 absolute inset-[7%] rounded-[6%/4%] border" />
                  <span className="absolute inset-0 rounded-[8%/6%] bg-[radial-gradient(var(--color-brand-300)_0.9px,transparent_0.9px)] opacity-45 [background-size:8px_8px]" />
                  <span className="text-surface/85 absolute inset-0 grid place-items-center text-2xl">
                    ♠
                  </span>
                </div>

                {/* Front. Only ever seen mid-wave, so it is the plainest a
                    card can be: an index, a pip, and nothing else. */}
                <div className="bg-surface border-line absolute inset-0 rounded-[8%/6%] border shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="border-line/60 absolute inset-[7%] rounded-[6%/4%] border" />
                  <Corner card={card} />
                  <span
                    className={cn(
                      "absolute inset-0 grid place-items-center text-4xl leading-none",
                      card.suit === "♥" || card.suit === "♦"
                        ? "text-accent"
                        : "text-heading",
                    )}
                  >
                    {card.suit}
                  </span>
                  <Corner card={card} flipped />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Corner({ card, flipped = false }: { card: HeroCard; flipped?: boolean }) {
  const red = card.suit === "♥" || card.suit === "♦";

  return (
    <span
      className={cn(
        "absolute flex flex-col items-center gap-0.5 text-sm leading-none font-semibold",
        flipped ? "right-[10%] bottom-[7%] rotate-180" : "top-[7%] left-[10%]",
        red ? "text-accent" : "text-heading",
      )}
    >
      <span>{card.rank}</span>
      <span className="text-[0.75em]">{card.suit}</span>
    </span>
  );
}
