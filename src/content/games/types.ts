import type { StaticImageData } from "next/image";

/**
 * Game catalogue schema.
 *
 * One record per shipped title. This is the only place game facts live —
 * routes, listings, sitemap entries, JSON-LD and store links are all derived
 * from it. Never hardcode a game name, slug or store URL in a page.
 */

export type GameCategory = "card" | "board" | "puzzle";

export type GameStatus = "live" | "in-development";

/**
 * Where a title comes from culturally. Drives copy ("the Filipino classic"),
 * listing groups and hreflang decisions later. Not a marketing label.
 */
export type GameRegion =
  | "philippines"
  | "india"
  | "bangladesh"
  | "vietnam"
  | "turkey"
  | "france"
  | "germany"
  | "russia"
  | "indonesia"
  | "sri-lanka"
  | "middle-east"
  | "international";

/**
 * An art slot. `src` is a static import so Next.js knows the intrinsic size
 * and can generate a blur placeholder at build time — see
 * src/components/media/media.tsx.
 */
export type GameArtwork = {
  src: StaticImageData;
  /** Describes the artwork, not the game. Empty string = decorative. */
  alt: string;
};

export type GameArt = {
  /** 600x600 store icon. */
  icon?: GameArtwork;
  /** Vertical key art used in listings (4:5). */
  cover?: GameArtwork;
  /** 1024x500 Play Store feature graphic. */
  feature?: GameArtwork;
  /** Phone screenshots, 9:16. */
  screenshots?: GameArtwork[];
};

export type Game = {
  /** URL segment under /games. Stable — changing it needs a redirect. */
  slug: string;
  /** English title as it appears on the store. */
  title: string;
  /**
   * Title in the game's own script, where the store listing has one. Rendered
   * with `font-sans` (Geist), never `font-display` — Bricolage Grotesque has
   * no Cyrillic or Arabic coverage.
   */
  nativeTitle?: string;
  /**
   * One factual sentence about the game itself. Safe to ship as-is.
   * Marketing copy belongs in `description`, sourced from the real store
   * listing — do not write it speculatively.
   */
  summary: string;
  /** Long-form store copy. `null` until the real listing text is imported. */
  description: string | null;
  category: GameCategory;
  region: GameRegion;
  status: GameStatus;
  /** Android application id. Also the Play Store URL key. */
  androidPackageId?: string;
  /** Apple App Store numeric id, when the title ships on iOS. */
  appStoreId?: string;
  /** ISO date, when known from the store listing. */
  releasedAt?: string;
  art?: GameArt;
  /**
   * Paths this game used to live at, for when a slug has to change. Emitted as
   * permanent redirects from next.config.ts. Leading slash, no trailing slash.
   *
   * Empty at launch: every game is served at the URL it already had, so there
   * is nothing to redirect.
   */
  legacyPaths?: readonly string[];
};

export const categoryLabels: Record<GameCategory, string> = {
  card: "Card game",
  board: "Board game",
  puzzle: "Puzzle",
};

export const regionLabels: Record<GameRegion, string> = {
  philippines: "Philippines",
  india: "India",
  bangladesh: "Bangladesh",
  vietnam: "Vietnam",
  turkey: "Türkiye",
  france: "France",
  germany: "Germany",
  russia: "Russia",
  indonesia: "Indonesia",
  "sri-lanka": "Sri Lanka",
  "middle-east": "Middle East",
  international: "International",
};
