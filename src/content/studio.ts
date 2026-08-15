/**
 * FunFuse Studio page content.
 *
 * The Studio page is served at the preserved WordPress path `/our-team/` and is
 * about how the games get made. That makes it the easiest page on the site to
 * decorate with figures nobody can stand behind, so the rule from
 * `src/config/site.ts` applies twice over here: every claim is either
 * verifiable from funfusegames.com and the Google Play developer page, or
 * counted from `src/content/games` at build time. Team size, years, awards and
 * client counts are not in this file because they are not in any source we
 * have.
 *
 * Sections are added under `hero` as they ship. Keeping them here means the
 * page file stays a layout and the copy stays reviewable in one place.
 */

export const studioContent = {
  hero: {
    eyebrow: "Studio",
    /** Two lines at every width the headline is set at. Keep it short. */
    title: "It starts on a table",
    /**
     * Not rendered in the hero: the first screen is the headline and the
     * studio, and nothing else. This is the page's description in search
     * results and the sentence the sections under the hero have to earn.
     */
    lead: "FunFuse builds card and board games people have played for generations. The work starts with a real deck and a real board, and ends as a game that plays the same on a phone, offline.",
    imageAlt:
      "The FunFuse studio: a table covered with playing cards, character sketches and a Ludo board, with three people working around it.",
  },
} as const;
