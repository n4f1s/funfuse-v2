import type { GameDetailsSlug } from "./games/details";

/**
 * FunFuse long-form blog content.
 *
 * CONTENT MODEL
 * - 20 complete, SEO-focused articles.
 * - 19 articles map one-to-one to the current FunFuse game catalogue.
 * - 1 preserved legacy Poker article remains for SEO continuity even though
 *   that title is not in the current 19-game catalogue.
 * - The three inherited WordPress article URLs stay at the site root.
 * - Seventeen new informational guides use `/blogs/<slug>/`.
 *
 * BODY HTML
 * `bodyHtml` is intentionally trusted, source-controlled HTML so different
 * articles can have genuinely different editorial compositions.
 *
 * The article renderer may use:
 *
 *   dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
 *
 * SECURITY REQUIREMENT
 * NEVER put user-submitted, CMS-authored, API-provided, query-string, or other
 * untrusted HTML through this rendering path without sanitizing it first.
 *
 * Article HTML deliberately contains semantic/layout hooks such as:
 * - data-article-layout
 * - data-ui
 * - article-* class names
 *
 * Codex/Claude can build shared typography primitives while styling individual
 * article layouts differently: ranking ladders, scoreboards, mode atlases,
 * partnership tables, timelines, decision panels, rule matrices, and more.
 *
 * RESEARCH
 * Verified/researched: 2026-08-14.
 * `researchSources` are editorial provenance and normally should NOT be shown
 * in the public article UI.
 *
 * SEO INTENT SPLIT
 * - These blog guides target informational queries: rules, how-to, scoring,
 *   strategy, terminology, and cultural game context.
 * - `/projects/<slug>/` remains the app/product-intent destination.
 *
 * This separation helps avoid keyword cannibalization between editorial guides
 * and current FunFuse product pages.
 */

export const BLOG_CONTENT_VERIFIED_ON = "2026-08-14" as const;
export const BLOG_INDEX_PATH = "/blogs/" as const;

export const BLOG_LEGACY_ROOT_SLUGS = [
  "poker-full-house-offline",
  "tongits-star-offline-2",
  "hazari-grand-1000-points-game",
] as const;

export type BlogCategory =
  | "Rules & Guides"
  | "Card Games"
  | "Board Games"
  | "Puzzle Games"
  | "Strategy";

export type BlogRouteKind = "legacy-root" | "blog";
export type BlogStatus = "legacy-live" | "ready-to-publish";
export type BlogSearchIntent = "informational" | "informational-commercial";

export type BlogSeo = {
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  searchIntent: BlogSearchIntent;
};

export type BlogHero = {
  kind: "game-art";
  gameSlug: GameDetailsSlug;
  preferredSlot: "cover" | "icon";
  alt: string;
};

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogResearchSource = {
  label: string;
  url: string;
  kind: "official-product" | "rules-reference" | "legacy";
};

export type BlogPost = {
  slug: string;

  /**
   * Canonical public path including trailing slash.
   *
   * Do not derive this by assuming every article lives under `/blogs/`.
   * Three inherited indexed WordPress posts intentionally remain root-level.
   */
  canonicalPath: string;

  routeKind: BlogRouteKind;
  status: BlogStatus;
  title: string;
  eyebrow: string;
  excerpt: string;
  seo: BlogSeo;

  /** Real historic dates where known. Null = set on actual publication. */
  publishedAt: string | null;
  modifiedAt: string | null;

  categories: readonly BlogCategory[];

  /**
   * Current FunFuse game related to this guide.
   * Null only for the legacy Poker article.
   */
  relatedGameSlug: GameDetailsSlug | null;

  hero: BlogHero | null;

  /**
   * Trusted static HTML only.
   * Do not add scripts, styles, inline event handlers, iframes, or arbitrary
   * third-party embed HTML here.
   */
  bodyHtml: string;

  /**
   * The same reader-facing FAQ is retained as typed data so the page can build
   * truthful FAQ structured data without scraping the HTML body.
   */
  faq: readonly BlogFaqItem[];

  /** Editorial provenance; normally hidden from visitors. */
  researchSources: readonly BlogResearchSource[];

  /** Internal implementation/migration accuracy note. */
  editorialNote: string;
};

export const blogIndexContent = {
  eyebrow: "From the table",
  title: "Rules, strategy, and the games behind FunFuse.",
  description:
    "Practical guides to classic card, board and puzzle games, explained with the rules, scoring systems and decisions that make each one worth learning.",
  seoTitle: "FunFuse Games Blog | Rules, Strategy & Game Guides",
  seoDescription:
    "Learn classic card, board and puzzle games with FunFuse guides covering rules, scoring, strategy and regional game traditions.",
  featuredPostSlug: "tongits-star-offline-2",
} as const;

function definePost(post: BlogPost): BlogPost {
  return {
    ...post,
    bodyHtml: `${post.bodyHtml.trim()}\n${renderFaqHtml(post.faq)}`,
  };
}

