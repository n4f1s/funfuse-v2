import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import {
  ARC_ROTATION,
  ARC_SPAN,
  LANE_SIZE,
  OPENING,
  OPENING_FACE,
  PLAYERS,
  RING,
  RING_LENGTH,
  RING_STEPS,
  SAFE,
  TILE_SIZE,
  arcOffset,
  ownersOf,
  seatFor,
  type Player,
  type Seat,
} from "./hero-board-game-board";

/**
 * The pieces the hero board is drawn from.
 *
 * All of it is server rendered. The client island adds motion on top and never
 * builds a node, so the board a visitor sees before hydration, without
 * scripting, or with reduced motion is the same board, in a composed position
 * rather than an empty one.
 *
 * Position comes in as custom properties rather than Tailwind classes because
 * every value is computed geometry: forty tiles at forty different points and
 * angles is not a set of utilities, it is a data structure.
 */

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

/** Places anything on the field at a seat, optionally square to the track. */
function seatVars(seat: Seat, size?: number, turn = true): CSSProperties {
  return {
    "--x": pct(seat.x),
    "--y": pct(seat.y),
    "--angle": turn ? `${seat.angle.toFixed(2)}deg` : "0deg",
    ...(size === undefined ? {} : { "--size": pct(size) }),
  } as CSSProperties;
}

/* -------------------------------------------------------------------------- */
/* Marks                                                                      */
/* -------------------------------------------------------------------------- */

