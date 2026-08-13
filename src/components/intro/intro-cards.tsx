import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/**
 * The five cards, their geometry, and the four suits.
 *
 * All of it is CSS and SVG: the intro loads no artwork of its own beyond the
 * brand lockup the header already fetches on every page.
 *
 * **The suits are drawn, not typed.** Everywhere else on the site they are the
 * Unicode glyphs, which is fine inside a paragraph of type. Here they are the
 * subject, and on a good number of Android builds `♥` and `♦` resolve to the
 * emoji font: a glossy red heart in the middle of an otherwise flat card. Four
 * paths, defined once and referenced with `<use>`, cost less than the glyphs
 * and look the same on every device.
 *
 * Sizes are in `cqw` against the stage, so a rank stays the same size relative
 * to the card it is printed on from a 360px phone to a desktop.
 */

export type SuitName = "spade" | "heart" | "diamond" | "club";

/** 24x24, all four drawn on the same optical weight. */
const SUIT_PATH: Record<SuitName, string> = {
  spade:
    "M12 2.4c0 0-8.6 6.3-8.6 11.5 0 2.7 1.9 4.6 4.3 4.6 1.5 0 2.8-.7 3.5-1.9.1 2.1-.5 3.9-1.8 5.1h5.2c-1.3-1.2-1.9-3-1.8-5.1.7 1.2 2 1.9 3.5 1.9 2.4 0 4.3-1.9 4.3-4.6C20.6 8.7 12 2.4 12 2.4z",
  heart:
    "M12 21.3c0 0-8.9-5.9-8.9-12C3.1 6 5.4 3.6 8.2 3.6c1.8 0 3.1.9 3.8 2 .7-1.1 2-2 3.8-2 2.8 0 5.1 2.4 5.1 5.7 0 6.1-8.9 12-8.9 12z",
  diamond: "M12 2.2 20.4 12 12 21.8 3.6 12z",
  club: "M12 2.3c-2.1 0-3.8 1.7-3.8 3.8 0 .7.2 1.3.5 1.8-.5-.2-1-.4-1.6-.4-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8c1.4 0 2.6-.7 3.2-1.8.1 2.6-.5 4.9-1.7 6.4h6.8c-1.2-1.5-1.8-3.8-1.7-6.4.6 1.1 1.8 1.8 3.2 1.8 2.1 0 3.8-1.7 3.8-3.8s-1.7-3.8-3.8-3.8c-.6 0-1.1.2-1.6.4.3-.5.5-1.1.5-1.8 0-2.1-1.7-3.8-3.8-3.8z",
};

export type IntroFace = {
  rank: string;
  suit: SuitName;
  /** The card the whole composition is built around. Exactly one. */
  hero?: true;
};

/**
 * A hand, not a poker hand.
 *
 * All four suits so the thing reads as "card games" at a glance, and ranks that
 * belong to the games in the catalogue rather than to a casino: seven through
 * ace is the Belote deck. The Ace of Spades sits in the middle because it is
 * the card that has carried the maker's mark since printers started signing
 * their decks, which is exactly the job it does here.
 */
export const HAND: readonly IntroFace[] = [
  { rank: "7", suit: "diamond" },
  { rank: "J", suit: "club" },
  { rank: "A", suit: "spade", hero: true },
  { rank: "Q", suit: "heart" },
  { rank: "K", suit: "spade" },
];

/** Index of the hero card in `HAND`. The fan is symmetric about it. */
export const HERO = 2;

export type Pose = { x: number; y: number; r: number };

/**
 * Where the cards are painted by the server, and therefore the first frame of
 * the choreography. A loose deck rather than a perfect stack: a squared deck is
 * where the animation *goes*, and it makes the opening beat a real gesture
 * instead of a jump.
 *
 * This is also the resting composition. Reduced motion and a failed chunk both
 * leave the visitor looking at it, so it has to be worth looking at.
 */
export const STACK: readonly Pose[] = [
  { x: -2.6, y: 1.8, r: -2.6 },
  { x: 1.8, y: -1.2, r: 1.8 },
  { x: -0.4, y: 0.4, r: -0.5 },
  { x: 2.6, y: 1.6, r: 3 },
  { x: -1.6, y: -0.9, r: -1.6 },
];

/**
 * The spread. Percentages of a card's own size, so it scales with the stage.
 *
 * The 64% step is the tightest the hand can be fanned and still show every
 * card's central pip: a neighbour lands 64% across, and a pip occupies the
 * middle third. Anything closer and the queen's heart is a red shape behind
 * the ace instead of a heart.
 */
export const FAN: readonly Pose[] = [
  { x: -128, y: 24, r: -22 },
  { x: -64, y: 6, r: -11 },
  { x: 0, y: 0, r: 0 },
  { x: 64, y: 6, r: 11 },
  { x: 128, y: 24, r: 22 },
];

/**
 * Stacking order. The hero is on top of both wings, which is what a hand fanned
 * from the middle looks like, and it is also what lets every other card tuck
 * back underneath it at the end without a single z change mid-flight.
 */
export const Z: readonly number[] = [10, 20, 40, 25, 15];

