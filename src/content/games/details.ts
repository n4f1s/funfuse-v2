/**
 * Rich editorial content for the 19 shipped FunFuse games.
 *
 * Keep this separate from:
 * - `games.ts`: lightweight catalogue / routing / store metadata
 * - `art.ts`: static image imports
 *
 * This module is plain data and safe to consume from Server Components.
 * Render the structured fields with React; do not convert this content to raw
 * HTML or `dangerouslySetInnerHTML`.
 *
 * Research verified: 2026-08-12.
 * See `docs/game-content-sources.md` for provenance and source notes.
 */

export const GAME_DETAILS_VERIFIED_ON = "2026-08-12" as const;

export type GameFact = {
  label: string;
  value: string;
};

export type GameStep = {
  title: string;
  body: string;
};

export type GameTip = {
  title: string;
  body: string;
};

export type GameRuleGroup = {
  title: string;
  items: readonly string[];
};

export type PuzzleMode = {
  name: string;
  description: string;
};

export type GameDetails = {
  seoDescription: string;
  about: readonly string[];
  objective: string;
  facts: readonly GameFact[];
  howToPlay: readonly GameStep[];
  ruleGroups?: readonly GameRuleGroup[];
  tips?: readonly GameTip[];
  callout?: string;
  modes?: readonly PuzzleMode[];
};

