/**
 * The hero mini game: geometry and rules.
 *
 * Everything here is pure, deterministic and framework free, so the board can
 * be reasoned about without reading a line of animation code.
 *
 * ## The shape
 *
 * The track is not a grid. It is a rounded square drawn as a real path and
 * sampled at even arc length, which is what gives the corners their curve and
 * lets every tile sit square to the direction of travel. A grid of identical
 * cells reads as a spreadsheet; a track with rhythm reads as a board.
 *
 * Coordinates are fractions of the field, 0 to 1, x rightward and y downward.
 * Nothing here is in pixels, so the same numbers serve a 320px phone slot and a
 * 480px desktop slot, and a resize can never strand a token.
 *
 * ## The rules
 *
 * Four players, one token each, taking turns clockwise. A roll of n from the
 * pod puts the token n - 1 tiles along its route, so nobody is stuck waiting
 * for a six. Twelve tiles of shared track, then the token turns inward off its
 * gate tile and climbs a three tile approach lane into the core. Landing on an
 * occupied tile that is not one of the four entry tiles sends that token home.
 *
 * Adjacent players share six tiles of track, so captures are common. Players
 * sitting opposite each other never meet, which is what keeps a match short.
 */

export type PlayerId = "red" | "blue" | "green" | "gold";

/** A place a token can stand, plus the heading of the track through it. */
export type Seat = { x: number; y: number; angle: number };

export type Player = {
  id: PlayerId;
  label: string;
  /**
   * Hex, and only used for the celebration: canvas-confetti parses hex and
   * nothing else. The board itself reads `--game-<id>` from globals.css, which
   * carries the same four colours.
   */
  hex: string;
  /** Ring index this token enters on. Also a safe tile. */
  start: number;
  /** Ring index the approach lane leaves from. */
  gate: number;
  /** Where the token waits before it enters. */
  pod: Seat;
  /** The three approach tiles, outermost first. */
  lane: Seat[];
  /** Every ring index this token travels, in order. */
  route: number[];
};

const CENTRE = 0.5;
/** Half-extent of the track centreline. */
const HALF = 0.3;
/** Corner radius of the track centreline. */
const CORNER = 0.1;
/** How far outside the track a pod sits. */
const POD_GAP = 0.1;
/** Where an approach lane stops, measured from the middle of the board. */
const LANE_MOUTH = 0.15;
/** Degrees an approach lane sweeps as it turns in. This is the pinwheel. */
const LANE_SWEEP = 16;

const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

export const RING_LENGTH = 24;
/** Tiles of shared track before a token turns in. */
export const RING_STEPS = 12;
/** Tiles in an approach lane. */
export const LANE_STEPS = 3;
/** The progress value that wins. */
export const FINISH = RING_STEPS + LANE_STEPS;

/** Diameter of a track tile, as a fraction of the field. */
export const TILE_SIZE = 0.072;
/** Approach tiles taper as they close on the core. */
export const LANE_SIZE = [0.062, 0.056, 0.05] as const;

export const CORE: Seat = { x: CENTRE, y: CENTRE, angle: 0 };

/** The four entry tiles. A token standing on one cannot be sent home. */
export const SAFE = new Set([0, 6, 12, 18]);

type Segment =
  | { kind: "line"; x0: number; y0: number; x1: number; y1: number; length: number }
  | { kind: "arc"; cx: number; cy: number; from: number; to: number; length: number };

const line = (x0: number, y0: number, x1: number, y1: number): Segment => ({
  kind: "line",
  x0,
  y0,
  x1,
  y1,
  length: Math.hypot(x1 - x0, y1 - y0),
});

const arc = (cx: number, cy: number, from: number, to: number): Segment => ({
  kind: "arc",
  cx,
  cy,
  from,
  to,
  length: Math.abs(to - from) * RAD * CORNER,
});

const INNER = HALF - CORNER;

/**
 * The track, clockwise from the middle of the top edge. Split so that tile 0
 * lands exactly on the top midpoint and tiles 6, 12 and 18 land exactly on the
 * other three: the whole board is symmetric under a quarter turn, which is what
 * lets one set of rules serve four players.
 */
const TRACK: Segment[] = [
  line(CENTRE, CENTRE - HALF, CENTRE + INNER, CENTRE - HALF),
  arc(CENTRE + INNER, CENTRE - INNER, -90, 0),
  line(CENTRE + HALF, CENTRE - INNER, CENTRE + HALF, CENTRE + INNER),
  arc(CENTRE + INNER, CENTRE + INNER, 0, 90),
  line(CENTRE + INNER, CENTRE + HALF, CENTRE - INNER, CENTRE + HALF),
  arc(CENTRE - INNER, CENTRE + INNER, 90, 180),
  line(CENTRE - HALF, CENTRE + INNER, CENTRE - HALF, CENTRE - INNER),
  arc(CENTRE - INNER, CENTRE - INNER, 180, 270),
  line(CENTRE - INNER, CENTRE - HALF, CENTRE, CENTRE - HALF),
];

const PERIMETER = TRACK.reduce((total, segment) => total + segment.length, 0);

