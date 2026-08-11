/**
 * Canonical facts about the company and the site shell.
 *
 * Everything here is verifiable from the live site, the Google Play developer
 * page, or company records. Do not invent values. If a fact is unknown, leave
 * it out rather than guessing.
 */

export const site = {
  name: "FunFuse Games",
  shortName: "FunFuse",
  /**
   * Production origin. Override per environment with NEXT_PUBLIC_SITE_URL so
   * preview deploys emit their own canonical/OG URLs instead of pointing at
   * production.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://funfusegames.com").replace(
    /\/$/,
    "",
  ),
  locale: "en_US",
  lang: "en",
  /** Used as the metadata title template suffix and in JSON-LD. */
  tagline: "Mobile card and board games",
  /** Homepage title and the fallback for any page without its own. */
  defaultTitle: "FunFuse Games - Mobile card and board games",
  description:
    "FunFuse Games is an independent mobile game studio building offline card and board games for players around the world.",
  email: "support@funfusegames.com",
  address: {
    street: "20380 Stevens Creek Boulevard, 310",
    locality: "Cupertino",
    region: "CA",
    postalCode: "95014",
    country: "US",
  },
  /** Dun & Bradstreet number, published on the current site footer. */
  duns: "119350806",
  socials: {
    googlePlay:
      "https://play.google.com/store/apps/dev?id=6374548454355020336",
    facebook: "https://www.facebook.com/funfuse.games",
    linkedin: "https://www.linkedin.com/company/funfuse-games/",
  },
} as const;

/** Every social profile as a flat list — feeds JSON-LD `sameAs`. */
export const socialProfiles = Object.values(site.socials);

export type NavItem = {
  label: string;
  href: string;
  /**
   * Extra path prefixes that should light this item up.
   *
   * Needed because public URLs are inherited from WordPress and do not nest
   * under the nav item they belong to: a game detail page is
   * `/projects/tongit/`, not `/games/tongit/`, but it is still "Games".
   */
  matchPrefixes?: readonly string[];
};

/**
 * Primary navigation. Must fit on one line at >=1024px — if an item is added,
 * something else moves to the footer.
 *
 * Hrefs are the preserved WordPress paths, not tidied equivalents. See
 * src/config/routes.ts.
 */
export const primaryNav: readonly NavItem[] = [
  {
    label: "Games",
    href: "/games",
    matchPrefixes: ["/projects", "/project-genre"],
  },
  { label: "Studio", href: "/our-team", matchPrefixes: ["/services"] },
  { label: "Blog", href: "/blogs" },
  { label: "Careers", href: "/careers" },
] as const;

export const footerNav: readonly { title: string; items: readonly NavItem[] }[] =
  [
    {
      title: "Games",
      items: [
        { label: "All games", href: "/games" },
        // Preserved WordPress genre archives, served as category listings.
        { label: "Card games", href: "/project-genre/card-game" },
        { label: "Board games", href: "/project-genre/board-game" },
      ],
    },
    {
      title: "Studio",
      items: [
        { label: "Our team", href: "/our-team" },
        { label: "What we do", href: "/services" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blogs" },
        { label: "Contact", href: "/contact-us" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "FAQ", href: "/faq" },
        { label: "Terms of Service", href: "/tos" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
  ] as const;
