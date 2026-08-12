"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The careers hero stage: a hand, dealt and then held.
 *
 * Why it animates: the whole catalogue is card games, so the first gesture on
 * any page of this site is a deal. Here it also does the work an illustration
 * would have done, without inventing a studio fact — the careers copy supplies
 * no image and no claim a picture could truthfully carry.
 *
 * **Transform only, never opacity.** The hand is beside the headline, and an
 * element at `opacity: 0` is not painted. Dealing out of a stack leaves every
 * pixel on screen in the first frame, so nothing here can reach LCP.
 *
 * Three jobs on three elements, so no two tweens ever write one property:
 *   - the tilt layer takes the pointer (rotationX / rotationY),
 *   - `[data-card]` wrappers take the pointer depth offset (x) and the idle bob (y),
 *   - `[data-face]` inners take the deal, and hold the resting rotation.
 *
 * The resting fan is in the server HTML as an inline rotation, so a visitor
 * with reduced motion, no JavaScript or a failed chunk still gets a finished
 * hand rather than a stack of rectangles.
 */

type Card = {
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
  /** Percentages of the stage box, so the fan scales instead of breaking. */
  left: string;
  top: string;
  width: string;
  rotate: number;
  /** Where the card comes from, as a percentage of its own size. */
  from: { x: number; y: number };
  /** Share of the pointer shift this card takes. Front cards take the most. */
  depth: number;
  /** Seconds for one leg of the idle bob. Different per card, so no two pair up. */
  bob: number;
  filled?: boolean;
};

/** Back to front. DOM order is the stacking order and the deal order. */
const HAND: Card[] = [
  {
    rank: "9",
    suit: "♣",
    left: "0%",
    top: "27%",
    width: "33%",
    rotate: -19,
    from: { x: 78, y: 14 },
    depth: 0.3,
    bob: 3.1,
  },
  {
    rank: "7",
    suit: "♦",
    left: "67%",
    top: "29%",
    width: "33%",
    rotate: 18,
    from: { x: -78, y: 16 },
    depth: 0.3,
    bob: 3.6,
  },
  {
    rank: "J",
    suit: "♠",
    left: "11%",
    top: "14%",
    width: "35%",
    rotate: -11,
    from: { x: 50, y: 12 },
    depth: 0.6,
    bob: 2.7,
  },
  {
    rank: "Q",
    suit: "♥",
    left: "54%",
    top: "13%",
    width: "35%",
    rotate: 12,
    from: { x: -50, y: 13 },
    depth: 0.6,
    bob: 3.3,
  },
  {
    rank: "A",
    suit: "♠",
    left: "33%",
    top: "0%",
    width: "35%",
    rotate: -2,
    from: { x: 0, y: 26 },
    depth: 1,
    bob: 2.4,
    filled: true,
  },
];

/** Peak tilt, in degrees, at the far edge of the stage. */
const TILT = 6;

/** Horizontal travel, in px, of the front card at full pointer deflection. */
const DEPTH_SHIFT = 16;

