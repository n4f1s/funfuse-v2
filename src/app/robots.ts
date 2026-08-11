import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Preview and staging deploys must not be indexed — they would compete with
 * production for the same content. Only the canonical origin allows crawling.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = site.url === "https://funfusegames.com";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
