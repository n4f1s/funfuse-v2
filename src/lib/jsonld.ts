import { site, socialProfiles } from "@/config/site";
import {
  categoryLabels,
  gameHref,
  playStoreUrl,
  type Game,
} from "@/content/games";
import type { BlogPost } from "@/content/blog";
import type { GameArtwork } from "@/content/games";

import { absoluteUrl } from "./seo";

/**
 * Structured data builders.
 *
 * Rendered with `<JsonLd />` (src/components/seo/json-ld.tsx). Keep the graph
 * small and truthful — only mark up facts that are visible on the page.
 * Never emit aggregateRating or review data we cannot verify.
 */

type Thing = Record<string, unknown>;

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema(): Thing {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    email: site.email,
    sameAs: socialProfiles,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "DUNS",
      value: site.duns,
    },
  };
}

export function websiteSchema(): Thing {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    inLanguage: site.lang,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * A single game. `SoftwareApplication` with the Game category is what Google
 * documents for mobile titles; `VideoGame` alone loses the app fields.
 *
 * `description` defaults to the catalogue's own fallback chain, but a caller
 * with richer content — `details.seoDescription` from
 * `src/content/games/details.ts` — can pass it in so the graph and the page
 * metadata never disagree about which sentence describes the game.
 */
export function gameSchema(game: Game, description?: string): Thing {
  const playUrl = playStoreUrl(game);

  return {
    "@type": ["SoftwareApplication", "VideoGame"],
    "@id": `${absoluteUrl(gameHref(game))}#game`,
    name: game.title,
    alternateName: game.nativeTitle,
    url: absoluteUrl(gameHref(game)),
    description: description ?? game.description ?? game.summary,
    applicationCategory: "GameApplication",
    applicationSubCategory: categoryLabels[game.category],
    operatingSystem: game.androidPackageId ? "Android" : undefined,
    datePublished: game.releasedAt,
    publisher: { "@id": ORGANIZATION_ID },
    author: { "@id": ORGANIZATION_ID },
    ...(playUrl ? { installUrl: playUrl, downloadUrl: playUrl } : {}),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbSchema(
  trail: readonly { name: string; path: string }[],
): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqSchema(
  entries: readonly { question: string; answer: string }[],
): Thing {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/** Source-controlled editorial content. Dates are omitted until they are real. */
export function articleSchema(post: BlogPost, artwork: GameArtwork | null): Thing {
  const image = artwork
    ? {
        "@type": "ImageObject",
        url: absoluteUrl(artwork.src.src),
        width: artwork.src.width,
        height: artwork.src.height,
      }
    : undefined;

  return {
    "@type": "Article",
    "@id": `${absoluteUrl(post.canonicalPath)}#article`,
    mainEntityOfPage: absoluteUrl(post.canonicalPath),
    url: absoluteUrl(post.canonicalPath),
    headline: post.title,
    description: post.seo.description,
    articleSection: post.categories,
    keywords: [post.seo.primaryKeyword, ...post.seo.secondaryKeywords].join(", "),
    inLanguage: site.lang,
    publisher: { "@id": ORGANIZATION_ID },
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.modifiedAt ? { dateModified: post.modifiedAt } : {}),
    ...(image ? { image } : {}),
  };
}

export function blogIndexSchema(posts: readonly BlogPost[]): Thing {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/blogs/")}#collection`,
    url: absoluteUrl("/blogs/"),
    name: "FunFuse Games Blog",
    description: "Rules, strategy and game guides from FunFuse Games.",
    inLanguage: site.lang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(post.canonicalPath),
        name: post.title,
      })),
    },
  };
}

/** Wraps one or more schema objects into a single @graph document. */
export function jsonLdGraph(...nodes: Thing[]): string {
  return JSON.stringify(
    { "@context": "https://schema.org", "@graph": nodes },
    // Drop undefined keys rather than shipping `"key": null`.
    (_key, value) => (value === undefined ? undefined : value),
  );
}
