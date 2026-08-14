import type { MetadataRoute } from "next";

import { liveRoutes, routes } from "@/config/routes";
import { getLegacyBlogPosts, getNewBlogPosts } from "@/content/blog";
import { gameHref, getAllGames } from "@/content/games";
import { absoluteUrl } from "@/lib/seo";

/**
 * Sitemap.
 *
 * This becomes the authoritative sitemap for funfusegames.com the moment the
 * new site is live. It replaces the WordPress `sitemap.xml` index outright —
 * the old one is not kept around, because two sitemaps disagreeing about which
 * URLs exist is worse than one that is briefly incomplete.
 *
 * Only routes marked `live` in src/config/routes.ts are emitted: submitting a
 * URL that 404s costs more than omitting one that will appear next week. Most
 * of these paths are inherited from WordPress and unchanged, so for Google
 * this reads as the same site, not a new one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = liveRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /**
   * Game detail pages, at their preserved `/projects/<slug>/` paths. They join
   * the sitemap once the detail route ships; `routes.games.live` gates the
   * catalogue and the detail pages together because they ship together.
   */
  const gameEntries = routes.games.live
    ? getAllGames().map((game) => ({
        url: absoluteUrl(gameHref(game)),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    : [];

  const legacyBlogEntries = routes.blogs.live
    ? getLegacyBlogPosts().map((post) => ({
        url: absoluteUrl(post.canonicalPath),
        ...(post.modifiedAt ? { lastModified: new Date(`${post.modifiedAt}T00:00:00Z`) } : {}),
        changeFrequency: "yearly" as const,
        priority: 0.4,
      }))
    : [];

  // New articles deliberately do not expose a made-up historical date. They
  // enter the sitemap without lastModified until a real publication update.
  const newBlogEntries = routes.blogs.live
    ? getNewBlogPosts().map((post) => ({
        url: absoluteUrl(post.canonicalPath),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    : [];

  return [...staticEntries, ...gameEntries, ...legacyBlogEntries, ...newBlogEntries];
}
