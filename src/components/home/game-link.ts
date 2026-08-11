import { playStoreUrl, type Game } from "@/content/games";

/**
 * Where a game on the homepage points.
 *
 * The canonical destination is `gameHref(game)` (`/projects/<slug>/`), but none
 * of those pages are built yet, so every card and row would link to a 404. Until
 * they ship, the homepage sends people to the real Play Store listing derived
 * from `androidPackageId`.
 *
 * This is the single place that decision lives. When the detail pages land,
 * this function becomes `return gameHref(game)` and nothing else changes.
 */
export function gameLinkHref(game: Game): string | null {
  return playStoreUrl(game);
}
