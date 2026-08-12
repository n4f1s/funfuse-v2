/**
 * Mini Trick Table — the geometry and the scripted round.
 *
 * This is the only place the scene's numbers live. The client island reads it
 * to build the GSAP timeline, and the markup inlines the same values as custom
 * properties so `globals.css` can place a card, a seat chip or a won pile
 * without a second copy of the layout. Change a coordinate here and both the
 * animated and the static states follow.
 *
 * **The game is invented.** Mini Trick Table is not CallBreak, Tarneeb, Omi or
 * any other title in the catalogue: putting real rules on a decorative loop
 * would teach somebody the wrong ones. The round below is a fixed script that
 * happens to be internally consistent (follow the led suit if you hold it,
 * highest spade otherwise takes the trick), so a card player watching it will
 * not see a move that could not happen.
 *
 * Coordinates are fractions of the board box: `{ x: 0, y: 0 }` is its top left
 * corner, `{ x: 1, y: 1 }` its bottom right. Nothing here is in pixels, so the
 * same numbers drive a 340px phone board and a 1080px desktop one.
 */

export type SeatId = "north" | "east" | "south" | "west";
export type Suit = "spade" | "heart" | "diamond" | "club";

export type Point = { x: number; y: number };
export type Pose = Point & { rotate: number; scale?: number };

export const SUIT_GLYPH: Record<Suit, string> = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣",
};

/** The invented game's permanent trump, shown on the table as a chip. */
export const TRUMP: Suit = "spade";

/** The near seat is the one whose hand is dealt face up. */
export const NEAR_SEAT: SeatId = "south";

export const SEAT_LABEL: Record<SeatId, string> = {
  north: "Kai",
  east: "Rey",
  south: "You",
  west: "Mina",
};

export type SceneCard = {
  id: string;
  rank: string;
  suit: Suit;
  seat: SeatId;
  /** Dealt in the three seat composition as well as the four seat one. */
  compact: boolean;
};

/**
 * Sixteen cards, in DOM order. The compact board deals nine of them: three
 * seats of three. Everything else is hidden by a media query rather than
 * removed, so one server render serves both compositions.
 */
export const CARDS: readonly SceneCard[] = [
  { id: "s1", rank: "K", suit: "heart", seat: "south", compact: true },
  { id: "s2", rank: "7", suit: "spade", seat: "south", compact: true },
  { id: "s3", rank: "4", suit: "club", seat: "south", compact: true },
  { id: "s4", rank: "8", suit: "heart", seat: "south", compact: false },
  { id: "w1", rank: "9", suit: "heart", seat: "west", compact: true },
  { id: "w2", rank: "A", suit: "diamond", seat: "west", compact: true },
  { id: "w3", rank: "3", suit: "spade", seat: "west", compact: true },
  { id: "w4", rank: "J", suit: "club", seat: "west", compact: false },
  { id: "n1", rank: "A", suit: "heart", seat: "north", compact: false },
  { id: "n2", rank: "Q", suit: "diamond", seat: "north", compact: false },
  { id: "n3", rank: "8", suit: "spade", seat: "north", compact: false },
  { id: "n4", rank: "6", suit: "club", seat: "north", compact: false },
  { id: "e1", rank: "4", suit: "heart", seat: "east", compact: true },
  { id: "e2", rank: "J", suit: "diamond", seat: "east", compact: true },
  { id: "e3", rank: "10", suit: "spade", seat: "east", compact: true },
  { id: "e4", rank: "Q", suit: "club", seat: "east", compact: false },
];

export type SeatLayout = {
  /** Centre of the fanned hand. */
  hand: Point;
  /** Which way the fan opens: along the board's width or its height. */
  axis: "x" | "y";
  /** Rotation of a card held at this seat, before the fan spreads it. */
  tilt: number;
  /** Distance between two neighbouring cards in the fan. */
  spread: number;
  /** Arc across the fan. Outer cards sit this much further from the table. */
  bow: number;
  /** Degrees of rotation between two neighbouring cards. */
  rotation: number;
  /** Seat name and trick count. */
  chip: Point;
  /** Where the tricks this seat wins stack up. */
  pile: Point;
  /** Where its card lands in the centre. */
  play: Pose;
};

type Play = { seat: SeatId; card: string };

export type Trick = {
  plays: readonly Play[];
  winner: SeatId;
  /** The card that takes it. */
  card: string;
  /** What the table says when it is taken. Short: it reads for one beat. */
  banner: string;
};

export type Layout = {
  key: "compact" | "wide";
  /** Board width divided by height. */
  aspect: number;
  /** Card size, as a fraction of the board's width and of its height. */
  card: { width: number; height: number };
  /** Where the deck squares up, and the home slot every card is placed at. */
  deck: Point;
  /** Centre of the trick zone. */
  centre: Point;
  seats: Partial<Record<SeatId, SeatLayout>>;
  /** Seating order, clockwise from the near seat. */
  order: readonly SeatId[];
  hands: Partial<Record<SeatId, readonly string[]>>;
  tricks: readonly Trick[];
  /** Where the celebration bursts from. */
  burst: Point;
};

