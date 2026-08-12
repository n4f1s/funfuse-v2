import { games } from "./games";
import {
  categoryLabels,
  type Game,
  type GameCategory,
  type GameRegion,
} from "./types";

export { games } from "./games";
export * from "./types";

/**
 * Artwork lives in `./art`, which is NOT re-exported here on purpose: this
 * barrel is imported by `next.config.ts` in a plain Node context, and the
 * static image imports in `./art` would fail to resolve there. Import it
 * directly as `@/content/games/art`.
 */

/** Every game, newest known release first, then alphabetical. */
export function getAllGames(): readonly Game[] {
  return games;
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function getGamesByCategory(category: GameCategory): Game[] {
  return games.filter((game) => game.category === category);
}

/**
 * Distinct regions the catalogue draws from, excluding `international`.
 *
 * `international` is a fallback for titles with no single home (Gin Rummy,
 * Puzzle Club), so counting it would overstate how many living traditions the
 * catalogue actually covers. Any figure the site prints about reach is derived
 * from this, never typed in by hand.
 */
export function getGameRegions(): GameRegion[] {
  const regions = new Set<GameRegion>();
  for (const game of games) {
    if (game.region !== "international") regions.add(game.region);
  }
  return [...regions];
}

/** Categories that actually have titles, with counts, for listing filters. */
export function getGameCategories(): {
  value: GameCategory;
  label: string;
  count: number;
}[] {
  const counts = new Map<GameCategory, number>();
  for (const game of games) {
    counts.set(game.category, (counts.get(game.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, label: categoryLabels[value], count }));
}

/**
 * Canonical route for a game detail page.
 *
 * `/projects/` is inherited from WordPress and is deliberately kept: eight of
 * these URLs are indexed and ranking, and moving them to buy a tidier prefix
 * is not worth the risk. The eleven titles that never had a page join the same
 * namespace so the catalogue has one URL shape rather than two.
 *
 * The prefix is a public-URL decision only. The implementation is a single
 * reusable game detail view fed by this module.
 */
export const GAME_PATH_PREFIX = "/projects";

export function gameHref(game: Pick<Game, "slug">): string {
  return `${GAME_PATH_PREFIX}/${game.slug}`;
}

/** Google Play listing URL, derived from the package id. */
export function playStoreUrl(game: Pick<Game, "androidPackageId">): string | null {
  return game.androidPackageId
    ? `https://play.google.com/store/apps/details?id=${game.androidPackageId}`
    : null;
}

export function appStoreUrl(game: Pick<Game, "appStoreId">): string | null {
  return game.appStoreId
    ? `https://apps.apple.com/app/id${game.appStoreId}`
    : null;
}

/**
 * Old game path -> current path, for the redirect table in next.config.ts.
 *
 * Empty at launch by design: every game keeps the URL it already had, so there
 * is nothing to redirect. The mechanism stays because a slug will eventually
 * need to change, and when it does the old path goes into `legacyPaths` and
 * the redirect wires itself.
 *
 * Paths that now equal the live URL are filtered out — leaving one in would
 * produce a redirect loop.
 */
export function getGameRedirects(): { source: string; destination: string }[] {
  return games.flatMap((game) => {
    const destination = gameHref(game);
    return (game.legacyPaths ?? [])
      .filter((source) => source !== destination)
      .map((source) => ({ source, destination }));
  });
}

/**
 * Other titles worth surfacing on a game's detail page.
 *
 * Same category first, then same region, then whatever is left, so every
 * game gets a full rail: `puzzle-twist-game` is the only puzzle in the
 * catalogue and `board` has just two titles, so "same category only" would
 * leave those pages nearly empty.
 */
export function getRelatedGames(game: Game, count = 6): Game[] {
  const pool = games.filter((candidate) => candidate.slug !== game.slug);
  const byCategory = pool.filter(
    (candidate) => candidate.category === game.category,
  );
  const byRegion = pool.filter(
    (candidate) =>
      candidate.region === game.region && !byCategory.includes(candidate),
  );
  const rest = pool.filter(
    (candidate) =>
      !byCategory.includes(candidate) && !byRegion.includes(candidate),
  );
  return [...byCategory, ...byRegion, ...rest].slice(0, count);
}
