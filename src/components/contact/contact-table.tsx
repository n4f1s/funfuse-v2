"use client";

import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The table beside the contact form.
 *
 * Why it animates: it is the progress indicator. Every field the visitor
 * finishes deals a card out of the deck, turns it over and lays it on the
 * table; clearing a field takes the card back. A four-step form has no obvious
 * shape otherwise, and a progress bar on four fields is a bar that is either
 * empty or nearly full. On a successful send the four cards square up into a
 * won trick, which is the only "it worked" this page needs to invent.
 *
 * So this is feedback, not decoration, which is the test every animation on
 * this site has to pass.
 *
 * **Nothing is ever measured.** Every pose below is a fraction of the stage
 * and reaches GSAP as `xPercent` / `yPercent`, percentages of the card's own
 * size. A resize can therefore never strand a card mid-flight, and no tween
 * has to be rebuilt on one.
 *
 * Reduced motion and no-JS never reach this code: `.contact-card` carries a
 * resting transform in `--rest`, and globals.css lays the hand out with it.
 */

/** Fractions of the stage box. The card is sized from the width. */
const CARD_W = 0.28;
const STAGE_ASPECT = 5 / 4;
/** Card height as a fraction of stage height. 5:7 card, so w * 7/5, rescaled. */
const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;

/** Where an unplayed card waits. Centre of the card, fractions of the stage. */
const DECK = { x: 0.5, y: 0.2 };

type Pose = { x: number; y: number; rotate: number };

/** Where a played card lands. One slot per field, left to right. */
const SLOTS: Pose[] = [
  { x: 0.18, y: 0.68, rotate: -13 },
  { x: 0.39, y: 0.62, rotate: -4.5 },
  { x: 0.61, y: 0.62, rotate: 4.5 },
  { x: 0.82, y: 0.68, rotate: 13 },
];

/** Where the four gather when the message is sent: a squared-up trick. */
const WON: Pose[] = [
  { x: 0.5, y: 0.52, rotate: -6 },
  { x: 0.5, y: 0.52, rotate: -2 },
  { x: 0.5, y: 0.52, rotate: 2 },
  { x: 0.5, y: 0.52, rotate: 6 },
];

export type TableCard = {
  /** Matches the form field name, which is how a card knows it was played. */
  field: string;
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
  label: string;
};

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

/** A pose as GSAP vars: percentages of the card, never of the viewport. */
function toVars(pose: Pose, index: number) {
  return {
    xPercent: ((pose.x - DECK.x) / CARD_W) * 100,
    yPercent: ((pose.y - DECK.y) / CARD_H) * 100,
    rotation: pose.rotate,
    // A deck is a stack, so unplayed cards sit slightly under one another.
    scale: 1,
    zIndex: 10 + index,
  };
}

function deckVars(index: number, total: number) {
  return {
    xPercent: 0,
    yPercent: -index * 1.6,
    rotation: (index - (total - 1) / 2) * 2.2,
    scale: 0.96,
    zIndex: 10 + (total - index),
  };
}

/** The resting hand, for the CSS fallback: every card in its slot, face up. */
export function restTransform(index: number): string {
  const pose = SLOTS[index] ?? SLOTS[0];
  const x = ((pose.x - DECK.x) / CARD_W) * 100;
  const y = ((pose.y - DECK.y) / CARD_H) * 100;

  return `translate(${x}%, ${y}%) rotate(${pose.rotate}deg)`;
}

