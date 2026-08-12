"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

/**
 * The table beside the contact form.
 *
 * Why it animates: it is the progress indicator. The deck falls onto the felt
 * as the section arrives, every field worth sending deals a card out of it and
 * turns that card over, clearing a field takes the card back, focusing a field
 * lifts its card, and a successful send hands the trick to the King. A four
 * field form has no obvious shape otherwise, and a progress bar on four fields
 * is either empty or nearly full.
 *
 * So this is feedback, not scenery, which is the test every animation on this
 * site has to pass.
 *
 * **Nothing is measured except the drop.** Every pose is a fraction of the
 * stage and reaches GSAP as `xPercent` / `yPercent`, percentages of the card's
 * own size, so a resize can never strand a card mid-flight. The entrance is
 * the one exception, and it rides a channel of its own:
 *
 *   - `xPercent` / `yPercent` / `rotation` / `scale` — the pose. Owned by `settle`.
 *   - `y` in pixels on the card — the fall. Owned by the entrance, once.
 *   - `y` on the inner `[data-flip]` node — the focus lift.
 *   - `rotationY` on that same node — the turn.
 *
 * Four owners, four properties, and no two tweens ever writing one of them.
 *
 * The card is positioned by `left` / `top` alone, with the half-card offset
 * already subtracted. It deliberately does not centre itself with the CSS
 * `translate` property: GSAP owns `transform` here, and an element carrying
 * both ends up disagreeing with the static slot drawn underneath it.
 *
 * Reduced motion and no-JS never reach this code: `.contact-card` carries a
 * resting transform in `--rest`, and globals.css lays the hand out with it.
 */

/** Fractions of the stage box. The card is sized from the width. */
const CARD_W = 0.26;
const STAGE_ASPECT = 5 / 4;
/** Card height as a fraction of stage height. 5:7 card, rescaled by the box. */
const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;

/** Where an unplayed card waits. Centre of the card, fractions of the stage. */
const DECK = { x: 0.5, y: 0.28 };

type Pose = { x: number; y: number; rotate: number; scale?: number };

/** Where a played card lands. One slot per field, left to right. */
const SLOTS: Pose[] = [
  { x: 0.17, y: 0.7, rotate: -14 },
  { x: 0.39, y: 0.64, rotate: -5 },
  { x: 0.61, y: 0.64, rotate: 5 },
  { x: 0.83, y: 0.7, rotate: 14 },
];

/**
 * The trick, taken. The King is on top and a size larger, the other three fan
 * in behind it. That is what a won trick looks like when somebody sweeps it
 * towards themselves, and it is the only "it worked" this page has to invent.
 */
const WON: Pose[] = [
  { x: 0.42, y: 0.56, rotate: -18 },
  { x: 0.5, y: 0.47, rotate: 0, scale: 1.12 },
  { x: 0.58, y: 0.56, rotate: 18 },
  { x: 0.5, y: 0.6, rotate: 5 },
];

/** Brand ramp only. Confetti in a colour we do not own is a second accent. */
const CONFETTI_COLORS = ["#eb3845", "#c92736", "#ffa39f", "#ffe3e1", "#ffffff"];

export type TableCard = {
  /** Matches the form field name, which is how a card knows it was played. */
  field: string;
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
  label: string;
};

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

/** A pose as GSAP vars: percentages of the card, never of the viewport. */
function toVars(pose: Pose, index: number, winner: boolean) {
  return {
    xPercent: ((pose.x - DECK.x) / CARD_W) * 100,
    yPercent: ((pose.y - DECK.y) / CARD_H) * 100,
    rotation: pose.rotate,
    scale: pose.scale ?? 1,
    zIndex: winner ? 60 : 20 + index,
  };
}