/** The point and heading at a given arc length along the track. */
function sampleTrack(distance: number): Seat {
  let left = ((distance % PERIMETER) + PERIMETER) % PERIMETER;

  for (const segment of TRACK) {
    if (left > segment.length) {
      left -= segment.length;
      continue;
    }

    if (segment.kind === "line") {
      const t = left / segment.length;
      return {
        x: segment.x0 + (segment.x1 - segment.x0) * t,
        y: segment.y0 + (segment.y1 - segment.y0) * t,
        angle: Math.atan2(segment.y1 - segment.y0, segment.x1 - segment.x0) * DEG,
      };
    }

    const a = (segment.from + (segment.to - segment.from) * (left / segment.length)) * RAD;
    return {
      x: segment.cx + Math.cos(a) * CORNER,
      y: segment.cy + Math.sin(a) * CORNER,
      // Tangent of a clockwise arc, which is the normal turned a quarter.
      angle: Math.atan2(Math.cos(a), -Math.sin(a)) * DEG,
    };
  }

  return { x: CENTRE, y: CENTRE - HALF, angle: 0 };
}

export const RING: Seat[] = Array.from({ length: RING_LENGTH }, (_, index) =>
  sampleTrack((index * PERIMETER) / RING_LENGTH),
);

/** Straight out from the track at a tile, which is its heading turned a quarter. */
function outward(seat: Seat, distance: number): Seat {
  const a = (seat.angle - 90) * RAD;
  return {
    x: seat.x + Math.cos(a) * distance,
    y: seat.y + Math.sin(a) * distance,
    angle: seat.angle,
  };
}

/**
 * The approach lane: a spiral, not a spoke.
 *
 * Radius falls linearly from the gate to the mouth of the core while the angle
 * sweeps on in the direction of travel, so the four lanes read as a pinwheel
 * rather than a crosshair. It is also the honest shape: a token that turns in
 * off a corner is still moving forward when it does it.
 */
function laneFrom(gate: Seat): Seat[] {
  const dx = gate.x - CENTRE;
  const dy = gate.y - CENTRE;
  const radius = Math.hypot(dx, dy);
  const theta = Math.atan2(dy, dx) * DEG;

  return Array.from({ length: LANE_STEPS }, (_, index) => {
    const t = (index + 1) / LANE_STEPS;
    const r = radius + (LANE_MOUTH - radius) * t;
    const a = theta + LANE_SWEEP * t;
    return {
      x: CENTRE + Math.cos(a * RAD) * r,
      y: CENTRE + Math.sin(a * RAD) * r,
      angle: a + 90,
    };
  });
}

function build(id: PlayerId, label: string, hex: string, start: number): Player {
  const gate = (start + RING_STEPS - 1) % RING_LENGTH;
  return {
    id,
    label,
    hex,
    start,
    gate,
    pod: outward(RING[start], POD_GAP),
    lane: laneFrom(RING[gate]),
    route: Array.from({ length: RING_STEPS }, (_, step) => (start + step) % RING_LENGTH),
  };
}

/**
 * Turn order is clockwise round the board, so the play reads as travelling
 * rather than jumping about. The hexes mirror `--game-<id>` in globals.css.
 */
export const PLAYERS: readonly Player[] = [
  build("red", "Red", "#eb3845", 0),
  build("blue", "Blue", "#4a86c8", 6),
  build("green", "Green", "#3f9e7c", 12),
  build("gold", "Gold", "#d99b3d", 18),
];

/* ---- The progress ring ---------------------------------------------------
   Four arcs round the rim of the core, one per player, each sitting in the
   quarter its owner's pod is in. Kept here rather than in the markup because
   the fill has to be computed identically on the server and on every step.   */

/** Fraction of the ring one player's arc covers. Four arcs, four gaps. */
export const ARC_SPAN = 0.21;

/** Rotation of each arc, in PLAYERS order. Puts red at the top, and so on. */
export const ARC_ROTATION = [-127.8, -37.8, 52.2, 142.2] as const;

/** `stroke-dashoffset` for a token at this progress. Full at FINISH. */
export function arcOffset(progress: number): number {
  const filled = Math.max(0, Math.min(FINISH, progress)) / FINISH;
  return Number((ARC_SPAN * (1 - filled)).toFixed(5));
}

/** Where a token stands at a given progress. -1 is the pod, FINISH is the core. */
export function seatFor(player: Player, progress: number): Seat {
  if (progress < 0) return player.pod;
  if (progress < RING_STEPS) return RING[player.route[progress]];
  if (progress < FINISH) return player.lane[progress - RING_STEPS];
  return CORE;
}

/** The shared-track tile a token occupies, or undefined if it is not on one. */
export function ringIndexAt(player: Player, progress: number): number | undefined {
  if (progress < 0 || progress >= RING_STEPS) return undefined;
  return player.route[progress];
}

/** Which players' routes pass through a tile. Used for the route highlight. */
export function ownersOf(index: number): PlayerId[] {
  return PLAYERS.filter((player) => player.route.includes(index)).map((player) => player.id);
}

/**
 * Uniform 1 to 6. Rejection sampling, because the naive modulo of a 32 bit
 * value is very slightly biased toward the low faces, and a board that quietly
 * favours short moves is a board that plays the same match every time.
 */
export function rollDie(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const limit = Math.floor(0x1_0000_0000 / 6) * 6;
    const value = new Uint32Array(1);
    do {
      crypto.getRandomValues(value);
    } while ((value[0] ?? 0) >= limit);
    return ((value[0] ?? 0) % 6) + 1;
  }

  return Math.floor(Math.random() * 6) + 1;
}

/**
 * The opening tableau.
 *
 * This is what the server paints, what a visitor without scripting keeps, and
 * what reduced motion is left holding: a match already in progress, with a
 * token in a lane, two on the track and one still home. When motion is allowed
 * the tokens gather into their pods first, so the board is seen setting itself
 * up rather than snapping to a start.
 */
export const OPENING: Record<PlayerId, number> = {
  red: 13,
  blue: 4,
  green: 9,
  gold: -1,
};

/** The face the die rests on before anything has been rolled. */
export const OPENING_FACE = 5;
