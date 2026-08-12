"use client";

import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * Three cards, cycling.
 *
 * Why it animates: the band beside it is a roll call of places, and it is
 * already moving. A still block of type on one side of a marquee reads as the
 * part of the page that has not loaded yet. This gives that column something
 * with the same pulse, at a fraction of the width.
 *
 * The gesture is a cut: the front card lifts, turns over the top of the other
 * two and tucks in at the back, and the other two step forward. Three steps
 * and every card is in the slot it started in, which is what makes the loop
 * seamless — not tuning, arithmetic:
 *
 *   slots  0 1 2  ->  1 2 0  ->  2 0 1  ->  0 1 2
 *
 * Each card therefore travels exactly once per cycle and picks up exactly one
 * full turn. The `set` back to the resting angles at the end of the timeline is
 * a multiple of 360 away from where the cards actually are, so it is invisible,
 * and it stops the numbers climbing forever.
 *
 * Nothing is measured. Every pose is a percentage of a card's own size, so a
 * resize can never strand one mid-flight.
 */

/** Fractions of the stage. The card is sized from the width. */
const CARD_W = 0.44;
const STAGE_ASPECT = 5 / 4;
const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;

type Slot = { x: number; y: number; r: number; z: number };

/** Front to back. Percentages of a card's own size, plus a stacking order. */
const SLOTS: Slot[] = [
  { x: -32, y: 14, r: -12, z: 30 },
  { x: 0, y: 0, r: 1, z: 20 },
  { x: 32, y: -14, r: 13, z: 10 },
];

/** Seconds a card spends travelling, and the pause before the next one goes. */
const STEP = 0.9;
const HOLD = 0.55;

type OriginsCard = { rank: string; suit: "♠" | "♥" | "♦" | "♣" };

/** Three suits, so the cut is legible. A fourth would not fit the column. */
const HAND: OriginsCard[] = [
  { rank: "A", suit: "♠" },
  { rank: "K", suit: "♥" },
  { rank: "Q", suit: "♦" },
];

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