/**
 * The FAQ text is controlled source data, but it is still escaped here because
 * it is interpolated into HTML.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderFaqHtml(faq: readonly BlogFaqItem[]): string {
  if (faq.length === 0) return "";

  const items = faq
    .map(
      (item, index) => `
        <details class="article-faq-item"${index === 0 ? " open" : ""}>
          <summary>${escapeHtml(item.question)}</summary>
          <div class="article-faq-answer"><p>${escapeHtml(item.answer)}</p></div>
        </details>`,
    )
    .join("");

  return `
<section class="article-faq" data-ui="faq" aria-labelledby="article-faq-heading">
  <div class="article-faq-heading">
    <span class="article-label">Quick answers</span>
    <h2 id="article-faq-heading">Frequently asked questions</h2>
  </div>
  <div class="article-faq-list">${items}
  </div>
</section>`.trim();
}

export const blogPosts: readonly BlogPost[] = [
  definePost({
    "slug": "poker-full-house-offline",
    "canonicalPath": "/poker-full-house-offline/",
    "routeKind": "legacy-root",
    "status": "legacy-live",
    "title": "Poker Full House Offline",
    "eyebrow": "Poker Guide",
    "excerpt": "Learn the structure of poker, the actions that shape a betting round, and the hand rankings that decide a showdown — with a closer look at the full house.",
    "seo": {
      "title": "Poker Full House Offline | Poker Rules & Hand Rankings",
      "description": "Learn poker basics, betting actions, standard hand rankings and how a full house compares with straights, flushes and other five-card poker hands.",
      "primaryKeyword": "poker full house",
      "secondaryKeywords": [
        "poker hand rankings",
        "how to play poker",
        "full house poker rules",
        "poker hands in order"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": "2024-07-15",
    "modifiedAt": "2024-07-16",
    "categories": [
      "Rules & Guides",
      "Card Games"
    ],
    "relatedGameSlug": null,
    "hero": null,
    "bodyHtml": String.raw`<div class="blog-body blog-body--poker" data-article-layout="poker-handbook">
  <section class="article-lead" data-ui="lead">
    <p class="article-kicker">A five-card hand can change in one card.</p>
    <p>Poker is a family of card games rather than one single ruleset. Texas Hold'em, Five-Card Draw and other variants deal cards differently, but they share a vocabulary that makes the game recognizable: a deck, a pot, betting decisions, a showdown and a hierarchy of hands.</p>
    <p>This guide focuses on that shared foundation. If you are new to poker, start with the actions and hand rankings below. If you already know the basics, the full-house section explains why this hand is so strong and how ties are resolved.</p>
  </section>

  <aside class="article-fact-ribbon" data-ui="fact-ribbon" aria-label="Poker at a glance">
    <div><strong>Deck</strong><span>Usually 52 cards</span></div>
    <div><strong>Core decisions</strong><span>Check, bet, call, raise, fold</span></div>
    <div><strong>Showdown</strong><span>Best legal hand wins</span></div>
    <div><strong>Full house</strong><span>Three of a kind + a pair</span></div>
  </aside>

  <section>
    <h2 id="how-a-poker-hand-works">How a poker hand works</h2>
    <p>The exact sequence depends on the variant. In a community-card game, players combine private cards with cards shared on the table. In draw poker, players normally begin with a private hand and may exchange selected cards. In either case, betting rounds create the strategic layer around the cards.</p>
    <p>A hand can end before showdown when every player except one folds. If two or more players remain after the final betting round, their legal hands are compared according to the ranking system used by that variant.</p>
  </section>

  <section class="article-action-grid" data-ui="action-grid">
    <h2 id="common-poker-actions">The six actions worth knowing first</h2>
    <div class="article-grid">
      <article><h3>Check</h3><p>Stay in the hand without adding a bet when no bet is currently outstanding.</p></article>
      <article><h3>Bet</h3><p>Put chips into the pot and establish an amount the other active players must answer.</p></article>
      <article><h3>Call</h3><p>Match the current bet so you can continue in the hand.</p></article>
      <article><h3>Raise</h3><p>Increase the current bet. A raise changes the price of continuing for everyone still active.</p></article>
      <article><h3>Fold</h3><p>Give up your claim to the current pot. Folding is often the correct choice with a weak position.</p></article>
      <article><h3>All-in</h3><p>Commit all chips available to you. Side-pot rules may apply when players have different stack sizes.</p></article>
    </div>
  </section>

  <section>
    <h2 id="poker-hand-rankings">Poker hand rankings from strongest to weakest</h2>
    <p>Most familiar five-card poker variants use the hierarchy below. Learn the order before worrying about advanced strategy; being able to identify the winning category quickly removes a lot of confusion from the table.</p>
    <div class="article-table-wrap" data-ui="ranking-table">
      <table>
        <caption>Standard five-card poker hand ranking</caption>
        <thead><tr><th>Rank</th><th>Hand</th><th>Definition</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Royal Flush</td><td>Ace, King, Queen, Jack and 10 of one suit.</td></tr>
          <tr><td>2</td><td>Straight Flush</td><td>Five consecutive cards of one suit.</td></tr>
          <tr><td>3</td><td>Four of a Kind</td><td>Four cards sharing one rank.</td></tr>
          <tr><td>4</td><td>Full House</td><td>Three cards of one rank plus two cards of another rank.</td></tr>
          <tr><td>5</td><td>Flush</td><td>Five cards of one suit that do not form a straight flush.</td></tr>
          <tr><td>6</td><td>Straight</td><td>Five consecutive ranks, not all in one suit.</td></tr>
          <tr><td>7</td><td>Three of a Kind</td><td>Three cards sharing one rank.</td></tr>
          <tr><td>8</td><td>Two Pair</td><td>Two different pairs plus one other card.</td></tr>
          <tr><td>9</td><td>Pair</td><td>Two cards sharing one rank.</td></tr>
          <tr><td>10</td><td>High Card</td><td>No made combination above; compare the highest relevant cards.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="article-feature-callout" data-ui="feature-callout">
    <div>
      <span class="article-label">Featured hand</span>
      <h2 id="what-is-a-full-house">What exactly is a full house?</h2>
    </div>
    <p>A full house contains a three-of-a-kind and a separate pair. For example, three Queens with two Fives is “Queens full of Fives.” It beats a flush and a straight, but loses to four of a kind, a straight flush and a royal flush.</p>
    <p>When two full houses are compared, the rank of the three-of-a-kind decides first. A hand with three Kings and two Twos therefore beats three Queens and two Aces. Only if the three-of-a-kind rank is equal does the pair matter — and in a standard single-deck five-card comparison, two players normally cannot hold different full houses with the same trip rank from completely separate cards.</p>
  </section>

  <section>
    <h2 id="community-card-rounds">Pre-flop, flop, turn and river</h2>
    <p>Those names belong to community-card poker, especially Texas Hold'em. They describe the stages at which cards become available, not hand rankings.</p>
    <ol class="article-timeline" data-ui="timeline">
      <li><strong>Pre-flop:</strong> players receive their private cards and make the first decisions.</li>
      <li><strong>Flop:</strong> the first three shared community cards are revealed.</li>
      <li><strong>Turn:</strong> a fourth shared card is added.</li>
      <li><strong>River:</strong> the fifth and final shared card is revealed before the last betting round.</li>
    </ol>
  </section>

  <section class="article-decision-panel" data-ui="decision-panel">
    <h2 id="beginner-decision-framework">A beginner decision framework</h2>
    <p>You do not need to calculate every possible outcome at the table. Start by asking four practical questions:</p>
    <ul>
      <li><strong>What do I currently have?</strong> Identify the made hand and realistic draws that can improve it.</li>
      <li><strong>What does the board allow?</strong> Shared cards can make strong hands possible for opponents too.</li>
      <li><strong>What has the betting told me?</strong> A large raise carries information even when you cannot see the cards behind it.</li>
      <li><strong>What is the cost of continuing?</strong> A hand that is worth checking may not be worth calling a large bet.</li>
    </ul>
  </section>

  <section>
    <h2 id="common-poker-mistakes">Common mistakes when learning poker</h2>
    <div class="article-split-list" data-ui="split-list">
      <div><h3>Playing every hand</h3><p>Folding is part of poker, not a failure to participate. Weak starting positions become expensive when you keep paying to continue.</p></div>
      <div><h3>Ignoring position</h3><p>Acting later gives you more information about what other players chose to do.</p></div>
      <div><h3>Confusing a straight and a flush</h3><p>A straight is about consecutive ranks. A flush is about one suit. A straight flush satisfies both.</p></div>
      <div><h3>Overvaluing one pair</h3><p>A pair may be good early, but the board can create many stronger possibilities by the river.</p></div>
    </div>
  </section>

  <aside class="article-note" data-ui="editorial-note">
    <strong>About this legacy article</strong>
    <p>Poker Full House Offline is preserved because the original FunFuse article URL is part of the site's history. The title is not in the current 19-game catalogue, so this guide should not display a current download claim unless an active store listing is verified again.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "Does a full house beat a flush?",
        "answer": "Yes. In standard poker hand rankings, a full house ranks above a flush and below four of a kind."
      },
      {
        "question": "What makes a full house?",
        "answer": "A full house is a five-card hand containing three cards of one rank and two cards of another rank."
      },
      {
        "question": "Which full house wins if two players have one?",
        "answer": "Compare the three-of-a-kind portion first. The higher trip rank wins; the pair is considered only if the trip rank is tied."
      },
      {
        "question": "Is a royal flush different from a straight flush?",
        "answer": "A royal flush is the highest possible straight flush: 10, Jack, Queen, King and Ace, all in the same suit."
      }
    ],
    "researchSources": [
      {
        "label": "Legacy FunFuse article",
        "url": "https://funfusegames.com/poker-full-house-offline/",
        "kind": "legacy"
      }
    ],
    "editorialNote": "Keep the legacy root URL. Do not invent a current Play Store CTA for this discontinued/non-catalogue title."
  }),
  definePost({
    "slug": "tongits-star-offline-2",
    "canonicalPath": "/tongits-star-offline-2/",
    "routeKind": "legacy-root",
    "status": "legacy-live",
    "title": "Tongits Club Offline",
    "eyebrow": "Filipino Card Game Guide",
    "excerpt": "A complete beginner-friendly guide to Tongits: the 13/12/12 deal, melds, discards, hand value, round endings and practical strategy.",
    "seo": {
      "title": "How to Play Tongits | Rules, Melds & Strategy Guide",
      "description": "Learn how to play Tongits: three-player setup, 13/12/12 deal, sets and runs, hand values, draw challenges and practical Filipino card-game strategy.",
      "primaryKeyword": "how to play Tongits",
      "secondaryKeywords": [
        "Tongits rules",
        "Tongits card game",
        "Tongits strategy",
        "Tongits melds",
        "Tongits offline"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": "2024-07-14",
    "modifiedAt": "2025-03-04",
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "tongit",
    "hero": {
      "kind": "game-art",
      "gameSlug": "tongit",
      "preferredSlot": "cover",
      "alt": "Tongits Club Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--tongits" data-article-layout="tongits-field-guide">
  <section class="article-lead article-lead--wide">
    <p>Tongits rewards two skills at the same time: organizing your own cards and reading what the other two players reveal. A good draw can complete a meld; a careless discard can complete someone else's. That tension is why a three-player game with a familiar 52-card deck can feel different every round.</p>
    <p>If you are learning, do not start by memorizing edge cases. Learn the rhythm first: <strong>draw, improve, discard, observe</strong>. Once that loop feels natural, hand value and challenge timing make much more sense.</p>
  </section>

  <div class="article-scoreboard" data-ui="scoreboard">
    <div><span>Players</span><strong>3</strong></div>
    <div><span>Deck</span><strong>52 cards</strong></div>
    <div><span>Dealer</span><strong>13 cards</strong></div>
    <div><span>Others</span><strong>12 each</strong></div>
  </div>

  <section>
    <h2 id="tongits-objective">The objective in one sentence</h2>
    <blockquote class="article-pullquote">Finish the round with no cards when the rules allow it, or be in the strongest position when unmatched hand values are compared.</blockquote>
    <p>Tongits belongs to the rummy family. That means cards become safer when they are organized into valid melds, while unmatched cards — often called deadwood in English-language explanations — remain exposed to scoring pressure if the round ends before you can use them.</p>
  </section>

  <section class="article-round-map" data-ui="round-map">
    <h2 id="tongits-round-flow">The map of a Tongits round</h2>
    <ol>
      <li><span>01</span><div><h3>Deal</h3><p>The dealer begins with 13 cards. The other two players receive 12. The remaining deck becomes the stock.</p></div></li>
      <li><span>02</span><div><h3>Open the table</h3><p>The dealer begins by releasing a card, establishing the first discard opportunity.</p></div></li>
      <li><span>03</span><div><h3>Draw</h3><p>On your turn, take the available draw according to the current table state and rules.</p></div></li>
      <li><span>04</span><div><h3>Meld or extend</h3><p>Build legal groups or add cards to valid exposed groups when permitted.</p></div></li>
      <li><span>05</span><div><h3>Discard</h3><p>Finish the turn by releasing one card. This is both hand management and information management.</p></div></li>
    </ol>
  </section>

  <section>
    <h2 id="tongits-melds">Melds: the structures you are trying to build</h2>
    <div class="article-card-pairs" data-ui="meld-cards">
      <article>
        <span class="article-label">Set</span>
        <h3>Same rank</h3>
        <p>Three or four cards sharing a rank form a set. Three Sevens in different suits are a basic example.</p>
      </article>
      <article>
        <span class="article-label">Run</span>
        <h3>Same suit, consecutive ranks</h3>
        <p>Three or more consecutive cards in one suit form a run. A connected middle card is valuable because it can often grow in either direction.</p>
      </article>
    </div>
    <p>Do not evaluate cards only by their printed value. A Nine that completes a same-suit run may be more useful than a low card that is isolated from everything else in your hand.</p>
  </section>

  <section>
    <h2 id="tongits-card-values">What unmatched cards cost</h2>
    <p>When a round reaches a hand comparison, unmatched card value matters. The common scale is straightforward:</p>
    <div class="article-table-wrap">
      <table>
        <thead><tr><th>Card</th><th>Value</th><th>Practical meaning</th></tr></thead>
        <tbody>
          <tr><td>King, Queen, Jack, 10</td><td>10 each</td><td>Expensive to carry if they do not join a meld.</td></tr>
          <tr><td>9 through 2</td><td>Face value</td><td>Lower ranks gradually reduce your exposed total.</td></tr>
          <tr><td>Ace</td><td>1</td><td>Cheap unmatched card, though its meld potential still matters.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="article-endings" data-ui="endings">
    <h2 id="how-tongits-ends">Three ideas that explain how a round ends</h2>
    <article>
      <h3>Tongits</h3>
      <p>A player successfully disposes of the entire hand under the active rules. There is nothing left to count.</p>
    </article>
    <article>
      <h3>The stock runs out</h3>
      <p>If nobody finishes before the stock is exhausted, eligible hands are compared. Lower unmatched value becomes the advantage.</p>
    </article>
    <article>
      <h3>A draw challenge</h3>
      <p>A player who believes their hand is low enough may challenge when the rules permit. This is not simply “I have a small number”; eligibility and exposed meld history also matter in traditional play.</p>
    </article>
  </section>

  <section>
    <h2 id="tongits-strategy">Tongits strategy: think in three questions</h2>
    <div class="article-question-stack" data-ui="question-stack">
      <div><span>1</span><h3>What improves me?</h3><p>Know which ranks and suits create immediate melds, flexible near-melds and dead ends.</p></div>
      <div><span>2</span><h3>What helps them?</h3><p>A discard is public information. If an opponent has repeatedly shown interest in a suit or rank pattern, your “useless” card may be useful to them.</p></div>
      <div><span>3</span><h3>What happens if the round ends now?</h3><p>High unmatched cards are a liability. As the stock shrinks, hand-value risk becomes more important than speculative combinations.</p></div>
    </div>
  </section>

  <section>
    <h2 id="tongits-beginner-mistakes">Five beginner mistakes that cost rounds</h2>
    <ul class="article-checklist article-checklist--negative">
      <li>Holding multiple high cards for too long because they “might” connect later.</li>
      <li>Discarding into an obvious sequence an opponent has been building.</li>
      <li>Breaking a flexible near-run to protect a single low-value card.</li>
      <li>Ignoring how many cards remain in the stock.</li>
      <li>Calling a draw based only on your own hand without considering whether you are eligible and what opponents have exposed.</li>
    </ul>
  </section>

  <aside class="article-callout article-callout--accent">
    <span class="article-label">Table habit</span>
    <p>Track discards by pattern, not by memory alone. Ask “which Hearts are gone?” or “how many Sevens have appeared?” That turns a long discard history into useful categories.</p>
  </aside>

  <section>
    <h2 id="tongits-offline-practice">Why offline practice is useful</h2>
    <p>Tongits Club Offline is designed around the same repeated decisions: organize, draw, discard and reassess. Playing against AI is useful when you want to learn the flow without waiting for a live table. The product page can handle download-focused information; this guide should remain focused on rules and decision-making so the two pages serve different search intent.</p>
  </section>
</div>`,
    "faq": [
      {
        "question": "How many players are needed for Tongits?",
        "answer": "Tongits is traditionally a three-player game using one standard 52-card deck without jokers."
      },
      {
        "question": "How many cards does each player get in Tongits?",
        "answer": "The dealer starts with 13 cards, while the other two players start with 12 cards each."
      },
      {
        "question": "What is a meld in Tongits?",
        "answer": "A meld is a valid group of cards, usually a set of equal ranks or a run of consecutive cards in the same suit."
      },
      {
        "question": "What cards are worth 10 points in Tongits?",
        "answer": "Kings, Queens, Jacks and Tens normally count 10 points each when unmatched hand values are compared."
      },
      {
        "question": "Is Tongits the same as rummy?",
        "answer": "Tongits is a distinct Filipino game in the wider rummy family. It uses familiar draw, discard, set and run concepts but has its own three-player flow and round-ending rules."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.tongits",
        "kind": "official-product"
      },
      {
        "label": "Pagat Tong-Its rules",
        "url": "https://www.pagat.com/rummy/tong-its.html",
        "kind": "rules-reference"
      },
      {
        "label": "Legacy FunFuse article",
        "url": "https://funfusegames.com/tongits-star-offline-2/",
        "kind": "legacy"
      }
    ],
    "editorialNote": "Preserve the root URL and legacy dates. This article targets informational Tongits queries; the /projects/tongit/ page remains the product-intent page."
  }),
  definePost({
    "slug": "hazari-grand-1000-points-game",
    "canonicalPath": "/hazari-grand-1000-points-game/",
    "routeKind": "legacy-root",
    "status": "legacy-live",
    "title": "Hazari Grand- 1000 Points Game",
    "eyebrow": "Bangladeshi Card Game Guide",
    "excerpt": "Learn Hazari from the deal to the 1000-point finish: arrange thirteen cards into 3+3+3+4 groups, compare combinations and collect card points.",
    "seo": {
      "title": "Hazari Card Game Rules | 1000 Points Guide",
      "description": "Learn Hazari rules: four players, 13 cards each, the 3+3+3+4 arrangement, Troy and Colour Run rankings, card values and the race to 1000 points.",
      "primaryKeyword": "Hazari card game rules",
      "secondaryKeywords": [
        "how to play Hazari",
        "Hazari 1000 points",
        "Hazari card ranking",
        "Hazari Grand"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": "2024-07-14",
    "modifiedAt": "2024-07-26",
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "hazari-grand",
    "hero": {
      "kind": "game-art",
      "gameSlug": "hazari-grand",
      "preferredSlot": "cover",
      "alt": "Hazari Grand key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--hazari" data-article-layout="hazari-scoreboard">
  <section class="article-lead">
    <p>Hazari begins with a puzzle before it becomes a contest. You receive 13 cards, but instead of playing them one by one, you first divide the whole hand into four groups: <strong>3 + 3 + 3 + 4</strong>. The strength and order of those groups decide what you can win when the comparisons begin.</p>
    <p>The name points to the destination: Hazari means a thousand, and the match continues across deals until a player reaches 1000 points or more.</p>
  </section>

  <div class="article-number-lockup" data-ui="number-lockup">
    <span>13 cards</span>
    <strong>3</strong><i>+</i><strong>3</strong><i>+</i><strong>3</strong><i>+</i><strong>4</strong>
    <span>4 comparison groups</span>
  </div>

  <section>
    <h2 id="hazari-setup">Hazari setup</h2>
    <dl class="article-definition-grid" data-ui="definition-grid">
      <div><dt>Players</dt><dd>4, playing individually</dd></div>
      <div><dt>Deck</dt><dd>Standard 52-card pack</dd></div>
      <div><dt>Cards each</dt><dd>13</dd></div>
      <div><dt>Target</dt><dd>1000 cumulative points</dd></div>
      <div><dt>Card order</dt><dd>A, K, Q, J, 10 down to 2</dd></div>
      <div><dt>Core skill</dt><dd>Partitioning one hand into four ordered groups</dd></div>
    </dl>
  </section>

  <section>
    <h2 id="hazari-combinations">The six Hazari combinations</h2>
    <p>Most comparisons are built around three-card combinations. Learn the category order first; only then do you need tie-breaking detail inside the same category.</p>
    <ol class="article-ranking-stack" data-ui="ranking-stack">
      <li><span>1</span><div><h3>Troy</h3><p>Three cards of the same rank. Three Aces is the top Troy.</p></div></li>
      <li><span>2</span><div><h3>Colour Run</h3><p>Three consecutive cards in the same suit.</p></div></li>
      <li><span>3</span><div><h3>Run</h3><p>Three consecutive ranks in mixed suits.</p></div></li>
      <li><span>4</span><div><h3>Colour</h3><p>Three cards in one suit that do not form a Colour Run.</p></div></li>
      <li><span>5</span><div><h3>Pair</h3><p>Two cards of one rank plus a third card.</p></div></li>
      <li><span>6</span><div><h3>Indi</h3><p>A group that fits none of the stronger patterns.</p></div></li>
    </ol>
  </section>

  <section class="article-score-explainer" data-ui="score-explainer">
    <div>
      <h2 id="hazari-card-points">Why winning a comparison matters</h2>
      <p>The winner does not merely mark “one win.” The winning player collects the cards used in that comparison, and those captured cards have point values.</p>
    </div>
    <div class="article-big-stat"><strong>360</strong><span>total card points in the full deck</span></div>
  </section>

  <div class="article-table-wrap">
    <table>
      <caption>Common Hazari card-point values</caption>
      <thead><tr><th>Cards</th><th>Points each</th></tr></thead>
      <tbody>
        <tr><td>Ace, King, Queen, Jack, 10</td><td>10</td></tr>
        <tr><td>9, 8, 7, 6, 5, 4, 3, 2</td><td>5</td></tr>
      </tbody>
    </table>
  </div>

  <section>
    <h2 id="how-a-hazari-deal-plays">How one deal plays out</h2>
    <div class="article-process-band" data-ui="process-band">
      <div><strong>Deal</strong><p>All 52 cards are distributed, 13 to each player.</p></div>
      <div><strong>Arrange</strong><p>Each hand becomes groups of 3, 3, 3 and 4.</p></div>
      <div><strong>Lock</strong><p>Players commit to the order before comparison.</p></div>
      <div><strong>Compare</strong><p>Corresponding groups are revealed in sequence.</p></div>
      <div><strong>Collect</strong><p>The strongest group takes the cards in that comparison.</p></div>
      <div><strong>Score</strong><p>Captured card values are added to the running total.</p></div>
    </div>
  </section>

  <section>
    <h2 id="four-card-group">What happens with the four-card group?</h2>
    <p>The last group contains four cards, but Hazari's traditional comparison logic still revolves around the best relevant three-card combination within that group. This is one reason the arrangement stage is more subtle than simply sorting four independent poker hands.</p>
    <p>When teaching the game, it is useful to think of the fourth group as a three-card comparison with one extra card available to shape the best legal pattern.</p>
  </section>

  <section class="article-strategy-board" data-ui="strategy-board">
    <h2 id="hazari-strategy">Strategy: do not solve one group at a time</h2>
    <div class="article-grid">
      <article><h3>Budget your strength</h3><p>If you spend every premium card on the first group, later positions may become automatic losses.</p></article>
      <article><h3>Respect the hierarchy</h3><p>A high Pair still loses to any legal Colour, Run, Colour Run or Troy.</p></article>
      <article><h3>Look for flexible cards</h3><p>A card may fit a Run, a Colour or help protect the ordering of the remaining groups.</p></article>
      <article><h3>Remember the points</h3><p>All comparisons are not identical in value because the cards you capture contribute different totals.</p></article>
    </div>
  </section>

  <section>
    <h2 id="hazari-example-thinking">An example of better arrangement thinking</h2>
    <p>Imagine you can build one excellent Troy, one solid Run and two weak groups. The tempting move is to place the Troy first and feel safe. A stronger player pauses and asks whether breaking that Troy could create two Colour Runs or a Colour Run plus a stronger Pair elsewhere. Hazari rewards the total quality of the four-position plan, not the beauty of one group.</p>
    <p>This is why experienced play often looks slower before the reveal and faster afterward: most of the difficult decisions were already made during arrangement.</p>
  </section>

  <aside class="article-callout">
    <strong>Core idea</strong>
    <p>Hazari is not “make the strongest three cards.” It is “make the strongest legal sequence of four comparisons from all thirteen cards.”</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "How many players play Hazari?",
        "answer": "Traditional Hazari is a four-player individual game using a standard 52-card deck."
      },
      {
        "question": "How are 13 cards arranged in Hazari?",
        "answer": "Each player divides the 13-card hand into four groups containing 3, 3, 3 and 4 cards."
      },
      {
        "question": "What is the strongest Hazari combination?",
        "answer": "Troy, three cards of the same rank, is the highest main three-card combination category."
      },
      {
        "question": "How many points are in a Hazari deck?",
        "answer": "Under the commonly documented scoring, the full 52-card deck contains 360 card points."
      },
      {
        "question": "How do you win Hazari?",
        "answer": "Players collect point-bearing cards by winning group comparisons over repeated deals. The game ends when one or more players reaches at least 1000 points, and the highest total wins."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.hazari",
        "kind": "official-product"
      },
      {
        "label": "Pagat Hazari rules",
        "url": "https://www.pagat.com/partition/hazari.html",
        "kind": "rules-reference"
      },
      {
        "label": "Legacy FunFuse article",
        "url": "https://funfusegames.com/hazari-grand-1000-points-game/",
        "kind": "legacy"
      }
    ],
    "editorialNote": "Preserve the legacy root URL and dates. Use the current local Hazari art rather than hotlinking the old WordPress hero."
  }),
  definePost({
    "slug": "how-to-play-callbreak",
    "canonicalPath": "/blogs/how-to-play-callbreak/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "How to Play CallBreak: Bidding, Tricks, Scoring and Strategy",
    "eyebrow": "Trick-Taking Guide",
    "excerpt": "Understand CallBreak from the call to the final score: four individual players, 13 cards each, permanent Spade trumps and a target you must meet.",
    "seo": {
      "title": "How to Play CallBreak | Rules, Scoring & Strategy",
      "description": "Learn CallBreak rules, bidding, Spade trumps, trick play, scoring examples and practical strategy for the four-player South Asian card game.",
      "primaryKeyword": "how to play CallBreak",
      "secondaryKeywords": [
        "CallBreak rules",
        "Call Break scoring",
        "CallBreak strategy",
        "Call Bridge card game"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "callbreak-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "callbreak-offline",
      "preferredSlot": "cover",
      "alt": "CallBreak Club key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--callbreak" data-article-layout="callbreak-bid-sheet">
  <section class="article-lead">
    <p>CallBreak is a game of promises. Before the first trick is resolved, you decide how many tricks your hand should be able to win. The rest of the round is a test of whether that estimate was disciplined, optimistic or too cautious.</p>
    <p>Four players compete individually with 13 cards each, and Spades are permanent trumps. You are not trying to help a partner. Every trick you give away changes someone else's route to their call.</p>
  </section>

  <aside class="article-bid-card" data-ui="bid-card">
    <span class="article-label">The round equation</span>
    <strong>Your call → tricks won → score</strong>
    <p>Meet the call to score positively. Fall short and the bid becomes a penalty.</p>
  </aside>

  <section>
    <h2 id="callbreak-setup">CallBreak setup</h2>
    <div class="article-facts-row">
      <div><strong>4</strong><span>players</span></div>
      <div><strong>52</strong><span>cards</span></div>
      <div><strong>13</strong><span>cards each</span></div>
      <div><strong>♠</strong><span>permanent trump</span></div>
    </div>
    <p>Cards normally rank Ace high, then King, Queen, Jack, 10 down to 2. Every player receives a full 13-card hand. After looking at the hand, each player calls the number of tricks they expect to win.</p>
  </section>

  <section>
    <h2 id="how-to-bid-callbreak">How to make a better call</h2>
    <p>A call should begin with reliable winners, not hopeful ones. Count obvious high Spades, side-suit Aces, long suits that may become winners after higher cards disappear, and combinations that let you control when trumps are used.</p>
    <div class="article-meter-list" data-ui="meter-list">
      <article><span>Reliable</span><h3>Top trumps and protected Aces</h3><p>These are the first tricks you can reasonably budget.</p></article>
      <article><span>Conditional</span><h3>Kings, Queens and long suits</h3><p>Their value depends on what higher cards are still out and whether you can keep the lead.</p></article>
      <article><span>Risky</span><h3>Low cards you hope will survive</h3><p>Do not build your call around tricks that require several opponents to make mistakes.</p></article>
    </div>
  </section>

  <section>
    <h2 id="callbreak-trick-rules">How a trick works</h2>
    <ol class="article-steps">
      <li><strong>Lead:</strong> the first player plays one card.</li>
      <li><strong>Follow suit:</strong> if you hold the suit led, you must play that suit.</li>
      <li><strong>When void:</strong> if you cannot follow suit, a Spade can trump the trick; another suit can be discarded when allowed by the active rules.</li>
      <li><strong>Resolve:</strong> the highest Spade wins if any Spade was played. Otherwise, the highest card of the led suit wins.</li>
      <li><strong>Continue:</strong> the trick winner leads the next trick.</li>
    </ol>
  </section>

  <section>
    <h2 id="callbreak-scoring">CallBreak scoring with examples</h2>
    <p>FunFuse's current listing uses a common scoring model: meeting your call earns the amount called, while extra tricks add a small decimal bonus. Missing the call loses the called amount.</p>
    <div class="article-table-wrap">
      <table>
        <thead><tr><th>Call</th><th>Tricks won</th><th>Example result</th></tr></thead>
        <tbody>
          <tr><td>4</td><td>4</td><td>4.0</td></tr>
          <tr><td>4</td><td>5</td><td>4.1</td></tr>
          <tr><td>4</td><td>7</td><td>4.3</td></tr>
          <tr><td>5</td><td>3</td><td>-5.0</td></tr>
        </tbody>
      </table>
    </div>
    <p>Scoring can vary between tables and apps, so the best habit is to check the selected rules before a match. The strategic principle does not change: your call sets the minimum result you are responsible for.</p>
  </section>

  <section class="article-phase-guide" data-ui="phase-guide">
    <h2 id="callbreak-strategy-by-phase">Strategy changes as the round gets shorter</h2>
    <div>
      <h3>Early tricks: collect information</h3>
      <p>Notice who is void in which suit, which high Spades have appeared and whether a player is protecting or aggressively spending trumps.</p>
    </div>
    <div>
      <h3>Middle tricks: compare reality with your call</h3>
      <p>If you called four and already have three secure tricks, you can play differently from a player who called five and has only one.</p>
    </div>
    <div>
      <h3>Late tricks: count exact obligations</h3>
      <p>At the end of the round, “strong card” matters less than “does this card force the exact trick I need?” Track remaining trumps and the likely winners in each suit.</p>
    </div>
  </section>

  <section>
    <h2 id="tracking-spades">Why tracking Spades is the highest-value habit</h2>
    <p>There are only 13 Spades. Every time one appears, the future power of the remaining Spades changes. If the Ace, King and Queen of Spades are already gone, a Jack that looked ordinary at the start may now be the highest trump remaining.</p>
    <p>You do not need perfect memory. Start by tracking the top five or six Spades. As that becomes automatic, add suit shortages: who failed to follow Hearts, who discarded on Clubs, and who is likely waiting to trump a side suit.</p>
  </section>

  <aside class="article-warning">
    <strong>Common bidding trap</strong>
    <p>Do not count the same strength twice. A long side suit may create future winners only if your Spades or entries let you regain control. “I have four good Hearts” is not automatically four tricks.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "How many players are in CallBreak?",
        "answer": "CallBreak is normally played by four individual players using a standard 52-card deck."
      },
      {
        "question": "What is the trump suit in CallBreak?",
        "answer": "Spades are permanent trumps in the standard game."
      },
      {
        "question": "How many cards does each player get?",
        "answer": "All 52 cards are dealt, so each of the four players receives 13 cards."
      },
      {
        "question": "What happens if you miss your call?",
        "answer": "In the scoring model used by FunFuse and many common rulesets, failing to reach your call gives you a negative score equal to the amount called."
      },
      {
        "question": "Is CallBreak played in teams?",
        "answer": "No. Standard CallBreak is an individual four-player game, unlike partnership games such as Spades or Tarneeb."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.callbreakpro",
        "kind": "official-product"
      },
      {
        "label": "Pagat Call Bridge / Call Break reference",
        "url": "https://www.pagat.com/auctionwhist/call_bridge.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Use informational keyword targeting. Product-download copy belongs on /projects/callbreak-offline/."
  }),
  definePost({
    "slug": "3-2-5-card-game-rules",
    "canonicalPath": "/blogs/3-2-5-card-game-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "3-2-5 Card Game Rules: How Teen Do Panch Really Works",
    "eyebrow": "South Asian Trick-Taking Guide",
    "excerpt": "Learn the traditional three-player 3-2-5 game: the 30-card deck, rotating quotas of five, three and two tricks, trump selection and the card-pulling advantage.",
    "seo": {
      "title": "3-2-5 Card Game Rules | How to Play Teen Do Panch",
      "description": "Learn traditional 3-2-5 or Teen Do Panch: three players, a 30-card deck, 5/3/2 trick quotas, trump selection and the card-pulling rule.",
      "primaryKeyword": "3-2-5 card game rules",
      "secondaryKeywords": [
        "Teen Do Panch rules",
        "how to play 3 2 5",
        "2 3 5 card game",
        "Teen Do Panch card game"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "3-2-5-offline-fun-card-game",
    "hero": {
      "kind": "game-art",
      "gameSlug": "3-2-5-offline-fun-card-game",
      "preferredSlot": "cover",
      "alt": "3 2 5 Grand key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--three-two-five" data-article-layout="three-two-five-rotation">
  <section class="article-lead">
    <p>The name 3-2-5 is the scorecard built into the game. Three players receive the same number of cards, but they do not receive the same job. One player must take at least five tricks, one must take three, and the dealer needs two.</p>
    <p>Those roles rotate with the deal, and performance can carry forward: exceed your quota and you may gain a card-pulling advantage on the next deal. That makes 3-2-5 more than a short trick-taking game; every round leaves a small strategic shadow over the next one.</p>
  </section>

  <section class="article-role-wheel" data-ui="role-wheel">
    <div class="role role--five"><strong>5</strong><span>Dealer's right</span><p>Chooses trump and leads first.</p></div>
    <div class="role role--three"><strong>3</strong><span>Dealer's left</span><p>Middle quota.</p></div>
    <div class="role role--two"><strong>2</strong><span>Dealer</span><p>Lowest quota.</p></div>
  </section>

  <section>
    <h2 id="325-players-and-deck">Players and the unusual 30-card deck</h2>
    <p>Traditional 3-2-5 uses three players and 30 cards. A standard 52-card deck is reduced by removing the cards from 2 through 6 and keeping only two Sevens. A common pack keeps the Seven of Hearts and Seven of Spades. The ordinary suit ranking runs Ace, King, Queen, Jack, 10, 9, 8 and then a retained 7 where present.</p>
    <p>Each player ultimately receives 10 cards, so every card in the reduced pack is active in the deal.</p>
  </section>

  <section>
    <h2 id="325-deal-and-trump">The deal and trump choice</h2>
    <div class="article-deal-strip" data-ui="deal-strip">
      <span><strong>5</strong> cards each</span>
      <span class="arrow">→</span>
      <span><strong>Trump chosen</strong> by the five-trick player</span>
      <span class="arrow">→</span>
      <span><strong>3</strong> more each</span>
      <span class="arrow">→</span>
      <span><strong>2</strong> more each</span>
    </div>
    <p>The five-trick player carries the biggest obligation, so choosing trump is both an advantage and a responsibility. After the first five cards are visible to that player, they select the suit that will be trump for the deal. The remaining cards are then distributed until everyone has ten.</p>
  </section>

  <section>
    <h2 id="325-playing-tricks">How tricks are played</h2>
    <ul class="article-rule-list">
      <li>The player with the five-trick quota leads the first trick.</li>
      <li>Players must follow the led suit when they can.</li>
      <li>A player who cannot follow suit may play a trump or discard another suit.</li>
      <li>The highest trump wins a trick containing trump.</li>
      <li>If no trump is played, the highest card of the led suit wins.</li>
      <li>The trick winner leads the next trick.</li>
    </ul>
  </section>

  <section class="article-carryover" data-ui="carryover">
    <span class="article-label">The rule that makes 3-2-5 distinctive</span>
    <h2 id="pulling-cards">What “pulling cards” means</h2>
    <p>From the second deal onward, players who exceeded their quota can gain an advantage from players who fell short. One card can be pulled for each trick above quota, matched against a card owed for each trick below quota.</p>
    <p>The under-quota player presents the hand face down. The over-quota player takes a card without knowing what it is, then returns an unwanted card under the traditional restrictions. It is a reward, but not a guaranteed upgrade: the pulled card is hidden until chosen.</p>
  </section>

  <section>
    <h2 id="325-example">A simple quota example</h2>
    <div class="article-example-grid" data-ui="example-grid">
      <div><span>Player A</span><strong>Quota 5 → wins 6</strong><p>One trick over quota. Gains one pull opportunity next deal.</p></div>
      <div><span>Player B</span><strong>Quota 3 → wins 3</strong><p>Exactly on quota. No carry-over change.</p></div>
      <div><span>Player C</span><strong>Quota 2 → wins 1</strong><p>One trick under quota. Owes one card-pull opportunity.</p></div>
    </div>
    <p>The quotas always total ten, which is exactly the number of tricks in the deal. Every overtrick therefore corresponds to someone else's shortage.</p>
  </section>

  <section>
    <h2 id="325-strategy-by-role">Strategy changes with your quota</h2>
    <article class="article-role-strategy">
      <h3>When you need five</h3>
      <p>Trump choice is your biggest lever. Count both trump length and side-suit control. A long weak trump suit can still be useful, but only if you can create situations where those trumps actually win.</p>
    </article>
    <article class="article-role-strategy">
      <h3>When you need three</h3>
      <p>You often have the most balanced task. Avoid donating easy tricks while keeping enough flexibility to exploit void suits later.</p>
    </article>
    <article class="article-role-strategy">
      <h3>When you need two</h3>
      <p>Your quota is lower, but “only two” can encourage careless play. Secure your necessary tricks before experimenting with risky leads.</p>
    </article>
  </section>

  <aside class="article-source-warning" data-ui="accuracy-note">
    <strong>Rules accuracy note</strong>
    <p>The current FunFuse store listing contains generic rule copy that conflicts with the traditional 3-player 30-card game. This guide follows the documented traditional Teen Do Panch rules and the verified game-content research used elsewhere in this website.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "How many players play 3-2-5?",
        "answer": "Traditional 3-2-5, also called Teen Do Panch, is a three-player game."
      },
      {
        "question": "How many cards are used in 3-2-5?",
        "answer": "The traditional game uses a reduced 30-card pack, and each player receives 10 cards."
      },
      {
        "question": "Who chooses trump in 3-2-5?",
        "answer": "The player with the five-trick quota chooses the trump suit after seeing the first batch of cards."
      },
      {
        "question": "What do 3, 2 and 5 mean?",
        "answer": "They are the players' trick quotas. The dealer aims for two tricks, the player to the dealer's right aims for five, and the third player aims for three."
      },
      {
        "question": "What is card pulling in 3-2-5?",
        "answer": "On later deals, a player who exceeded their previous quota may take hidden cards from a player who fell short, returning unwanted cards under the traditional exchange rules."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.doteenpanch",
        "kind": "official-product"
      },
      {
        "label": "Pagat 3-2-5 rules",
        "url": "https://www.pagat.com/quotawhist/3-2-5.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Traditional rules take precedence over conflicting generic rule text currently present in the Play Store description."
  }),
  definePost({
    "slug": "gin-rummy-rules",
    "canonicalPath": "/blogs/gin-rummy-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Gin Rummy Rules: Melds, Deadwood, Knocking and Better Discards",
    "eyebrow": "Two-Player Rummy Guide",
    "excerpt": "Learn Gin Rummy from first draw to final knock: sets, runs, deadwood values, Gin, undercuts and the discard decisions that shape every hand.",
    "seo": {
      "title": "Gin Rummy Rules | How to Play, Knock & Go Gin",
      "description": "Learn Gin Rummy rules, sets and runs, deadwood values, knocking, Gin, undercuts and practical two-player strategy for better hands.",
      "primaryKeyword": "Gin Rummy rules",
      "secondaryKeywords": [
        "how to play Gin Rummy",
        "Gin Rummy strategy",
        "deadwood Gin Rummy",
        "what is knocking in Gin Rummy"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "gin-rummy-master-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "gin-rummy-master-offline",
      "preferredSlot": "cover",
      "alt": "Gin Rummy Master Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--gin-rummy" data-article-layout="gin-rummy-notebook">
  <section class="article-lead">
    <p>Gin Rummy is a two-player conversation conducted through draws and discards. You are building sets and runs, but every card you take also tells your opponent what you may be collecting. Every card you throw away tells them what you probably are not.</p>
    <p>The winning habit is not simply “make melds quickly.” It is to improve your hand while keeping unmatched value — deadwood — under control, then recognize the moment when ending the hand is better than waiting for perfection.</p>
  </section>

  <section class="article-hand-anatomy" data-ui="hand-anatomy">
    <h2 id="gin-rummy-vocabulary">The four words to learn first</h2>
    <div class="article-grid">
      <article><span>01</span><h3>Set</h3><p>Three or four cards of the same rank, such as three Queens.</p></article>
      <article><span>02</span><h3>Run</h3><p>Three or more consecutive cards in the same suit, such as 5-6-7 of Hearts.</p></article>
      <article><span>03</span><h3>Deadwood</h3><p>Cards that are not currently part of a valid meld.</p></article>
      <article><span>04</span><h3>Knock</h3><p>End the hand when your deadwood is low enough under the selected rules.</p></article>
    </div>
  </section>

  <section>
    <h2 id="gin-rummy-turn">What happens on a turn?</h2>
    <div class="article-two-step" data-ui="two-step">
      <div><strong>Draw one</strong><p>Take the available top card from the stock or the discard pile according to the rules.</p></div>
      <div><strong>Discard one</strong><p>Release a card and return your hand to its required size.</p></div>
    </div>
    <p>That tiny loop contains most of Gin Rummy's strategy. A discard-pile card is visible and therefore informative. A stock card is unknown. Taking a visible discard may complete your meld immediately, but it can also confirm to your opponent exactly what pattern you are building.</p>
  </section>

  <section>
    <h2 id="gin-rummy-deadwood-values">Deadwood values</h2>
    <div class="article-table-wrap">
      <table>
        <thead><tr><th>Card</th><th>Deadwood value</th><th>Why it matters</th></tr></thead>
        <tbody>
          <tr><td>Ace</td><td>1</td><td>Cheap to hold unmatched.</td></tr>
          <tr><td>2–9</td><td>Face value</td><td>Risk rises with the number.</td></tr>
          <tr><td>10, Jack, Queen, King</td><td>10 each</td><td>Expensive when they fail to meld.</td></tr>
        </tbody>
      </table>
    </div>
    <p>A high card can still be worth keeping if it is one card away from a strong run or set, but the clock matters. The longer a hand continues, the more dangerous unsupported ten-point cards become.</p>
  </section>

  <section class="article-draw-decisions" data-ui="decision-ledger">
    <h2 id="stock-or-discard">Stock or discard pile?</h2>
    <article>
      <h3>Take the discard when it creates immediate value</h3>
      <p>If the visible card completes a meld, replaces expensive deadwood, or creates a flexible four-card structure, the information you reveal may be worth the improvement.</p>
    </article>
    <article>
      <h3>Prefer the stock when the discard only looks “interesting”</h3>
      <p>A speculative visible card can expose your direction without actually improving your hand. Unknown stock cards preserve more ambiguity.</p>
    </article>
    <article>
      <h3>Remember what your opponent refused</h3>
      <p>If a card sits untouched in the discard pile, that is evidence. It does not prove the opponent cannot use nearby cards, but it helps narrow the possibilities.</p>
    </article>
  </section>

  <section>
    <h2 id="knock-gin-undercut">Knock, Gin and undercut</h2>
    <dl class="article-term-stack">
      <div><dt>Knock</dt><dd>End the hand with deadwood at or below the allowed threshold. Both hands are then evaluated.</dd></div>
      <div><dt>Gin</dt><dd>Every card in your hand belongs to melds, leaving zero deadwood. Gin normally earns a bonus and cannot be undercut.</dd></div>
      <div><dt>Undercut</dt><dd>If the knocker's opponent ends with equal or lower deadwood after legal layoffs, the opponent can earn the scoring advantage instead.</dd></div>
    </dl>
    <p>Exact bonus values vary between Gin Rummy rulesets. That is why a rules guide should distinguish the universal idea — melds, deadwood, knock, Gin, undercut — from configurable scoring details.</p>
  </section>

  <section class="article-strategy-notes" data-ui="notebook">
    <h2 id="gin-rummy-strategy">Five notes that improve real play</h2>
    <div><span>Note 01</span><h3>Middle cards are flexible</h3><p>A 6 can connect toward 4-5-6 or 6-7-8 in the same suit. Edge cards often have fewer run possibilities.</p></div>
    <div><span>Note 02</span><h3>Pairs are promises, not melds</h3><p>Two Kings look valuable, but until the third King arrives they still represent 20 points of deadwood.</p></div>
    <div><span>Note 03</span><h3>Do not feed a known run</h3><p>If your opponent picked up the 8 of Clubs, discarding the 7 or 9 of Clubs soon afterward deserves extra scrutiny.</p></div>
    <div><span>Note 04</span><h3>Know when to abandon a plan</h3><p>A near-meld that has consumed several turns without improvement can become an anchor.</p></div>
    <div><span>Note 05</span><h3>Knocking is a timing decision</h3><p>Waiting for Gin can be costly when your current deadwood is already low and your opponent appears close to finishing.</p></div>
  </section>

  <aside class="article-callout">
    <strong>A useful mental model</strong>
    <p>Every card has two prices: its deadwood value if the hand ends now, and its connection value if the hand continues.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "What is deadwood in Gin Rummy?",
        "answer": "Deadwood is the total value of cards in your hand that are not part of valid sets or runs."
      },
      {
        "question": "What is the difference between knocking and going Gin?",
        "answer": "Knocking ends the hand with a permitted amount of deadwood. Going Gin means all cards are melded and deadwood is zero."
      },
      {
        "question": "How many players play Gin Rummy?",
        "answer": "Traditional Gin Rummy is primarily a two-player game using a standard 52-card deck."
      },
      {
        "question": "What is a run in Gin Rummy?",
        "answer": "A run is three or more consecutive cards in the same suit."
      },
      {
        "question": "Are face cards worth 10 in Gin Rummy?",
        "answer": "Yes. Kings, Queens, Jacks and Tens count 10 deadwood points each; Aces count 1 and number cards count face value."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.ginrummy",
        "kind": "official-product"
      },
      {
        "label": "Pagat Gin Rummy rules",
        "url": "https://www.pagat.com/rummy/ginrummy.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Avoid locking the article to one bonus-scoring variant; explain universal Gin Rummy mechanics and note configurable scoring."
  }),
  definePost({
    "slug": "how-to-play-tarneeb",
    "canonicalPath": "/blogs/how-to-play-tarneeb/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "How to Play Tarneeb: Bidding, Trump and Partnership Strategy",
    "eyebrow": "Middle Eastern Card Game Guide",
    "excerpt": "A complete guide to Tarneeb: four players in partnerships, 13 cards each, bidding for tricks, choosing trump and converting a contract into teamwork.",
    "seo": {
      "title": "How to Play Tarneeb | Rules, Bidding & Strategy",
      "description": "Learn Tarneeb rules: four-player partnerships, 13-card hands, trick bidding, trump selection, contract play and practical partner strategy.",
      "primaryKeyword": "how to play Tarneeb",
      "secondaryKeywords": [
        "Tarneeb rules",
        "Tarneeb card game",
        "Tarneeb bidding",
        "Tarneeb strategy",
        "لعبة طرنيب"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "tarneeb",
    "hero": {
      "kind": "game-art",
      "gameSlug": "tarneeb",
      "preferredSlot": "cover",
      "alt": "Tarneeb key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--tarneeb" data-article-layout="tarneeb-partnership">
  <section class="article-lead">
    <p>Tarneeb turns bidding into a partnership promise. Four players sit as two teams, every card is dealt, and the auction decides which side will be responsible for making a target number of tricks. The final bidder chooses the trump suit — tarneeb — and the hand becomes a test of coordination.</p>
    <p>You cannot openly tell your partner what you hold. Your communication happens through bids, leads, follows and the cards you choose not to play.</p>
  </section>

  <div class="article-team-board" data-ui="team-board" aria-label="Tarneeb seating">
    <div class="seat seat--north">Partner A</div>
    <div class="seat seat--west">Opponent B</div>
    <div class="seat seat--center"><strong>13</strong><span>cards each</span></div>
    <div class="seat seat--east">Opponent A</div>
    <div class="seat seat--south">Partner B</div>
  </div>

  <section>
    <h2 id="tarneeb-setup">Tarneeb setup</h2>
    <ul class="article-fact-list">
      <li><strong>Players:</strong> four.</li>
      <li><strong>Teams:</strong> two fixed partnerships, partners opposite each other.</li>
      <li><strong>Deck:</strong> standard 52-card deck.</li>
      <li><strong>Cards per player:</strong> 13.</li>
      <li><strong>Rank:</strong> Ace high, then King, Queen, Jack, 10 down to 2.</li>
      <li><strong>Core mechanism:</strong> bid for tricks, choose trump, make the contract.</li>
    </ul>
  </section>

  <section class="article-auction" data-ui="auction-ladder">
    <h2 id="tarneeb-bidding">How Tarneeb bidding works</h2>
    <p>In a widely played form, bids represent the number of tricks a partnership promises to take, commonly beginning at seven and rising toward thirteen. A player can raise the current bid or pass. When the auction ends, the highest bidder's partnership becomes responsible for the contract.</p>
    <div class="auction-ladder">
      <span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span>
    </div>
    <p>The high bidder then names the trump suit. A higher bid creates a harder target, so a successful auction is not about “winning” the bidding. It is about buying the contract at a level your partnership can actually make.</p>
  </section>

  <section>
    <h2 id="choosing-tarneeb-trump">Choosing the trump suit</h2>
    <p>A good trump suit usually combines length and control. Four or five cards in a suit can be more useful than one isolated Ace because long trump holdings let you survive repeated trump rounds and later convert low trumps into winners.</p>
    <div class="article-choice-grid" data-ui="choice-grid">
      <article><h3>Length</h3><p>How many cards do you hold in the suit?</p></article>
      <article><h3>Top strength</h3><p>Do you control the Ace, King or other high cards?</p></article>
      <article><h3>Side winners</h3><p>Can your non-trump Aces or long suits produce tricks once trumps are under control?</p></article>
      <article><h3>Partner expectation</h3><p>Your bid should leave room for normal partner support rather than requiring a perfect hidden hand.</p></article>
    </div>
  </section>

  <section>
    <h2 id="tarneeb-trick-play">Playing the tricks</h2>
    <ol class="article-steps article-steps--cards">
      <li><strong>Lead:</strong> the appropriate opening player leads one card.</li>
      <li><strong>Follow suit:</strong> every player who can follow the led suit must do so.</li>
      <li><strong>When void:</strong> a player without the led suit may use a trump or discard according to the ruleset.</li>
      <li><strong>Resolve:</strong> the highest trump wins if trump is present; otherwise the highest card of the led suit wins.</li>
      <li><strong>Lead again:</strong> the winner of the trick chooses the next lead.</li>
    </ol>
  </section>

  <section class="article-partnership-language" data-ui="partnership-language">
    <h2 id="tarneeb-partnership-strategy">The silent language between partners</h2>
    <article>
      <span>Lead</span>
      <h3>What suit are you asking about?</h3>
      <p>A lead can test a suit, cash a winner or invite partner support. Repeated leads carry meaning because they reveal distribution.</p>
    </article>
    <article>
      <span>Follow</span>
      <h3>Do not spend a winner your partner already owns</h3>
      <p>If your partner is clearly winning the current trick, overtaking with a higher card can waste partnership strength unless you need the lead for a specific reason.</p>
    </article>
    <article>
      <span>Discard</span>
      <h3>A void is future trump access</h3>
      <p>When you run out of a side suit, later leads in that suit may let you trump. Remember which players have shown they are void.</p>
    </article>
  </section>

  <section>
    <h2 id="tarneeb-contract-management">Playing to the contract, not to ego</h2>
    <p>If your team bid eight and already has seven tricks with several cards left, the correct line may be conservative. You do not receive extra value from turning every hand into a sweep if doing so introduces avoidable risk.</p>
    <p>The defending partnership has the opposite objective: it does not need to dominate every trick. It only needs to stop the bidders from reaching their contract. One well-timed trump or preserved Ace can be enough.</p>
  </section>

  <aside class="article-callout article-callout--dark">
    <strong>Partnership principle</strong>
    <p>Count tricks as a team. A card that looks weak in your hand may be exactly what lets your partner's long suit or trump holding become powerful.</p>
  </aside>

  <section>
    <h2 id="tarneeb-variations">Why Tarneeb scoring may look different at different tables</h2>
    <p>Tarneeb is played across several Middle Eastern countries, and bidding limits, scoring targets and penalties vary. A responsible rules guide should explain the stable core — four players, partnerships, bidding, named trump, follow-suit trick play — and tell players to check the selected scoring rules before a match.</p>
  </section>
</div>`,
    "faq": [
      {
        "question": "How many players play Tarneeb?",
        "answer": "Tarneeb is normally played by four players in two fixed partnerships, with partners sitting opposite each other."
      },
      {
        "question": "How many cards does each Tarneeb player receive?",
        "answer": "All 52 cards are dealt, so each player receives 13 cards."
      },
      {
        "question": "What does Tarneeb mean in the game?",
        "answer": "Tarneeb refers to the trump suit. The winning bidder names the trump suit for the hand."
      },
      {
        "question": "What is the usual minimum Tarneeb bid?",
        "answer": "In a widely played form, bidding begins at seven tricks, though regional and app variants can differ."
      },
      {
        "question": "Do you have to follow suit in Tarneeb?",
        "answer": "Yes. Players must follow the suit led whenever they hold a card in that suit."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.tarneeb",
        "kind": "official-product"
      },
      {
        "label": "Pagat Tarneeb rules",
        "url": "https://www.pagat.com/auctionwhist/tarneeb.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Keep scoring language variant-aware because Tarneeb has regional forms. The stable core rules are safe evergreen content."
  }),
  definePost({
    "slug": "how-to-play-ludo",
    "canonicalPath": "/blogs/how-to-play-ludo/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "How to Play Ludo: Movement, Captures, Safe Play and Endgame Choices",
    "eyebrow": "Board Game Guide",
    "excerpt": "Learn the logic behind Ludo: bringing pieces into play, choosing which token to move, using captures, managing danger and getting all four pieces home.",
    "seo": {
      "title": "How to Play Ludo | Rules, Captures & Strategy Guide",
      "description": "Learn how to play Ludo, including token movement, captures, safe positions, home paths and simple strategy for two to four players.",
      "primaryKeyword": "how to play Ludo",
      "secondaryKeywords": [
        "Ludo rules",
        "Ludo strategy",
        "Ludo board game",
        "Ludo capture rules",
        "offline Ludo"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Board Games",
      "Strategy"
    ],
    "relatedGameSlug": "ludo-challenge-offline-play",
    "hero": {
      "kind": "game-art",
      "gameSlug": "ludo-challenge-offline-play",
      "preferredSlot": "cover",
      "alt": "Ludo Challenge Offline Play key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--ludo" data-article-layout="ludo-race-map">
  <section class="article-lead">
    <p>Ludo looks like a race, but the interesting decisions come from traffic. Four pieces share a route with opposing pieces, and one die roll can present several legal moves. Do you push the leader, develop a second token, move into safety or capture an opponent?</p>
    <p>That is the strategic core. The die creates the options; the player decides which risk to accept.</p>
  </section>

  <section class="article-race-map" data-ui="race-map">
    <div><span>01</span><strong>Yard</strong><p>Pieces begin off the shared track.</p></div>
    <div><span>02</span><strong>Entry</strong><p>An eligible roll brings a piece into play under the selected rules.</p></div>
    <div><span>03</span><strong>Shared track</strong><p>Race, threaten captures and avoid exposed squares.</p></div>
    <div><span>04</span><strong>Home lane</strong><p>After completing the route, a piece turns into its own finishing path.</p></div>
    <div><span>05</span><strong>Home</strong><p>Finish all four pieces before the opponents.</p></div>
  </section>

  <section>
    <h2 id="ludo-objective">The objective</h2>
    <p>Each player controls four pieces of one color. The goal is to move all four from the starting area, around the board and into the final home positions before anyone else completes the same journey.</p>
    <p>Most versions support two to four players. Ludo Challenge Offline also supports local multiplayer and computer opponents, making the same core race playable without a network connection.</p>
  </section>

  <section>
    <h2 id="ludo-starting-a-piece">Getting a piece onto the board</h2>
    <p>Many familiar Ludo rules require a particular die result — often a six — to release a piece from the yard. However, entry rules are one of the settings that can vary between regional and digital versions. Because FunFuse supports customizable rules, the app's selected match settings should be treated as authoritative for that game.</p>
    <aside class="article-note"><strong>Best-practice content rule:</strong> teach the strategic effect of entry rather than pretending every Ludo table uses identical house rules.</aside>
  </section>

  <section class="article-move-chooser" data-ui="move-chooser">
    <h2 id="which-ludo-piece-to-move">Which piece should you move?</h2>
    <div class="article-grid">
      <article><h3>Advance the leader</h3><p>Good when the square ahead is safe and moving closer to home does not create a large capture risk.</p></article>
      <article><h3>Develop another piece</h3><p>More active pieces mean more useful options from future rolls and reduce dependence on one runner.</p></article>
      <article><h3>Take a capture</h3><p>Sending an opponent backward can be worth more than a few squares of forward progress, especially late in the race.</p></article>
      <article><h3>Move out of danger</h3><p>Sometimes the strongest move is defensive: leave a square that an opponent can reach on the next roll.</p></article>
    </div>
  </section>

  <section>
    <h2 id="ludo-captures">How captures change the race</h2>
    <p>In common Ludo play, landing exactly on an opponent's exposed piece sends that piece back to its starting area, subject to safe-square and rule variations. A capture therefore creates a double swing: you advance your own piece and erase some of the opponent's progress.</p>
    <p>Before choosing a move, count the distance between your piece and the nearest opponent behind it. If several common die results can reach you, your position is exposed even if you are currently ahead.</p>
  </section>

  <section class="article-risk-scale" data-ui="risk-scale">
    <h2 id="ludo-risk">A simple way to read danger</h2>
    <div><span class="risk risk--low">Low</span><p>Opponent cannot reach the piece on the next roll or the square is protected under the selected rules.</p></div>
    <div><span class="risk risk--medium">Medium</span><p>One narrow roll creates a capture, but other moves may be more attractive to the opponent.</p></div>
    <div><span class="risk risk--high">High</span><p>Multiple opponents or multiple die results can capture the piece immediately.</p></div>
  </section>

  <section>
    <h2 id="ludo-endgame">The endgame is about exact movement</h2>
    <p>Once a piece reaches its home lane, the race changes. Captures may no longer be the main problem; exact movement and die efficiency become more important. A player with three finished pieces and one distant runner can lose to someone whose four pieces are all positioned efficiently near home.</p>
    <p>This is another reason to develop more than one piece early. A balanced board often gives more useful endgame rolls than a strategy that sends one token far ahead while leaving three untouched.</p>
  </section>

  <blockquote class="article-pullquote">The strongest Ludo move is not always the move that travels the farthest.</blockquote>
</div>`,
    "faq": [
      {
        "question": "How many pieces does each Ludo player have?",
        "answer": "Each player normally controls four pieces of one color."
      },
      {
        "question": "How many people can play Ludo?",
        "answer": "Ludo is commonly played by two to four players."
      },
      {
        "question": "Do you always need a six to start in Ludo?",
        "answer": "Requiring a six is a common rule, but entry rules can vary by version. Check the selected match settings in digital or house-rule play."
      },
      {
        "question": "What happens when you land on another player's piece?",
        "answer": "In many standard rules, an exposed opposing piece is captured and returned to its starting area, unless the square or selected rules protect it."
      },
      {
        "question": "What is a good Ludo strategy?",
        "answer": "Develop multiple pieces, watch capture distances, use safe positions when available and balance immediate progress against the risk of being sent back."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.ludo.challenge",
        "kind": "official-product"
      },
      {
        "label": "Pagat race-game background",
        "url": "https://www.pagat.com/race/",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "FunFuse supports customizable rules, so keep entry, safe-square and bonus-roll claims variant-aware."
  }),
  definePost({
    "slug": "puzzle-club-offline-guide",
    "canonicalPath": "/blogs/puzzle-club-offline-guide/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Puzzle Club Offline Guide: 6 Puzzle Modes and How to Think About Each",
    "eyebrow": "Puzzle Collection Guide",
    "excerpt": "Explore the six highlighted Puzzle Club modes — 2048, Tic Tac Toe, Dice Down, falling blocks, Block Puzzle and SOS — and the different thinking each one rewards.",
    "seo": {
      "title": "Puzzle Club Offline Guide | 2048, Blocks, SOS & More",
      "description": "Explore Puzzle Club Offline and learn the core ideas behind 2048, Tic Tac Toe, Dice Down, falling blocks, Block Puzzle and SOS.",
      "primaryKeyword": "Puzzle Club Offline",
      "secondaryKeywords": [
        "offline puzzle games",
        "2048 strategy",
        "Block Puzzle tips",
        "SOS game",
        "Tic Tac Toe strategy"
      ],
      "searchIntent": "informational-commercial"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Puzzle Games",
      "Strategy"
    ],
    "relatedGameSlug": "puzzle-twist-game",
    "hero": {
      "kind": "game-art",
      "gameSlug": "puzzle-twist-game",
      "preferredSlot": "cover",
      "alt": "Puzzle Club Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--puzzle-club" data-article-layout="puzzle-mode-atlas">
  <section class="article-lead">
    <p>Puzzle Club is unusual in the FunFuse catalogue because there is no single ruleset to learn. It is a collection. Switching modes means switching the type of problem your brain is solving: number compression, line control, spatial packing, falling-piece timing or opponent prediction.</p>
    <p>The best way to understand the app is not to ask “what are the Puzzle Club rules?” but “what does each mode reward?”</p>
  </section>

  <section class="article-mode-atlas" data-ui="mode-atlas">
    <article><span>01</span><h2 id="2048">2048</h2><p class="mode-tag">Numbers + space management</p><p>Slide the board, merge matching values and build toward larger tiles. The real resource is empty space: once the board becomes crowded, even high-value tiles can become trapped.</p></article>
    <article><span>02</span><h2 id="tic-tac-toe">Tic Tac Toe</h2><p class="mode-tag">Threats + prevention</p><p>Create your own winning line while blocking the opponent's. Strong play looks one move beyond the current mark and recognizes forks — positions that create two threats at once.</p></article>
    <article><span>03</span><h2 id="dice-down">Dice Down</h2><p class="mode-tag">Placement + line planning</p><p>Dice become spatial pieces. Good placement scores now without closing the shapes or lanes you will need later.</p></article>
    <article><span>04</span><h2 id="falling-blocks">Falling Blocks</h2><p class="mode-tag">Rotation + tempo</p><p>Rotate and place falling shapes to complete lines. The board punishes holes because later pieces may not be able to reach them cleanly.</p></article>
    <article><span>05</span><h2 id="block-puzzle">Block Puzzle</h2><p class="mode-tag">Packing + future space</p><p>Place available shapes to complete rows or columns. Unlike a falling-block game, the pressure comes from the set of shapes you are offered and how much usable room remains.</p></article>
    <article><span>06</span><h2 id="sos">SOS</h2><p class="mode-tag">Pattern creation + denial</p><p>Place S or O to form SOS horizontally, vertically or diagonally while preventing the opponent from creating the same pattern.</p></article>
  </section>

  <section>
    <h2 id="choose-a-mode">Which mode should you play?</h2>
    <div class="article-table-wrap">
      <table>
        <thead><tr><th>If you want…</th><th>Start with…</th><th>Main skill</th></tr></thead>
        <tbody>
          <tr><td>A calm number puzzle</td><td>2048</td><td>Planning merges and preserving space</td></tr>
          <tr><td>A short opponent puzzle</td><td>Tic Tac Toe</td><td>Threat recognition</td></tr>
          <tr><td>Placement pressure</td><td>Dice Down</td><td>Local scoring vs future board shape</td></tr>
          <tr><td>Faster spatial play</td><td>Falling Blocks</td><td>Rotation and line clearing</td></tr>
          <tr><td>Untimed spatial planning</td><td>Block Puzzle</td><td>Packing and open-space management</td></tr>
          <tr><td>A compact pattern duel</td><td>SOS</td><td>Creating and denying patterns</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="article-mode-tips" data-ui="mode-tips">
    <h2 id="puzzle-club-tips">One high-value habit for every mode</h2>
    <div><strong>2048</strong><p>Choose a corner strategy and avoid moving your highest tile away from its stable edge without a reason.</p></div>
    <div><strong>Tic Tac Toe</strong><p>Before making an attacking move, check whether the opponent already has a one-move win.</p></div>
    <div><strong>Dice Down</strong><p>Value placements that interact with more than one possible future line.</p></div>
    <div><strong>Falling Blocks</strong><p>A flat surface is easier to manage than a skyline full of deep wells and isolated holes.</p></div>
    <div><strong>Block Puzzle</strong><p>Do not reserve a huge empty area for one imagined shape while the rest of the board becomes unusable.</p></div>
    <div><strong>SOS</strong><p>A single letter can belong to several future SOS lines; evaluate horizontal, vertical and diagonal consequences together.</p></div>
  </section>

  <section>
    <h2 id="puzzle-space-is-currency">Across puzzle games, space is a form of currency</h2>
    <p>2048, falling blocks and Block Puzzle look different, but they share a principle: a board with more useful open space gives you more future options. Filling space is easy. Filling it in a way that still accepts the next piece is the real challenge.</p>
    <p>This is a useful mindset for beginners. Do not judge a move only by what disappears or scores immediately. Judge the shape of the board left behind.</p>
  </section>

  <section class="article-session-guide" data-ui="session-guide">
    <h2 id="offline-puzzle-sessions">Why a collection works well offline</h2>
    <p>Different puzzle loops fit different lengths of time. Tic Tac Toe or SOS can fill a very short break. A 2048 attempt can continue as long as the board survives. Block-placement modes offer a clean stop-and-restart rhythm. That variety is useful when the app is being played on a commute, while travelling or anywhere a network connection is unavailable.</p>
  </section>

  <aside class="article-note">
    <strong>Product-description caution</strong>
    <p>The Google Play description has historically mentioned future additions to the collection. This article only treats the six highlighted modes that are explicitly documented and avoids promising unverified future mode counts.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "What games are in Puzzle Club Offline?",
        "answer": "The current FunFuse listing highlights 2048, Tic Tac Toe, Dice Down, a falling-block mode, Block Puzzle and SOS."
      },
      {
        "question": "Can Puzzle Club be played offline?",
        "answer": "The product is presented by FunFuse as an offline-focused puzzle collection."
      },
      {
        "question": "What is the main strategy in 2048?",
        "answer": "Preserve open space, plan merges and keep your highest-value tiles organized rather than scattering them across the board."
      },
      {
        "question": "What is SOS?",
        "answer": "SOS is a pattern game where players place S or O and try to form the sequence SOS horizontally, vertically or diagonally."
      },
      {
        "question": "Is Puzzle Club one game or a collection?",
        "answer": "It is a collection of multiple puzzle modes with different rules and types of strategic thinking."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=games.funfuse.puzzletwist",
        "kind": "official-product"
      }
    ],
    "editorialNote": "Do not repeat the Play listing's unverified promise about more than 30 future games. Limit factual mode claims to the six documented modes."
  }),
  definePost({
    "slug": "lucky-9-card-game-rules",
    "canonicalPath": "/blogs/lucky-9-card-game-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Lucky 9 Card Game Rules: Card Values, Hand Math and the Race to Nine",
    "eyebrow": "Filipino Card Game Guide",
    "excerpt": "Lucky 9 is easy to calculate once you understand one rule: only the final digit of the total matters. Learn the values, examples and round flow.",
    "seo": {
      "title": "Lucky 9 Card Game Rules | How to Play Lucky 9",
      "description": "Learn Lucky 9 rules, two-card hand values, Ace and face-card scoring, last-digit math and how to compare hands closest to nine.",
      "primaryKeyword": "Lucky 9 card game rules",
      "secondaryKeywords": [
        "how to play Lucky 9",
        "Lucky 9 card values",
        "9 points card game",
        "Lucky 9 offline"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games"
    ],
    "relatedGameSlug": "lucky-9-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "lucky-9-offline",
      "preferredSlot": "cover",
      "alt": "Lucky 9 Offline Game key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--lucky-nine" data-article-layout="lucky-nine-numberline">
  <section class="article-lead">
    <p>Lucky 9 compresses a card hand into one digit. Two cards are dealt, their values are added, and if the result has two digits you keep only the last one. The best possible value is nine.</p>
    <p>That simple rule makes the game quick to learn. The easiest way to remember it is to stop thinking in totals above nine: 15 is not “fifteen” for the final comparison — it is five.</p>
  </section>

  <section class="article-nine-display" data-ui="number-display">
    <span class="article-label">Target value</span>
    <strong>9</strong>
    <p>The closer your final one-digit hand value is to nine, the stronger the result.</p>
  </section>

  <section>
    <h2 id="lucky-9-card-values">Lucky 9 card values</h2>
    <div class="article-value-cards" data-ui="value-cards">
      <div><strong>A</strong><span>1 point</span></div>
      <div><strong>2–9</strong><span>Face value</span></div>
      <div><strong>10</strong><span>0 points</span></div>
      <div><strong>J Q K</strong><span>0 points</span></div>
    </div>
    <p>This is why a face card is not automatically “high” in Lucky 9. A King contributes zero to the hand total, while a Nine contributes the perfect single-card value.</p>
  </section>

  <section class="article-math-examples" data-ui="math-examples">
    <h2 id="lucky-9-last-digit">The last-digit rule</h2>
    <article><span>8 + A</span><strong>9</strong><p>Ace counts as 1, giving the ideal total.</p></article>
    <article><span>7 + 8</span><strong>5</strong><p>7 + 8 = 15. Keep the last digit: 5.</p></article>
    <article><span>K + 9</span><strong>9</strong><p>King counts as 0, so the hand remains 9.</p></article>
    <article><span>6 + 6</span><strong>2</strong><p>12 becomes 2 for the final hand value.</p></article>
  </section>

  <section>
    <h2 id="lucky-9-round-flow">A basic Lucky 9 round</h2>
    <ol class="article-steps">
      <li>Deal two cards to the participating hands.</li>
      <li>Convert each card to its Lucky 9 value.</li>
      <li>Add the two values.</li>
      <li>If the total is 10 or higher, keep only the final digit.</li>
      <li>Compare the resulting one-digit values.</li>
      <li>The value closest to nine wins under the basic comparison described by FunFuse.</li>
    </ol>
  </section>

  <section class="article-concept-band" data-ui="concept-band">
    <h2 id="lucky-9-why-zero-matters">Why zero-value cards are interesting</h2>
    <p>Ten and face cards act like a zero in the arithmetic. That can preserve a strong first card: a Nine paired with a Queen remains nine. But a zero-value card cannot rescue a weak first value on its own.</p>
    <p>The game therefore feels different from poker or trick-taking games where face cards are naturally strong. Lucky 9 asks you to relearn what “high card” means.</p>
  </section>

  <section>
    <h2 id="lucky-9-strategy">Is Lucky 9 a strategy game?</h2>
    <p>The core two-card comparison is deliberately simple and chance plays a large role. Strategy depends on the exact variant and what choices the game gives the player beyond the initial deal. A good guide should not manufacture deep tactics where the rules do not provide them.</p>
    <p>What players can master immediately is <strong>fast hand recognition</strong>: know the values without recalculating them slowly, understand the last-digit conversion, and avoid importing rules from unrelated games that happen to use similar cards.</p>
  </section>

  <aside class="article-callout article-callout--number">
    <strong>Fast mental shortcut</strong>
    <p>Add the values modulo ten. In everyday terms: add the cards, then throw away the tens digit.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "What is the best hand value in Lucky 9?",
        "answer": "Nine is the best possible final value."
      },
      {
        "question": "How much is an Ace worth in Lucky 9?",
        "answer": "An Ace counts as 1."
      },
      {
        "question": "How much are Kings, Queens and Jacks worth?",
        "answer": "Face cards count as 0 in the basic Lucky 9 rules described by FunFuse."
      },
      {
        "question": "What happens if the cards total more than 9?",
        "answer": "Only the last digit is kept. For example, a total of 15 becomes a hand value of 5."
      },
      {
        "question": "How many cards are dealt in Lucky 9?",
        "answer": "The basic FunFuse explanation begins each hand with two cards."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.luckynineclub",
        "kind": "official-product"
      }
    ],
    "editorialNote": "Keep this guide mathematically clear and avoid implying real-money betting. FunFuse positions the app as an offline entertainment game."
  }),
  definePost({
    "slug": "how-to-play-pusoy",
    "canonicalPath": "/blogs/how-to-play-pusoy/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "How to Play Pusoy: Arrange 13 Cards Into Three Winning Hands",
    "eyebrow": "Filipino Chinese Poker Guide",
    "excerpt": "Learn Pusoy as a 13-card arrangement puzzle: build a 3-card front, 5-card middle and 5-card back while keeping the three hands in legal strength order.",
    "seo": {
      "title": "How to Play Pusoy | Rules, Hand Order & Strategy",
      "description": "Learn Pusoy rules, the 13-card 3-5-5 arrangement, legal hand order, poker rankings and practical strategy for Filipino Chinese Poker.",
      "primaryKeyword": "how to play Pusoy",
      "secondaryKeywords": [
        "Pusoy rules",
        "Filipino Chinese Poker",
        "Pusoy hand ranking",
        "Pusoy strategy",
        "Pusoy 13 cards"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "pusoy-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "pusoy-offline",
      "preferredSlot": "cover",
      "alt": "Pusoy Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--pusoy" data-article-layout="pusoy-three-hands">
  <section class="article-lead">
    <p>Pusoy gives you all 13 cards at once and asks you to solve one problem: how can this single hand become three separate poker hands without breaking the required strength order?</p>
    <p>That arrangement stage is the game. Once everyone locks their cards, the front, middle and back positions are compared against the same positions held by the other players.</p>
  </section>

  <section class="article-three-hand-stack" data-ui="three-hand-stack">
    <article class="hand hand--front"><span>Front</span><strong>3 cards</strong><p>Must be the weakest of your three hands.</p></article>
    <article class="hand hand--middle"><span>Middle</span><strong>5 cards</strong><p>Stronger than the front, weaker than the back.</p></article>
    <article class="hand hand--back"><span>Back</span><strong>5 cards</strong><p>Must be your strongest hand.</p></article>
  </section>

  <section>
    <h2 id="pusoy-objective">The objective</h2>
    <p>Build a legal three-hand arrangement and win as many position-by-position comparisons as possible. In many Chinese Poker scoring systems, beating an opponent in two of the three positions is the basic route to winning that head-to-head comparison, with bonuses or royalties varying by ruleset.</p>
    <p>FunFuse's offline version emphasizes the arrangement puzzle, AI opponents and automatic scoring, so beginners can focus on building legal hands without doing every point calculation manually.</p>
  </section>

  <section>
    <h2 id="pusoy-hand-order">Why hand order matters</h2>
    <aside class="article-equation" data-ui="equation"><strong>Back &gt; Middle &gt; Front</strong></aside>
    <p>A common beginner mistake is to create the strongest possible middle hand and only afterward discover that the back hand is weaker. That creates an invalid or “fouled” arrangement under standard Chinese Poker rules.</p>
    <p>The best workflow starts from all 13 cards, not from one attractive combination. Identify premium made hands, then test how using those cards affects the other two rows.</p>
  </section>

  <section>
    <h2 id="pusoy-poker-rankings">Poker rankings in the five-card hands</h2>
    <div class="article-ranking-line" data-ui="ranking-line">
      <span>Straight Flush</span><i>›</i><span>Four of a Kind</span><i>›</i><span>Full House</span><i>›</i><span>Flush</span><i>›</i><span>Straight</span><i>›</i><span>Three of a Kind</span><i>›</i><span>Two Pair</span><i>›</i><span>Pair</span><i>›</i><span>High Card</span>
    </div>
    <p>The three-card front is different because five-card-only patterns such as straights and flushes are not evaluated in the same way. High-card, pair and three-of-a-kind strength are the main concepts to understand there, subject to the selected Pusoy rules.</p>
  </section>

  <section class="article-arrangement-workflow" data-ui="workflow">
    <h2 id="pusoy-arrangement-process">A better way to arrange 13 cards</h2>
    <ol>
      <li><strong>Scan for locked combinations.</strong> Do you already have a full house, flush, straight or four of a kind?</li>
      <li><strong>Identify competing uses.</strong> Can the same cards support two different strong structures?</li>
      <li><strong>Protect the back.</strong> Make sure the final five-card back hand remains strongest.</li>
      <li><strong>Build a viable middle.</strong> Do not leave the middle so weak that it loses automatically.</li>
      <li><strong>Check the front.</strong> A pair in front can be powerful if it does not force an illegal middle/back order.</li>
      <li><strong>Validate before locking.</strong> Read all three rows one more time from weakest to strongest.</li>
    </ol>
  </section>

  <section>
    <h2 id="pusoy-balance">Balance beats one spectacular hand</h2>
    <p>Suppose your 13 cards can make a very strong back hand only by leaving both the middle and front nearly empty of structure. Another arrangement might weaken the back slightly but create a solid middle pair and a useful front pair. Pusoy rewards the total arrangement, so the second plan may produce more winning comparisons.</p>
    <p>This is the central strategic question: <strong>where does each card create the most value across three battles?</strong></p>
  </section>

  <section class="article-error-cards" data-ui="error-cards">
    <h2 id="pusoy-common-mistakes">Common Pusoy mistakes</h2>
    <div><strong>Fouling the hand</strong><p>Middle accidentally becomes stronger than back, or front becomes too strong for the middle.</p></div>
    <div><strong>Overfeeding the back</strong><p>One premium hand wins, but the other two rows become easy losses.</p></div>
    <div><strong>Ignoring the front</strong><p>The three-card row looks small, but one pair can swing many comparisons.</p></div>
    <div><strong>Locking too early</strong><p>Moving cards into neat groups before evaluating alternatives can hide a better global arrangement.</p></div>
  </section>

  <blockquote class="article-pullquote">Thirteen cards are not one hand in Pusoy. They are a budget you distribute across three hands.</blockquote>
</div>`,
    "faq": [
      {
        "question": "How many cards do you get in Pusoy?",
        "answer": "Each player receives 13 cards and arranges them into three hands."
      },
      {
        "question": "How are Pusoy cards arranged?",
        "answer": "The 13 cards are divided into a 3-card front hand, a 5-card middle hand and a 5-card back hand."
      },
      {
        "question": "Which Pusoy hand must be strongest?",
        "answer": "The back hand must be strongest, the middle must be weaker than the back, and the front must be weakest."
      },
      {
        "question": "Is Pusoy the same as Pusoy Dos?",
        "answer": "No. Pusoy is a Chinese Poker-style arrangement game. Pusoy Dos is a climbing and shedding game related to Big Two."
      },
      {
        "question": "What is a fouled hand in Pusoy?",
        "answer": "A fouled hand is an illegal arrangement where the required strength order between back, middle and front is broken."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.pusoy",
        "kind": "official-product"
      },
      {
        "label": "Pagat Chinese Poker / Pusoy rules",
        "url": "https://www.pagat.com/partition/pusoy.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Use ‘Pusoy’ for the Filipino Chinese Poker arrangement game and clearly distinguish it from Pusoy Dos."
  }),
  definePost({
    "slug": "pusoy-dos-rules",
    "canonicalPath": "/blogs/pusoy-dos-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Pusoy Dos Rules: How to Climb, Control the Table and Empty Your Hand",
    "eyebrow": "Filipino Climbing Game Guide",
    "excerpt": "Learn Pusoy Dos from the 3♣ opening to the final card: singles, pairs, triples, five-card combinations, rank order and table-control strategy.",
    "seo": {
      "title": "Pusoy Dos Rules | How to Play Filipino Big Two",
      "description": "Learn Pusoy Dos rules, card ranking, the 3 of Clubs opening, singles, pairs, triples, five-card hands and strategy for emptying your hand first.",
      "primaryKeyword": "Pusoy Dos rules",
      "secondaryKeywords": [
        "how to play Pusoy Dos",
        "Filipino Big Two",
        "Pusoy Dos card ranking",
        "Pusoy Dos combinations"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "pusoy-dos-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "pusoy-dos-offline",
      "preferredSlot": "cover",
      "alt": "Pusoy Dos Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--pusoy-dos" data-article-layout="pusoy-dos-climb">
  <section class="article-lead">
    <p>Pusoy Dos is a race where higher cards buy control. The rank order climbs from 3 up to 2, making the card that is low in many games the strongest rank here. Players shed singles and combinations, and whoever empties the hand first wins.</p>
    <p>The challenge is not merely having strong cards. It is arranging your cards into an exit plan: which combinations will you use, when will you spend your Twos, and what shape do you want the table to be when your final cards arrive?</p>
  </section>

  <section class="article-rank-ladder" data-ui="rank-ladder">
    <span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>J</span><span>Q</span><span>K</span><span>A</span><strong>2</strong>
  </section>

  <section>
    <h2 id="pusoy-dos-setup">Setup and first play</h2>
    <p>Pusoy Dos is commonly played by three or four players with a standard 52-card deck. In a four-player game, each person receives 13 cards. The player holding the 3 of Clubs traditionally opens the first sequence and must include that card in the opening play.</p>
    <p>After that opening, players either beat the current play with a stronger legal combination of the required type or pass.</p>
  </section>

  <section class="article-combo-cards" data-ui="combo-cards">
    <h2 id="pusoy-dos-combinations">The four basic shapes</h2>
    <article><strong>1</strong><h3>Single</h3><p>One card. The next single must outrank it under the active ranking rules.</p></article>
    <article><strong>2</strong><h3>Pair</h3><p>Two cards of the same rank. A higher pair beats a lower pair.</p></article>
    <article><strong>3</strong><h3>Triple</h3><p>Three cards of one rank.</p></article>
    <article><strong>5</strong><h3>Five-card hand</h3><p>Structured combinations such as straights, flushes, full houses, four of a kind plus a kicker, and straight flushes under common rules.</p></article>
  </section>

  <section>
    <h2 id="pusoy-dos-five-card-hands">Five-card combination order</h2>
    <div class="article-ranking-stack article-ranking-stack--compact">
      <div><span>1</span><strong>Straight Flush</strong></div>
      <div><span>2</span><strong>Four of a Kind combination</strong></div>
      <div><span>3</span><strong>Full House</strong></div>
      <div><span>4</span><strong>Flush</strong></div>
      <div><span>5</span><strong>Straight</strong></div>
    </div>
    <p>House and regional rules can affect exactly how five-card hands and suits break ties. The safe principle is to learn the combination hierarchy, then check the active game's suit order before relying on a same-rank tie.</p>
  </section>

  <section class="article-variant-note" data-ui="variant-note">
    <h2 id="pusoy-dos-suit-order">A note about suit order</h2>
    <p>Suit hierarchy is one of the details that varies across Big Two traditions and digital implementations. A commonly documented Philippine Pusoy Dos order is Diamonds high, followed by Hearts, Spades and Clubs; some apps and tables use a different order. Because that difference can change which same-rank card wins, the selected in-game rules should be treated as final for play.</p>
  </section>

  <section>
    <h2 id="pusoy-dos-control">What “control of the table” means</h2>
    <p>When all other active players pass, the last player who successfully played gains control and can open a new legal combination. That is strategically powerful because you choose the shape: a single, pair, triple or five-card hand.</p>
    <p>A player holding an awkward pair may deliberately spend a strong single to regain control, then lead the pair. This is why powerful cards are not only “winners”; they are tools for changing what kind of cards the table is asking for.</p>
  </section>

  <section class="article-endgame-plan" data-ui="endgame-plan">
    <h2 id="pusoy-dos-endgame">Plan the last five cards before you get there</h2>
    <div><span>Bad ending</span><p>You keep one low single after spending all your control cards. Everyone can beat it and you never regain the lead.</p></div>
    <div><span>Better ending</span><p>Your final cards form a pair plus a strong single, and you still have a control card that can reopen the table in the shape you need.</p></div>
  </section>

  <section>
    <h2 id="pusoy-dos-strategy">Practical Pusoy Dos strategy</h2>
    <ul class="article-strategy-list">
      <li><strong>Inventory your shapes immediately.</strong> Count singles, pairs, triples and potential five-card groups before the first play.</li>
      <li><strong>Protect exit combinations.</strong> Breaking a pair early may leave two weak singles later.</li>
      <li><strong>Do not burn every Two.</strong> A Two used now cannot recover control near the end.</li>
      <li><strong>Count who has passed.</strong> Passing patterns reveal which players may be unable or unwilling to contest a certain shape.</li>
      <li><strong>Watch hand size.</strong> A player with two cards left has a very different threat profile from a player holding nine.</li>
    </ul>
  </section>

  <aside class="article-callout"><strong>Winning mindset</strong><p>Do not ask only, “Can I beat this play?” Ask, “If I beat it, what can I lead next?”</p></aside>
</div>`,
    "faq": [
      {
        "question": "What is the highest rank in Pusoy Dos?",
        "answer": "The rank 2 is highest, while 3 is the lowest rank in the standard climbing order."
      },
      {
        "question": "Who starts Pusoy Dos?",
        "answer": "In a commonly documented Philippine form, the player holding the 3 of Clubs opens the first sequence and includes it in the opening play."
      },
      {
        "question": "How do you win Pusoy Dos?",
        "answer": "Be the first player to play all cards from your hand."
      },
      {
        "question": "Can you play a pair on a single card?",
        "answer": "Normally no. Players must answer with a legal play of the same required type and size, unless a specific variant says otherwise."
      },
      {
        "question": "Is suit order always the same in Pusoy Dos?",
        "answer": "No. Suit hierarchy varies between Big Two traditions and implementations, so check the active rules for tie-breaking."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.pusoydos",
        "kind": "official-product"
      },
      {
        "label": "Pagat Big Two / Pusoy Dos rules",
        "url": "https://www.pagat.com/climbing/bigtwo.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Explicitly treat suit order as variant-sensitive because the current Play listing and established Philippine rules references differ."
  }),
  definePost({
    "slug": "capsa-susun-rules",
    "canonicalPath": "/blogs/capsa-susun-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Capsa Susun Rules: Build a Legal 13-Card Chinese Poker Layout",
    "eyebrow": "Indonesian Card Game Guide",
    "excerpt": "Learn Capsa Susun: split 13 cards into top, middle and bottom hands, keep the strength order legal and balance all three rows instead of overbuilding one.",
    "seo": {
      "title": "Capsa Susun Rules | How to Arrange 13 Cards",
      "description": "Learn Capsa Susun rules, the 3-5-5 Chinese Poker layout, top-middle-bottom hand order, poker rankings and practical arrangement strategy.",
      "primaryKeyword": "Capsa Susun rules",
      "secondaryKeywords": [
        "how to play Capsa Susun",
        "Capsa Susun 13 cards",
        "Chinese Poker Indonesia",
        "Capsa Susun strategy"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "capsa-susun-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "capsa-susun-offline",
      "preferredSlot": "cover",
      "alt": "Capsa Susun Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--capsa" data-article-layout="capsa-susun-stack">
  <section class="article-lead">
    <p>Capsa Susun is the Indonesian branch of the Chinese Poker family: 13 cards arrive together, and you arrange them into three hands before comparison. The bottom must be strongest, the middle comes next, and the three-card top must be weakest.</p>
    <p>The rules are easy to state. The difficulty is deciding where each useful card creates the most total value.</p>
  </section>

  <figure class="article-stack-figure" data-ui="stack-figure">
    <div class="stack-row stack-row--top"><span>Top</span><strong>3 cards</strong><em>Weakest</em></div>
    <div class="stack-row stack-row--middle"><span>Middle</span><strong>5 cards</strong><em>Stronger</em></div>
    <div class="stack-row stack-row--bottom"><span>Bottom</span><strong>5 cards</strong><em>Strongest</em></div>
    <figcaption>Legal strength flows from top to bottom.</figcaption>
  </figure>

  <section>
    <h2 id="capsa-susun-objective">The objective</h2>
    <p>Create a legal layout and win positional comparisons against the other players. The top hand is compared with other top hands, middle with middle, and bottom with bottom. Exact point systems and royalties differ, so this guide focuses on the stable arrangement logic.</p>
  </section>

  <section>
    <h2 id="capsa-susun-poker-rankings">Five-card ranking foundation</h2>
    <p>The middle and bottom use familiar poker categories. From strong to weak, think straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair and high card. The top has only three cards, so its useful categories are more limited.</p>
    <aside class="article-equation"><strong>Bottom must beat Middle; Middle must beat Top.</strong></aside>
  </section>

  <section class="article-layout-lab" data-ui="layout-lab">
    <h2 id="capsa-susun-layout-process">A six-pass arrangement process</h2>
    <div><span>Pass 1</span><h3>Find premium structures</h3><p>Mark any made flushes, straights, full houses, four of a kind or strong pairs.</p></div>
    <div><span>Pass 2</span><h3>Test alternative combinations</h3><p>A card inside one straight may also complete a flush or protect two-pair elsewhere.</p></div>
    <div><span>Pass 3</span><h3>Reserve enough for bottom</h3><p>The bottom cannot become weaker than the middle.</p></div>
    <div><span>Pass 4</span><h3>Give the middle real fighting power</h3><p>Do not automatically sacrifice it just to maximize the bottom.</p></div>
    <div><span>Pass 5</span><h3>Improve the top safely</h3><p>A pair on top can be valuable when the middle still remains stronger.</p></div>
    <div><span>Pass 6</span><h3>Validate the order</h3><p>Read all three hands as if an opponent were checking them.</p></div>
  </section>

  <section>
    <h2 id="capsa-susun-balance">Why balance matters</h2>
    <p>Imagine two layouts. Layout A creates an elite bottom but leaves high-card hands in both remaining positions. Layout B downgrades the bottom slightly but creates a pair in the middle and another pair on top. Depending on opponents and scoring, Layout B can win more individual comparisons.</p>
    <p>That is why Capsa Susun feels more like resource allocation than ordinary poker. You are not searching for one best hand. You are deciding how to distribute strength.</p>
  </section>

  <section class="article-foul-panel" data-ui="foul-panel">
    <h2 id="capsa-susun-foul">The mistake to prevent first: a fouled layout</h2>
    <p>A beautiful arrangement is useless if the rows are in the wrong order. Before confirming, compare the category and tie-break strength of bottom versus middle, then middle versus top.</p>
    <ul>
      <li>Do not put a stronger five-card hand in the middle than the bottom.</li>
      <li>Do not make the top effectively stronger than the middle.</li>
      <li>Do not assume the interface will always rescue a mistaken manual arrangement; learn to recognize legality yourself.</li>
    </ul>
  </section>

  <section>
    <h2 id="capsa-vs-pusoy">Capsa Susun and Pusoy: related, not different objectives</h2>
    <p>Both belong to the Chinese Poker family and share the core 13-card, three-hand structure. Names, local scoring and conventions can differ between Indonesian Capsa Susun and Filipino Pusoy, but a player who understands legal hand order and balanced arrangement has already learned the central skill of both.</p>
  </section>

  <aside class="article-callout"><strong>Arrangement rule</strong><p>Before you improve any one row, ask what that change forces the other two rows to become.</p></aside>
</div>`,
    "faq": [
      {
        "question": "How many cards do you get in Capsa Susun?",
        "answer": "Each player receives 13 cards."
      },
      {
        "question": "How do you arrange Capsa Susun?",
        "answer": "Arrange the cards into a 3-card top, 5-card middle and 5-card bottom hand."
      },
      {
        "question": "Which hand is strongest in Capsa Susun?",
        "answer": "The bottom hand must be strongest, the middle weaker than the bottom, and the top weakest."
      },
      {
        "question": "Is Capsa Susun Chinese Poker?",
        "answer": "Yes. Capsa Susun is an Indonesian form of the Chinese Poker family."
      },
      {
        "question": "What is a fouled Capsa Susun hand?",
        "answer": "It is an illegal arrangement that violates the required top-middle-bottom strength order."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.capsasusunclub",
        "kind": "official-product"
      },
      {
        "label": "Pagat Chinese Poker reference",
        "url": "https://www.pagat.com/partition/pusoy.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Keep scoring and royalties variant-aware; the evergreen SEO value is in arrangement rules and strategy."
  }),
  definePost({
    "slug": "tien-len-rules",
    "canonicalPath": "/blogs/tien-len-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Tiến Lên Rules: How Vietnam's Climbing Card Game Works",
    "eyebrow": "Vietnamese Card Game Guide",
    "excerpt": "Learn Tiến Lên: 13-card hands, the unusual high rank of 2, singles and combinations, passing, control of the pile and endgame planning.",
    "seo": {
      "title": "Tiến Lên Rules | How to Play Vietnamese Card Game",
      "description": "Learn Tiến Lên rules, card and suit ranking, the opening play, combinations, passing, pile control and strategy for shedding all 13 cards.",
      "primaryKeyword": "Tiến Lên rules",
      "secondaryKeywords": [
        "how to play Tien Len",
        "Vietnamese card game",
        "Tien Len card ranking",
        "Tien Len strategy"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "tien-len-club",
    "hero": {
      "kind": "game-art",
      "gameSlug": "tien-len-club",
      "preferredSlot": "cover",
      "alt": "Tiến Lên Club Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--tien-len" data-article-layout="tien-len-ladder">
  <section class="article-lead">
    <p>Tiến Lên is a Vietnamese climbing game built around momentum. A player opens a single card or combination, and everyone else must beat that same kind of play or pass. When the table can no longer answer, the last successful player gains control and chooses a fresh shape.</p>
    <p>The first player to shed all 13 cards wins. The 2 is the highest rank, which makes endgame planning feel very different from games where Ace sits permanently at the top.</p>
  </section>

  <section class="article-rank-ladder article-rank-ladder--vietnam" data-ui="rank-ladder">
    <span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>J</span><span>Q</span><span>K</span><span>A</span><strong>2</strong>
  </section>

  <section>
    <h2 id="tien-len-setup">Standard setup</h2>
    <p>Four players is the classic size, with a standard 52-card deck and 13 cards per player. Common southern Vietnamese rules rank suits from Hearts high through Diamonds, Clubs and Spades when cards of the same rank need a tie-break.</p>
    <p>On the first deal, a common rule gives the opening to the player with the 3 of Spades, the lowest card, and requires the first play to include it. Later deals can begin with the previous winner depending on the ruleset.</p>
  </section>

  <section>
    <h2 id="tien-len-legal-plays">What can you play?</h2>
    <div class="article-combo-matrix" data-ui="combo-matrix">
      <div><strong>Single</strong><p>One card, answered by a stronger single.</p></div>
      <div><strong>Pair</strong><p>Two equal ranks, answered by a stronger pair.</p></div>
      <div><strong>Triple</strong><p>Three equal ranks, answered by a stronger triple.</p></div>
      <div><strong>Sequence</strong><p>Consecutive ranks using the number of cards allowed by the selected variant.</p></div>
      <div><strong>Special combinations</strong><p>Some rules support four-of-a-kind or sequences of pairs that can defeat otherwise powerful cards such as 2s.</p></div>
    </div>
  </section>

  <section class="article-control-loop" data-ui="control-loop">
    <h2 id="tien-len-control">The control loop</h2>
    <div><span>Lead</span><p>Choose a legal play.</p></div>
    <div><span>Climb</span><p>Opponents answer with stronger plays of the required type.</p></div>
    <div><span>Pass</span><p>Players who cannot or choose not to beat the play step out of that sequence under common rules.</p></div>
    <div><span>Reset</span><p>When nobody can answer, the last successful player clears the pile and opens a new shape.</p></div>
  </section>

  <section>
    <h2 id="tien-len-two">Why the 2 is powerful — and dangerous to waste</h2>
    <p>A 2 can dominate ordinary singles, but its value is not only the trick it wins. A high control card can give you the right to choose the next play. If your hand contains a difficult pair, winning control with a 2 may let you lead that pair instead of waiting for someone else to choose the shape.</p>
    <p>Some Tiến Lên variants also contain “bomb” or chopping combinations that can beat 2s. Because those details vary, players should check the active rules rather than assuming a 2 is absolutely unbeatable.</p>
  </section>

  <section class="article-hand-shape" data-ui="hand-shape">
    <h2 id="tien-len-plan-hand">Plan by hand shape, not by card strength</h2>
    <p>A hand with many high singles can still be awkward if opponents keep leading pairs and sequences. Before the game develops, count what you actually possess:</p>
    <ul>
      <li>How many isolated singles?</li>
      <li>How many pairs and triples?</li>
      <li>Can several cards form a long sequence?</li>
      <li>Which card or combination can regain control?</li>
      <li>What do you want your final play to be?</li>
    </ul>
  </section>

  <section>
    <h2 id="tien-len-endgame">The endgame starts earlier than you think</h2>
    <p>When an opponent reaches three or four cards, hand size becomes information. If they have repeatedly passed on pairs, they may be holding singles. If they have preserved cards through several single-card sequences, they may be protecting a combination.</p>
    <p>Your own last cards should be planned the same way. Avoid breaking a pair if doing so strands one low single that you cannot lead safely later.</p>
  </section>

  <aside class="article-callout"><strong>Table-control rule</strong><p>The strongest play is often the one that lets you choose the next type of play.</p></aside>
</div>`,
    "faq": [
      {
        "question": "What is the highest card in Tiến Lên?",
        "answer": "The rank 2 is highest in the standard rank order."
      },
      {
        "question": "How many cards does each player get in Tiến Lên?",
        "answer": "In the standard four-player game, each player receives 13 cards."
      },
      {
        "question": "Who starts Tiến Lên?",
        "answer": "A common first-deal rule has the holder of the 3 of Spades start with a play that includes that card. Later starting rules can vary."
      },
      {
        "question": "Can you pass in Tiến Lên?",
        "answer": "Yes. Players can pass when they cannot or do not want to beat the current play; common rules keep a player out until the pile resets."
      },
      {
        "question": "Can anything beat a 2 in Tiến Lên?",
        "answer": "Some variants allow special combinations to beat or 'chop' 2s, so the exact answer depends on the ruleset being used."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.tienlen",
        "kind": "official-product"
      },
      {
        "label": "Pagat Tiến Lên rules",
        "url": "https://www.pagat.com/climbing/thirteen.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Keep chopping/bomb rules variant-aware. Use diacritics in the title and body but include 'Tien Len' in secondary SEO terms."
  }),
  definePost({
    "slug": "okey-rules",
    "canonicalPath": "/blogs/okey-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Okey Rules: Tiles, Jokers, Runs, Sets and How to Finish",
    "eyebrow": "Turkish Tile Game Guide",
    "excerpt": "Learn traditional Okey: 106 tiles, the indicator-defined joker, 14-tile racks, runs, sets, drawing and discarding, plus the seven-pairs finish.",
    "seo": {
      "title": "Okey Rules | How to Play the Turkish Tile Game",
      "description": "Learn Okey rules, the 106-tile set, indicator and joker system, valid runs and sets, draw-discard flow and how to complete a winning rack.",
      "primaryKeyword": "Okey rules",
      "secondaryKeywords": [
        "how to play Okey",
        "Turkish tile game",
        "Okey joker",
        "Okey sets and runs",
        "Okey Club"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Board Games",
      "Strategy"
    ],
    "relatedGameSlug": "okey-club",
    "hero": {
      "kind": "game-art",
      "gameSlug": "okey-club",
      "preferredSlot": "cover",
      "alt": "Okey Club key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--okey" data-article-layout="okey-rack">
  <section class="article-lead">
    <p>Okey is a Turkish rummy-style game played with numbered tiles instead of cards. The rack slowly becomes more organized as you draw one tile, discard one tile and build groups until all 14 playable tiles fit into legal runs and sets.</p>
    <p>The detail that surprises new players is the joker system. The face-up indicator does not itself become the ordinary joker. It identifies which numbered tiles will act as the real jokers for that hand.</p>
  </section>

  <section class="article-tile-inventory" data-ui="tile-inventory">
    <div><strong>106</strong><span>tiles total</span></div>
    <div><strong>1–13</strong><span>numbers</span></div>
    <div><strong>4</strong><span>colors</span></div>
    <div><strong>2×</strong><span>each numbered tile</span></div>
    <div><strong>2</strong><span>special false-joker tiles</span></div>
  </section>

  <section>
    <h2 id="okey-indicator-and-joker">Indicator and joker: the key relationship</h2>
    <p>A tile is exposed as the indicator. The next number in the same color identifies the real joker tiles. If the indicator is a Blue 7, the Blue 8 tiles become jokers for that hand.</p>
    <p>The two special tiles often called false jokers are not universal wild cards. Their role corresponds to the actual joker value under the traditional system, which is why visually identifying “the special tile” is not enough to understand Okey.</p>
  </section>

  <section class="article-rack-builder" data-ui="rack-builder">
    <h2 id="okey-valid-groups">The two building blocks</h2>
    <article>
      <span class="tile-swatch tile-swatch--run">4 · 5 · 6</span>
      <h3>Run</h3>
      <p>At least three consecutive numbers in the same color.</p>
    </article>
    <article>
      <span class="tile-swatch tile-swatch--set">9 · 9 · 9</span>
      <h3>Set</h3>
      <p>Three or four tiles with the same number in different colors.</p>
    </article>
  </section>

  <section>
    <h2 id="okey-deal">How many tiles do players hold?</h2>
    <p>In traditional four-player Okey, one player begins with 15 tiles and the others begin with 14. The 15-tile player starts by discarding, and normal turns then follow the draw-one, discard-one rhythm.</p>
    <p>FunFuse's Okey Club listing supports two to four players, so digital setup details can adapt to the selected match while preserving the same rack-building objective.</p>
  </section>

  <section class="article-turn-loop" data-ui="turn-loop">
    <h2 id="okey-turn">One Okey turn</h2>
    <div><span>Draw</span><p>Take one legal tile from the available source.</p></div>
    <div><span>Arrange</span><p>Re-evaluate runs, sets and joker placement across the whole rack.</p></div>
    <div><span>Discard</span><p>Release one tile, keeping the working rack at the correct size.</p></div>
    <div><span>Read</span><p>Notice what opponents discard and which visible tiles are becoming scarce.</p></div>
  </section>

  <section>
    <h2 id="okey-seven-pairs">The seven-pairs hand</h2>
    <p>A traditional alternative winning pattern is seven pairs. In this context, a pair means two identical tiles — same number and same color — rather than two tiles that merely share a number.</p>
    <p>This hand develops differently from runs and sets, so if the early rack contains several true pairs, it may be worth evaluating whether the pair route is realistic before breaking them apart.</p>
  </section>

  <section class="article-okey-strategy" data-ui="strategy-rack">
    <h2 id="okey-strategy">Practical Okey strategy</h2>
    <div><h3>Keep open-ended runs</h3><p>A 6-7 can grow with a 5 or 8. A blocked edge sequence may have fewer useful draws.</p></div>
    <div><h3>Watch duplicate availability</h3><p>There are two copies of each numbered tile. Visible discards change the probability that a missing connector is still available.</p></div>
    <div><h3>Do not waste the joker</h3><p>A joker used to complete a weak group may be more valuable solving a difficult gap elsewhere.</p></div>
    <div><h3>Discard with opponents in mind</h3><p>A tile that cannot help you may still be the exact number or color another rack needs.</p></div>
  </section>

  <aside class="article-callout"><strong>The Okey rhythm</strong><p>Draw one. Rebuild the rack. Discard one. Repeat until every tile has a home.</p></aside>
</div>`,
    "faq": [
      {
        "question": "How many tiles are used in Okey?",
        "answer": "A traditional Okey set has 106 tiles: two copies of numbers 1 through 13 in four colors, plus two special false-joker tiles."
      },
      {
        "question": "How is the joker chosen in Okey?",
        "answer": "A face-up indicator tile is selected, and the next number of the same color becomes the real joker value for that hand."
      },
      {
        "question": "What is a run in Okey?",
        "answer": "A run is at least three consecutive numbers of the same color."
      },
      {
        "question": "What is a set in Okey?",
        "answer": "A set is three or four tiles of the same number in different colors."
      },
      {
        "question": "Can you win Okey with pairs?",
        "answer": "Yes. A traditional special winning hand consists of seven pairs of identical tiles."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.okey",
        "kind": "official-product"
      },
      {
        "label": "Pagat Okey rules",
        "url": "https://www.pagat.com/rummy/okey.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Use ‘false joker’ carefully: explain that the indicator determines the real joker value rather than presenting the special tiles as unrestricted wild cards."
  }),
  definePost({
    "slug": "belote-rules",
    "canonicalPath": "/blogs/belote-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Belote Rules: Trump Rankings, Scoring and Partnership Play",
    "eyebrow": "French Card Game Guide",
    "excerpt": "Learn French Belote from the 32-card deck to trump selection, trick obligations, card values and the famous Belote-Rebelote declaration.",
    "seo": {
      "title": "Belote Rules | How to Play, Score & Choose Trump",
      "description": "Learn French Belote rules: four-player teams, the 32-card deck, trump rankings, trick play, card points, Belote-Rebelote and practical strategy.",
      "primaryKeyword": "Belote rules",
      "secondaryKeywords": [
        "how to play Belote",
        "French Belote",
        "Belote scoring",
        "Belote trump ranking",
        "Belote Rebelote"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "belote-francaise",
    "hero": {
      "kind": "game-art",
      "gameSlug": "belote-francaise",
      "preferredSlot": "cover",
      "alt": "Belote Française key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--belote" data-article-layout="belote-scorecard">
  <section class="article-lead">
    <p>Belote is a French partnership trick-taking game where choosing trump changes the value of the cards themselves. A Jack that is modest outside trump becomes the most important card in the trump suit; the 9 jumps to second place. That single rule reshapes bidding, counting and partnership play.</p>
    <p>The classic game uses four players in two teams, partners sitting opposite each other, and a compact 32-card deck. There are eight tricks per hand, so every decision carries visible weight.</p>
  </section>

  <section class="article-belote-table" data-ui="team-table" aria-label="Belote table">
    <div class="seat seat--north"><strong>Team A</strong><span>Partner 1</span></div>
    <div class="seat seat--west"><strong>Team B</strong><span>Partner 1</span></div>
    <div class="seat seat--center"><span>32-card deck</span><strong>8 tricks</strong></div>
    <div class="seat seat--east"><strong>Team B</strong><span>Partner 2</span></div>
    <div class="seat seat--south"><strong>Team A</strong><span>Partner 2</span></div>
  </section>

  <section>
    <h2 id="belote-deck">The 32-card Belote deck</h2>
    <p>Belote keeps only the 7, 8, 9, 10, Jack, Queen, King and Ace from each of the four suits. All four players receive eight cards once the deal is complete.</p>
    <p>Non-trump cards use a familiar high-card order, but trump has its own ranking and scoring. Learning those two tables is the fastest way to stop making beginner mistakes.</p>
  </section>

  <section class="article-ranking-duel" data-ui="ranking-duel">
    <article>
      <span class="article-label">Trump suit</span>
      <h2 id="belote-trump-ranking">Trump ranking</h2>
      <ol>
        <li><strong>Jack</strong><span>20 points</span></li>
        <li><strong>9</strong><span>14 points</span></li>
        <li><strong>Ace</strong><span>11 points</span></li>
        <li><strong>10</strong><span>10 points</span></li>
        <li><strong>King</strong><span>4 points</span></li>
        <li><strong>Queen</strong><span>3 points</span></li>
        <li><strong>8</strong><span>0 points</span></li>
        <li><strong>7</strong><span>0 points</span></li>
      </ol>
    </article>
    <article>
      <span class="article-label">Other suits</span>
      <h2 id="belote-non-trump-ranking">Non-trump ranking</h2>
      <ol>
        <li><strong>Ace</strong><span>11 points</span></li>
        <li><strong>10</strong><span>10 points</span></li>
        <li><strong>King</strong><span>4 points</span></li>
        <li><strong>Queen</strong><span>3 points</span></li>
        <li><strong>Jack</strong><span>2 points</span></li>
        <li><strong>9</strong><span>0 points</span></li>
        <li><strong>8</strong><span>0 points</span></li>
        <li><strong>7</strong><span>0 points</span></li>
      </ol>
    </article>
  </section>

  <section>
    <h2 id="choosing-trump-in-belote">How trump is chosen</h2>
    <p>Traditional French Belote deals in stages. A card is turned face up to offer a possible trump suit. Players receive the opportunity to accept that suit. If everyone passes, another bidding round can allow a different suit to be named, depending on the ruleset. Once trump is settled, the deal is completed so each player holds eight cards.</p>
    <p>The decision is not only “do I have high cards?” Because the Jack and 9 become premium trump cards, a hand containing them can be much stronger than it first appears.</p>
  </section>

  <section class="article-obligation-map" data-ui="obligation-map">
    <h2 id="belote-trick-obligations">Belote trick obligations</h2>
    <p>Belote is more restrictive than a simple follow-suit game. The exact obligations depend on whether trump was led, whether your partner is winning, and which cards remain available.</p>
    <div>
      <span>1</span><h3>Follow the led suit when required</h3><p>If you can legally follow the suit led, you generally must do so.</p>
    </div>
    <div>
      <span>2</span><h3>Trump when void when the rules require it</h3><p>If you cannot follow the led suit, you may be required to play trump unless your partner is already master of the trick under the applicable rule.</p>
    </div>
    <div>
      <span>3</span><h3>Overtrump when possible</h3><p>When trump is being played and the rules require it, a player may have to beat the highest trump already in the trick if able.</p>
    </div>
    <p class="article-smallprint">Belote has regional and platform variations. The selected in-game rule set should be treated as final for edge-case obligations.</p>
  </section>

  <section>
    <h2 id="belote-rebelote">Belote-Rebelote</h2>
    <p>Holding the King and Queen of the trump suit creates the declaration that gives the game its name. Under traditional scoring, the pair is worth 20 points when declared correctly: “Belote” is announced with the first of the pair played and “Rebelote” with the second.</p>
    <p>This bonus matters because it is attached to a specific pair in the trump suit, not simply to any King and Queen.</p>
  </section>

  <section class="article-score-ledger" data-ui="score-ledger">
    <h2 id="belote-card-points">Where the points are</h2>
    <div class="article-big-stat"><strong>162</strong><span>ordinary trick points in a standard hand, including the last-trick bonus</span></div>
    <p>The card values total 152, and the team taking the final trick receives the traditional 10-point “dix de der” bonus, bringing the ordinary trick total to 162 before declarations.</p>
    <p>The team that chose trump is expected to justify that choice by taking enough points to make the contract. Exact score conversion, declaration handling and match targets vary between Belote forms, so a modern digital implementation should display its selected scoring settings clearly.</p>
  </section>

  <section>
    <h2 id="belote-strategy">Belote strategy for new players</h2>
    <div class="article-strategy-grid">
      <article><h3>Count trump early</h3><p>There are only eight trump cards. Knowing whether the Jack, 9 and Ace are still out changes the safety of every later trump.</p></article>
      <article><h3>Protect point cards</h3><p>A non-trump 10 is worth 10 points but can easily lose to the Ace or a trump. Do not donate it casually.</p></article>
      <article><h3>Read your partner's wins</h3><p>If partner already controls the trick, adding another premium card may waste team value.</p></article>
      <article><h3>Re-evaluate the 9</h3><p>Outside trump it is worth zero and ranks low. In trump it becomes the second-highest card and worth 14.</p></article>
    </div>
  </section>

  <aside class="article-callout article-callout--belote">
    <strong>The rule that unlocks Belote</strong>
    <p>Trump is not merely a suit that beats other suits. It has its own ranking and its own point economy.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "How many players play Belote?",
        "answer": "Classic Belote is played by four players in two partnerships."
      },
      {
        "question": "How many cards are used in Belote?",
        "answer": "Belote uses a 32-card deck containing 7 through Ace in each suit."
      },
      {
        "question": "What is the highest trump in Belote?",
        "answer": "The Jack is the highest trump, followed by the 9."
      },
      {
        "question": "What is Belote-Rebelote?",
        "answer": "It is the traditional 20-point declaration for holding the King and Queen of the trump suit and announcing them correctly when played."
      },
      {
        "question": "How many tricks are in a Belote hand?",
        "answer": "There are eight tricks because each of the four players holds eight cards."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfusegames.belote",
        "kind": "official-product"
      },
      {
        "label": "Pagat Belote rules",
        "url": "https://www.pagat.com/jass/belote.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Belote trick obligations and scoring details vary by form; preserve the stable French Belote core and defer edge cases to selected in-game settings."
  }),
  definePost({
    "slug": "mau-mau-rules",
    "canonicalPath": "/blogs/mau-mau-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Mau Mau Rules: Matching Cards, Action Rules and Smarter Hand Management",
    "eyebrow": "Shedding Game Guide",
    "excerpt": "Learn the durable core of Mau Mau: match rank or suit, draw when blocked, manage action cards and be the first player to empty your hand.",
    "seo": {
      "title": "Mau Mau Rules | How to Play the Card Game",
      "description": "Learn Mau Mau rules: matching rank or suit, drawing when blocked, common action-card ideas, hand management and strategy for shedding your last card.",
      "primaryKeyword": "Mau Mau rules",
      "secondaryKeywords": [
        "how to play Mau Mau",
        "Mau-Mau card game",
        "Mau Mau action cards",
        "Mau Mau strategy",
        "offline Mau Mau"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "mau-mau-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "mau-mau-offline",
      "preferredSlot": "cover",
      "alt": "Mau Mau Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--mau-mau" data-article-layout="mau-mau-discard-pile">
  <section class="article-lead">
    <p>Mau Mau is a shedding game: your job is to get rid of every card before the other players. The shared discard pile determines what can be played next, so the table can change direction with every card.</p>
    <p>The universal core is simple — match the active card by rank or suit, use special cards according to the chosen rules, and draw when you cannot make a legal play. The details of those special cards vary substantially by country, family and app, which makes one habit essential: <strong>check the house rules before the first turn.</strong></p>
  </section>

  <section class="article-discard-visual" data-ui="discard-visual">
    <div class="discard-card"><span>Current card</span><strong>7♥</strong></div>
    <div class="legal-paths">
      <article><strong>Same rank</strong><span>7♣ · 7♠ · 7♦</span></article>
      <article><strong>Same suit</strong><span>Any legal ♥ card</span></article>
      <article><strong>Special card</strong><span>Only if the selected rules allow it</span></article>
    </div>
  </section>

  <section>
    <h2 id="mau-mau-basic-turn">The basic Mau Mau turn</h2>
    <ol class="article-steps">
      <li><strong>Read the top discard.</strong> Its rank and suit define the normal legal response.</li>
      <li><strong>Play a matching card.</strong> Match rank or suit, or use a legal special card.</li>
      <li><strong>If you cannot play, draw.</strong> The exact number of cards and whether a drawn card may be played immediately depend on the active rules.</li>
      <li><strong>Apply action effects.</strong> Follow the table's configured effects before the next player acts.</li>
      <li><strong>Empty your hand.</strong> The first player with no cards left wins the normal shedding race.</li>
    </ol>
  </section>

  <section class="article-variant-board" data-ui="variant-board">
    <h2 id="mau-mau-action-cards">Why action-card lists disagree online</h2>
    <p>Mau Mau belongs to the wider Eights family of games. Different traditions assign different powers to Jacks, Sevens, Eights, Aces or other ranks. One table may use a Jack to choose a suit; another may give that power to a different card. Draw penalties and skip effects also vary.</p>
    <div class="article-rule-principles">
      <div><strong>Stable rule</strong><p>Matching rank or suit and shedding your hand are widely shared.</p></div>
      <div><strong>Variable rule</strong><p>Which rank causes a draw, skip, reverse or suit change.</p></div>
      <div><strong>Best practice</strong><p>Treat the app's rule screen or table agreement as authoritative for special effects.</p></div>
    </div>
  </section>

  <section>
    <h2 id="mau-mau-hand-management">Hand management matters more than one clever action</h2>
    <p>A five-card hand containing five different suits is flexible in one way but difficult in another. A hand concentrated in one suit can disappear quickly while that suit remains active, yet become stranded as soon as the table changes.</p>
    <p>Strong play balances immediate shedding with future access. Keep enough suit diversity that you are not blocked by one change, and preserve special cards when they provide a realistic route out of a bad suit.</p>
  </section>

  <section class="article-last-card-plan" data-ui="last-card-plan">
    <h2 id="mau-mau-last-card">Plan the final two cards together</h2>
    <div class="bad">
      <span>Weak finish</span>
      <p>You play the only card matching the table and leave yourself with one card in a suit you cannot easily activate.</p>
    </div>
    <div class="good">
      <span>Better finish</span>
      <p>You use a legal action or suit-matching sequence so the second-to-last card creates a realistic path for the final card.</p>
    </div>
  </section>

  <section>
    <h2 id="mau-mau-strategy">Five practical Mau Mau habits</h2>
    <ul class="article-checklist">
      <li><strong>Know the special-card rules before play.</strong> Strategy is impossible if you are guessing what a Jack or Seven does.</li>
      <li><strong>Watch suit scarcity.</strong> If an opponent repeatedly draws on Clubs, keeping the table on Clubs may be useful.</li>
      <li><strong>Do not spend every action card early.</strong> A suit-change card can be far more valuable when your hand drops to two or three cards.</li>
      <li><strong>Count opponent hand sizes.</strong> A player with one card deserves a defensive response even if another move would shed your own card faster.</li>
      <li><strong>Think about the card you leave on top.</strong> Every play creates the problem the next player gets to solve.</li>
    </ul>
  </section>

  <section class="article-offline-note" data-ui="offline-note">
    <h2 id="mau-mau-offline-practice">Learning the flow offline</h2>
    <p>Mau Mau Offline from FunFuse is built for play against computer opponents without requiring a network connection. That is useful for learning the rhythm of matching, drawing and managing hand shape. The product page can explain app features; this article should remain the rules-and-strategy resource.</p>
  </section>

  <aside class="article-callout"><strong>Mau Mau in one line</strong><p>Play what matches now without leaving yourself a hand that cannot match later.</p></aside>
</div>`,
    "faq": [
      {
        "question": "What is the goal of Mau Mau?",
        "answer": "The normal goal is to be the first player to get rid of all cards in your hand."
      },
      {
        "question": "What card can you play in Mau Mau?",
        "answer": "The durable core rule is to match the top discard by rank or suit, unless a legal special-card rule provides another option."
      },
      {
        "question": "What happens if you cannot play in Mau Mau?",
        "answer": "You draw according to the selected rules. The exact draw procedure differs between variants."
      },
      {
        "question": "What do Jacks and Sevens do in Mau Mau?",
        "answer": "Special-card effects vary between Mau Mau traditions, so there is no single universal action-card table. Check the rules used by your app or table."
      },
      {
        "question": "Is Mau Mau similar to Crazy Eights?",
        "answer": "Yes. Mau Mau belongs to the wider family of shedding games related to Eights, though local action-card rules differ."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.maumauoffline",
        "kind": "official-product"
      },
      {
        "label": "Pagat Eights-family reference",
        "url": "https://www.pagat.com/eights/",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Do not hardcode a universal Mau Mau action-card table. Regional rules vary too much; explain the stable shedding core and make variants explicit."
  }),
  definePost({
    "slug": "thousand-card-game-rules",
    "canonicalPath": "/blogs/thousand-card-game-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Thousand Card Game Rules: Bidding, Marriages and the Race to 1000",
    "eyebrow": "Eastern European Card Game Guide",
    "excerpt": "Learn Thousand (1000): the 24-card deck, 120 card points, the three-card prikup, bidding, King-Queen marriages, changing trump and contract strategy.",
    "seo": {
      "title": "Thousand Card Game Rules | How to Play 1000",
      "description": "Learn Thousand (1000) card game rules: 24-card deck, bidding, prikup, card values, marriage bonuses, trump changes and strategy to reach 1000.",
      "primaryKeyword": "Thousand card game rules",
      "secondaryKeywords": [
        "1000 card game rules",
        "Tysiacha rules",
        "Тысяча card game",
        "Thousand marriage values",
        "how to play 1000"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "thousand-offline",
    "hero": {
      "kind": "game-art",
      "gameSlug": "thousand-offline",
      "preferredSlot": "cover",
      "alt": "Thousand Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--thousand" data-article-layout="thousand-contract-ledger">
  <section class="article-lead">
    <p>Thousand — often written as 1000 and known in Eastern Europe by names such as Тысяча — is a bidding and point-trick game where every contract is measured against a small, valuable 24-card deck.</p>
    <p>The ordinary cards contain only 120 points. To make ambitious bids, players often need King-Queen marriages, which add bonuses and can establish a trump suit. That creates the central tension: you are bidding not only on the tricks already visible in your hand, but on the scoring structure you may be able to activate.</p>
  </section>

  <section class="article-thousand-inventory" data-ui="deck-inventory">
    <div><strong>3</strong><span>active players</span></div>
    <div><strong>24</strong><span>cards</span></div>
    <div><strong>7</strong><span>cards dealt to each</span></div>
    <div><strong>3</strong><span>cards in the prikup</span></div>
    <div><strong>1000</strong><span>target score</span></div>
  </section>

  <section>
    <h2 id="thousand-card-values">Card ranking and point values</h2>
    <p>Only six ranks from each suit are used. Their order is unusual if you come from ordinary high-card games because the 10 ranks above the King for trick-taking purposes.</p>
    <div class="article-table-wrap">
      <table>
        <thead><tr><th>Card</th><th>Rank order</th><th>Points</th></tr></thead>
        <tbody>
          <tr><td>Ace</td><td>Highest</td><td>11</td></tr>
          <tr><td>10</td><td>2nd</td><td>10</td></tr>
          <tr><td>King</td><td>3rd</td><td>4</td></tr>
          <tr><td>Queen</td><td>4th</td><td>3</td></tr>
          <tr><td>Jack</td><td>5th</td><td>2</td></tr>
          <tr><td>9</td><td>Lowest</td><td>0</td></tr>
        </tbody>
      </table>
    </div>
    <p>Across all four suits, those values total exactly <strong>120 ordinary card points</strong>.</p>
  </section>

  <section class="article-prikup-flow" data-ui="prikup-flow">
    <h2 id="thousand-deal-and-prikup">The deal and the prikup</h2>
    <div><span>Deal</span><p>Seven cards go to each of the three active players.</p></div>
    <div><span>Reserve</span><p>Three cards are placed face down as the central prikup.</p></div>
    <div><span>Auction</span><p>Players compete for the right to become declarer.</p></div>
    <div><span>Collect</span><p>The high bidder takes the prikup and incorporates those cards into the hand.</p></div>
    <div><span>Restore</span><p>Under a common three-player form, the declarer gives one card to each opponent, returning everyone to eight cards for trick play.</p></div>
  </section>

  <section>
    <h2 id="thousand-bidding">Bidding for the contract</h2>
    <p>In a widely documented form, bidding begins at 100 and rises in multiples of five. A bid is a promise: if you become declarer, your trick points plus valid marriage bonuses need to reach at least the amount you declared.</p>
    <p>Because the deck itself contains only 120 card points, bids well above 120 depend on marriages. That is why bidding without understanding your King-Queen holdings is one of the fastest ways to create an impossible contract.</p>
  </section>

  <section class="article-marriage-board" data-ui="marriage-board">
    <h2 id="thousand-marriages">Marriage bonuses</h2>
    <p>A marriage is a King and Queen of the same suit. In the traditional Russian/Belarusian/Ukrainian scoring documented by Pagat, the values are:</p>
    <div><span>♥ Hearts</span><strong>100</strong></div>
    <div><span>♦ Diamonds</span><strong>80</strong></div>
    <div><span>♣ Clubs</span><strong>60</strong></div>
    <div><span>♠ Spades</span><strong>40</strong></div>
    <p>When a marriage is legally declared, its suit becomes trump. A later marriage declaration can change trump again, so trump is not necessarily fixed for the whole hand.</p>
  </section>

  <section>
    <h2 id="declaring-a-marriage">When can you declare a marriage?</h2>
    <p>Under the common rules documented for Thousand, you normally declare a marriage when leading either the King or Queen of that pair after your side has obtained the right to lead through a won trick. The exact first-trick and declaration restrictions vary between local versions, so the active table rules remain important.</p>
    <p>The strategic consequence is universal: owning a marriage is not the same as having already scored it. You need the opportunity to declare it.</p>
  </section>

  <section class="article-contract-risk" data-ui="contract-risk">
    <h2 id="thousand-contract-strategy">Contract strategy</h2>
    <article><span>Count certain points</span><p>Aces and Tens account for most ordinary card value. Start with tricks you can realistically secure.</p></article>
    <article><span>Discount uncertain marriages</span><p>A marriage that you may never get to declare should not be counted as guaranteed.</p></article>
    <article><span>Value the prikup carefully</span><p>The three hidden cards can improve a hand, but bidding as if they will be perfect is gambling against probability.</p></article>
    <article><span>Track trump changes</span><p>A later marriage can rewrite which suit controls the remaining tricks.</p></article>
  </section>

  <section>
    <h2 id="thousand-barrel">What is “the barrel” in Thousand?</h2>
    <p>Many Thousand variants introduce a special endgame state near the winning target, often called the barrel, commonly around 880 points. Rules for entering, leaving and failing on the barrel differ significantly between traditions and apps.</p>
    <p>For SEO accuracy, the right approach is to teach the concept but not pretend there is one universal barrel formula. Check the scoring options used in the current game before applying a specific threshold or penalty.</p>
  </section>

  <aside class="article-source-warning">
    <strong>Variant note</strong>
    <p>Marriage values and some scoring details differ between published Thousand variants. This guide uses the traditional 100/80/60/40 marriage schedule documented by Pagat and already used in FunFuse's verified website game content.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "How many cards are used in Thousand?",
        "answer": "The common three-player game uses 24 cards: Ace, 10, King, Queen, Jack and 9 in each suit."
      },
      {
        "question": "How many points are in the Thousand deck?",
        "answer": "The ordinary card values total 120 points before marriage bonuses."
      },
      {
        "question": "What is a marriage in Thousand?",
        "answer": "A marriage is the King and Queen of the same suit. When legally declared it earns a bonus and establishes that suit as trump."
      },
      {
        "question": "What are the traditional marriage values in 1000?",
        "answer": "A widely documented schedule is Hearts 100, Diamonds 80, Clubs 60 and Spades 40."
      },
      {
        "question": "What is the prikup?",
        "answer": "The prikup is the three-card face-down reserve that the winning bidder takes after the auction."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfusegames.thousand",
        "kind": "official-product"
      },
      {
        "label": "Pagat Thousand / 1000 rules",
        "url": "https://www.pagat.com/marriage/1000.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Use the traditional Pagat 100/80/60/40 marriage values. The current Play listing contains an alternate schedule, so keep scoring explicitly variant-aware."
  }),
  definePost({
    "slug": "omi-card-game-rules",
    "canonicalPath": "/blogs/omi-card-game-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Omi Card Game Rules: Sri Lankan Trump, Tricks and Partnership Scoring",
    "eyebrow": "Sri Lankan Card Game Guide",
    "excerpt": "Learn traditional Omi: four players in partnerships, a 32-card deck, trump chosen after the first four cards, eight tricks and token-based scoring.",
    "seo": {
      "title": "Omi Card Game Rules | How to Play Sri Lankan Omi",
      "description": "Learn Sri Lankan Omi rules: four-player partnerships, the 32-card deck, choosing trump after four cards, trick play, Kapothi and token scoring.",
      "primaryKeyword": "Omi card game rules",
      "secondaryKeywords": [
        "how to play Omi",
        "Sri Lankan card game",
        "Omi trump rules",
        "Omi scoring",
        "Omi Club"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "omi-club",
    "hero": {
      "kind": "game-art",
      "gameSlug": "omi-club",
      "preferredSlot": "cover",
      "alt": "Omi Club Card Game Offline key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--omi" data-article-layout="omi-trump-table">
  <section class="article-lead">
    <p>Omi is one of Sri Lanka's best-known partnership card games. Four players sit in two teams, use only the top 32 cards of a standard deck, and play exactly eight tricks per deal.</p>
    <p>Its signature decision arrives halfway through the deal. After seeing only four cards, the player to the dealer's right must choose the trump suit. Four more cards then arrive. The choice is final, so Omi rewards reading suit shape from incomplete information.</p>
  </section>

  <section class="article-omi-table" data-ui="team-table">
    <div class="seat seat--north">Team A</div>
    <div class="seat seat--west">Team B</div>
    <div class="seat seat--center"><strong>8 tricks</strong><span>4 + trump + 4 deal</span></div>
    <div class="seat seat--east">Team B</div>
    <div class="seat seat--south">Team A</div>
  </section>

  <section>
    <h2 id="omi-deck">The 32-card Omi deck</h2>
    <p>Traditional Omi uses Ace, King, Queen, Jack, 10, 9, 8 and 7 from each suit. Cards rank in that order from high to low. With four players, each person receives eight cards and the full 32-card pack is used.</p>
    <div class="article-rank-line"><strong>A</strong><span>K</span><span>Q</span><span>J</span><span>10</span><span>9</span><span>8</span><span>7</span></div>
  </section>

  <section class="article-deal-reveal" data-ui="deal-reveal">
    <h2 id="omi-deal-and-trump">The deal that defines Omi</h2>
    <div><span>Step 1</span><strong>4 cards each</strong><p>The first batch is dealt.</p></div>
    <div><span>Step 2</span><strong>Trump chosen</strong><p>The player to the dealer's right names trump based only on those first four cards.</p></div>
    <div><span>Step 3</span><strong>4 more cards each</strong><p>The second batch completes every eight-card hand.</p></div>
  </section>

  <section>
    <h2 id="choosing-omi-trump">How should you choose trump from four cards?</h2>
    <p>Suit length is usually the first signal. Three cards in one suit often provide a stronger reason than one isolated Ace in another. High cards still matter, but your choice has to survive the possibility that the second batch changes the balance of the hand.</p>
    <p>Because you are choosing from incomplete information, Omi trump selection is probability management rather than certainty.</p>
    <div class="article-choice-grid">
      <article><h3>Length</h3><p>More cards in a suit give you a better chance of controlling repeated trump rounds.</p></article>
      <article><h3>Top cards</h3><p>Ace and King reduce the risk that opponents immediately dominate your chosen suit.</p></article>
      <article><h3>Side shape</h3><p>Short side suits may later let you trump when opponents lead them.</p></article>
      <article><h3>Partnership</h3><p>Your partner's unseen four cards may provide the support your partial hand lacks.</p></article>
    </div>
  </section>

  <section>
    <h2 id="omi-trick-rules">How tricks work</h2>
    <ul class="article-rule-list">
      <li>The player who selected trump leads the first trick in the commonly documented game.</li>
      <li>Players must follow the suit led whenever possible.</li>
      <li>If you cannot follow suit, you may play another suit, including trump.</li>
      <li>The highest trump wins a trick containing trump.</li>
      <li>If no trump is played, the highest card of the led suit wins.</li>
      <li>The trick winner leads next.</li>
    </ul>
  </section>

  <section class="article-token-score" data-ui="token-score">
    <h2 id="omi-scoring">Traditional Omi token scoring</h2>
    <p>The exact vocabulary varies locally, but the documented scoring gives extra reward to the defenders when they beat the partnership that chose trump.</p>
    <div class="article-table-wrap">
      <table>
        <thead><tr><th>Result</th><th>Trump-choosing team</th><th>Defending team</th></tr></thead>
        <tbody>
          <tr><td>Win 5–7 tricks</td><td>1 token when they win</td><td>2 tokens when they win</td></tr>
          <tr><td>Win all 8 tricks</td><td colspan="2">3 tokens to the sweeping team</td></tr>
          <tr><td>4–4 tie</td><td colspan="2">No immediate winner; a token is carried forward under the traditional scoring procedure.</td></tr>
        </tbody>
      </table>
    </div>
    <p>A complete match is commonly played to 10 tokens. The sweep of all eight tricks is often known by terms such as Kapothi or Basthe in documented Sri Lankan play.</p>
  </section>

  <section class="article-partner-play" data-ui="partner-play">
    <h2 id="omi-partnership-strategy">Partnership habits that matter</h2>
    <div><h3>Do not overtake a safe partner trick</h3><p>If partner is already winning, preserve your higher card unless taking the lead creates a clear advantage.</p></div>
    <div><h3>Remember void suits</h3><p>Once a player fails to follow a suit, every later lead of that suit carries trump risk.</p></div>
    <div><h3>Count the eight-card suit supply</h3><p>Because each suit has only eight cards in the reduced deck, suit counting is manageable and highly useful.</p></div>
    <div><h3>Defend the contract aggressively</h3><p>The defenders can earn more for beating the side that selected trump, so one critical trick can be worth the risk.</p></div>
  </section>

  <aside class="article-source-warning">
    <strong>Rules-source note</strong>
    <p>Some generic digital store descriptions of Omi conflict with documented Sri Lankan Omi. This guide follows the traditional four-player, partnership, 32-card game documented by established card-game rules references and FunFuse's verified website research.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "How many players play Omi?",
        "answer": "Traditional Sri Lankan Omi is played by four players in two fixed partnerships."
      },
      {
        "question": "How many cards are used in Omi?",
        "answer": "Omi uses 32 cards: Ace, King, Queen, Jack, 10, 9, 8 and 7 in each suit."
      },
      {
        "question": "When is trump chosen in Omi?",
        "answer": "After the first four cards are dealt to each player, the player to the dealer's right chooses trump; four more cards are then dealt to everyone."
      },
      {
        "question": "How many tricks are in Omi?",
        "answer": "There are eight tricks in each deal."
      },
      {
        "question": "What is Kapothi in Omi?",
        "answer": "Kapothi is a commonly documented term for a sweep in which one partnership wins all eight tricks."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.omiclub",
        "kind": "official-product"
      },
      {
        "label": "Pagat Omi rules",
        "url": "https://www.pagat.com/whist/omi.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Traditional Pagat Omi is the rules authority here because the current Play Store description contains generic/inconsistent rules. Keep the article aligned with the verified project game details."
  }),
  definePost({
    "slug": "bhabhi-thulla-rules",
    "canonicalPath": "/blogs/bhabhi-thulla-rules/",
    "routeKind": "blog",
    "status": "ready-to-publish",
    "title": "Bhabhi Thulla Rules: How the Getaway Card Game Punishes the High Card",
    "eyebrow": "South Asian Shedding Game Guide",
    "excerpt": "Learn Bhabhi Thulla, also known as Getaway: follow suit, throw a Thulla when void, force the high card to pick up and avoid being last with cards.",
    "seo": {
      "title": "Bhabhi Thulla Rules | How to Play Getaway Card Game",
      "description": "Learn Bhabhi Thulla or Getaway rules: following suit, the Thulla penalty, trick pickup, the Ace of Spades opening and strategy for shedding your hand.",
      "primaryKeyword": "Bhabhi Thulla rules",
      "secondaryKeywords": [
        "how to play Bhabhi card game",
        "Getaway card game",
        "Thulla card game",
        "Bhabhi card game rules"
      ],
      "searchIntent": "informational"
    },
    "publishedAt": null,
    "modifiedAt": null,
    "categories": [
      "Rules & Guides",
      "Card Games",
      "Strategy"
    ],
    "relatedGameSlug": "bhabhi-thulla-card-game",
    "hero": {
      "kind": "game-art",
      "gameSlug": "bhabhi-thulla-card-game",
      "preferredSlot": "cover",
      "alt": "Bhabhi Thulla Card Game key art."
    },
    "bodyHtml": String.raw`<div class="blog-body blog-body--bhabhi" data-article-layout="bhabhi-escape-route">
  <section class="article-lead">
    <p>Bhabhi Thulla turns a familiar trick-taking instinct upside down. In many card games, playing the highest card is good because it wins the trick. In Bhabhi, being highest in the led suit can become a punishment: if another player cannot follow suit and throws a Thulla, the high-card player may have to pick up the entire trick.</p>
    <p>The objective is to escape the hand. Players who get rid of their cards can leave the game; the last player still holding cards is the loser — the “Bhabhi” or equivalent local loser designation.</p>
  </section>

  <section class="article-escape-meter" data-ui="escape-meter">
    <div><strong>Start</strong><span>Cards in hand</span></div>
    <div class="arrow">→</div>
    <div><strong>Shed</strong><span>Follow suit and manage risk</span></div>
    <div class="arrow">→</div>
    <div><strong>Escape</strong><span>No cards left</span></div>
    <div class="arrow">→</div>
    <div><strong>Avoid</strong><span>Being the last player holding cards</span></div>
  </section>

  <section>
    <h2 id="bhabhi-setup">Players, deck and opening</h2>
    <p>Traditional Getaway/Bhabhi is played with a standard 52-card deck and works with several player counts, commonly around three to eight. Cards are dealt as evenly as possible.</p>
    <p>In a widely documented South Asian form, the player holding the Ace of Spades begins the first trick by playing it. The opening trick has special handling in some variants, after which the normal Thulla rule becomes the defining mechanism.</p>
  </section>

  <section class="article-thulla-demo" data-ui="thulla-demo">
    <h2 id="what-is-a-thulla">What is a Thulla?</h2>
    <div class="demo-row">
      <span class="lead">Lead: 8♥</span>
      <span>Q♥</span>
      <span>K♥</span>
      <span class="thulla">4♣ — THULLA</span>
    </div>
    <p>A Thulla occurs when a player cannot follow the led suit and plays an off-suit card on a normal trick. The trick stops immediately. The player who has played the highest card of the <strong>led suit</strong> must pick up all cards in that trick.</p>
    <p>In the example above, the King of Hearts is currently highest in Hearts, so that player takes the pile after the 4 of Clubs triggers the Thulla.</p>
  </section>

  <section>
    <h2 id="bhabhi-normal-trick">A normal trick without a Thulla</h2>
    <ol class="article-steps">
      <li>One player leads a card.</li>
      <li>Players who hold the led suit must follow it.</li>
      <li>If everyone follows suit, the highest card of that suit wins the completed trick.</li>
      <li>The winner controls the next lead under the normal flow.</li>
      <li>If someone cannot follow on a later normal trick, the off-suit card triggers the Thulla pickup instead of ordinary trick resolution.</li>
    </ol>
  </section>

  <section class="article-danger-board" data-ui="danger-board">
    <h2 id="why-high-cards-are-dangerous">Why high cards can be dangerous</h2>
    <article><span>Safe-looking lead</span><p>You play a King because it seems likely to win.</p></article>
    <article><span>Hidden information</span><p>The next player follows, but a later player has no cards in that suit.</p></article>
    <article><span>Thulla</span><p>The void player throws another suit.</p></article>
    <article><span>Penalty</span><p>Your King is highest in the led suit, so you collect the entire pile and your hand grows.</p></article>
  </section>

  <section>
    <h2 id="bhabhi-strategy">Bhabhi strategy: track void suits</h2>
    <p>The most useful information is not only which high cards have been played. It is <strong>who has shown they are void in a suit</strong>. Once a player has failed to follow Hearts, leading Hearts immediately before that player can be dangerous if you are likely to hold the highest Heart in the trick.</p>
    <p>This creates a different style of card counting. You are looking for pickup traps rather than only trying to establish winners.</p>
  </section>

  <section class="article-mode-cards" data-ui="product-mode-cards">
    <h2 id="bhabhi-funfuse-modes">How FunFuse changes the starting pressure</h2>
    <p>The current Bhabhi Thulla app adds offline modes that alter the starting card distribution while keeping the recognizable shedding challenge:</p>
    <div>
      <span>Classic</span><strong>13 cards each</strong><p>A balanced four-hand starting format in the app.</p>
    </div>
    <div>
      <span>Difficult</span><strong>You: 16 · others: 12</strong><p>You begin with a larger hand and therefore more work to escape.</p>
    </div>
    <div>
      <span>Pro</span><strong>You: 19 · others: 11</strong><p>The imbalance creates an even harder offline challenge.</p>
    </div>
    <p>These are app modes, not universal traditional dealing rules. Keeping that distinction clear makes the article useful both to players learning the historic game and to players arriving from the FunFuse app.</p>
  </section>

  <section>
    <h2 id="bhabhi-endgame">The final-card problem</h2>
    <p>Getting down to one card is not always enough. If your last card wins a trick or interacts with the lead rules in a way that keeps you active under the chosen variant, you may not escape as cleanly as expected. Experienced players plan the final few cards as a sequence rather than celebrating as soon as their hand becomes small.</p>
    <p>Try to leave yourself a final card that can be legally shed without making you the obvious pickup target on the preceding trick.</p>
  </section>

  <aside class="article-callout article-callout--bhabhi">
    <strong>The inversion at the heart of Bhabhi</strong>
    <p>Winning the led suit is only good when nobody behind you can turn that win into a pickup.</p>
  </aside>
</div>`,
    "faq": [
      {
        "question": "What is Bhabhi Thulla?",
        "answer": "Bhabhi Thulla, also known as Getaway, is a South Asian shedding game where players try to get rid of all cards and avoid being the last player still holding cards."
      },
      {
        "question": "What is a Thulla?",
        "answer": "A Thulla is an off-suit card played by someone who cannot follow the led suit. On a normal later trick it ends the trick and causes the player with the highest card of the led suit to pick up the pile."
      },
      {
        "question": "Why can high cards be bad in Bhabhi?",
        "answer": "If an opponent is void in the led suit and throws a Thulla, the player with the highest card of that suit may be forced to collect the whole trick."
      },
      {
        "question": "Who loses Bhabhi?",
        "answer": "The last player still holding cards is the loser."
      },
      {
        "question": "What are the FunFuse Bhabhi modes?",
        "answer": "The current app advertises Classic, Difficult and Pro offline modes with progressively harder starting-card distributions for the user."
      }
    ],
    "researchSources": [
      {
        "label": "FunFuse Google Play listing",
        "url": "https://play.google.com/store/apps/details?id=com.funfuse.bhabhicardgame",
        "kind": "official-product"
      },
      {
        "label": "Pagat Getaway / Bhabhi rules",
        "url": "https://www.pagat.com/inflation/getaway.html",
        "kind": "rules-reference"
      }
    ],
    "editorialNote": "Keep traditional Getaway/Bhabhi rules separate from the FunFuse app's Classic/Difficult/Pro starting distributions."
  }),
];

/** Curated listing order. New posts intentionally have no fabricated dates. */
export function getAllBlogPosts(): readonly BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostByCanonicalPath(
  canonicalPath: string,
): BlogPost | undefined {
  return blogPosts.find((post) => post.canonicalPath === canonicalPath);
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter((post) => post.categories.includes(category));
}