export function ContactTable({
  cards,
  /** Field names that currently count as finished. Order does not matter. */
  played,
  sent,
  className,
}: {
  cards: readonly TableCard[];
  played: readonly string[];
  sent: boolean;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  /**
   * The first pass places the table instead of animating into it. Without
   * this, `autoAlpha` tweening the banner from its computed opacity down to
   * zero makes it visible on the way there, so "Message sent" flashes on a
   * page nobody has sent anything from yet.
   */
  const placed = useRef(false);
  /** Joined, so the effect re-runs on content rather than array identity. */
  const key = played.join("|");

  useGSAP(
    () => {
      const root = stage.current;
      if (!root) return;

      registerGsap();

      const nodes = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      const flips = gsap.utils.toArray<HTMLElement>("[data-flip]", root);
      const glow = root.querySelector<HTMLElement>("[data-glow]");
      const banner = root.querySelector<HTMLElement>("[data-banner]");
      if (nodes.length !== cards.length) return;

      const media = gsap.matchMedia();

      media.add({ ok: MOTION_QUERY.ok }, (context) => {
        const { ok } = context.conditions as { ok: boolean };

        // Reduced motion: the CSS in globals.css has already laid the hand out
        // in its slots. A static finished table is the right end state, and
        // there is nothing here worth flying across the screen to say.
        if (!ok) return;

        const settle = (index: number) => {
          const node = nodes[index];
          const flip = flips[index];
          const card = cards[index];
          if (!node || !flip || !card) return;

          const isPlayed = played.includes(card.field);
          const target = sent
            ? WON[index]
            : isPlayed
              ? SLOTS[index]
              : undefined;

          // Two eases across two axes is what bows a straight line into an arc
          // over the table. It costs nothing: no motion path plugin, no extra
          // bundle. Whichever axis leaves first gets the fast curve.
          const vars = target ? toVars(target, index) : deckVars(index, cards.length);
          const rising = target ? target.y < DECK.y : true;

          if (!placed.current) {
            gsap.set(node, { ...vars });
            gsap.set(flip, { rotationY: isPlayed || sent ? 180 : 0 });
            return;
          }

          gsap.to(node, {
            xPercent: vars.xPercent,
            duration: 0.62,
            ease: rising ? "power2.in" : "power2.out",
            overwrite: "auto",
          });
          gsap.to(node, {
            yPercent: vars.yPercent,
            duration: 0.62,
            ease: rising ? "power2.out" : "power2.in",
            overwrite: "auto",
          });
          gsap.to(node, {
            rotation: vars.rotation,
            zIndex: vars.zIndex,
            duration: 0.62,
            ease: ease.out,
            overwrite: "auto",
          });

          // The lift: the card comes up off the felt, travels, and settles back
          // onto it. Without it a card looks like it slid.
          gsap
            .timeline()
            .to(node, { scale: vars.scale * 1.09, duration: 0.26, ease: "power2.out" })
            .to(node, { scale: vars.scale, duration: 0.36, ease: "power2.in" });

          gsap.to(flip, {
            rotationY: isPlayed || sent ? 180 : 0,
            duration: 0.44,
            ease: ease.out,
            overwrite: "auto",
          });
        };

        // Staggered by hand rather than by GSAP: only the cards whose state
        // actually changed should be moving, and a stagger on all four would
        // animate the three that are already where they belong.
        cards.forEach((_, index) => settle(index));

        if (glow && banner) {
          const won = { autoAlpha: 1, scale: 1.06 };
          const quiet = { autoAlpha: 0, scale: 0.85 };

          if (!placed.current || !sent) {
            // Nothing has been won, so there is nothing to fade out of. Set it.
            gsap.set(glow, quiet);
            gsap.set(banner, { autoAlpha: 0, y: 8, scale: 0.94 });
          } else {
            gsap.to(glow, { ...won, duration: 0.4, ease: ease.out, overwrite: "auto" });
            gsap.to(banner, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.36,
              delay: 0.3,
              ease: ease.out,
              overwrite: "auto",
            });
          }
        }

        placed.current = true;
      });

      return () => media.revert();
    },
    { scope: stage, dependencies: [key, sent] },
  );

  const board = {
    "--card-w": pct(CARD_W),
    "--card-x": pct(DECK.x),
    "--card-y": pct(DECK.y),
  } as CSSProperties;

  return (
    // Decorative in full. It mirrors the form beside it, and a screen reader
    // reading out four playing cards on top of four field labels is noise.
    <div
      ref={stage}
      aria-hidden
      style={board}
      className={cn("contact-stage relative w-full", className)}
    >
      <div className="contact-board absolute inset-0">
        <div className="bg-surface border-line absolute inset-0 rounded-[1.5rem] border shadow-sm md:rounded-[2rem]" />
        {/* Warmth where the hand lands, so the felt reads as lit rather than
            as a flat white panel. One hue, low chroma: this is depth. */}
        <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(58%_56%_at_50%_62%,var(--color-brand-50),transparent_70%)] md:rounded-[2rem]" />
        <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(var(--color-ink-200)_0.5px,transparent_0.5px)] opacity-40 [background-size:13px_13px] md:rounded-[2rem]" />

        {/* The empty deck slot, so the stack has somewhere to have come from. */}
        <div className="contact-slot border-line-strong/50 rounded-[1.6cqw] border border-dashed" />

        <div
          data-glow
          className="contact-glow bg-accent/18 invisible rounded-full blur-2xl"
        />

        <ul>
          {cards.map((card, index) => (
            <li
              key={card.field}
              data-card
              className="contact-card"
              style={{ "--rest": restTransform(index) } as CSSProperties}
            >
              <div
                data-flip
                className="relative h-full w-full [transform-style:preserve-3d]"
              >
                {/* Back. Patterned rather than plain, so a card that has not
                    been played still reads as a card. */}
                <div className="bg-accent-strong absolute inset-0 rounded-[1.4cqw] shadow-md [backface-visibility:hidden]">
                  <span className="border-surface/30 absolute inset-[8%] rounded-[1cqw] border" />
                  <span className="absolute inset-0 rounded-[1.4cqw] bg-[radial-gradient(var(--color-brand-300)_0.8px,transparent_0.8px)] opacity-50 [background-size:7px_7px]" />
                </div>

                {/* Front. */}
                <div className="bg-surface border-line absolute inset-0 rounded-[1.4cqw] border shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <Corner card={card} />
                  <span
                    className={cn(
                      "absolute inset-x-0 top-[34%] text-center text-[7cqw] leading-none",
                      card.suit === "♥" || card.suit === "♦"
                        ? "text-accent"
                        : "text-heading",
                    )}
                  >
                    {card.suit}
                  </span>
                  <span className="text-muted absolute inset-x-0 bottom-[12%] text-center text-[2.6cqw] font-medium tracking-wide">
                    {card.label}
                  </span>
                  <Corner card={card} flipped />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="absolute inset-x-0 bottom-[6%] flex justify-center">
          <span
            data-banner
            className="bg-heading text-inverse invisible rounded-full px-3.5 py-1.5 text-xs font-medium shadow-md"
          >
            Message sent
          </span>
        </div>
      </div>
    </div>
  );
}

function Corner({ card, flipped = false }: { card: TableCard; flipped?: boolean }) {
  const red = card.suit === "♥" || card.suit === "♦";

  return (
    <span
      className={cn(
        "absolute flex flex-col items-center gap-[0.2cqw] text-[2.8cqw] leading-none font-semibold",
        flipped ? "right-[9%] bottom-[8%] rotate-180" : "top-[8%] left-[9%]",
        red ? "text-accent" : "text-heading",
      )}
    >
      <span>{card.rank}</span>
      <span className="text-[0.75em]">{card.suit}</span>
    </span>
  );
}
