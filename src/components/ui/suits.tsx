/**
 * The four suits, drawn.
 *
 * Everywhere the site sets them in a paragraph it uses the Unicode glyphs, which
 * is fine inside type. Wherever a suit is the subject — a card face, the back's
 * medallion — it is one of these paths instead, because on a good number of
 * Android builds `♥` and `♦` resolve to the emoji font and put a glossy red
 * heart in the middle of an otherwise flat card.
 *
 * Two ways to draw one, and the choice is about bytes rather than taste:
 *
 *   - `SuitIcon` inlines the path. Correct for anything rendered on demand by
 *     the client, where the markup never reaches the served HTML.
 *   - `SUIT_PATH` feeds a `<symbol>`/`<use>` pair. Correct where the same shape
 *     appears a dozen times in HTML that ships on every route — see the intro,
 *     which prints thirty-odd pips before a single script has run.
 */

export type SuitName = "spade" | "heart" | "diamond" | "club";

/** Reading order of the medallion: spade, heart / diamond, club. */
export const SUITS: readonly SuitName[] = ["spade", "heart", "diamond", "club"];

/** 24x24, all four drawn on the same optical weight. */
export const SUIT_PATH: Record<SuitName, string> = {
  spade:
    "M12 2.4c0 0-8.6 6.3-8.6 11.5 0 2.7 1.9 4.6 4.3 4.6 1.5 0 2.8-.7 3.5-1.9.1 2.1-.5 3.9-1.8 5.1h5.2c-1.3-1.2-1.9-3-1.8-5.1.7 1.2 2 1.9 3.5 1.9 2.4 0 4.3-1.9 4.3-4.6C20.6 8.7 12 2.4 12 2.4z",
  heart:
    "M12 21.3c0 0-8.9-5.9-8.9-12C3.1 6 5.4 3.6 8.2 3.6c1.8 0 3.1.9 3.8 2 .7-1.1 2-2 3.8-2 2.8 0 5.1 2.4 5.1 5.7 0 6.1-8.9 12-8.9 12z",
  diamond: "M12 2.2 20.4 12 12 21.8 3.6 12z",
  club: "M12 2.3c-2.1 0-3.8 1.7-3.8 3.8 0 .7.2 1.3.5 1.8-.5-.2-1-.4-1.6-.4-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8c1.4 0 2.6-.7 3.2-1.8.1 2.6-.5 4.9-1.7 6.4h6.8c-1.2-1.5-1.8-3.8-1.7-6.4.6 1.1 1.8 1.8 3.2 1.8 2.1 0 3.8-1.7 3.8-3.8s-1.7-3.8-3.8-3.8c-.6 0-1.1.2-1.6.4.3-.5.5-1.1.5-1.8 0-2.1-1.7-3.8-3.8-3.8z",
};

/** Takes its colour from `currentColor`, so callers style it with `text-*`. */
export function SuitIcon({
  suit,
  className,
}: {
  suit: SuitName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <path d={SUIT_PATH[suit]} fill="currentColor" />
    </svg>
  );
}