export function getLegacyBlogPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.routeKind === "legacy-root");
}

export function getNewBlogPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.routeKind === "blog");
}

/**
 * Related articles for article footers.
 *
 * Shared categories are the primary signal. Secondary-keyword overlap is used
 * as a smaller tie-breaker. Curated source order breaks remaining ties.
 */
export function getRelatedBlogPosts(
  post: BlogPost,
  count = 3,
): BlogPost[] {
  const pool = blogPosts.filter((candidate) => candidate.slug !== post.slug);

  return pool
    .map((candidate, index) => {
      const sharedCategories = candidate.categories.filter((category) =>
        post.categories.includes(category),
      ).length;

      const sharedKeywords = candidate.seo.secondaryKeywords.filter((keyword) =>
        post.seo.secondaryKeywords.includes(keyword),
      ).length;

      return {
        candidate,
        score: sharedCategories * 10 + sharedKeywords * 3 - index * 0.001,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ candidate }) => candidate);
}

/**
 * Extracts authored h2/h3 headings for an optional article table of contents.
 * Heading text in this file is intentionally plain text.
 */
export function getBlogTableOfContents(post: BlogPost): {
  id: string;
  text: string;
  level: 2 | 3;
}[] {
  const matches = post.bodyHtml.matchAll(
    /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g,
  );

  return [...matches].map((match) => ({
    level: Number(match[1]) as 2 | 3,
    id: match[2],
    text: stripHtml(match[3]).trim(),
  }));
}

export function getBlogWordCount(post: BlogPost): number {
  return stripHtml(post.bodyHtml).split(/\s+/).filter(Boolean).length;
}

export function getBlogReadingTimeMinutes(
  post: BlogPost,
  wordsPerMinute = 220,
): number {
  return Math.max(1, Math.ceil(getBlogWordCount(post) / wordsPerMinute));
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ");
}
