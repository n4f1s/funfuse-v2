"use client";

import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * Three cards, cut one at a time.
 *
 * Why it animates: the band beside it is a roll call of places, and it is
 * already moving. A still block of type on one side of a marquee reads as the
 * part of the page that has not loaded yet. This gives that column something
 * with the same pulse, at a fraction of the width.
 *
 * **The move is the one a hand can actually make.** The card at the *back* is
 * drawn out to the side, lifted over the other two and set down on *top*. A
 * card that travels over a stack lands on it; the earlier version of this took
 * the front card over the top and then dropped it underneath, which is not
 * something that can happen to a physical card.
 *
 * The z-order is the whole problem, and it is solved by sequence rather than
 * by hoping nobody looks:
 *
 *   1. the traveller slides clear while still *behind* everything. It is the
 *      back card sliding out from behind the fan, which is exactly what that
 *      looks like.
 *   2. it is raised only once its box no longer touches another card — the
 *      slide is a full card width past the nearest one, and the other two have
 *      not started moving yet. So the moment it comes to the front is a moment
 *      with nothing to be in front of.
 *   3. it arcs over and lands in the front slot, staying on top the whole way
 *      down. Its z drops from "in flight" to "front of the stack" at the end,
 *      which is invisible because nothing else sits between the two.
 *
 * Depth is carried by scale as well as by stacking: the back card is a little
 * smaller and grows as it comes forward, which is what moving toward the eye
 * looks like.
 *
 * The loop is seamless by arithmetic rather than by tuning. Every card steps
 * one slot back each time, so three steps return all three to where they
 * began, and each has travelled exactly once. Every property is absolute per
 * slot, so nothing accumulates and there is nothing to reset.
 *
 * Nothing is measured. Every pose is a percentage of a card's own size, so a
 * resize can never strand one mid-flight.
 */

/** Fractions of the stage. The card is sized from the width. */
const CARD_W = 0.3;
const STAGE_ASPECT = 5 / 4;
const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;

type Slot = { x: number; y: number; r: number; scale: number; z: number };

/**
 * Front to back. Positions are percentages of a card's own size.
 *
 * The scale step is small on purpose: it is perspective on a table, not a
 * corridor. Anything stronger and the back card reads as a different size of
 * card rather than the same one further away.
 */
const SLOTS: Slot[] = [
  { x: -44, y: 16, r: -12, scale: 1, z: 30 },
  { x: 0, y: 0, r: 1, scale: 0.97, z: 20 },
  { x: 44, y: -16, r: 13, scale: 0.94, z: 10 },
];

/**
 * Where the traveller waits before it is lifted.
 *
 * 112% of a card's width from the middle, against a nearest neighbour sitting
 * at 0. Two boxes a full width apart do not overlap, which is what makes the
 * change of stacking order at this instant impossible to see.
 */
const CLEAR = { x: 112, y: 34, r: 22 };

/** Seconds a card spends being moved, and the pause before the next one goes. */
const STEP = 1.05;
const HOLD = 0.5;

/** Fractions of `STEP`. The slide has to finish before the lift begins. */
const SLIDE = 0.26;
/** When the other two close the gap. After the traveller is out of their way. */
const SHIFT = 0.3;

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
              scale: slot.scale,
              zIndex: slot.z,
            });
          });

          // `repeatDelay` rather than a spacer at the end: a timeline's length
          // is its last tween, so without this the third card would land and
          // the first would be drawn out in the same frame, losing one beat
          // out of every three.
          const loop = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: HOLD,
          });

          /** Which slot each card is in, as the timeline is built. */
          const at = nodes.map((_, index) => index);
          const back = SLOTS.length - 1;

          for (let step = 0; step < SLOTS.length; step += 1) {
            const start = step * (STEP + HOLD);
            const from = [...at];

            nodes.forEach((node, index) => {
              const source = from[index];
              // Everything steps one slot further back; the card that was at
              // the back comes round to the front.
              const target = (source + 1) % SLOTS.length;
              const slot = SLOTS[target];
              at[index] = target;

              if (source !== back) {
                // Closing the gap the traveller left. A slide across the table,
                // so no lift and no change in size. Its new stacking order can
                // be taken at once: the two of them keep their order relative
                // to each other, and the traveller is above both regardless.
                loop
                  .set(node, { zIndex: slot.z }, start + STEP * SHIFT)
                  .to(
                    node,
                    {
                      xPercent: slot.x,
                      yPercent: slot.y,
                      rotation: slot.r,
                      scale: slot.scale,
                      duration: STEP * 0.62,
                      ease: ease.out,
                    },
                    start + STEP * SHIFT,
                  );
                return;
              }

              // ---- The traveller -------------------------------------------
              // Out from behind, still underneath everything.
              loop.to(
                node,
                {
                  xPercent: CLEAR.x,
                  yPercent: CLEAR.y,
                  rotation: CLEAR.r,
                  duration: STEP * SLIDE,
                  ease: "power2.out",
                },
                start,
              );

              // Clear of every other card, so this is unobservable.
              loop.set(node, { zIndex: 50 }, start + STEP * SLIDE);

              const lift = start + STEP * SLIDE;
              const flight = STEP * (1 - SLIDE);

              // Two eases across two axes is what bows a straight line into an
              // arc over the other cards, and it costs nothing: no motion path
              // plugin, no extra bundle.
              loop
                .to(
                  node,
                  { xPercent: slot.x, duration: flight, ease: "power1.inOut" },
                  lift,
                )
                .to(
                  node,
                  {
                    yPercent: slot.y - 52,
                    duration: flight * 0.45,
                    ease: "power2.out",
                  },
                  lift,
                )
                .to(
                  node,
                  { yPercent: slot.y, duration: flight * 0.55, ease: "power2.in" },
                  lift + flight * 0.45,
                )
                // A wrist turn, not a pirouette: it swings past the angle it is
                // going to land on and comes back to it.
                .to(
                  node,
                  { rotation: -34, duration: flight * 0.45, ease: "power2.out" },
                  lift,
                )
                .to(
                  node,
                  { rotation: slot.r, duration: flight * 0.55, ease: ease.out },
                  lift + flight * 0.45,
                )
                // Bigger at the top of the arc, because it is nearer the eye.
                .to(
                  node,
                  { scale: 1.12, duration: flight * 0.45, ease: "power2.out" },
                  lift,
                )
                .to(
                  node,
                  { scale: slot.scale, duration: flight * 0.55, ease: "power2.in" },
                  lift + flight * 0.45,
                )
                // Down onto the front of the stack. Invisible: nothing else
                // sits between the front slot and the in-flight order.
                .set(node, { zIndex: slot.z }, start + STEP);
            });
          }

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
      className={cn("relative aspect-5/4 w-full", className)}
    >
      {HAND.map((card, index) => {
        const slot = SLOTS[index];
        const red = card.suit === "♥" || card.suit === "♦";

        return (
          <div
            key={`${card.rank}${card.suit}`}
            data-card
            className="absolute aspect-5/7"
            // The resting stack lives in the markup, so this is already three
            // cards before GSAP runs, or if it never does.
            style={{
              ...seat,
              transform: `translate(${slot.x}%, ${slot.y}%) rotate(${slot.r}deg) scale(${slot.scale})`,
              zIndex: slot.z,
            }}
          >
            <div className="border-line bg-surface relative h-full w-full rounded-sm border shadow-md">
              <span className="border-line/60 absolute inset-[8%]" />
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
