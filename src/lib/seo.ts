import type { Metadata } from "next";

import { site } from "@/config/site";

/**
 * Metadata helpers.
 *
 * Every route builds its metadata through `createMetadata` so canonical URLs,
 * Open Graph and Twitter cards stay consistent and no page silently ships
 * without a canonical. The root layout owns `metadataBase` and the title
 * template; pages only supply what differs.
 */

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Builds a canonical absolute URL.
 *
 * `trailingSlash: true` is set in next.config.ts to preserve the WordPress URL
 * shape, so every canonical, sitemap entry and JSON-LD `@id` must end in a
 * slash. File-like paths (/sitemap.xml) are left alone. Always go through this
 * function — a canonical that disagrees with the served URL splits the page's
 * ranking signals across two addresses.
 */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const [pathname, rest = ""] = splitQuery(withLeadingSlash);
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  const normalized =
    isFile || pathname.endsWith("/") ? pathname : `${pathname}/`;

  return `${site.url}${normalized}${rest}`;
}

function splitQuery(path: string): [string, string?] {
  const index = path.search(/[?#]/);
  return index === -1
    ? [path]
    : [path.slice(0, index), path.slice(index)];
}

type CreateMetadataInput = {
  /** Page title without the site suffix. Omit on the homepage. */
  title?: string;
  /** A complete title supplied by source content, without the layout suffix. */
  titleAbsolute?: string;
  description: string;
  /** Route path, e.g. "/games/tongit". Used for the canonical URL. */
  path: string;
  /** Overrides the generated OG image for this route. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article";
  /** Set for legal or thin pages that should stay out of the index. */
  noIndex?: boolean;
  keywords?: string[];
};

export function createMetadata({
  title,
  titleAbsolute,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  keywords,
}: CreateMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = image
    ? {
        url: image.url,
        width: image.width ?? OG_IMAGE_SIZE.width,
        height: image.height ?? OG_IMAGE_SIZE.height,
        alt: image.alt ?? title ?? site.name,
      }
    : undefined;

  const fullTitle = titleAbsolute ?? (title ? `${title} | ${site.name}` : site.defaultTitle);

  return {
    // The key must be absent, not `undefined`: an explicit undefined overrides
    // the layout's `title.default` and the page ships with no <title> at all.
    ...(titleAbsolute ? { title: { absolute: titleAbsolute } } : title ? { title } : {}),
    description,
    keywords,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
      // Omitting `images` lets the file-convention opengraph-image apply.
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
  };
}