/**
 * Four seats around a wide table.
 *
 * The side hands are held sideways, which is what stops the composition from
 * reading as four identical rows of cards, and gives the played card a real
 * rotation to unwind on its way to the centre.
 */
export const WIDE: Layout = {
  key: "wide",
  aspect: 1.75,
  // height = width * 7/5 * aspect, because the card is 5:7 and the board is
  // measured in two different axes.
  card: { width: 0.062, height: 0.062 * 1.4 * 1.75 },
  deck: { x: 0.5, y: 0.5 },
  centre: { x: 0.5, y: 0.5 },
  order: ["south", "west", "north", "east"],
  seats: {
    north: {
      hand: { x: 0.5, y: 0.215 },
      axis: "x",
      tilt: 0,
      spread: 0.05,
      bow: -0.014,
      rotation: 9,
      chip: { x: 0.5, y: 0.048 },
      pile: { x: 0.7, y: 0.215 },
      play: { x: 0.5, y: 0.44, rotate: -6 },
    },
    east: {
      hand: { x: 0.85, y: 0.5 },
      axis: "y",
      tilt: -90,
      spread: 0.062,
      bow: 0.008,
      rotation: 9,
      chip: { x: 0.85, y: 0.735 },
      pile: { x: 0.85, y: 0.275 },
      play: { x: 0.556, y: 0.506, rotate: 8 },
    },
    south: {
      hand: { x: 0.5, y: 0.785 },
      axis: "x",
      tilt: 0,
      spread: 0.05,
      bow: 0.014,
      rotation: 9,
      chip: { x: 0.5, y: 0.952 },
      pile: { x: 0.3, y: 0.785 },
      play: { x: 0.5, y: 0.562, rotate: 5 },
    },
    west: {
      hand: { x: 0.15, y: 0.5 },
      axis: "y",
      tilt: 90,
      spread: 0.062,
      bow: -0.008,
      rotation: 9,
      chip: { x: 0.15, y: 0.275 },
      pile: { x: 0.15, y: 0.735 },
      play: { x: 0.444, y: 0.494, rotate: -9 },
    },
  },
  hands: {
    south: ["s1", "s2", "s3", "s4"],
    west: ["w1", "w2", "w3", "w4"],
    north: ["n1", "n2", "n3", "n4"],
    east: ["e1", "e2", "e3", "e4"],
  },
  tricks: [
    {
      // Hearts led, everybody holds one, the ace takes it.
      plays: [
        { seat: "south", card: "s1" },
        { seat: "west", card: "w1" },
        { seat: "north", card: "n1" },
        { seat: "east", card: "e1" },
      ],
      winner: "north",
      card: "n1",
      banner: `${SEAT_LABEL.north} takes it`,
    },
    {
      // Diamonds led. The near seat is out of them, so a low spade beats the
      // ace. This is the beat the whole loop is built around.
      plays: [
        { seat: "north", card: "n2" },
        { seat: "east", card: "e2" },
        { seat: "south", card: "s2" },
        { seat: "west", card: "w2" },
      ],
      winner: "south",
      card: "s2",
      banner: "Trump takes it",
    },
  ],
  burst: { x: 0.5, y: 0.72 },
};

/**
 * Three seats on a portrait board.
 *
 * Not the wide table scaled down. A phone gets a shorter round, a quarter
 * fewer cards in the air at once, and every hand fanned the same way up, which
 * is the only way the ranks stay readable at this size.
 */
export const COMPACT: Layout = {
  key: "compact",
  aspect: 0.82,
  card: { width: 0.135, height: 0.135 * 1.4 * 0.82 },
  deck: { x: 0.5, y: 0.53 },
  centre: { x: 0.5, y: 0.53 },
  order: ["south", "west", "east"],
  seats: {
    east: {
      hand: { x: 0.755, y: 0.255 },
      axis: "x",
      tilt: 0,
      spread: 0.075,
      bow: -0.012,
      rotation: 10,
      chip: { x: 0.8, y: 0.108 },
      pile: { x: 0.925, y: 0.47 },
      play: { x: 0.565, y: 0.515, rotate: 7 },
    },
    south: {
      hand: { x: 0.5, y: 0.795 },
      axis: "x",
      tilt: 0,
      spread: 0.075,
      bow: 0.012,
      rotation: 10,
      chip: { x: 0.5, y: 0.95 },
      pile: { x: 0.855, y: 0.8 },
      play: { x: 0.5, y: 0.585, rotate: 4 },
    },
    west: {
      hand: { x: 0.245, y: 0.255 },
      axis: "x",
      tilt: 0,
      spread: 0.075,
      bow: -0.012,
      rotation: 10,
      chip: { x: 0.2, y: 0.108 },
      pile: { x: 0.075, y: 0.47 },
      play: { x: 0.435, y: 0.5, rotate: -8 },
    },
  },
  hands: {
    south: ["s1", "s2", "s3"],
    west: ["w1", "w2", "w3"],
    east: ["e1", "e2", "e3"],
  },
  tricks: [
    {
      plays: [
        { seat: "south", card: "s1" },
        { seat: "west", card: "w1" },
        { seat: "east", card: "e1" },
      ],
      winner: "south",
      card: "s1",
      banner: `${SEAT_LABEL.south} take it`,
    },
    {
      // Clubs led and neither opponent holds one, so both cut. The higher
      // spade wins.
      plays: [
        { seat: "south", card: "s3" },
        { seat: "west", card: "w3" },
        { seat: "east", card: "e3" },
      ],
      winner: "east",
      card: "e3",
      banner: "Trump takes it",
    },
  ],
  burst: { x: 0.755, y: 0.34 },
};

