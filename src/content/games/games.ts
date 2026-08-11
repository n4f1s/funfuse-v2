import type { Game } from "./types";

/**
 * The FunFuse catalogue — 19 shipped titles.
 *
 * Sourced from the Google Play developer listing and the current
 * funfusegames.com project pages. Facts only:
 *   - `title` / `androidPackageId` come from the store listing.
 *   - `summary` describes the traditional game, which is public knowledge.
 *   - `description` stays `null` until the real store copy is imported. Do not
 *     write marketing copy here from imagination.
 *
 * Slugs are the public URL. Eight of these titles already have an indexed page
 * at `/projects/<slug>/` on the WordPress site, and the new site serves the
 * same path, so their slugs are fixed and must not be edited:
 *
 *   tongit · hazari-grand · callbreak-offline · 3-2-5-offline-fun-card-game
 *   gin-rummy-master-offline · tarneeb · ludo-challenge-offline-play
 *   puzzle-twist-game
 *
 * The other eleven have never had a public page, so their slugs were free to
 * choose. If any slug ever has to change, put the old path in `legacyPaths`
 * and the redirect wires itself.
 */
export const games: readonly Game[] = [
  {
    slug: "tongit",
    title: "Tongits Club Offline",
    summary:
      "Tongits is a three-player Filipino rummy variant played with a standard 52-card deck, where players race to meld their hand or hold the lowest total.",
    description: null,
    category: "card",
    region: "philippines",
    status: "live",
    androidPackageId: "com.funfuse.tongits",
    releasedAt: "2022-06-28",
  },
  {
    slug: "hazari-grand",
    title: "Hazari Grand - 1000 Points Game",
    summary:
      "Hazari is a Bangladeshi and Indian card game in which thirteen cards are split into five hands and scored toward a target of 1000 points.",
    description: null,
    category: "card",
    region: "bangladesh",
    status: "live",
    androidPackageId: "com.funfuse.hazari",
  },
  {
    slug: "callbreak-offline",
    title: "CallBreak Club",
    summary:
      "Call Break is a South Asian trick-taking game for four players where each player bids the number of tricks they expect to win with spades as permanent trumps.",
    description: null,
    category: "card",
    region: "india",
    status: "live",
    androidPackageId: "com.funfuse.callbreakpro",
  },
  {
    slug: "3-2-5-offline-fun-card-game",
    title: "3 2 5 Offline Fun Card Game",
    summary:
      "Also known as Do Teen Panch, this three-player Indian trick-taking game deals uneven hands with targets of three, two and five tricks.",
    description: null,
    category: "card",
    region: "india",
    status: "live",
    androidPackageId: "com.funfuse.doteenpanch",
  },
  {
    slug: "gin-rummy-master-offline",
    title: "Gin Rummy Master Offline",
    summary:
      "Gin Rummy is a two-player draw-and-discard game where players form sets and runs, then knock or go gin to end the hand.",
    description: null,
    category: "card",
    region: "international",
    status: "live",
    androidPackageId: "com.funfuse.ginrummy",
  },
  {
    slug: "tarneeb",
    title: "Tarneeb",
    nativeTitle: "لعبة طرنيب",
    summary:
      "Tarneeb is a four-player partnership trick-taking game popular across the Levant and the Gulf, played with bidding and a named trump suit.",
    description: null,
    category: "card",
    region: "middle-east",
    status: "live",
    androidPackageId: "com.funfuse.tarneeb",
  },
  {
    slug: "ludo-challenge-offline-play",
    title: "Ludo Challenge Offline Play",
    summary:
      "Ludo is a cross-and-circle race game for two to four players, where dice rolls move four tokens from the yard to the home column.",
    description: null,
    category: "board",
    region: "india",
    status: "live",
    androidPackageId: "com.funfuse.ludo.challenge",
  },
  {
    slug: "puzzle-twist-game",
    title: "Puzzle Club Offline",
    summary:
      "A block-and-tile puzzle collection played against the clock, with progressively tighter boards as levels advance.",
    description: null,
    category: "puzzle",
    region: "international",
    status: "live",
    androidPackageId: "games.funfuse.puzzletwist",
  },
  {
    slug: "lucky-9-offline",
    title: "Lucky 9 Offline Game",
    summary:
      "Lucky 9 is a Filipino banking card game in which players draw toward a hand total whose last digit is closest to nine.",
    description: null,
    category: "card",
    region: "philippines",
    status: "live",
    androidPackageId: "com.funfuse.luckynineclub",
  },
  {
    slug: "pusoy-offline",
    title: "Pusoy Offline",
    summary:
      "Pusoy, the Filipino form of Chinese Poker, asks each player to arrange thirteen cards into three poker hands that must rank in descending order.",
    description: null,
    category: "card",
    region: "philippines",
    status: "live",
    androidPackageId: "com.funfuse.pusoy",
  },
  {
    slug: "pusoy-dos-offline",
    title: "Pusoy Dos Offline",
    summary:
      "Pusoy Dos is a Filipino shedding game where the two is the highest card and players race to empty their hand by beating the previous combination.",
    description: null,
    category: "card",
    region: "philippines",
    status: "live",
    androidPackageId: "com.funfuse.pusoydos",
  },
  {
    slug: "capsa-susun-offline",
    title: "Capsa Susun Offline",
    summary:
      "Capsa Susun is the Indonesian version of Chinese Poker, scored by comparing three stacked poker hands against every other player at the table.",
    description: null,
    category: "card",
    region: "indonesia",
    status: "live",
    androidPackageId: "com.funfuse.capsasusunclub",
  },
  {
    slug: "tien-len-club",
    title: "Tiến Lên Club Offline",
    summary:
      "Tiến Lên is the Vietnamese national shedding game, where four players discard ascending combinations until one hand is empty.",
    description: null,
    category: "card",
    region: "vietnam",
    status: "live",
    androidPackageId: "com.funfuse.tienlen",
  },
  {
    slug: "okey-club",
    title: "Okey Club",
    summary:
      "Okey is a Turkish tile game for four players, similar to rummy, played with 106 numbered tiles and a joker chosen at the start of each hand.",
    description: null,
    category: "board",
    region: "turkey",
    status: "live",
    androidPackageId: "com.funfuse.okey",
  },
  {
    slug: "belote-francaise",
    title: "Belote Française",
    summary:
      "Belote is the French partnership trick-taking game played with a 32-card deck, where declarations and the belote-rebelote pair add to the score.",
    description: null,
    category: "card",
    region: "france",
    status: "live",
    androidPackageId: "com.funfusegames.belote",
  },
  {
    slug: "mau-mau-offline",
    title: "Mau Mau Offline",
    summary:
      "Mau-Mau is a German shedding game in which players match the rank or suit of the discard pile and special cards force draws, skips and suit changes.",
    description: null,
    category: "card",
    region: "germany",
    status: "live",
    androidPackageId: "com.funfuse.maumauoffline",
  },
  {
    slug: "thousand-offline",
    title: "Thousand Offline",
    nativeTitle: "Тысяча-1000",
    summary:
      "Thousand is a Russian and Eastern European point-trick game where marriages of king and queen in a suit count toward a target of 1000 points.",
    description: null,
    category: "card",
    region: "russia",
    status: "live",
    androidPackageId: "com.funfusegames.thousand",
  },
  {
    slug: "omi-club",
    title: "Omi Club Card Game Offline",
    summary:
      "Omi is the Sri Lankan national card game, a four-player partnership trick-taking game played with the 32 highest cards of the deck.",
    description: null,
    category: "card",
    region: "sri-lanka",
    status: "live",
    androidPackageId: "com.funfuse.omiclub",
  },
  {
    slug: "bhabhi-thulla-card-game",
    title: "Bhabhi Thulla Card Game",
    summary:
      "Bhabhi, also called Thulla, is an Indian shedding game where failing to follow suit forces a player to pick up the whole pile.",
    description: null,
    category: "card",
    region: "india",
    status: "live",
    androidPackageId: "com.funfuse.bhabhicardgame",
  },
] as const;