/** The four-point spark that says "you are safe here". */
function SafeMark() {
  return (
    <svg viewBox="0 0 24 24" className="hero-game-mark" aria-hidden focusable="false">
      <path
        d="M12 1.5c.9 5.4 4.2 8.7 9.6 9.6v1.8c-5.4.9-8.7 4.2-9.6 9.6h-1.8c-.9-5.4-4.2-8.7-9.6-9.6v-1.8c5.4-.9 8.7-4.2 9.6-9.6z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Points the way off the track and into the approach lane. */
function GateMark() {
  return (
    <svg viewBox="0 0 24 24" className="hero-game-mark" aria-hidden focusable="false">
      <path
        d="M8.6 3.9 17 12l-8.4 8.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* The track                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * One tile of shared track.
 *
 * Four treatments, so the route has rhythm instead of forty identical squares:
 * a plain tile, an entry tile in its owner's colour, a spark on the safe tiles
 * and a chevron on the tile each player turns inward from.
 */
function TrackTile({ index }: { index: number }) {
  const start = PLAYERS.find((player) => player.start === index);
  const gate = PLAYERS.find((player) => player.gate === index);
  const owner = start ?? gate;
  const role = start ? "start" : gate ? "gate" : undefined;

  return (
    <span
      data-game-tile={index}
      data-role={role}
      data-owner={ownersOf(index).join(" ")}
      data-player={owner?.id}
      style={seatVars(RING[index], TILE_SIZE)}
      className={cn("hero-game-tile", SAFE.has(index) && "hero-game-tile-safe")}
    >
      <span className="hero-game-tile-face">
        {SAFE.has(index) ? <SafeMark /> : null}
        {gate ? <GateMark /> : null}
      </span>
    </span>
  );
}

/** The three tiles that climb from a gate into the core. */
function ApproachLane({ player }: { player: Player }) {
  return (
    <>
      {player.lane.map((seat, step) => (
        <span
          key={step}
          data-game-lane={`${player.id}:${step}`}
          data-player={player.id}
          data-step={step}
          // The lane behind a token is lit. Rendered rather than set on
          // hydration, so the composed board the server paints is complete.
          data-lit={OPENING[player.id] >= RING_STEPS + step ? "" : undefined}
          style={seatVars(seat, LANE_SIZE[step])}
          className="hero-game-lane"
        >
          <span className="hero-game-lane-face" />
        </span>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A launch pod, docked to the outside of the track at its owner's entry tile.
 *
 * One token each, so this is a berth rather than a yard: a rounded tab with a
 * recessed cradle, a count of pips that identifies the seat without a word of
 * text, and a halo that is lit while it is that player's turn. The whole tab is
 * rotated to the track, which is what lets one rule serve all four.
 */
function Pod({ player, index }: { player: Player; index: number }) {
  return (
    <span
      data-game-pod={player.id}
      data-player={player.id}
      // The board is painted mid-match, and red is up. Rendering the resting
      // turn here is what keeps reduced motion and no-script from showing a
      // board where nobody's turn it is.
      data-active={index === 0 ? "" : undefined}
      style={seatVars(player.pod)}
      className="hero-game-pod"
    >
      <span data-game-halo className="hero-game-pod-halo" />
      <span className="hero-game-pod-tab">
        <span className="hero-game-pod-cradle" />
        <span className="hero-game-pod-pips">
          {Array.from({ length: index + 1 }, (_, pip) => (
            <span key={pip} />
          ))}
        </span>
      </span>
      <span className="hero-game-pod-stem" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* The core                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The middle of the board: the goal, and the only readout on it.
 *
 * Four arcs round the rim, one per player, filling as that token advances. It
 * is the piece of information a spectator actually wants — who is close — and
 * it says it without a word or a number, which is what keeps the hero's own
 * text the only text on the page.
 */
function Core() {
  return (
    <div className="hero-game-core" aria-hidden>
      <svg viewBox="0 0 100 100" className="hero-game-arcs" focusable="false">
        {PLAYERS.map((player, index) => (
          <g key={player.id} data-player={player.id}>
            <circle
              className="hero-game-arc-track"
              cx="50"
              cy="50"
              r="42"
              pathLength={1}
              strokeDasharray={`${ARC_SPAN} 2`}
              transform={`rotate(${ARC_ROTATION[index]} 50 50)`}
            />
            <circle
              data-game-arc={player.id}
              className="hero-game-arc"
              cx="50"
              cy="50"
              r="42"
              pathLength={1}
              strokeDasharray={`${ARC_SPAN} 2`}
              strokeDashoffset={arcOffset(OPENING[player.id])}
              transform={`rotate(${ARC_ROTATION[index]} 50 50)`}
            />
          </g>
        ))}
      </svg>

      <div data-game-core className="hero-game-core-disc">
        <span className="hero-game-core-ring" />
        <span data-game-core-cap className="hero-game-core-cap">
          <SafeMark />
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tokens                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A token.
 *
 * Four nested layers, because four different things move it and none of them
 * should have to know about the others:
 *
 *   root      where it is on the board          GSAP, per turn
 *   hop       the arc of a single step          GSAP, per step
 *   flourish  the reaction to a tap or a hit    GSAP, on demand
 *   body      hover and press                   CSS, via `translate` / `scale`
 *
 * The contact shadow is a sibling of the stack rather than a filter on it: a
 * drop-shadow filter flattens 3D, and the board tilts.
 */
function Token({ player }: { player: Player }) {
  const seat = seatFor(player, OPENING[player.id]);

  return (
    <span
      data-game-token={player.id}
      data-player={player.id}
      style={{ left: pct(seat.x), top: pct(seat.y) }}
      className="hero-game-token"
    >
      <span data-game-shadow className="hero-game-token-shadow" />
      <span data-game-hop className="hero-game-token-hop">
        <span data-game-flourish className="hero-game-token-flourish">
          <span className="hero-game-token-body">
            <span className="hero-game-token-gloss" />
            <span className="hero-game-token-collar" />
          </span>
        </span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* The die                                                                    */
/* -------------------------------------------------------------------------- */

const PIPS: Record<number, readonly number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

/** Which way the cube turns to bring a face to the front. */
const FACE_POSE: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 0, y: 180 },
};

/**
 * A permanent three-quarter tilt on top of whichever face is up.
 *
 * Without it a cube showing one face is a square: its neighbours are exactly
 * edge on and take up no width at all. Fourteen degrees is enough to keep two
 * more faces in view, which is the difference between a die and a rounded
 * rectangle with dots on it.
 */
export const DIE_TILT = { x: -14, y: 17 };

export function diePose(face: number) {
  const pose = FACE_POSE[face] ?? FACE_POSE[1];
  return { x: pose.x + DIE_TILT.x, y: pose.y + DIE_TILT.y };
}

/** How each face is placed on the cube. Opposite faces sum to seven. */
const FACE_PLACEMENT: Record<number, string> = {
  1: "rotateY(0deg)",
  2: "rotateY(90deg)",
  3: "rotateX(90deg)",
  4: "rotateX(-90deg)",
  5: "rotateY(-90deg)",
  6: "rotateY(180deg)",
};

function DieFace({ face }: { face: number }) {
  const lit = new Set(PIPS[face]);

  return (
    <span
      className="hero-game-die-face"
      style={{ transform: `${FACE_PLACEMENT[face]} translateZ(var(--die-half))` }}
    >
      {Array.from({ length: 9 }, (_, cell) => (
        <span key={cell} className={cn("hero-game-pip", !lit.has(cell) && "hero-game-pip-off")} />
      ))}
    </span>
  );
}

/**
 * The die, and the one control on the board.
 *
 * A real button, not a clickable div: it is the single thing here a visitor can
 * actually do, so it takes focus, answers the keyboard and carries a name. Its
 * tray hangs off the bottom edge of the board the way a dice tray sits beside a
 * real one, which is also what keeps the middle of the board free for the goal.
 */
function Die() {
  const pose = diePose(OPENING_FACE);

  return (
    <button
      type="button"
      data-game-roll
      className="hero-game-tray"
      aria-label="Roll the die"
    >
      <span aria-hidden className="hero-game-tray-well" />
      <span aria-hidden data-game-tray-ring className="hero-game-tray-ring" />
      <span aria-hidden data-game-die-shadow className="hero-game-die-shadow" />
      <span
        aria-hidden
        data-game-die
        className="hero-game-die"
        style={{ transform: `rotateX(${pose.x}deg) rotateY(${pose.y}deg)` }}
      >
        {[1, 2, 3, 4, 5, 6].map((face) => (
          <DieFace key={face} face={face} />
        ))}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Chrome                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Whose turn it is, as four dots and a thumb that slides between them.
 *
 * It hangs off the top edge opposite the dice tray, so the board is anchored on
 * a diagonal rather than framed. No labels: the hero's headline is the text on
 * this half of the page and this is furniture.
 */
function TurnRail() {
  return (
    <div className="hero-game-rail" aria-hidden>
      <span data-game-thumb data-player={PLAYERS[0].id} className="hero-game-rail-thumb" />
      {PLAYERS.map((player, index) => (
        <span key={player.id} className="hero-game-rail-slot">
          <span
            data-game-chip={player.id}
            data-player={player.id}
            data-active={index === 0 ? "" : undefined}
            className="hero-game-chip"
          />
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The board                                                                  */
/* -------------------------------------------------------------------------- */

export function Board() {
  return (
    <>
      <div className="hero-game-plate" aria-hidden>
        <span className="hero-game-grain" />
        <span data-game-sheen className="hero-game-sheen" />
        <span className="hero-game-glow" />
      </div>

      <div data-game-field className="hero-game-field" aria-hidden>
        {/* Faint inner furniture. Gives the space between the track and the
            core something to be, without adding anything to read. */}
        <span className="hero-game-inner" />

        {Array.from({ length: RING_LENGTH }, (_, index) => (
          <TrackTile key={index} index={index} />
        ))}

        {PLAYERS.map((player) => (
          <ApproachLane key={player.id} player={player} />
        ))}

        <Core />

        {PLAYERS.map((player, index) => (
          <Pod key={player.id} player={player} index={index} />
        ))}

        {/* One shared impact, moved to wherever a capture happens. Six sparks
            and a ring is a celebration; sixty is a particle system. */}
        <span data-game-impact className="hero-game-impact">
          <span className="hero-game-impact-ring" />
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} data-game-spark className="hero-game-spark" />
          ))}
        </span>

        <span data-game-scrim className="hero-game-scrim" />

        <div className="hero-game-pieces">
          {PLAYERS.map((player) => (
            <Token key={player.id} player={player} />
          ))}
        </div>

        <div data-game-banner className="hero-game-banner">
          <span data-game-banner-dot className="hero-game-banner-dot" />
          <span data-game-banner-text className="hero-game-banner-text" />
        </div>

        {/* Nothing is drawn here. It is the point the confetti comes out of. */}
        <span data-game-burst className="hero-game-burst" />
      </div>

      <TurnRail />
      <Die />
    </>
  );
}
