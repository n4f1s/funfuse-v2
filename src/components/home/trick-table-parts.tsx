import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import {
  NEAR_SEAT,
  SEAT_LABEL,
  SUIT_GLYPH,
  type SceneCard,
  type SeatId,
  type Suit,
} from "./trick-table-round";

/**
 * The pieces the table is made of. All of it is CSS: no image is loaded for
 * this section, and nothing here is a screenshot of a real game.
 *
 * Sizes are in `cqw`, a percentage of the board's own width, so a rank stays
 * the same size relative to the card it is printed on at every viewport. The
 * board declares the container in `globals.css`.
 *
 * Radii are the one place these ignore the site's radius rule. A miniature
 * card is 46px wide; the 18px a real card gets would round it into a lozenge,
 * so the scene uses the same *ratio* rather than the same value.
 */

const SUIT_TONE: Record<Suit, string> = {
  spade: "text-ink-900",
  club: "text-ink-900",
  heart: "text-accent-strong",
  diamond: "text-accent-strong",
};

export function PlayingCard({
  card,
  faceUp,
  lit,
  style,
}: {
  card: SceneCard;
  /** Shows its face in the resting tableau. */
  faceUp: boolean;
  /** Takes the first trick in the resting tableau, so it wears the glow. */
  lit?: "compact" | "wide";
  style?: CSSProperties;
}) {
  const glyph = SUIT_GLYPH[card.suit];

  return (
    <li
      data-card={card.id}
      data-rest-face={faceUp ? "up" : undefined}
      data-rest-lit={lit}
      style={style}
      // Each card owns its own vanishing point. One perspective on the board
      // would flip the far cards at a sharper angle than the near ones.
      className={cn(
        "trick-card [perspective:30cqw] md:[perspective:14cqw]",
        !card.compact && "trick-wide-only",
      )}
    >
      {/* Ring first, so the glow sits under the card rather than over the
          rank. It is a separate element because a box-shadow cannot be
          animated on the GPU. */}
      <span className="trick-glow bg-accent/25 absolute -inset-[6%] rounded-[2.4cqw] blur-[1.4cqw] md:rounded-[1.2cqw] md:blur-[0.7cqw]" />

      <span className="trick-flip absolute inset-0 [transform-style:preserve-3d]">
        <span className="trick-back bg-accent-strong absolute inset-0 overflow-hidden rounded-[1.6cqw] bg-[repeating-linear-gradient(45deg,transparent_0_0.6cqw,rgba(255,255,255,0.14)_0.6cqw_1.2cqw)] shadow-sm [backface-visibility:hidden] md:rounded-[0.8cqw] md:bg-[repeating-linear-gradient(45deg,transparent_0_0.3cqw,rgba(255,255,255,0.14)_0.3cqw_0.6cqw)]">
          <span className="border-surface/45 absolute inset-[11%] rounded-[1cqw] border md:rounded-[0.5cqw]" />
          <span className="bg-surface/85 absolute top-1/2 left-1/2 h-[3cqw] w-[3cqw] -translate-x-1/2 -translate-y-1/2 rotate-45 md:h-[1.5cqw] md:w-[1.5cqw]" />
        </span>

        <span
          className={cn(
            "trick-face bg-surface ring-line absolute inset-0 rounded-[1.6cqw] shadow-sm ring-1 [backface-visibility:hidden] [transform:rotateY(180deg)] md:rounded-[0.8cqw]",
            SUIT_TONE[card.suit],
          )}
        >
          <span className="absolute top-[5%] left-[8%] flex flex-col items-center leading-none">
            <span className="text-[2.7cqw] font-semibold md:text-[1.2cqw]">
              {card.rank}
            </span>
            <span className="text-[2.1cqw] md:text-[0.95cqw]">{glyph}</span>
          </span>

          <span className="absolute inset-0 flex items-center justify-center text-[3.6cqw] md:text-[1.7cqw]">
            {glyph}
          </span>

          {/* Rotated rather than a second markup block: the corner of a real
              card is the same corner, printed upside down. */}
          <span className="absolute right-[8%] bottom-[5%] flex rotate-180 flex-col items-center leading-none">
            <span className="text-[2.7cqw] font-semibold md:text-[1.2cqw]">
              {card.rank}
            </span>
            <span className="text-[2.1cqw] md:text-[0.95cqw]">{glyph}</span>
          </span>
        </span>
      </span>
    </li>
  );
}

/**
 * A seat: who is sitting there and how many tricks they hold.
 *
 * The count is server rendered at zero, which is the honest state of the
 * tableau a static visitor sees, because it shows the first trick still on
 * the table rather than collected.
 */
export function PlayerSeat({
  seat,
  style,
}: {
  seat: SeatId;
  style?: CSSProperties;
}) {
  return (
    <div style={style} className="trick-anchor -translate-x-1/2 -translate-y-1/2">
      <div
        data-seat-chip={seat}
        className={cn(
          "text-2xs md:text-xs flex items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 shadow-sm",
          // The near seat is the one the table is played from, so it is the
          // one carrying the accent. Everybody else is furniture.
          seat === NEAR_SEAT
            ? "border-brand-200 bg-accent-tint"
            : "border-line bg-surface",
        )}
      >
        {/* A player mark, not a face. Drawing four little avatars would be
            four little claims about who plays these games. */}
        <span className="from-brand-200 to-brand-100 ring-surface grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br ring-2 md:h-5 md:w-5">
          <span className="bg-accent-strong h-1.5 w-1.5 rounded-full md:h-2 md:w-2" />
        </span>
        <span className="text-heading font-medium">{SEAT_LABEL[seat]}</span>
        <span className="bg-surface-sunken text-muted tabular rounded-full px-1.5 font-medium">
          <span data-seat-count={seat}>0</span>
        </span>
      </div>
    </div>
  );
}

/** The empty slot a seat's won tricks stack onto. */
export function TrickPile({
  seat,
  style,
}: {
  seat: SeatId;
  style?: CSSProperties;
}) {
  return (
    <div
      data-pile={seat}
      style={style}
      className="trick-pile border-line-strong/70 rounded-[1cqw] border border-dashed md:rounded-[0.5cqw]"
    />
  );
}
