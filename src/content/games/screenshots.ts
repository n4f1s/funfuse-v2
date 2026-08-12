import type { StaticImageData } from "next/image";

import { generatedScreenshots } from "./generated/screenshots.generated";
import type { GameArtwork } from "./types";

/** Every game gets exactly this many screenshot slots. */
export const SCREENSHOT_SLOT_COUNT = 5;

/**
 * The always-five-slot screenshot list for a game.
 *
 * Backed entirely by `./generated/screenshots.generated.ts`, which
 * `scripts/generate-screenshots.ts` regenerates from the filesystem — see
 * that file for how a slot becomes a real import or `null`. This function's
 * only job is to turn a `null` slot into `null` (the gallery's placeholder
 * cue) and a real one into a `GameArtwork`, with alt text built from the
 * game's own title rather than curated per screenshot, since no game in the
 * catalogue has curated screenshot copy yet.
 */
export function getGameScreenshots(
  slug: string,
  title: string,
): (GameArtwork | null)[] {
  const slots = generatedScreenshots[slug] ?? emptySlots();

  return slots.map((src, index) => toArtwork(src, title, index));
}

function toArtwork(
  src: StaticImageData | null,
  title: string,
  index: number,
): GameArtwork | null {
  return src ? { src, alt: `${title} gameplay screenshot ${index + 1}.` } : null;
}

function emptySlots(): readonly (StaticImageData | null)[] {
  return Array.from({ length: SCREENSHOT_SLOT_COUNT }, () => null);
}