export function CareersHeroStage({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  /**
   * The deal is an entrance, so it gets one performance. `matchMedia` re-runs
   * its callback whenever a condition flips, and without this a window dragged
   * across the pointer query would re-deal the hand mid-read.
   */
  const dealt = useRef(false);

  useGSAP(
    () => {
      registerGsap();

      const stageEl = stage.current;
      const tiltEl = tilt.current;
      if (!stageEl || !tiltEl) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", stageEl);
      const faces = gsap.utils.toArray<HTMLElement>("[data-face]", stageEl);
      if (!faces.length) return;

      const media = gsap.matchMedia();

      media.add(
        {
          ok: MOTION_QUERY.ok,
          // Tilt is a pointer affordance. On touch a tap reports as a hover and
          // leaves the hand stuck mid-lean, so it is gated, not scaled down.
          pointer: "(hover: hover) and (pointer: fine)",
          // An infinite tween keeps a compositor layer alive for as long as the
          // page is open. Five of those idling on a mid-range Android is the
          // kind of cost that never shows up in a screenshot.
          desktop: MOTION_QUERY.desktop,
        },
        (context) => {
          const { ok, pointer, desktop } = context.conditions as {
            ok: boolean;
            pointer: boolean;
            desktop: boolean;
          };

          // Reduced motion: the hand is already dealt. A static composition is
          // the correct end state, so there is nothing to schedule.
          if (!ok) return;

          const cleanups: (() => void)[] = [];

          if (!dealt.current) {
            dealt.current = true;

            gsap.from(faces, {
              xPercent: (index: number) => HAND[index]?.from.x ?? 0,
              yPercent: (index: number) => HAND[index]?.from.y ?? 0,
              rotation: 0,
              scale: 0.88,
              duration: 0.9,
              ease: ease.entrance,
              stagger: 0.09,
              onStart: () => gsap.set(faces, { willChange: "transform" }),
              onComplete: () => gsap.set(faces, { clearProps: "willChange" }),
            });
          }

          if (desktop) {
            const idles = cards.map((card, index) =>
              gsap.to(card, {
                y: index % 2 === 0 ? -7 : 7,
                duration: HAND[index]?.bob ?? 3,
                ease: ease.loop,
                repeat: -1,
                yoyo: true,
              }),
            );

            cleanups.push(() => {
              for (const idle of idles) idle.kill();
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
            const shift = cards.map((card) =>
              gsap.quickTo(card, "x", { duration: 0.7, ease: ease.out }),
            );

            const onMove = (event: PointerEvent) => {
              const bounds = stageEl.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;

              rotateX(-y * TILT * 2);
              rotateY(x * TILT * 2);
              shift.forEach((to, index) =>
                to(x * DEPTH_SHIFT * (HAND[index]?.depth ?? 0.5)),
              );
            };

            const onLeave = () => {
              rotateX(0);
              rotateY(0);
              shift.forEach((to) => to(0));
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

  return (
    // Decorative in full. Every fact this section carries is in the copy beside
    // it, and a screen reader reading out five playing cards is noise.
    <div
      ref={stage}
      aria-hidden
      className={cn(
        "relative aspect-[5/4] w-full [perspective:1400px]",
        className,
      )}
    >
      <div
        ref={tilt}
        className="absolute inset-0 [transform-style:preserve-3d]"
      >
        {HAND.map((card) => (
          <div
            key={`${card.rank}${card.suit}`}
            data-card
            className="absolute"
            style={{ left: card.left, top: card.top, width: card.width }}
          >
            <div
              data-face
              // The resting rotation lives in the markup, so the hand is
              // already a hand before GSAP runs, or if it never does.
              style={{ transform: `rotate(${card.rotate}deg)` }}
            >
              <CardFace card={card} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFace({ card }: { card: Card }) {
  const red = card.suit === "♥" || card.suit === "♦";

  if (card.filled) {
    return (
      <div className="bg-accent shadow-lg relative aspect-[5/7] w-full rounded-lg">
        <span className="border-surface/35 absolute inset-[7%] rounded-md border" />
        <Corner card={card} className="text-inverse" />
        <span className="text-inverse absolute inset-0 grid place-items-center text-[2.75rem] leading-none sm:text-[3.25rem]">
          {card.suit}
        </span>
        <Corner card={card} className="text-inverse" flipped />
      </div>
    );
  }

  return (
    <div className="border-line bg-surface shadow-md relative aspect-[5/7] w-full rounded-lg border">
      <span className="border-line/60 absolute inset-[7%] rounded-md border" />
      <Corner card={card} className={red ? "text-accent" : "text-heading"} />
      <span
        className={cn(
          "absolute inset-0 grid place-items-center text-[2.25rem] leading-none sm:text-[2.75rem]",
          red ? "text-accent" : "text-heading",
        )}
      >
        {card.suit}
      </span>
      <Corner card={card} className={red ? "text-accent" : "text-heading"} flipped />
    </div>
  );
}

/** Rank over suit, printed in the corner the way a real index is. */
function Corner({
  card,
  className,
  flipped = false,
}: {
  card: Card;
  className?: string;
  flipped?: boolean;
}) {
  return (
    <span
      className={cn(
        "absolute flex flex-col items-center gap-0.5 text-sm leading-none font-semibold sm:text-base",
        flipped
          ? "right-[11%] bottom-[8%] rotate-180"
          : "top-[8%] left-[11%]",
        className,
      )}
    >
      <span>{card.rank}</span>
      <span className="text-[0.7em]">{card.suit}</span>
    </span>
  );
}