export function OriginsCards({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = stage.current;
      if (!root) return;

      registerGsap();

      const nodes = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      if (nodes.length !== HAND.length) return;

      const media = gsap.matchMedia();

      media.add(
        // The stage is only rendered from lg, and this is the same threshold.
        // An infinite timeline holds a compositor layer per card for as long as
        // the page is open; it is not worth that on a phone for scenery.
        `${MOTION_QUERY.ok} and ${MOTION_QUERY.desktop}`,
        () => {
          // GSAP has to own these from known values. The inline transform in
          // the markup is the no-JS resting pose, and reading it back out of a
          // computed matrix would give pixels where these are percentages.
          nodes.forEach((node, index) => {
            const slot = SLOTS[index];
            gsap.set(node, {
              xPercent: slot.x,
              yPercent: slot.y,
              rotation: slot.r,
              zIndex: slot.z,
              scale: 1,
            });
          });

          const loop = gsap.timeline({ paused: true, repeat: -1 });

          /** Which slot each card is in, as the timeline is built. */
          const at = nodes.map((_, index) => index);
          /** Absolute rotation, which keeps climbing so a turn never unwinds. */
          const spin = nodes.map((_, index) => SLOTS[index].r);

          for (let step = 0; step < SLOTS.length; step += 1) {
            const start = step * (STEP + HOLD);
            const from = [...at];

            nodes.forEach((node, index) => {
              const source = from[index];
              // The front card goes to the back; everything else steps up one.
              const target = source === 0 ? SLOTS.length - 1 : source - 1;
              const slot = SLOTS[target];
              const travelling = source === 0;

              spin[index] += slot.r - SLOTS[source].r + (travelling ? 360 : 0);
              at[index] = target;

              if (!travelling) {
                // Stepping forward, so it can take its new stacking order at
                // once: there is nothing for it to pass over.
                loop
                  .set(node, { zIndex: slot.z }, start)
                  .to(
                    node,
                    {
                      xPercent: slot.x,
                      yPercent: slot.y,
                      rotation: spin[index],
                      duration: STEP * 0.8,
                      ease: ease.out,
                    },
                    start + 0.05,
                  );
                return;
              }

              // The traveller. Two eases across two axes is what bows a
              // straight line into an arc over the other cards, and it costs
              // nothing: no motion path plugin, no extra bundle.
              loop
                .set(node, { zIndex: 50 }, start)
                .to(
                  node,
                  { xPercent: slot.x, duration: STEP, ease: "power2.inOut" },
                  start,
                )
                .to(
                  node,
                  {
                    yPercent: slot.y - 30,
                    duration: STEP * 0.5,
                    ease: "power2.out",
                  },
                  start,
                )
                .to(
                  node,
                  {
                    yPercent: slot.y,
                    duration: STEP * 0.5,
                    ease: "power2.in",
                  },
                  start + STEP * 0.5,
                )
                .to(
                  node,
                  { rotation: spin[index], duration: STEP, ease: "power2.inOut" },
                  start,
                )
                // The lift. Without it the card reads as sliding across the
                // others rather than coming up off them.
                .to(
                  node,
                  { scale: 1.1, duration: STEP * 0.45, ease: "power2.out" },
                  start,
                )
                .to(
                  node,
                  { scale: 1, duration: STEP * 0.55, ease: "power2.in" },
                  start + STEP * 0.45,
                )
                // Back into the stack only once it has cleared the others.
                .set(node, { zIndex: slot.z }, start + STEP * 0.92);
            });
          }

          // Every card is home and exactly one turn heavier. Shedding the turn
          // here is invisible and keeps the numbers from climbing forever.
          loop.set(
            nodes,
            { rotation: (index: number) => SLOTS[index].r },
            SLOTS.length * (STEP + HOLD),
          );

          let onScreen = false;

          const sync = () => {
            if (onScreen && !document.hidden) {
              gsap.set(nodes, { willChange: "transform" });
              loop.play();
              return;
            }
            loop.pause();
            gsap.set(nodes, { clearProps: "willChange" });
          };

          const observer = new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting;
              sync();
            },
            { threshold: 0.3 },
          );

          observer.observe(root);
          document.addEventListener("visibilitychange", sync);

          return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
            loop.kill();
          };
        },
      );

      return () => media.revert();
    },
    { scope: stage },
  );

  /** Shared by all three: the same box, centred, before any transform. */
  const seat: CSSProperties = {
    left: pct(0.5 - CARD_W / 2),
    top: pct(0.5 - CARD_H / 2),
    width: pct(CARD_W),
  };

  return (
    // Decorative in full. The heading beside it carries everything this section
    // says, and three playing cards read out to a screen reader are noise.
    <div
      ref={stage}
      aria-hidden
      className={cn("relative aspect-[5/4] w-full", className)}
    >
      {HAND.map((card, index) => {
        const slot = SLOTS[index];
        const red = card.suit === "♥" || card.suit === "♦";

        return (
          <div
            key={`${card.rank}${card.suit}`}
            data-card
            className="absolute aspect-[5/7]"
            // The resting stack lives in the markup, so this is already three
            // cards before GSAP runs, or if it never does.
            style={{
              ...seat,
              transform: `translate(${slot.x}%, ${slot.y}%) rotate(${slot.r}deg)`,
              zIndex: slot.z,
            }}
          >
            <div className="border-line bg-surface relative h-full w-full rounded-lg border shadow-md">
              <span className="border-line/60 absolute inset-[8%] rounded-md border" />
              <span
                className={cn(
                  "absolute top-[8%] left-[11%] flex flex-col items-center gap-0.5 text-xs leading-none font-semibold",
                  red ? "text-accent" : "text-heading",
                )}
              >
                <span>{card.rank}</span>
                <span className="text-[0.8em]">{card.suit}</span>
              </span>
              <span
                className={cn(
                  "absolute inset-0 grid place-items-center text-3xl leading-none",
                  red ? "text-accent" : "text-heading",
                )}
              >
                {card.suit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