export function handOf(layout: Layout, seat: SeatId): readonly string[] {
  return layout.hands[seat] ?? [];
}

/** The cards a given composition actually deals, in DOM order. */
export function cardsIn(layout: Layout): readonly SceneCard[] {
  return layout.key === "wide" ? CARDS : CARDS.filter((card) => card.compact);
}

/** Where a card sits when it is the `index`th of a `count` card hand. */
export function fanPose(geo: SeatLayout, index: number, count: number): Pose {
  const offset = index - (count - 1) / 2;
  const arc = geo.bow * offset * offset;
  const rotate = geo.tilt + offset * geo.rotation;

  return geo.axis === "x"
    ? { x: geo.hand.x + offset * geo.spread, y: geo.hand.y + arc, rotate }
    : { x: geo.hand.x + arc, y: geo.hand.y + offset * geo.spread, rotate };
}

/** Where the `depth`th card of a won pile lands. Small, squared up, stacked. */
export function pilePose(geo: SeatLayout, depth: number): Pose {
  return {
    x: geo.pile.x + depth * 0.0016,
    y: geo.pile.y - depth * 0.0022,
    rotate: geo.tilt + (depth % 2 === 0 ? 2.5 : -2.5),
    scale: 0.62,
  };
}

/**
 * Where the `index`th card sits in the squared up deck. The offsets are tiny
 * on purpose: a deck is a solid block with a little life in it, not a fan.
 */
export function deckPose(layout: Layout, index: number): Pose {
  return {
    x: layout.deck.x + ((index % 3) - 1) * 0.0012,
    y: layout.deck.y - index * 0.0007,
    rotate: ((index % 5) - 2) * 0.9,
  };
}

/**
 * A pose as GSAP transform values.
 *
 * `xPercent` and `yPercent` are percentages of the card's own size, which is
 * itself a percentage of the board. That makes every position resolution
 * independent: the timeline never measures anything, and a resize cannot put a
 * card in the wrong place mid-flight.
 */
export function toVars(layout: Layout, pose: Pose) {
  return {
    xPercent: ((pose.x - layout.deck.x) / layout.card.width) * 100,
    yPercent: ((pose.y - layout.deck.y) / layout.card.height) * 100,
    rotation: pose.rotate,
    scale: pose.scale ?? 1,
  };
}

/** The same pose as a CSS transform, for the states GSAP never reaches. */
export function toTransform(layout: Layout, pose: Pose): string {
  const vars = toVars(layout, pose);
  const round = (value: number) => Number(value.toFixed(2));

  return `translate(${round(vars.xPercent)}%, ${round(vars.yPercent)}%) rotate(${round(
    vars.rotation,
  )}deg) scale(${round(vars.scale)})`;
}

/**
 * The resting tableau: the first trick complete, hands short by a card, the
 * winning card lit. It is what a reduced-motion visitor and a browser with no
 * JavaScript get, so it has to be a table worth looking at rather than an
 * empty felt or a stack of card backs.
 */
export function restPose(layout: Layout, cardId: string): Pose | undefined {
  const [first] = layout.tricks;
  const played = first.plays.find((play) => play.card === cardId);

  if (played) return layout.seats[played.seat]?.play;

  for (const seat of layout.order) {
    const hand = handOf(layout, seat).filter(
      (id) => !first.plays.some((play) => play.card === id),
    );
    const index = hand.indexOf(cardId);
    const geo = layout.seats[seat];

    if (index >= 0 && geo) return fanPose(geo, index, hand.length);
  }

  return undefined;
}

/** Cards showing their face in the resting tableau. */
export function restFaceUp(cardId: string): boolean {
  const card = CARDS.find((entry) => entry.id === cardId);
  if (!card) return false;

  const played = [WIDE, COMPACT].some((layout) =>
    layout.tricks[0].plays.some((play) => play.card === cardId),
  );

  return played || card.seat === NEAR_SEAT;
}