export const gameDetails = {
  tongit: {
    seoDescription:
      "Learn Tongits, the classic three-player Filipino rummy game: draw, meld sets and runs, discard carefully, and finish with the strongest or lowest-value hand.",
    about: [
      "Tongits is a three-player Filipino rummy game built around drawing, discarding and forming melds. The dealer begins with 13 cards while the other two players receive 12, and the rest of the deck becomes the draw pile.",
      "Every turn is a balance between improving your own hand and revealing as little as possible. Sets of equal ranks and runs of consecutive cards in the same suit reduce the value left in your hand, while the timing of a discard or challenge can decide the round.",
    ],
    objective:
      "Finish the round by getting rid of your cards, or hold the lowest unmatched hand value when the round is compared.",
    facts: [
      { label: "Players", value: "3" },
      { label: "Deck", value: "52 cards" },
      { label: "Core play", value: "Draw, meld, discard" },
      { label: "Melds", value: "Sets and same-suit runs" },
    ],
    howToPlay: [
      {
        title: "Deal the cards",
        body: "The dealer starts with 13 cards; the other two players start with 12. The remaining cards form the draw pile.",
      },
      {
        title: "Draw one",
        body: "At the start of your turn, take a card from the available draw source according to the game state.",
      },
      {
        title: "Build melds",
        body: "Create sets of three or four equal-ranked cards, or runs of three or more consecutive cards in the same suit.",
      },
      {
        title: "Discard to end the turn",
        body: "Choose one card to discard. Good discards lower your hand value without giving an opponent an easy completion.",
      },
      {
        title: "Finish or compare",
        body: "A round can end through Tongits, an exhausted draw pile, or a challenge/draw situation. When hands are compared, lower unmatched card value is the advantage.",
      },
    ],
    tips: [
      {
        title: "Watch the discard trail",
        body: "Cards that have already appeared help you estimate which sets or runs are still realistic for each player.",
      },
      {
        title: "Reduce expensive deadwood",
        body: "High-value unmatched cards become a liability if the round ends before you can meld them.",
      },
      {
        title: "Challenge with evidence",
        body: "A low hand is useful, but challenge timing is strongest when the table history also suggests your opponents are carrying more.",
      },
    ],
    callout: "Three players. One draw pile. Every discard tells a story.",
  },

  "hazari-grand": {
    seoDescription:
      "Learn Hazari, the four-player 1000-points card game: arrange 13 cards into 3+3+3+4 groups, compare ranked combinations, collect card points, and race to 1000.",
    about: [
      "Hazari is a four-player partition game played with a standard 52-card deck. Each player receives 13 cards and arranges them before play into four groups of 3, 3, 3 and 4 cards.",
      "The challenge happens before the first comparison: stronger groups must be placed ahead of weaker ones. Players then reveal corresponding groups in sequence, and the strongest combination in each comparison collects the cards. Those captured cards carry points toward the game's 1000-point target.",
    ],
    objective:
      "Arrange your 13 cards into legal descending groups, win the group comparisons, and accumulate at least 1000 points.",
    facts: [
      { label: "Players", value: "4" },
      { label: "Deck", value: "52 cards" },
      { label: "Arrangement", value: "3 + 3 + 3 + 4" },
      { label: "Target", value: "1000 points" },
    ],
    howToPlay: [
      {
        title: "Receive 13 cards",
        body: "All 52 cards are dealt, giving each of the four players a 13-card hand.",
      },
      {
        title: "Build four groups",
        body: "Split your hand into groups of 3, 3, 3 and 4. Arrange them from strongest to weakest before committing to the layout.",
      },
      {
        title: "Lock the arrangement",
        body: "Once the hand is set, the groups are played in order. The final 4-card group is judged by the best relevant 3-card combination within it under the traditional rules.",
      },
      {
        title: "Compare combinations",
        body: "Each player exposes the corresponding group. The strongest ranked combination wins that comparison and collects the cards played.",
      },
      {
        title: "Count captured cards",
        body: "Captured cards contribute points to the winner's running total. New deals continue until the target is reached.",
      },
    ],
    ruleGroups: [
      {
        title: "Combination order",
        items: [
          "Troy — three cards of the same rank.",
          "Colour Run — three consecutive cards of the same suit.",
          "Run — three consecutive ranks in mixed suits.",
          "Colour — three cards of one suit that are not a run.",
          "Pair — two cards of the same rank plus one other card.",
          "Indi — a three-card group that matches none of the higher combinations.",
        ],
      },
      {
        title: "Card points",
        items: [
          "Aces, Kings, Queens, Jacks and Tens are worth 10 points each in the commonly documented Bangladeshi rules.",
          "Cards from 2 through 9 are worth 5 points each.",
          "The full deck therefore contains 360 card points to be collected each deal.",
        ],
      },
    ],
    tips: [
      {
        title: "Protect the order",
        body: "An impressive first group is not enough if it leaves a later group illegally or strategically weak. Evaluate the whole 3+3+3+4 structure together.",
      },
      {
        title: "Think in comparisons",
        body: "A group only needs to beat the groups it faces. Balance strength across all four positions instead of concentrating everything in one place.",
      },
    ],
    callout: "Arrange first. Reveal later. Race to 1000.",
  },

  "callbreak-offline": {
    seoDescription:
      "Learn CallBreak Club: four players bid for tricks, Spades are permanent trumps, every player gets 13 cards, and meeting your call is the key to scoring.",
    about: [
      "CallBreak is a four-player trick-taking game played individually with a standard 52-card deck. Before the cards are played, each player calls the number of tricks they expect to win.",
      "Spades are permanent trumps, so even a low Spade can defeat a high card from another suit when it is played legally. The tension comes from judging your hand accurately: falling short of your call is costly, while extra tricks are worth only a smaller bonus in the FunFuse rules.",
    ],
    objective:
      "Meet or exceed the number of tricks you called, and finish the match with the highest total score.",
    facts: [
      { label: "Players", value: "4 individual players" },
      { label: "Deck", value: "52 cards" },
      { label: "Cards each", value: "13" },
      { label: "Trump", value: "Spades" },
    ],
    howToPlay: [
      {
        title: "Call your target",
        body: "After seeing your hand, announce how many of the 13 tricks you expect to win.",
      },
      {
        title: "Lead the first trick",
        body: "The opening player leads a card. Play then proceeds around the table, one card per player.",
      },
      {
        title: "Follow suit",
        body: "If you hold the suit that was led, you must play that suit. If you cannot follow, you may use a Spade or discard another suit.",
      },
      {
        title: "Resolve the trick",
        body: "The highest Spade wins if any Spade was played; otherwise the highest card of the led suit wins. The trick winner leads next.",
      },
      {
        title: "Score the call",
        body: "Meeting the call scores the bid, with small credit for overtricks in the FunFuse rules. Missing the call costs the amount bid.",
      },
    ],
    tips: [
      {
        title: "Bid the hand you actually have",
        body: "Count reliable winners first. A bold call is only useful if your suit control and Spades can support it.",
      },
      {
        title: "Track Spades",
        body: "Knowing how many trumps remain changes whether a side-suit winner is safe or vulnerable.",
      },
    ],
    callout: "Call it. Make it. Every trick matters.",
  },

  "3-2-5-offline-fun-card-game": {
    seoDescription:
      "Learn 3-2-5 (Teen Do Panch), a three-player 30-card trick-taking game with rotating quotas of 5, 3 and 2 tricks and a trump chosen by the five-trick player.",
    about: [
      "3-2-5, also known as Teen Do Panch, is a three-player trick-taking game from South Asia. It uses a 30-card pack, and every player receives 10 cards.",
      "What changes is not the hand size but the responsibility. The player to the dealer's right has a quota of five tricks and chooses trump, the dealer aims for two, and the remaining player aims for three. On later deals, players who exceeded their quota can gain an advantage through the traditional card-pulling rule.",
    ],
    objective:
      "Meet your rotating trick quota — five, three or two — and use any overtricks to improve your position on the next deal.",
    facts: [
      { label: "Players", value: "3" },
      { label: "Deck", value: "30 cards" },
      { label: "Cards each", value: "10" },
      { label: "Quotas", value: "5 / 3 / 2 tricks" },
    ],
    howToPlay: [
      {
        title: "Set the quotas",
        body: "The player to the dealer's right takes the five-trick role, the dealer takes two, and the third player takes three.",
      },
      {
        title: "Choose trump",
        body: "After the first batch of cards, the five-trick player chooses the trump suit for the deal.",
      },
      {
        title: "Complete the deal",
        body: "Each player finishes with 10 cards from the 30-card pack.",
      },
      {
        title: "Play the tricks",
        body: "Follow the led suit whenever possible. A trick is won by the highest trump, or by the highest card of the led suit when no trump is present.",
      },
      {
        title: "Compare with the quota",
        body: "At the end of the 10 tricks, compare each player's result with the assigned quota. Roles rotate with the deal.",
      },
      {
        title: "Use the next-deal advantage",
        body: "In traditional play, over-quota players may pull cards from under-quota players on following deals, creating a carry-over reward for strong performance.",
      },
    ],
    ruleGroups: [
      {
        title: "Traditional 30-card pack",
        items: [
          "The pack is formed by removing cards 2 through 6 from a standard deck and keeping two Sevens.",
          "Cards rank A, K, Q, J, 10, 9, 8 and the retained 7s within their suits.",
        ],
      },
    ],
    callout: "Same ten cards each. Different job every deal.",
  },

  "gin-rummy-master-offline": {
    seoDescription:
      "Learn Gin Rummy: draw and discard to build sets and same-suit runs, reduce deadwood, then knock or go Gin to close the hand.",
    about: [
      "Gin Rummy is a two-player draw-and-discard game where the hand gradually becomes more organized. Players combine cards into sets of equal rank and runs of consecutive cards in the same suit.",
      "Cards that do not belong to a meld are deadwood. The central decision is whether to keep improving the hand or end it: a player can knock when their deadwood is low enough, while a completely melded hand is Gin.",
    ],
    objective:
      "Create melds, minimize deadwood, and end hands in a position that scores better than your opponent.",
    facts: [
      { label: "Players", value: "2" },
      { label: "Deck", value: "52 cards" },
      { label: "Melds", value: "Sets and runs" },
      { label: "Key term", value: "Deadwood" },
    ],
    howToPlay: [
      {
        title: "Start with a hand",
        body: "Each player receives a hand of cards; the undealt cards form the stock and a discard pile is started.",
      },
      {
        title: "Draw",
        body: "Take one card from the stock or the available discard according to the turn rules.",
      },
      {
        title: "Build melds",
        body: "Group equal ranks into sets, or form consecutive cards of the same suit into runs.",
      },
      {
        title: "Discard",
        body: "End each turn by discarding one card, keeping the hand at its required size.",
      },
      {
        title: "Knock or go Gin",
        body: "When your unmatched cards are low enough, you may knock. If every card belongs to a meld, you have Gin.",
      },
      {
        title: "Score the difference",
        body: "Unmatched card values determine the hand result, with stronger finishes earning the scoring advantage.",
      },
    ],
    tips: [
      {
        title: "Keep flexible connectors",
        body: "Middle cards in a suit can often extend runs in two directions, giving them more future value than isolated edge cards.",
      },
      {
        title: "Read the discard pile",
        body: "What your opponent takes or ignores can reveal which ranks and suits are dangerous to release.",
      },
    ],
    callout: "Every draw asks the same question: improve, or finish?",
  },

  tarneeb: {
    seoDescription:
      "Learn Tarneeb, the Middle Eastern four-player partnership game: bid for tricks, choose a trump suit, follow suit, and make your contract with your partner.",
    about: [
      "Tarneeb is a four-player partnership trick-taking game popular across the Middle East. Partners sit opposite each other and all 52 cards are dealt, leaving every player with 13.",
      "Before play, players bid the number of tricks their team expects to take. The final bidder chooses the trump suit — tarneeb — and the partnership then has to turn that promise into actual tricks.",
    ],
    objective:
      "Win at least the number of tricks your partnership bid, while preventing the opposing team from making its own opportunities count.",
    facts: [
      { label: "Players", value: "4" },
      { label: "Teams", value: "2 partnerships" },
      { label: "Deck", value: "52 cards" },
      { label: "Cards each", value: "13" },
    ],
    howToPlay: [
      {
        title: "Deal all 52 cards",
        body: "Each player receives 13 cards, giving both partnerships complete information about their own combined holdings only through play.",
      },
      {
        title: "Bid for tricks",
        body: "Players bid how many tricks their team can take. In the commonly documented form, bids run from 7 to 13.",
      },
      {
        title: "Name the trump",
        body: "The final bidder chooses the trump suit for the hand and leads the first trick.",
      },
      {
        title: "Follow suit",
        body: "You must play the led suit if possible. If you cannot, you may trump or discard another suit.",
      },
      {
        title: "Win and lead",
        body: "Highest trump wins a trick containing trump; otherwise the highest card of the led suit wins. The trick winner leads next.",
      },
      {
        title: "Make the contract",
        body: "The bidding partnership needs at least its promised number of tricks. Success adds to the team score; failure carries a penalty.",
      },
    ],
    tips: [
      {
        title: "Bid with your partner in mind",
        body: "Your hand is only half of the partnership. Distribution, long suits and likely support matter as much as raw high cards.",
      },
      {
        title: "Control the trump timing",
        body: "Drawing out opposing trumps can protect side-suit winners, but spending trumps too early can remove your own safety net.",
      },
    ],
    callout: "A bid is a promise made by two hands.",
  },

  "ludo-challenge-offline-play": {
    seoDescription:
      "Learn Ludo Challenge: roll the die, bring your pieces into play, race around the board, capture opponents when rules allow, and get every piece home first.",
    about: [
      "Ludo is a race game for two to four players. Each player controls four pieces and uses die rolls to move them from the starting area around the shared track toward home.",
      "The board creates constant choices between progress and interference. A move can advance a piece toward safety, develop another piece, or land on an opponent and send it back when the selected rules allow it. FunFuse also supports customizable rules, so exact entry and safety details can vary by match settings.",
    ],
    objective:
      "Be the first player to move all of your pieces from the starting area around the board and into home.",
    facts: [
      { label: "Players", value: "Up to 4" },
      { label: "Pieces", value: "4 per player" },
      { label: "Movement", value: "Die rolls" },
      { label: "Play style", value: "Race and positioning" },
    ],
    howToPlay: [
      {
        title: "Choose the match",
        body: "Play against the computer or use local multiplayer, then use the selected rule set for the match.",
      },
      {
        title: "Bring pieces into play",
        body: "Roll the die and use an eligible roll to move a piece from the starting area onto the track under the chosen rules.",
      },
      {
        title: "Race around the board",
        body: "Move one eligible piece by the number shown on the die. Spread pieces out or push one forward depending on the board state.",
      },
      {
        title: "Use captures when available",
        body: "Landing on an opponent can send that piece back to its starting area when the active rules permit the capture.",
      },
      {
        title: "Enter the home path",
        body: "After completing the circuit, guide each piece into its own finishing lane and home positions.",
      },
      {
        title: "Finish all four",
        body: "The first player to bring every piece home wins the race.",
      },
    ],
    tips: [
      {
        title: "Develop more than one piece",
        body: "A single advanced piece is easy to target. Multiple active pieces create more useful moves from the same die roll.",
      },
      {
        title: "Read the risk behind you",
        body: "Before advancing, check which opposing pieces could reach your square on their next roll.",
      },
    ],
    callout: "Four pieces. One lap. Plenty of ways to get sent back.",
  },

  "puzzle-twist-game": {
    seoDescription:
      "Explore Puzzle Club Offline, a collection featuring 2048, Tic Tac Toe, Dice Down, falling-block play, Block Puzzle and SOS in one puzzle-focused app.",
    about: [
      "Puzzle Club Offline is a collection rather than a single ruleset. Its current Google Play listing highlights six distinct puzzle styles: 2048, Tic Tac Toe, Dice Down, falling-block play, Block Puzzle and SOS.",
      "That mix shifts the challenge from number planning to board control, spatial reasoning and quick placement. Instead of learning one deep card system, players can switch between compact puzzle loops with very different ways to think.",
    ],
    objective:
      "Pick a mode and solve its particular board challenge — merge, align, place, clear or out-plan the opposing side.",
    facts: [
      { label: "Type", value: "Puzzle collection" },
      { label: "Highlighted modes", value: "6" },
      { label: "Play", value: "Offline-focused" },
      { label: "Skills", value: "Logic, planning, spatial play" },
    ],
    howToPlay: [
      {
        title: "Pick a challenge",
        body: "Choose the puzzle style that fits the session: numbers, lines, dice, falling pieces, block placement or SOS.",
      },
      {
        title: "Learn the local rule",
        body: "Each mode has its own win or scoring condition. The interface changes with the selected puzzle rather than forcing one shared control scheme.",
      },
      {
        title: "Plan before committing",
        body: "Most modes reward keeping future space open. A move that scores now can still create a worse board on the next turn.",
      },
      {
        title: "Push for a cleaner board",
        body: "Whether you are merging tiles or clearing lines, preserving options is usually more valuable than chasing one isolated move.",
      },
    ],
    modes: [
      {
        name: "2048",
        description:
          "Slide numbered tiles, merge matching values, and build toward the 2048 tile while preserving space for future moves.",
      },
      {
        name: "Tic Tac Toe",
        description:
          "Place your mark with the goal of completing a line before the opposing side can do the same.",
      },
      {
        name: "Dice Down",
        description:
          "Place dice strategically on the board and use combinations or completed lines to clear space and score.",
      },
      {
        name: "Falling Blocks",
        description:
          "Rotate and position falling pieces to complete lines and keep the stack from reaching the top.",
      },
      {
        name: "Block Puzzle",
        description:
          "Fit the available shapes onto the board and complete rows or columns to clear them.",
      },
      {
        name: "SOS",
        description:
          "Place S or O to form SOS horizontally, vertically or diagonally while denying the same opportunities to the opponent.",
      },
    ],
    tips: [
      {
        title: "Preserve options",
        body: "Across most puzzle modes, open space and multiple possible follow-ups are stronger than a move that only solves the current moment.",
      },
      {
        title: "Switch mental gears",
        body: "The collection rewards different skills. A pattern that works in 2048 will not replace spatial planning in Block Puzzle or opponent-reading in SOS.",
      },
    ],
    callout: "Six different ways to look at the next move.",
  },

  "lucky-9-offline": {
    seoDescription:
      "Learn Lucky 9: two cards form a value whose last digit counts, Aces are 1, tens and face cards are 0, and the hand closest to 9 wins.",
    about: [
      "Lucky 9 is a compact comparing game built around one target: nine. Players receive two cards and convert them into a single hand value.",
      "Aces count as one, cards 2 through 9 keep their face value, and 10, Jack, Queen and King count as zero. When a total reaches two digits, only the last digit matters — so 15 becomes 5.",
    ],
    objective:
      "Finish with a hand value closer to 9 than the opposing hand.",
    facts: [
      { label: "Starting hand", value: "2 cards" },
      { label: "Best value", value: "9" },
      { label: "Ace", value: "1 point" },
      { label: "10 / J / Q / K", value: "0 points" },
    ],
    howToPlay: [
      {
        title: "Deal two cards",
        body: "Each side begins with a two-card hand.",
      },
      {
        title: "Convert the values",
        body: "Aces count as 1, number cards count at face value, and tens plus face cards count as 0.",
      },
      {
        title: "Keep the last digit",
        body: "If the total is 10 or more, discard the tens digit. A total of 15 therefore counts as 5.",
      },
      {
        title: "Compare with nine",
        body: "The hand whose final value is closest to 9 wins the round.",
      },
    ],
    callout: "Two cards. One digit. Nine is perfect.",
  },

  "pusoy-offline": {
    seoDescription:
      "Learn Pusoy (Chinese Poker): arrange 13 cards into a 3-card front, 5-card middle and 5-card back hand, keeping each hand in legal strength order.",
    about: [
      "Pusoy is the Filipino form of Chinese Poker. Each player receives 13 cards and must divide them into three poker hands: a three-card front, a five-card middle and a five-card back.",
      "The layout has a strict strength order. The back hand must be stronger than the middle, and the middle must be stronger than the front. After everyone sets their cards, corresponding hands are compared using poker rankings.",
    ],
    objective:
      "Build three legal hands and win as many front, middle and back comparisons as possible.",
    facts: [
      { label: "Cards each", value: "13" },
      { label: "Front", value: "3 cards" },
      { label: "Middle", value: "5 cards" },
      { label: "Back", value: "5 cards" },
    ],
    howToPlay: [
      {
        title: "Read all 13 cards",
        body: "Treat the deal as one complete puzzle before committing strong combinations to a position.",
      },
      {
        title: "Build the back",
        body: "Create a five-card back hand that will remain the strongest of your three hands.",
      },
      {
        title: "Build the middle",
        body: "Use five cards for a hand weaker than the back but stronger than the front.",
      },
      {
        title: "Finish the front",
        body: "The remaining three cards form the front hand, which must be the weakest legal hand.",
      },
      {
        title: "Compare positions",
        body: "Front is compared with front, middle with middle and back with back. Standard poker strength determines each comparison.",
      },
    ],
    ruleGroups: [
      {
        title: "Legal hand order",
        items: [
          "Back: strongest five-card hand.",
          "Middle: weaker than the back, stronger than the front.",
          "Front: three-card hand and the weakest position.",
        ],
      },
      {
        title: "Poker hierarchy",
        items: [
          "Five-card hands use standard poker-style rankings such as straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair and high card.",
          "The three-card front does not use five-card-only combinations such as straights and flushes in the same way as the five-card positions.",
        ],
      },
    ],
    tips: [
      {
        title: "Avoid a fouled layout",
        body: "A powerful middle hand is worthless if it accidentally outranks the back. Validate the order before locking the cards.",
      },
      {
        title: "Balance three battles",
        body: "The strongest possible back is not always the best overall arrangement if it leaves both other positions too weak.",
      },
    ],
    callout: "Thirteen cards become three separate battles.",
  },

  "pusoy-dos-offline": {
    seoDescription:
      "Learn Pusoy Dos (Big Two): 3♣ opens, 2 is the highest rank, players beat singles, pairs, triples or five-card combinations, and the first empty hand wins.",
    about: [
      "Pusoy Dos is the Filipino version of Big Two, a climbing and shedding game where the rank order runs upward from 3 to 2. The goal is simple: be the first player with no cards left.",
      "The table alternates between singles, pairs, triples and legal five-card combinations. A response has to beat the current play with the same combination size and type under the active rules, or the player passes.",
    ],
    objective:
      "Shed every card before the other players by taking control of the table with stronger legal combinations.",
    facts: [
      { label: "Players", value: "3–4" },
      { label: "Deck", value: "52 cards" },
      { label: "Highest rank", value: "2" },
      { label: "Opening card", value: "3♣" },
    ],
    howToPlay: [
      {
        title: "Start with the 3 of Clubs",
        body: "In the documented Filipino form, the holder of 3♣ opens the first sequence and includes it in the opening play.",
      },
      {
        title: "Choose a combination",
        body: "Lead a legal single, pair, triple or five-card combination.",
      },
      {
        title: "Beat like with like",
        body: "The next player must produce a stronger legal response of the required type and size, or pass.",
      },
      {
        title: "Let the table reset",
        body: "When the other players pass, the last successful player gains control and may open a new legal combination.",
      },
      {
        title: "Empty the hand",
        body: "The first player to play their final card or combination wins.",
      },
    ],
    ruleGroups: [
      {
        title: "Rank direction",
        items: [
          "Card ranks climb from 3 upward through the face cards and Ace to 2.",
          "In the commonly documented Pusoy Dos suit order, Diamonds are highest, followed by Hearts, Spades and Clubs.",
        ],
      },
    ],
    tips: [
      {
        title: "Save control cards",
        body: "Twos and powerful combinations can reclaim the lead later, so spending them early should have a purpose.",
      },
      {
        title: "Plan the exit",
        body: "A hand can be strong overall but awkward to finish. Keep an eye on the exact combination you want to use for your final cards.",
      },
    ],
    callout: "In Pusoy Dos, the 2 sits at the top.",
  },

  "capsa-susun-offline": {
    seoDescription:
      "Learn Capsa Susun: arrange 13 cards into a 3-card top, 5-card middle and 5-card bottom hand, with bottom stronger than middle and middle stronger than top.",
    about: [
      "Capsa Susun is the Indonesian form of Chinese Poker. Every player receives 13 cards and turns them into three separate poker hands.",
      "The bottom five-card hand must be the strongest, the middle five-card hand comes next, and the three-card top must be weakest. Once layouts are locked, matching positions are compared against the other players.",
    ],
    objective:
      "Create the strongest legal three-level layout you can and win the positional comparisons against your opponents.",
    facts: [
      { label: "Cards each", value: "13" },
      { label: "Top", value: "3 cards" },
      { label: "Middle", value: "5 cards" },
      { label: "Bottom", value: "5 cards" },
    ],
    howToPlay: [
      {
        title: "Study the full deal",
        body: "Before moving cards, identify your strongest made hands and the cards that can connect into alternate layouts.",
      },
      {
        title: "Set the bottom",
        body: "Build the strongest five-card hand in the bottom position.",
      },
      {
        title: "Set the middle",
        body: "Build another five-card poker hand that remains weaker than the bottom.",
      },
      {
        title: "Set the top",
        body: "Use the final three cards for the weakest legal position.",
      },
      {
        title: "Compare all three levels",
        body: "Each position is judged against the same position in opposing layouts, with points awarded according to the game's scoring system.",
      },
    ],
    tips: [
      {
        title: "Do not overfeed one row",
        body: "A marginal upgrade to the bottom can cost an entire comparison if it destroys the middle or top.",
      },
      {
        title: "Check legality last",
        body: "Before confirming the layout, verify bottom > middle > top. A fouled arrangement defeats the purpose of otherwise strong cards.",
      },
    ],
    callout: "One deal. Three hands. Strength must flow downward.",
  },

  "tien-len-club": {
    seoDescription:
      "Learn Tiến Lên, Vietnam's climbing card game: four players shed singles and combinations, 2 is high, passes reset control, and the first empty hand wins.",
    about: [
      "Tiến Lên is a Vietnamese climbing and shedding game typically played by four players with 13 cards each. Players take control by playing a card or combination, then opponents either beat that same kind of play or pass.",
      "The rank order puts 2 at the top, which gives the game its distinctive endgame pressure. Once everyone else passes, the last player to make a successful play opens a fresh sequence.",
    ],
    objective:
      "Be the first player to shed all 13 cards by beating the current play with stronger legal combinations.",
    facts: [
      { label: "Players", value: "4 standard" },
      { label: "Cards each", value: "13" },
      { label: "Deck", value: "52 cards" },
      { label: "Highest rank", value: "2" },
    ],
    howToPlay: [
      {
        title: "Open the first sequence",
        body: "The first deal begins from the lowest required starting card used by the ruleset, then play continues around the table.",
      },
      {
        title: "Play a legal shape",
        body: "Lead a single card or a supported combination such as a pair, triple or sequence.",
      },
      {
        title: "Climb higher",
        body: "A response must beat the current play with the same kind of combination under the active ranking rules.",
      },
      {
        title: "Pass when needed",
        body: "If you cannot or do not want to beat the play, pass. Once the other active players pass, the last successful player takes control.",
      },
      {
        title: "Open again",
        body: "The player with control can begin a new sequence with a legal card or combination.",
      },
      {
        title: "Shed the final card",
        body: "The first player to empty their hand wins.",
      },
    ],
    tips: [
      {
        title: "Keep an exit route",
        body: "Plan how your final few cards can be played legally. A stranded single can turn a strong hand into a difficult finish.",
      },
      {
        title: "Control is valuable",
        body: "Winning a sequence is not only about removing cards; it gives you the right to choose the shape of the next play.",
      },
    ],
    callout: "Climb the table, take control, empty the hand.",
  },

  "okey-club": {
    seoDescription:
      "Learn Okey Club, the Turkish tile game: draw and discard from 106 tiles, use the indicator to identify the joker, and build same-color runs or same-number sets.",
    about: [
      "Okey is a Turkish tile game from the rummy family. The FunFuse listing supports two to four players and uses the traditional 106-tile set: two copies of numbers 1 through 13 in four colors, plus two special false-joker tiles.",
      "An indicator tile determines which numbered tile acts as the real joker for the hand. Players repeatedly draw one tile and discard one, improving the rack until all tiles can be organized into valid runs and sets.",
    ],
    objective:
      "Arrange the rack into valid runs and sets, then finish by discarding the extra tile before the other players.",
    facts: [
      { label: "Players", value: "2–4 in the app" },
      { label: "Tiles", value: "106" },
      { label: "Numbers", value: "1–13 in 4 colors" },
      { label: "Core move", value: "Draw one, discard one" },
    ],
    howToPlay: [
      {
        title: "Find the joker",
        body: "The indicator tile establishes the joker: the tile one number higher in the same color acts as the real joker for that hand.",
      },
      {
        title: "Build the rack",
        body: "Organize tiles so potential runs and sets are easy to see while leaving room for useful draws.",
      },
      {
        title: "Draw one tile",
        body: "On your turn, take an available tile according to the table rules.",
      },
      {
        title: "Create groups",
        body: "Runs use consecutive numbers of the same color. Sets use the same number in different colors.",
      },
      {
        title: "Discard one tile",
        body: "End the turn by discarding a tile you no longer need, while considering whether it helps the next player.",
      },
      {
        title: "Complete the rack",
        body: "When the playable tiles form valid groups, finish by discarding the extra tile.",
      },
    ],
    tips: [
      {
        title: "Keep flexible sequences",
        body: "A partial run with open numbers on both ends can accept more future draws than a tightly blocked pattern.",
      },
      {
        title: "Read discarded colors and numbers",
        body: "The table's discards help indicate which tiles are becoming safer to release and which patterns opponents may be building.",
      },
    ],
    callout: "Draw one. Discard one. Shape the whole rack.",
  },

  "belote-francaise": {
    seoDescription:
      "Learn French Belote: four players form two teams, use a 32-card deck, choose trump, follow Belote's special trump ranking, and score tricks with your partner.",
    about: [
      "Belote is a French partnership trick-taking game most commonly played by four players in two teams. It uses a 32-card deck containing 7 through Ace in each suit.",
      "Trump changes both the strength and point value of cards. In particular, the Jack and 9 become the top two trumps, which makes suit selection and card counting very different from ordinary high-card trick games.",
    ],
    objective:
      "As a partnership, take valuable tricks and make the chosen trump contract score better than the opposing team.",
    facts: [
      { label: "Players", value: "4" },
      { label: "Teams", value: "2 partnerships" },
      { label: "Deck", value: "32 cards" },
      { label: "Tricks", value: "8 per hand" },
    ],
    howToPlay: [
      {
        title: "Deal and expose a suit",
        body: "The deal begins in stages and a card is turned up to offer a possible trump suit.",
      },
      {
        title: "Choose trump or pass",
        body: "Players get the chance to accept the offered suit; if everyone passes, another round can allow a different trump suit.",
      },
      {
        title: "Complete the hands",
        body: "Once trump is chosen, the deal is completed so each player has eight cards.",
      },
      {
        title: "Follow Belote's trick rules",
        body: "Players follow suit and obey the trump obligations of the ruleset. Trump cards use their special ranking rather than the normal non-trump order.",
      },
      {
        title: "Count the valuable tricks",
        body: "Card values, the final trick and valid declarations contribute to the partnership score.",
      },
    ],
    ruleGroups: [
      {
        title: "Trump ranking",
        items: [
          "Jack is the highest trump and is worth 20 card points.",
          "9 is the second-highest trump and is worth 14 card points.",
          "Then come Ace, 10, King, Queen, 8 and 7.",
        ],
      },
      {
        title: "Belote–Rebelote",
        items: [
          "Holding the King and Queen of trump together is the famous Belote–Rebelote declaration and is worth 20 points in the traditional game.",
        ],
      },
    ],
    tips: [
      {
        title: "Relearn the trump suit",
        body: "The Jack and 9 change value dramatically when they are trump. Evaluate them before judging the rest of the hand.",
      },
      {
        title: "Play as a partnership",
        body: "A trick already safe with your partner often does not need another valuable card from you.",
      },
    ],
    callout: "In Belote, trump rewrites the card hierarchy.",
  },

  "mau-mau-offline": {
    seoDescription:
      "Learn Mau Mau: match the discard pile by rank or suit, draw when you cannot play, use the active special-card rules, and be first to empty your hand.",
    about: [
      "Mau Mau belongs to the family of shedding games where players build one shared discard pile. A normal play matches the previous card by rank or suit; when no legal card is available, the player draws according to the selected rules.",
      "Special-card effects vary between Mau Mau rule sets, which is why the core website explanation stays version-neutral. The constant is the race to remove every card from your hand while managing what the next player is allowed to do.",
    ],
    objective:
      "Be the first player to empty your hand by matching the active rank or suit and using the selected special-card rules effectively.",
    facts: [
      { label: "Game family", value: "Shedding" },
      { label: "Core match", value: "Rank or suit" },
      { label: "When blocked", value: "Draw" },
      { label: "Win", value: "Empty your hand" },
    ],
    howToPlay: [
      {
        title: "Start the discard pile",
        body: "A face-up card establishes the rank and suit that the next play must respond to.",
      },
      {
        title: "Match rank or suit",
        body: "Play a card sharing the current rank or suit whenever the rules allow it.",
      },
      {
        title: "Use action cards",
        body: "Special cards can alter normal play depending on the chosen Mau Mau ruleset. Follow the effects shown by the game.",
      },
      {
        title: "Draw when blocked",
        body: "If you cannot make a legal play, draw according to the active rules and continue from the resulting state.",
      },
      {
        title: "Shed the final card",
        body: "The first player to remove all cards from their hand wins.",
      },
    ],
    tips: [
      {
        title: "Keep more than one suit alive",
        body: "A hand concentrated in a single suit can become awkward after the table changes direction.",
      },
      {
        title: "Time special cards",
        body: "Action cards are often most useful when they also improve your path to an empty hand, not merely because they are available.",
      },
    ],
    callout: "Match the table. Change the pressure. Lose the last card.",
  },

  "thousand-offline": {
    seoDescription:
      "Learn Thousand (1000): a 24-card Eastern European point-trick game with bidding, a three-card prikup, King–Queen marriages that set trump, and a race to 1000 points.",
    about: [
      "Thousand, or Тысяча, is a point-trick game from Eastern Europe. The core three-player game uses 24 cards — Ace, 10, King, Queen, Jack and 9 in each suit — with each card carrying a point value.",
      "Players bid for the right to become declarer. The winner of the auction takes the three-card prikup, adjusts the hand, and tries to score at least the amount promised. King–Queen marriages add bonus points and can establish a trump suit when declared.",
    ],
    objective:
      "Win card points and marriage bonuses, make your bids when you are declarer, and be the first player to reach 1000 points.",
    facts: [
      { label: "Core players", value: "3" },
      { label: "Deck", value: "24 cards" },
      { label: "Prikup", value: "3 cards" },
      { label: "Target", value: "1000 points" },
    ],
    howToPlay: [
      {
        title: "Deal around the prikup",
        body: "The three active players receive seven cards each and three cards are dealt face down into the central prikup.",
      },
      {
        title: "Bid for the contract",
        body: "Players raise the promised score or pass. The highest bidder becomes declarer.",
      },
      {
        title: "Take the prikup",
        body: "The declarer exposes and takes the three central cards, then redistributes/discards as required by the rules to restore the hand sizes.",
      },
      {
        title: "Play for card points",
        body: "Tricks contain point-bearing cards. Ace and 10 are especially valuable, while 9 carries no card points.",
      },
      {
        title: "Declare marriages",
        body: "Holding King and Queen of the same suit can earn a marriage bonus when legally announced and can establish that suit as trump.",
      },
      {
        title: "Make the bid",
        body: "The declarer needs enough trick points and declaration points to cover the contract. Scores accumulate toward 1000.",
      },
    ],
    ruleGroups: [
      {
        title: "Card values",
        items: [
          "Ace — 11 points.",
          "10 — 10 points.",
          "King — 4 points.",
          "Queen — 3 points.",
          "Jack — 2 points.",
          "9 — 0 points.",
        ],
      },
      {
        title: "Marriage bonuses",
        items: [
          "Hearts — 100 points.",
          "Diamonds — 80 points.",
          "Clubs — 60 points.",
          "Spades — 40 points.",
        ],
      },
    ],
    tips: [
      {
        title: "Bid the points, not the picture cards",
        body: "A visually strong hand is only useful if its trick points and marriage potential can realistically support the contract.",
      },
      {
        title: "Protect valuable tens and aces",
        body: "These cards carry most of the ordinary card points, so winning or losing the trick that contains one can swing the contract.",
      },
    ],
    callout: "Every bid is measured against 120 card points — plus the marriages you can prove.",
  },

  "omi-club": {
    seoDescription:
      "Learn Sri Lankan Omi: four players form two partnerships, use 32 cards, choose trump after the first four-card deal, follow suit, and fight for the majority of eight tricks.",
    about: [
      "Omi is a Sri Lankan partnership trick-taking game of the Whist family. Four players sit in fixed teams and use the top 32 cards of a standard deck: Ace through 7 in each suit.",
      "Its defining decision arrives halfway through the deal. After each player has four cards, the player to the dealer's right chooses trump based only on that partial hand. Four more cards are then dealt to everyone, and the teams contest eight tricks.",
    ],
    objective:
      "Work with your partner to win the required majority of tricks and build the team's match score.",
    facts: [
      { label: "Players", value: "4" },
      { label: "Teams", value: "2 partnerships" },
      { label: "Deck", value: "32 cards" },
      { label: "Tricks", value: "8 per deal" },
    ],
    howToPlay: [
      {
        title: "Deal four cards each",
        body: "The first half of the deal gives every player four cards.",
      },
      {
        title: "Choose trump",
        body: "The player to the dealer's right chooses the trump suit using only those first four cards.",
      },
      {
        title: "Complete the deal",
        body: "A second batch of four cards gives every player eight cards in total.",
      },
      {
        title: "Follow suit",
        body: "The player who chose trump leads first. Everyone must follow the led suit when possible.",
      },
      {
        title: "Resolve each trick",
        body: "Highest trump wins if trump was played; otherwise the highest card of the led suit wins. The winner leads next.",
      },
      {
        title: "Count the eight tricks",
        body: "Partnership scoring depends on which team chose trump and how many of the eight tricks each side captured.",
      },
    ],
    ruleGroups: [
      {
        title: "Card order",
        items: [
          "The playing deck contains A, K, Q, J, 10, 9, 8 and 7 in each suit.",
          "Those 32 cards rank in that same high-to-low order.",
        ],
      },
      {
        title: "Traditional match scoring",
        items: [
          "A 5–3, 6–2 or 7–1 result earns tokens, with the defending partnership rewarded more when it beats the side that selected trump.",
          "Winning all eight tricks is a special sweep commonly called Kapothi/Basthe in documented regional rules.",
        ],
      },
    ],
    tips: [
      {
        title: "Choose trump from shape, not hope",
        body: "With only four cards visible, length in a suit is usually a more dependable reason to choose it than one isolated high card.",
      },
      {
        title: "Do not fight your partner",
        body: "When your partner is already winning the trick, preserve your higher card unless there is a tactical reason to overtake.",
      },
    ],
    callout: "Choose trump after four cards — then live with the other four.",
  },

  "bhabhi-thulla-card-game": {
    seoDescription:
      "Learn Bhabhi Thulla (Getaway): follow suit, trigger a Thulla when you cannot, force the highest card of the led suit to pick up the trick, and avoid being last with cards.",
    about: [
      "Bhabhi Thulla, also known in rules references as Getaway, is a South Asian shedding game with an unusual trick-taking penalty. The aim is not to collect tricks but to get rid of every card.",
      "Players follow the suit that was led when possible. If a player cannot follow and throws a card of another suit — the Thulla — the trick stops, and the player who currently has the highest card of the led suit must pick up the cards played to that trick.",
    ],
    objective:
      "Get rid of your cards and leave the game safely; the last player still holding cards loses.",
    facts: [
      { label: "Players", value: "3–8 traditional" },
      { label: "Deck", value: "52 cards" },
      { label: "Core rule", value: "Follow suit if possible" },
      { label: "Lose condition", value: "Last player with cards" },
    ],
    howToPlay: [
      {
        title: "Begin the game",
        body: "The standard documented game starts with the Ace of Spades, after which normal lead control develops from the tricks.",
      },
      {
        title: "Follow the led suit",
        body: "If you have a card in the suit that was led, you must play that suit.",
      },
      {
        title: "Throw a Thulla when void",
        body: "If you cannot follow suit, you may play another suit. On normal later tricks this off-suit card ends the trick immediately.",
      },
      {
        title: "Make the high card pick up",
        body: "When a Thulla ends the trick, the player who played the highest card of the led suit takes all cards from that trick into their hand.",
      },
      {
        title: "Keep shedding",
        body: "Players gradually run out of cards and leave the game, subject to the lead/power rules when their final card wins a trick.",
      },
      {
        title: "Avoid being last",
        body: "When only one player remains with cards, that player is the loser.",
      },
    ],
    tips: [
      {
        title: "High cards can be dangerous",
        body: "Unlike ordinary trick-taking, winning the led suit at the wrong moment can force you to collect a Thulla pile.",
      },
      {
        title: "Track who is void",
        body: "Knowing that the next player lacks a suit can turn a seemingly safe lead into a pickup risk.",
      },
    ],
    callout: "Sometimes the highest card is the one that gets punished.",
  },
} as const satisfies Readonly<Record<string, GameDetails>>;

export type GameDetailsSlug = keyof typeof gameDetails;

export function getGameDetails(slug: string): GameDetails | undefined {
  return gameDetails[slug as GameDetailsSlug];
}