/** The deck: squared up, each card a hair proud of the one under it. */
function deckVars(index: number, total: number) {
  return {
    xPercent: 0,
    yPercent: -index * 1.4,
    rotation: (index - (total - 1) / 2) * 2.2,
    scale: 0.97,
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

type TableState = {
  played: readonly string[];
  focused: string | null;
  sent: boolean;
};

export function ContactTable({
  cards,
  /** Field names that currently count as finished. Order does not matter. */
  played,
  /** The field the visitor is in, so its card can lift. */
  focused,
  sent,
  className,
}: {
  cards: readonly TableCard[];
  played: readonly string[];
  focused: string | null;
  sent: boolean;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  /**
   * The scene is built once and then driven imperatively.
   *
   * The alternative is a dependency array on `useGSAP`, which re-runs the whole
   * setup on every keystroke that changes a card: a fresh `gsap.matchMedia()`
   * and a fresh media-query listener each time, none of them released until the
   * page is left. Here `matchMedia` is created once, the reduced-motion branch
   * is still a real code path, and updates are a function call.
   */
  const apply = useRef<((state: TableState) => void) | null>(null);
  /** Joined, so the update runs on content rather than array identity. */
  const key = played.join("|");

  /** The King takes the trick, so the table has to know which card that is. */
  const winner = Math.max(
    0,
    cards.findIndex((card) => card.rank === "K"),
  );

  useGSAP(
    () => {
      const root = stage.current;
      if (!root) return;

      registerGsap();

      const nodes = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      const flips = gsap.utils.toArray<HTMLElement>("[data-flip]", root);
      const glow = root.querySelector<HTMLElement>("[data-glow]");
      const banner = root.querySelector<HTMLElement>("[data-banner]");
      if (nodes.length !== cards.length || !glow || !banner) return;

      const media = gsap.matchMedia();

      media.add({ ok: MOTION_QUERY.ok }, (context) => {
        const { ok } = context.conditions as { ok: boolean };

        // Reduced motion: the CSS in globals.css has already laid the hand out
        // in its slots. A static finished table is the right end state, and
        // there is nothing here worth flying across a screen to say.
        if (!ok) return;

        /**
         * The first pass places the table instead of animating into it.
         * Without it, `autoAlpha` tweening the banner down from its computed
         * opacity makes it visible on the way to zero, so "Message sent"
         * flashes on a page nobody has sent anything from yet.
         */
        let placed = false;
        let celebrated = false;

        const settle = (index: number, state: TableState) => {
          const node = nodes[index];
          const flip = flips[index];
          const card = cards[index];
          if (!node || !flip || !card) return;

          const isPlayed = state.played.includes(card.field);
          const won = state.sent && index === winner;
          const pose = state.sent
            ? WON[index]
            : isPlayed
              ? SLOTS[index]
              : undefined;
          const vars = pose
            ? toVars(pose, index, won)
            : deckVars(index, cards.length);

          if (!placed) {
            gsap.set(node, vars);
            gsap.set(flip, { rotationY: isPlayed || state.sent ? 180 : 0 });
            return;
          }

          // Two eases across two axes is what bows a straight line into an arc
          // over the table. It costs nothing: no motion path plugin, no extra
          // bundle. Whichever axis leaves first gets the fast curve.
          const rising = pose ? pose.y < DECK.y : true;
          const travel = 0.58;

          gsap.to(node, {
            xPercent: vars.xPercent,
            duration: travel,
            ease: rising ? "power2.in" : "power2.out",
            overwrite: "auto",
          });
          gsap.to(node, {
            yPercent: vars.yPercent,
            duration: travel,
            ease: rising ? "power2.out" : "power2.in",
            overwrite: "auto",
          });
          gsap.to(node, {
            rotation: vars.rotation,
            zIndex: vars.zIndex,
            duration: travel,
            ease: ease.out,
            overwrite: "auto",
          });

          // The lift: the card comes up off the felt, travels, and settles back
          // onto it. Without it a card looks like it slid.
          gsap
            .timeline()
            .to(node, {
              scale: vars.scale * 1.1,
              duration: travel * 0.42,
              ease: "power2.out",
            })
            .to(node, {
              scale: vars.scale,
              duration: travel * 0.58,
              // The winner lands with a little overshoot. It is the one card
              // being pointed at; everything else settles flat.
              ease: won ? "back.out(2.6)" : "power2.in",
            });

          gsap.to(flip, {
            rotationY: isPlayed || state.sent ? 180 : 0,
            duration: 0.44,
            ease: ease.out,
            overwrite: "auto",
          });
        };

        apply.current = (state) => {
          cards.forEach((_, index) => settle(index, state));

          // The focus lift rides `y` on the inner node, a property nothing else
          // writes, so it composes with whatever pose the card is holding.
          flips.forEach((flip, index) => {
            gsap.to(flip, {
              y: cards[index]?.field === state.focused ? -14 : 0,
              duration: 0.34,
              ease: ease.out,
              overwrite: "auto",
            });
          });

          if (!placed || !state.sent) {
            // Nothing has been won, so there is nothing to fade out of. Set it.
            gsap.set(glow, { autoAlpha: 0, scale: 0.85 });
            gsap.set(banner, { autoAlpha: 0, y: 8, scale: 0.94 });
          } else {
            gsap.to(glow, {
              autoAlpha: 1,
              scale: 1.06,
              duration: 0.4,
              ease: ease.out,
              overwrite: "auto",
            });
            gsap.to(banner, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.36,
              delay: 0.34,
              ease: ease.out,
              overwrite: "auto",
            });
          }

          if (state.sent && !celebrated) {
            celebrated = true;
            burst(root);
          }

          placed = true;
        };

        // ---- The entrance ---------------------------------------------------
        // The deck falls onto the felt as the section arrives. It rides `y` in
        // pixels on the card, a channel nothing else writes, so a card can be
        // dealt while it is still falling and the two simply compose.
        // Lifted now rather than in the timeline. The board clips, so a deck
        // held above it is simply not there yet; setting it at trigger time
        // would leave one frame of a deck sitting on the felt before it jumps
        // back up to fall.
        gsap.set(nodes, { y: () => -root.offsetHeight * 0.85 });

        const drop = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
          // A layer per card, but only while the deck is in the air.
          onStart: () => gsap.set(nodes, { willChange: "transform" }),
          onComplete: () => gsap.set(nodes, { clearProps: "willChange" }),
        });

        drop
          .to(nodes, {
            // Gravity, so `power2.in`. This is the one place on the site an
            // ease-in is right: nothing is entering a UI here, something is
            // being dropped, and a drop accelerates.
            y: 8,
            duration: 0.46,
            ease: "power2.in",
            stagger: 0.055,
          })
          .to(
            nodes,
            { y: 0, duration: 0.3, ease: "power2.out", stagger: 0.055 },
            "-=0.22",
          );

        return () => {
          apply.current = null;
          drop.scrollTrigger?.kill();
          drop.kill();
        };
      });

      return () => media.revert();
    },
    { scope: stage },
  );

  useEffect(() => {
    apply.current?.({ played, focused, sent });
    // `key` stands in for `played`, whose identity changes on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, focused, sent]);

  const board = {
    // The half-card offset is already taken out here, so the element needs no
    // transform of its own to sit centred on the deck.
    "--card-x": pct(DECK.x - CARD_W / 2),
    "--card-y": pct(DECK.y - CARD_H / 2),
    "--card-w": pct(CARD_W),
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
      {/* Clips the fall: the deck starts above the felt and has to arrive over
          the top edge rather than hang in the page above it. */}
      <div className="contact-board bg-surface border-line absolute inset-0 overflow-hidden rounded-[1.5rem] border shadow-sm md:rounded-[2rem]">
        {/* Warmth where the hand lands, so the felt reads as lit rather than
            as a flat white panel. One hue, low chroma: this is depth. */}
        <div className="absolute inset-0 bg-[radial-gradient(58%_56%_at_50%_62%,var(--color-brand-50),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-ink-200)_0.5px,transparent_0.5px)] opacity-40 [background-size:13px_13px]" />

        {/* The deck slot: where the fall lands, and where an unplayed card sits. */}
        <div className="contact-slot border-line-strong/50 rounded-[1.6cqw] border border-dashed" />

        <div
          data-glow
          className="contact-glow bg-accent/20 invisible rounded-full blur-2xl"
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

/**
 * The celebration.
 *
 * `canvas-confetti` is imported at the moment it is needed rather than with
 * the page, so the bytes only ever reach a browser that got as far as sending
 * something. It draws to a fixed canvas of its own and cleans up after itself.
 *
 * Aimed at the table rather than at the middle of the window, so the burst
 * comes out of the trick that was just taken.
 */
async function burst(root: HTMLElement) {
  if (window.matchMedia(MOTION_QUERY.reduced).matches) return;

  try {
    const { default: confetti } = await import("canvas-confetti");
    const box = root.getBoundingClientRect();
    const origin = {
      x: (box.left + box.width / 2) / window.innerWidth,
      y: (box.top + box.height * 0.45) / window.innerHeight,
    };

    const shared = {
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      origin,
    };

    confetti({
      ...shared,
      particleCount: 90,
      spread: 78,
      startVelocity: 38,
      decay: 0.9,
      scalar: 0.95,
      ticks: 180,
    });

    // A second, wider handful a beat later, so the burst has a tail instead of
    // being one puff that stops dead.
    window.setTimeout(() => {
      confetti({
        ...shared,
        particleCount: 45,
        spread: 110,
        startVelocity: 26,
        decay: 0.91,
        scalar: 0.8,
        ticks: 160,
      });
    }, 220);
  } catch {
    // A missing chunk costs a celebration, never the confirmation. The panel
    // beside this table has already told the visitor the message went.
  }
}

function Corner({
  card,
  flipped = false,
}: {
  card: TableCard;
  flipped?: boolean;
}) {
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
