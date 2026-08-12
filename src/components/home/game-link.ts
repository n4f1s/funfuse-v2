import { gameHref, type Game } from "@/content/games";

/**
 * Where a game on the homepage points: its own detail page.
 *
 * This is the single place that decision lives, so the homepage never builds
 * a `/projects/<slug>/` URL by hand.
 */
export function gameLinkHref(game: Game): string {
  return gameHref(game);
}
