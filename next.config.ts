import type { NextConfig } from "next";

import { assertRedirectTable, legacyRedirects } from "./src/config/routes";
import { gameHref, getAllGames, getGameRedirects } from "./src/content/games";

/**
 * Redirects from the WordPress site.
 *
 * Deliberately short. Every URL in the live sitemap on 2026-08-11 keeps its
 * exact path unless it is genuinely consolidated or has no equivalent; those
 * five exceptions, each with a written reason, live in `legacyRedirects`.
 *
 * `permanent: true` is what passes ranking signal, so nothing here is ever
 * temporary. Sources are written without a trailing slash; Next normalises
 * both forms before matching, and `trailingSlash: true` puts the slash back on
 * the destination.
 */
async function redirects() {
  const entries = [...legacyRedirects, ...getGameRedirects()];

  // Fails the build on a self-redirect, a duplicate source, or a rule that
  // would shadow a URL we promised to preserve. Game detail paths are passed
  // in because they come from the catalogue, not the route registry.
  assertRedirectTable(entries, getAllGames().map(gameHref));

  return entries.map(({ source, destination }) => ({
    source,
    // Destinations are declared slash-free; add the slash here so an old URL
    // lands on its final address in one hop instead of bouncing through the
    // trailing-slash normaliser.
    destination: destination.endsWith("/") ? destination : `${destination}/`,
    permanent: true,
  }));
}

const nextConfig: NextConfig = {
  /**
   * The WordPress site served every URL with a trailing slash, and pages we
   * are keeping (/careers/, /faq/, /tos/, /privacy-policy/, /contact-us/)
   * carry ranking. Matching that shape means those URLs survive the migration
   * byte for byte with no redirect at all, and the pages that do move take a
   * single hop instead of two.
   *
   * Consequence: canonical URLs, the sitemap and JSON-LD must all end in a
   * slash. That is centralised in `absoluteUrl` (src/lib/seo.ts) — never build
   * an absolute URL by hand.
   */
  trailingSlash: true,

  redirects,

  images: {
    /**
     * Only 75 is allowed, matching the Next 16 default. A single quality means
     * one cache entry per size instead of one per size-and-quality pair.
     */
    qualities: [75],
    /**
     * AVIF first, WebP fallback. AVIF is roughly 20% smaller at the same
     * quality, which matters most on the mobile connections our players use.
     */
    formats: ["image/avif", "image/webp"],
    /** Play Store assets, once we start pulling icons and screenshots. */
    remotePatterns: [
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
    ],
  },

  /** Surface accessibility and correctness problems during development. */
  reactStrictMode: true,

  /** Do not advertise the framework version to every visitor. */
  poweredByHeader: false,
};

export default nextConfig;
