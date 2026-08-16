import type { GameCategory } from "@/content/games/types";

/**
 * Route registry.
 *
 * The launch principle is **preserve, do not tidy**. If a WordPress URL can
 * serve the equivalent new content, the new site serves it at that exact path,
 * trailing slash included. A cleaner URL structure is not a reason to move a
 * page that already ranks. Redirects are reserved for URLs that are genuinely
 * consolidated, obsolete, or have no equivalent.
 *
 * This means the public URL structure and the internal code structure do not
 * match, and that is fine: game detail pages live at `/projects/<slug>/`
 * publicly while the implementation is a single reusable `GameDetail` fed by
 * `src/content/games`.
 *
 * `live: false` routes are committed to but not built yet — they are excluded
 * from the sitemap so we never submit a URL that 404s. Flip the flag in the
 * same commit that ships the page.
 */

export type RouteEntry = {
  path: string;
  live: boolean;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  /** Present on paths inherited from WordPress. Absent means it is new. */
  preserved?: true;
};

export const routes = {
  home: { path: "/", live: true, changeFrequency: "weekly", priority: 1 },

  /** New. The catalogue the old site never had a clean URL for. */
  games: {
    path: "/games",
    live: true,
    changeFrequency: "weekly",
    priority: 0.9,
  },

  /** Preserved. Blog listing. */
  blogs: {
    path: "/blogs",
    live: true,
    changeFrequency: "weekly",
    priority: 0.6,
    preserved: true,
  },

  /**
   * New. The Studio page: who the studio is, what it makes and how.
   *
   * It replaces two WordPress pages rather than inheriting either of them.
   * `/our-team/` held the people and `/services/` held the disciplines; this
   * page carries both plus the process, the catalogue and the crafts, so
   * neither old URL describes what is served here any more. Both 308 into it.
   *
   * Not `preserved`: this path is ours, not inherited. The two inherited ones
   * are in `legacyRedirects` with their reason, and docs/seo-migration.md
   * records the trade being made.
   */
  studio: {
    path: "/studio",
    live: true,
    changeFrequency: "monthly",
    priority: 0.8,
  },

  careers: {
    path: "/careers",
    live: true,
    changeFrequency: "weekly",
    priority: 0.6,
    preserved: true,
  },
  contact: {
    path: "/contact-us",
    live: true,
    changeFrequency: "yearly",
    priority: 0.5,
    preserved: true,
  },
  faq: {
    path: "/faq",
    live: true,
    changeFrequency: "monthly",
    priority: 0.5,
    preserved: true,
  },
  terms: {
    path: "/tos",
    live: true,
    changeFrequency: "yearly",
    priority: 0.2,
    preserved: true,
  },
  privacy: {
    path: "/privacy-policy",
    live: true,
    changeFrequency: "yearly",
    priority: 0.2,
    preserved: true,
  },
} as const satisfies Record<string, RouteEntry>;

/**
 * Preserved WordPress genre archives, served by `/project-genre/[genre]/`.
 * Each one maps to a category that exists in the catalogue, so the URL keeps
 * serving equivalent content. `strategy` has no equivalent and is redirected
 * instead (see `legacyRedirects`).
 */
export const legacyGenreRoutes: Record<string, GameCategory> = {
  "card-game": "card",
  "board-game": "board",
};

export const genreRoutes: RouteEntry[] = Object.keys(legacyGenreRoutes).map(
  (genre) => ({
    path: `/project-genre/${genre}`,
    live: true,
    changeFrequency: "monthly",
    priority: 0.4,
    preserved: true,
  }),
);

/**
 * Blog posts published at the site root by WordPress. They stay at the root.
 *
 * Their source of truth is now `src/content/blog.ts`, which also owns sitemap
 * metadata. Keeping a route registry record here would duplicate that data.
 */
export const allRoutes: RouteEntry[] = [
  ...Object.values(routes),
  ...genreRoutes,
];

export const liveRoutes: RouteEntry[] = allRoutes.filter((route) => route.live);

/**
 * The only URLs that change.
 *
 * Every entry needs a reason that fits one of: the content is genuinely being
 * consolidated, the path is a CMS artifact with nothing to retain, or there is
 * no equivalent content in the new site. Adding a row because a path is untidy
 * is not allowed.
 */
export const legacyRedirects: readonly {
  source: string;
  destination: string;
  reason: string;
}[] = [
  {
    source: "/funfuse-home/games",
    destination: "/games",
    reason:
      "CMS artifact. 'funfuse-home' is a WordPress page-tree remnant, not a name anyone links or searches. The catalogue it held is consolidated onto /games/.",
  },
  {
    source: "/projects",
    destination: "/games",
    reason:
      "Bare post-type archive with no content of its own. Consolidated into the catalogue. Individual /projects/<slug>/ pages are untouched.",
  },
  {
    source: "/project-genre/strategy",
    destination: "/games",
    reason:
      "No equivalent. The catalogue has card, board and puzzle categories; nothing maps to 'strategy'.",
  },
  {
    source: "/our-team",
    destination: "/studio",
    reason:
      "Consolidated. WordPress split the studio across /our-team/ for the people and /services/ for the work. Both are now one page, which is about the studio rather than about a team roster, so neither old title describes it. /studio/ is the name the navigation has used for this section since launch. Points straight at the destination so no visitor or crawler is asked to take two hops.",
  },
  {
    source: "/services",
    destination: "/studio",
    reason:
      "Consolidated into the same page as /our-team/, including the three disciplines this URL listed. Keeping a thinner second copy of that content would compete with the real one.",
  },
  {
    source: "/category/company",
    destination: "/blogs",
    reason:
      "Every post sits in this one category, so the archive is a duplicate of the blog listing. Consolidated.",
  },
  {
    source: "/category/company/card-game",
    destination: "/blogs",
    reason: "Nested duplicate of the same three posts. Consolidated.",
  },
] as const;

/**
 * Build-time guard against the ways a redirect table goes wrong: a rule that
 * points at itself (infinite loop), a duplicate source, and a rule that
 * shadows a page we actually serve (the page becomes unreachable). Called from
 * next.config.ts, so a bad table fails the build rather than production.
 *
 * `servedPaths` covers routes this registry cannot see because they come from
 * content — above all the game detail pages at `/projects/<slug>/`, which are
 * the URLs most worth protecting. next.config.ts passes them in.
 */
export function assertRedirectTable(
  entries: readonly { source: string; destination: string }[],
  servedPaths: readonly string[] = [],
): void {
  const seen = new Set<string>();
  const served = new Set([
    ...allRoutes.map((route) => route.path),
    ...servedPaths,
  ]);

  for (const { source, destination } of entries) {
    if (source === destination) {
      throw new Error(`Redirect points at itself: ${source}`);
    }
    if (seen.has(source)) {
      throw new Error(`Duplicate redirect source: ${source}`);
    }
    if (served.has(source)) {
      throw new Error(
        `Redirect source ${source} is a route we serve. Preserved URLs must not be redirected.`,
      );
    }
    seen.add(source);
  }
}
