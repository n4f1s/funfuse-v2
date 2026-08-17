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
 * The generated default social card, built by src/app/opengraph-image.tsx.
 *
 * Named explicitly rather than left to the file convention. The convention
 * binds an image to the segment the file sits in, and every page here declares
 * its own `openGraph` block through `createMetadata` below — which replaced the
 * inherited one and took the image with it. The result was that only
 * `/404/`, the one route in the same segment as the file, ever carried a card:
 * the homepage, /games/, /studio/, /careers/, /contact-us/, /faq/, /tos/,
 * /privacy-policy/ and /blogs/ all shipped `summary_large_image` with nothing
 * behind it.
 *
 * With the trailing slash, because `trailingSlash: true` applies to this route
 * too: `/opengraph-image` answers 308 and only `/opengraph-image/` answers 200.
 * Most scrapers follow the hop, but the ones that do not would show no card at
 * all, and there is no reason to spend a redirect on the canonical form. Worth
 * noting that Next's own file-convention tag emits the slash-free URL, which is
 * a second reason this is set here rather than left to the convention.
 */
const DEFAULT_OG_IMAGE = {
  url: `${site.url}/opengraph-image/`,
  width: OG_IMAGE_SIZE.width,
  height: OG_IMAGE_SIZE.height,
  alt: `${site.name} - ${site.tagline}`,
} as const;

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
  // A route that supplies its own artwork keeps it — game covers and blog hero
  // plates are more use in a share card than the studio lockup. Everything else
  // falls back to the generated default rather than to no image at all.
  const ogImage = image
    ? {
        url: image.url,
        width: image.width ?? OG_IMAGE_SIZE.width,
        height: image.height ?? OG_IMAGE_SIZE.height,
        alt: image.alt ?? title ?? site.name,
      }
    : DEFAULT_OG_IMAGE;

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
      // Always set, never omitted. Leaving this out to let the file convention
      // fill it in is what produced nine imageless pages — see DEFAULT_OG_IMAGE.
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}