/**
 * Fractions of the stage. The stage is 3:2, the cards are 5:7.
 *
 * 3:2 rather than something squarer because the fan is a wide, shallow shape:
 * at these angles it reaches 155% of a card's width either side of the middle
 * but only 90% of a card's height below it. A squarer stage would clear the
 * fan with room to spare and then push the readout a long way down the screen
 * to say nothing.
 */
export const CARD_W = 0.24;
const STAGE_ASPECT = 3 / 2;
export const CARD_H = CARD_W * (7 / 5) * STAGE_ASPECT;

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

/** Custom properties the `.intro-card` rule in globals.css reads. */
export const stageVars: CSSProperties = {
  "--intro-card-x": pct(0.5 - CARD_W / 2),
  "--intro-card-y": pct(0.5 - CARD_H / 2),
  "--intro-card-w": pct(CARD_W),
} as CSSProperties;

/**
 * The four suits, defined once. Every pip on every card is a `<use>` of one of
 * these, which keeps the overlay's markup small — it ships in the HTML of every
 * route, including the ones that will never display it.
 */
export function SuitDefs() {
  return (
    <svg aria-hidden focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {(Object.keys(SUIT_PATH) as SuitName[]).map((suit) => (
          <symbol key={suit} id={`intro-suit-${suit}`} viewBox="0 0 24 24">
            <path d={SUIT_PATH[suit]} fill="currentColor" />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

function Pip({ suit, className }: { suit: SuitName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <use href={`#intro-suit-${suit}`} />
    </svg>
  );
}

export function IntroCard({
  face,
  pose,
  z,
}: {
  face: IntroFace;
  pose: Pose;
  z: number;
}) {
  const red = face.suit === "heart" || face.suit === "diamond";

  return (
    <div
      data-intro-card
      data-hero={face.hero}
      className="intro-card"
      // The resting pose lives in the markup, so this is a deck of cards before
      // any script runs and cannot drift if none ever does. GSAP re-declares
      // the same numbers as `xPercent` before it moves anything: reading them
      // back out of a computed matrix would give pixels where these are
      // percentages of the card.
      style={{
        transform: `translate(${pose.x}%, ${pose.y}%) rotate(${pose.r}deg)`,
        zIndex: z,
      }}
    >
      <div
        data-intro-flip
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* Back. The face the deck rests on, and the only brand colour in the
            composition until the fan turns over. */}
        <div className="bg-accent-strong absolute inset-0 overflow-hidden rounded-[1.6cqw] shadow-lg [backface-visibility:hidden]">
          <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent_0_0.7cqw,rgba(255,255,255,0.11)_0.7cqw_1.4cqw)]" />
          <span className="border-surface/35 absolute inset-[7%] rounded-[1.1cqw] border" />
          <span className="border-surface/50 bg-surface/15 absolute top-1/2 left-1/2 h-[6cqw] w-[6cqw] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[0.7cqw] border" />
        </div>

        <div className="bg-surface ring-line absolute inset-0 rounded-[1.6cqw] shadow-lg ring-1 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {/* Everything printed on the card sits in one node, so the exit can
              take the ink away and leave a plain white sheet. At the scale the
              hero card reaches, an inset hairline would otherwise stretch into
              a soft grey rectangle across the middle of the screen. */}
          <div
            data-intro-ink
            className={cn(
              "absolute inset-0",
              red ? "text-accent-strong" : "text-heading",
            )}
          >
            <span className="border-line/70 absolute inset-[7%] rounded-[1.1cqw] border" />

            <Corner face={face} />

            {face.hero ? <MakersMark suit={face.suit} /> : (
              <span className="absolute inset-0 grid place-items-center">
                <Pip suit={face.suit} className="h-[8cqw] w-[8cqw]" />
              </span>
            )}

            {/* Rotated, not written twice: the corner of a real card is the
                same corner, printed upside down. */}
            <Corner face={face} flipped />
          </div>
        </div>
      </div>
    </div>
  );
}

function Corner({ face, flipped }: { face: IntroFace; flipped?: boolean }) {
  return (
    <span
      className={cn(
        "absolute flex flex-col items-center gap-[0.4cqw] leading-none",
        flipped ? "right-[9%] bottom-[6%] rotate-180" : "top-[6%] left-[9%]",
      )}
    >
      <span className="text-[3.4cqw] font-semibold">{face.rank}</span>
      <Pip suit={face.suit} className="h-[2.5cqw] w-[2.5cqw]" />
    </span>
  );
}

/**
 * The ace's single central pip, inside the ring a printer would have put its
 * name in. Two hairline circles and a dashed one, which is the sort of thing
 * SVG does for a few hundred bytes and a stack of divs does badly.
 */
function MakersMark({ suit }: { suit: SuitName }) {
  return (
    <span className="absolute inset-0 grid place-items-center">
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        focusable="false"
        className="absolute h-[17cqw] w-[17cqw]"
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="var(--color-brand-200)"
          strokeWidth="1.4"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--color-brand-100)"
          strokeWidth="2.6"
          strokeDasharray="1.6 5"
          strokeLinecap="round"
        />
      </svg>
      <Pip suit={suit} className="relative h-[9cqw] w-[9cqw]" />
    </span>
  );
}
