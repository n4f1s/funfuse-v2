/**
 * FunFuse Studio page content.
 *
 * The Studio page is served at `/studio/` and is the one page that answers who
 * FunFuse is, what it makes and how. It absorbs what the old site split across
 * `/our-team/` and `/services/`; both of those 308 into it.
 *
 * **The factual line.** Every claim in this file is one of:
 *   - counted from `src/content/games` at build time (titles, traditions),
 *   - taken from a catalogue record's own `summary` (how a game is scored),
 *   - taken from `src/content/careers.ts`, which is transcribed from
 *     funfusegames.com/careers/ (the team is remote, the crafts we hire for,
 *     the culture lines), or
 *   - a description of the work that any reader can check against the
 *     nineteen shipped apps.
 *
 * Team size, headcount, founding year, awards, downloads, client counts and
 * office locations are not here because no source we have carries them. The
 * process below is written as an editorial account of how a card game becomes
 * an app, not as a certified internal pipeline, and the copy says so.
 *
 * Section keys are in page order.
 */

export const studioContent = {
  hero: {
    eyebrow: "Studio",
    /** Two lines at every width the headline is set at. Keep it short. */
    title: "It starts on a table",
    /**
     * Not rendered in the hero: the first screen is the headline and the
     * studio, and nothing else. This is the page's description in search
     * results and the sentence the sections under it have to earn.
     */
    lead: "FunFuse builds card and board games people have played for generations. The work starts with a real deck and a real board, and ends as a game that plays the same on a phone, offline.",
    imageAlt:
      "The FunFuse studio: a table covered with playing cards, character sketches and a Ludo board, with three people working around it.",
  },

  premise: {
    title: "We did not invent these games",
    body: [
      "Tongits belongs to the Philippines. Hazari to Bangladesh. Okey to Türkiye, Belote to France, Ludo to India. Every title FunFuse ships is a game that already had players, rules and arguments long before it had an app.",
      "That makes this studio's work translation rather than invention. Keep the game exactly as the table plays it. Rebuild everything around it for a screen the size of a hand.",
    ],
  },

  translation: {
    title: "The same game, on a phone",
    body: "A digital version earns its name by being the game people already argue about. What changes is everything around the rules: a table you can read at arm's length, a hand you can play with one thumb, and three opponents who are always ready.",
    keeps: [
      {
        term: "The rules carry over",
        detail:
          "Bidding, trumps, melds and the awkward edge cases are ported as written, not flattened into one engine wearing a new skin.",
      },
      {
        term: "The arithmetic carries over",
        detail:
          "Hazari counts to a thousand. Tarneeb bids for tricks. Each title keeps the sums its players already do in their heads.",
      },
      {
        term: "The table is rebuilt",
        detail:
          "One thumb, a small screen, and no connection. That is the constraint the whole layout is drawn against.",
      },
    ],
    /** Slugs, in the order the plates are laid out. All three ship real art. */
    plates: [
      { slug: "callbreak-offline", note: "Four players, spades are trumps." },
      { slug: "hazari-grand", note: "Thirteen cards, grouped 3 · 3 · 3 · 4." },
      { slug: "belote-francaise", note: "Partnership play, bid then take." },
    ],
  },

  process: {
    title: "How a game gets made here",
    lead: "Five moves, in the order they usually happen. Games are not a production line, so the middle of this list runs more than once before anything ships.",
    imageAlt:
      "A prototype card game in progress: hand-drawn card faces on paper, a scoring sheet and a pencil on the studio table.",
    steps: [
      {
        title: "Play the real thing",
        body: "Somebody sits down and plays the game the way it is actually played, house rules included, until the arguments make sense.",
      },
      {
        title: "Write the rules down",
        body: "Bidding, trumps, scoring, turn order and the local variants become a specification before a single screen exists.",
      },
      {
        title: "Set the table",
        body: "What a player has to see at a glance, what a thumb can reach, and what still reads on a five inch screen in daylight.",
      },
      {
        title: "Draw the world",
        body: "Characters, tables, cards and icons are drawn per title, so a game looks like the one its players know before they read a word.",
      },
      {
        title: "Ship it, then keep tuning",
        body: "It goes out offline first. Then the slow part: the things that only show up once real hands have played a thousand rounds.",
      },
    ],
  },

  craft: {
    title: "Three things have to be right",
    lead: "The same three crafts sit around every title. A game only ships when none of them is carrying the other two.",
    /**
     * The three disciplines funfusegames.com lists under "Our Expertise".
     * `evidence` is a catalogue slug, so the artwork beside each one is a real
     * shipped title rather than a stock illustration of the idea.
     */
    disciplines: [
      {
        title: "Game development",
        body: "A game that stutters on a mid-range Android is not a game. Every title is built to run offline on the phone most of our players actually own, and that decides the budget for everything else before a line is written.",
        evidence: "callbreak-offline",
        evidenceNote:
          "Four-player trick taking, bid and all, with no connection.",
      },
      {
        title: "Game design",
        body: "The design work is the rulebook, not the theme. Bidding, melds, scoring and the small regional variants are where a card game lives, and where a generic engine with a new skin gets found out on the first hand.",
        evidence: "hazari-grand",
        evidenceNote: "Thirteen cards, four groups, a thousand points to reach.",
      },
      {
        title: "Art direction",
        body: "Characters, tables, cards and store icons are drawn per title. A player should recognise their own game from the listing, before a single word of the description.",
        evidence: "ludo-challenge-offline-play",
        evidenceNote: "A board, four colours, and pieces drawn for this one.",
      },
    ],
  },

  shelf: {
    title: "Nineteen tables, nineteen apps",
    body: "Everything the studio has shipped, at the size it appears on a phone's home screen.",
    cta: { label: "See the full catalogue", href: "/games" },
  },

  culture: {
    title: "The people who play them first",
    body: [
      "FunFuse is an independent studio, and the team is currently fully remote. The people who build a title are the people who had to learn it first, which is why a Tongits build gets argued about by somebody who has lost at Tongits.",
      "Three crafts sit around every game: developers who build it, artists who draw it, and designers who keep the rules honest. What we look for in each of them is written out in full on the careers page rather than paraphrased here.",
    ],
    /**
     * Rendered from `careersContent.benefits.groups`, not retyped. The careers
     * page is the transcription of record, and two copies of a culture claim
     * is how one of them ends up wrong.
     */
    listTitle: "How we work together",
    /**
     * The plate is shot from above and shows hands and objects rather than
     * faces. That is a content decision, not a style one: we do not publish
     * invented employees, and a table tells the truth about this studio in a
     * way a lineup of imaginary people would not.
     */
    imageAlt:
      "The studio table from above: hands dealing a hand of cards, a Ludo board mid-game, pages of sketched card faces, and two phones showing the finished games.",
    cta: { label: "See open roles", href: "/careers" },
  },

  closing: {
    title: "Two ways in",
    routes: [
      {
        title: "Play one you already know",
        body: "Nineteen titles, free on Google Play, every one of them playable with no connection.",
        cta: { label: "See the games", href: "/games" },
      },
      {
        title: "Help make the next one",
        body: "We hire for the three crafts above. The listings say exactly what each one asks for.",
        cta: { label: "See open roles", href: "/careers" },
      },
    ],
  },
} as const;
