"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { celebrate } from "@/lib/motion/confetti";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

import {
  arcOffset,
  FINISH,
  OPENING,
  OPENING_FACE,
  PLAYERS,
  RING_STEPS,
  SAFE,
  ringIndexAt,
  rollDie,
  seatFor,
  type Player,
  type PlayerId,
} from "./hero-board-game-board";
import { Board, diePose } from "./hero-board-game-parts";

/**
 * The hero mini game.
 *
 * A four player race that plays itself, and answers a visitor who touches it.
 * The catalogue is card and board games, and the hero's job is to say so before
 * a word is read: a still image of a board says a studio has a board, a board
 * that rolls, moves, takes a piece and celebrates says a studio makes games.
 *
 * ## What React owns and what GSAP owns
 *
 * React renders the board once and never re-renders it. There is no state in
 * this component at all. Progress lives in a `Map` inside the effect, and every
 * frame of motion is a GSAP tween writing `transform` and `opacity`. A hero
 * animation that re-rendered a hundred nodes per turn would be the most
 * expensive thing on the page.
 *
 * CSS owns hover, press and focus. GSAP owns the choreography. They never touch
 * the same property on the same node: states use the `translate` / `rotate` /
 * `scale` properties, choreography uses `transform`, and the browser composes
 * the two.
 *
 * ## One clock
 *
 * There is exactly one pending timer (`pending`) and one running timeline
 * (`turn`). Autoplay, the manual roll and the restart all go through the same
 * `playTurn`, so there is no second, fake game running beside the real one, and
 * a click can never land a turn on top of one already playing.
 *
 * ## What stops it
 *
 * Off screen, backgrounded tab, or reduced motion. The last of those never
 * builds a timeline at all: the server already painted a composed match, so a
 * visitor who asked for less motion gets a finished piece of artwork rather
 * than an empty grid.
 */

/* ---- Tempo ---------------------------------------------------------------
   A turn is a sentence: it takes a breath, rolls, is read, moves, and lands.
   Fast enough that a match runs about half a minute, slow enough that the beat
   between the die settling and the token moving is legible.                */

const ROLL_AT = 0.06;
const ROLL_TIME = 0.46;
/** The read. The gap between the die settling and the token leaving. */
const MOVE_AT = ROLL_AT + ROLL_TIME + 0.16;
const STEP = 0.135;
const LAND = 0.2;
const HANDOFF = 0.26;
const CAPTURE_TIME = 0.78;
const WIN_HOLD = 2.25;
const OPEN_GAP = 0.5;

/** How long a visitor keeps the die after touching it. */
const IDLE_RESUME = 4.5;
/** A match that somehow stalls is ended rather than left running forever. */
const TURN_LIMIT = 56;

type TokenRefs = {
  root: HTMLElement;
  hop: HTMLElement;
  flourish: HTMLElement;
  shadow: HTMLElement;
};

export function HeroBoardGame({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = stage.current;
      if (!root) return;

      const pick = <T extends HTMLElement>(selector: string): T | null =>
        root.querySelector<T>(selector);

      const field = pick("[data-game-field]");
      const tilt = pick("[data-game-tilt]");
      const die = pick("[data-game-die]");
      const dieShadow = pick("[data-game-die-shadow]");
      const trayRing = pick("[data-game-tray-ring]");
      const roll = pick<HTMLButtonElement>("[data-game-roll]");
      const thumb = pick("[data-game-thumb]");
      const core = pick("[data-game-core]");
      const coreCap = pick("[data-game-core-cap]");
      const scrim = pick("[data-game-scrim]");
      const banner = pick("[data-game-banner]");
      const bannerText = pick("[data-game-banner-text]");
      const bannerDot = pick("[data-game-banner-dot]");
      const burst = pick("[data-game-burst]");
      const impact = pick("[data-game-impact]");
      const impactRing = pick(".hero-game-impact-ring");

      if (
        !field ||
        !tilt ||
        !die ||
        !dieShadow ||
        !trayRing ||
        !roll ||
        !thumb ||
        !core ||
        !coreCap ||
        !scrim ||
        !banner ||
        !bannerText ||
        !bannerDot ||
        !burst ||
        !impact ||
        !impactRing
      ) {
        return;
      }

      try {
        registerGsap();

        const sparks = gsap.utils.toArray<HTMLElement>("[data-game-spark]", root);

        // The face, never the tile. A tile carries its position and its
        // heading in the `translate` and `rotate` properties, and the first
        // GSAP transform on an element folds those into `transform` and sets
        // them to `none` inline. Pulsing the tile itself would therefore drop
        // it out of the track the first time a piece landed on it.
        const tiles = new Map<number, HTMLElement>();
        for (const tile of gsap.utils.toArray<HTMLElement>("[data-game-tile]", root)) {
          const face = tile.querySelector<HTMLElement>(".hero-game-tile-face");
          if (face) tiles.set(Number(tile.dataset.gameTile), face);
        }

        const tokens = new Map<PlayerId, TokenRefs>();
        const pods = new Map<PlayerId, { root: HTMLElement; halo: HTMLElement }>();
        const chips = new Map<PlayerId, HTMLElement>();
        const arcs = new Map<PlayerId, SVGCircleElement>();
        const lanes = new Map<PlayerId, HTMLElement[]>();

        for (const player of PLAYERS) {
          const token = pick(`[data-game-token="${player.id}"]`);
          const hop = token?.querySelector<HTMLElement>("[data-game-hop]");
          const flourish = token?.querySelector<HTMLElement>("[data-game-flourish]");
          const shadow = token?.querySelector<HTMLElement>("[data-game-shadow]");
          const pod = pick(`[data-game-pod="${player.id}"]`);
          const halo = pod?.querySelector<HTMLElement>("[data-game-halo]");
          const chip = pick(`[data-game-chip="${player.id}"]`);
          const arc = root.querySelector<SVGCircleElement>(`[data-game-arc="${player.id}"]`);

          if (!token || !hop || !flourish || !shadow || !pod || !halo || !chip || !arc) return;

          tokens.set(player.id, { root: token, hop, flourish, shadow });
          pods.set(player.id, { root: pod, halo });
          chips.set(player.id, chip);
          arcs.set(player.id, arc);
          lanes.set(
            player.id,
            gsap.utils.toArray<HTMLElement>(`[data-game-lane^="${player.id}:"]`, root),
          );
        }

        /* ---- State ------------------------------------------------------ */

        // Seeded with the tableau the server painted, not with an empty board.
        // The ResizeObserver below fires once as soon as it is attached, and a
        // map that already said "everyone is home" would place every token in
        // its pod before the opening had a chance to walk them there.
        const progress = new Map<PlayerId, number>(
          PLAYERS.map((player) => [player.id, OPENING[player.id]]),
        );
        let size = field.clientWidth || 1;
        let seat = 0;
        let played = 0;
        let phase: "idle" | "turn" | "winner" = "idle";
        let running = false;
        let opened = false;
        let spinX = 0;
        let spinY = 0;
        let lastTouched = 0;

        let turn: gsap.core.Timeline | undefined;
        let pending: gsap.core.Tween | undefined;
        let ambient: gsap.core.Timeline | undefined;
        let halo: gsap.core.Tween | undefined;
        let focusOff: gsap.core.Tween | undefined;

        const moving = () => [
          ...[...tokens.values()].flatMap((token) => [token.root, token.hop]),
          die,
        ];

        /* ---- Placement --------------------------------------------------- */

        const px = (fraction: number) => fraction * size;

        const place = (player: Player, value: number) => {
          const token = tokens.get(player.id);
          if (!token) return;
          const point = seatFor(player, value);
          gsap.set(token.root, { x: px(point.x), y: px(point.y) });
        };

        const measure = () => {
          size = field.clientWidth || size;
          if (turn?.isActive()) return;
          for (const player of PLAYERS) place(player, progress.get(player.id) ?? -1);
          gsap.set(impact, { x: px(0.5), y: px(0.5) });
        };

        /* ---- Board state ------------------------------------------------- */

        const setArc = (player: Player, value: number) => {
          const arc = arcs.get(player.id);
          if (arc) arc.style.strokeDashoffset = String(arcOffset(value));
        };

        const lightLane = (player: Player, value: number) => {
          lanes.get(player.id)?.forEach((tile, step) => {
            tile.toggleAttribute("data-lit", value >= RING_STEPS + step);
          });
        };

        const setActive = (player: Player) => {
          root.dataset.turn = player.id;
          thumb.dataset.player = player.id;

          // The podium slides with a little overshoot and the piece taking the
          // turn lands on it. Two beats rather than one: a marker that only
          // brightens is a state change, a marker that arrives is a handover.
          gsap.to(thumb, {
            xPercent: PLAYERS.indexOf(player) * 100,
            duration: 0.42,
            ease: "back.out(1.7)",
            overwrite: "auto",
          });

          for (const other of PLAYERS) {
            const active = other.id === player.id;
            chips.get(other.id)?.toggleAttribute("data-active", active);
            pods.get(other.id)?.root.toggleAttribute("data-active", active);
          }

          // The pop goes on the slot, not on the marker inside it. The marker's
          // active state is the `scale` and `translate` properties, and GSAP
          // zeroes those on any element it transforms. Scaling the slot moves
          // the marker just the same and leaves its state alone.
          const slot = chips.get(player.id)?.parentElement;
          if (slot) {
            gsap.fromTo(
              slot,
              { scale: 0.82 },
              { scale: 1, duration: 0.5, ease: "back.out(3)", overwrite: "auto" },
            );
          }

          // One looping tween, retargeted, rather than a CSS keyframe per pod:
          // a keyframe would keep four compositor layers alive for a state only
          // one pod is ever in.
          halo?.kill();
          const lit = pods.get(player.id)?.halo;
          if (!lit) return;
          gsap.set(lit, { opacity: 0.34, scale: 1 });
          halo = gsap.to(lit, {
            opacity: 0.92,
            scale: 1.07,
            duration: 1.05,
            ease: ease.loop,
            yoyo: true,
            repeat: -1,
          });
        };

        /* ---- The die ----------------------------------------------------- */

        const rollTo = (line: gsap.core.Timeline, face: number, at: number) => {
          spinX += 2;
          spinY += 3;
          const pose = diePose(face);
          const lift = ROLL_TIME * 0.4;

          line
            .to(
              die,
              {
                rotationX: pose.x + spinX * 360,
                rotationY: pose.y + spinY * 360,
                duration: ROLL_TIME,
                ease: "power3.out",
              },
              at,
            )
            .to(die, { y: () => -px(0.04), duration: lift, ease: "power2.out" }, at)
            .to(die, { y: 0, duration: ROLL_TIME - lift, ease: "power3.in" }, at + lift)
            .to(dieShadow, { scale: 0.68, opacity: 0.4, duration: lift, ease: "power2.out" }, at)
            .to(
              dieShadow,
              { scale: 1, opacity: 1, duration: ROLL_TIME - lift, ease: "power3.in" },
              at + lift,
            )
            // The settle. A die that stops dead at the exact angle it was aimed
            // at is a rotation; this is a die coming to rest.
            .to(die, { rotationZ: 5, duration: 0.09, ease: "power2.out" }, at + ROLL_TIME)
            .to(die, { rotationZ: 0, duration: 0.24, ease: "back.out(2.4)" }, at + ROLL_TIME + 0.09)
            .fromTo(
              trayRing,
              { scale: 1, autoAlpha: 0.75 },
              { scale: 1.24, autoAlpha: 0, duration: 0.46, ease: ease.out, overwrite: "auto" },
              at + ROLL_TIME,
            )
            .set(trayRing, { scale: 1, autoAlpha: 0.5 }, at + ROLL_TIME + 0.46);
        };

        /* ---- Movement ---------------------------------------------------- */

        const stepTo = (
          line: gsap.core.Timeline,
          player: Player,
          value: number,
          at: number,
          last: boolean,
        ) => {
          const token = tokens.get(player.id);
          if (!token) return at;
          const point = seatFor(player, value);
          const rise = STEP * 0.46;

          line
            .to(
              token.root,
              {
                x: () => px(point.x),
                y: () => px(point.y),
                duration: STEP,
                ease: "power1.inOut",
              },
              at,
            )
            // The hop is the arc. Splitting it off the travel means it reads the
            // same whichever way the token is going, including round a corner.
            .to(
              token.hop,
              { y: () => -px(last ? 0.03 : 0.022), scale: 1.05, duration: rise, ease: "power2.out" },
              at,
            )
            .to(token.hop, { y: 0, scale: 1, duration: STEP - rise, ease: "power2.in" }, at + rise)
            .to(
              token.shadow,
              { scale: 0.7, opacity: 0.4, duration: rise, ease: "power2.out" },
              at,
            )
            .to(
              token.shadow,
              { scale: 1, opacity: 1, duration: STEP - rise, ease: "power2.in" },
              at + rise,
            );

          // The readout moves with the token, not with the decision. Doing this
          // on the timeline rather than while it is being built is the
          // difference between an arc that fills as a token walks and one that
          // jumps the moment the die is picked up.
          line.call(
            () => {
              setArc(player, value);
              lightLane(player, value);
            },
            undefined,
            at + STEP * 0.6,
          );

          const index = ringIndexAt(player, value);
          const tile = index === undefined ? undefined : tiles.get(index);
          if (tile) {
            line.fromTo(
              tile,
              { scale: 1 },
              {
                scale: last ? 1.16 : 1.08,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
                overwrite: "auto",
              },
              at + STEP * 0.7,
            );
          }

          if (last) {
            line
              .to(
                token.flourish,
                { scaleX: 1.1, scaleY: 0.9, duration: 0.08, ease: "power2.out" },
                at + STEP,
              )
              .to(
                token.flourish,
                { scaleX: 1, scaleY: 1, duration: LAND, ease: "back.out(2.6)" },
                at + STEP + 0.08,
              );
          }

          return at + STEP;
        };

        /* ---- Capture ------------------------------------------------------ */

        const takeToken = (
          line: gsap.core.Timeline,
          victim: Player,
          from: { x: number; y: number },
          at: number,
        ) => {
          const token = tokens.get(victim.id);
          if (!token) return at;

          progress.set(victim.id, -1);

          // Knocked outward off the track and then carried home. Away from the
          // middle rather than away from the attacker, because the middle is
          // what the token has just lost its place in the race for, and it is
          // the one direction that is never into another piece.
          const angle = Math.atan2(from.y - 0.5, from.x - 0.5);
          const knock = 0.038;

          line
            .call(
              () => {
                gsap.set(impact, { x: px(from.x), y: px(from.y) });
                setArc(victim, -1);
                lightLane(victim, -1);
              },
              undefined,
              at,
            )
            .fromTo(
              impactRing,
              { scale: 0.35, autoAlpha: 0.85 },
              { scale: 2.2, autoAlpha: 0, duration: 0.52, ease: ease.out, overwrite: "auto" },
              at,
            )
            .fromTo(
              sparks,
              { x: 0, y: 0, scale: 0.7, autoAlpha: 1 },
              {
                x: (index: number) => Math.cos((index / sparks.length) * Math.PI * 2) * px(0.042),
                y: (index: number) => Math.sin((index / sparks.length) * Math.PI * 2) * px(0.042),
                scale: 0,
                autoAlpha: 0,
                duration: 0.46,
                ease: ease.out,
                overwrite: "auto",
              },
              at + 0.03,
            )
            .to(
              token.flourish,
              { scaleX: 1.24, scaleY: 0.76, duration: 0.09, ease: "power2.out", overwrite: "auto" },
              at,
            )
            .to(
              token.flourish,
              { scaleX: 1, scaleY: 1, duration: 0.3, ease: "back.out(3)" },
              at + 0.09,
            )
            .to(
              token.root,
              {
                x: () => px(from.x + Math.cos(angle) * knock),
                y: () => px(from.y + Math.sin(angle) * knock),
                duration: 0.17,
                ease: "power2.out",
              },
              at + 0.02,
            )
            .to(
              token.root,
              {
                x: () => px(victim.pod.x),
                y: () => px(victim.pod.y),
                duration: 0.52,
                ease: "power2.inOut",
              },
              at + 0.2,
            )
            .to(token.hop, { y: () => -px(0.055), duration: 0.26, ease: "power2.out" }, at + 0.2)
            .to(token.hop, { y: 0, duration: 0.26, ease: "power2.in" }, at + 0.46)
            // A whole turn, so the piece always comes to rest square. A partial
            // spin would have to be unwound at the reset, and unwinding it is a
            // token spinning backwards for no reason anybody can see.
            .to(token.hop, { rotation: "+=360", duration: 0.52, ease: ease.out }, at + 0.2)
            .to(token.shadow, { scale: 0.6, opacity: 0.3, duration: 0.26, ease: "power2.out" }, at + 0.2)
            .to(token.shadow, { scale: 1, opacity: 1, duration: 0.26, ease: "power2.in" }, at + 0.46);

          return at + CAPTURE_TIME;
        };

        /* ---- Winning ------------------------------------------------------ */

        const win = (line: gsap.core.Timeline, winner: Player, at: number) => {
          phase = "winner";
          // The celebration and the reset are appended to this same timeline,
          // and `openMatch` closes it out. Leaving the turn's own `onComplete`
          // attached would advance the seat a second time behind the reset.
          line.eventCallback("onComplete", null);

          const token = tokens.get(winner.id);
          bannerText.textContent = `${winner.label.toUpperCase()} WINS`;
          bannerDot.dataset.player = winner.id;
          banner.dataset.player = winner.id;
          core.dataset.player = winner.id;

          const others = PLAYERS.filter((player) => player.id !== winner.id)
            .map((player) => tokens.get(player.id))
            .filter((entry): entry is TokenRefs => Boolean(entry));

          line
            .to(scrim, { autoAlpha: 1, duration: 0.36, ease: ease.out }, at)
            .call(
              () => {
                core.setAttribute("data-won", "");
              },
              undefined,
              at + 0.04,
            )
            .to(core, { scale: 1.14, duration: 0.2, ease: "power2.out" }, at + 0.06)
            .to(core, { scale: 1.04, duration: 0.4, ease: "back.out(2.2)" }, at + 0.26)
            .to(
              others.map((entry) => entry.flourish),
              { scale: 0.9, opacity: 0.42, duration: 0.36, ease: ease.out, overwrite: "auto" },
              at + 0.1,
            );

          if (token) {
            line
              .to(
                token.flourish,
                { scale: 1.26, y: () => -px(0.036), duration: 0.34, ease: "back.out(2)", overwrite: "auto" },
                at + 0.12,
              )
              .to(
                token.flourish,
                { y: () => -px(0.027), duration: 0.9, ease: ease.loop, yoyo: true, repeat: 1 },
                at + 0.46,
              );
          }

          line
            .set(banner, { y: () => px(0.05), scale: 0.94 }, at + 0.3)
            .to(banner, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: ease.out }, at + 0.32)
            .call(
              () => {
                // Fired from the middle of the board rather than the middle of
                // the window, so the paper comes out of the thing that was won.
                celebrate(burst, "modest", [winner.hex, "#eb3845", "#ffc9c5", "#ffffff"]);
              },
              undefined,
              at + 0.36,
            );

          const out = at + WIN_HOLD;

          line
            .to(banner, { autoAlpha: 0, y: () => -px(0.03), duration: 0.28, ease: ease.out }, out)
            .to(scrim, { autoAlpha: 0, duration: 0.34, ease: ease.out }, out + 0.12)
            .call(
              () => {
                core.removeAttribute("data-won");
                core.removeAttribute("data-player");
              },
              undefined,
              out + 0.2,
            )
            .to(core, { scale: 1, duration: 0.34, ease: ease.out }, out + 0.2);

          openMatch(line, out + 0.3);
        };

        /* ---- Setting up --------------------------------------------------- */

        /**
         * The reset, and the opening.
         *
         * Both are the same move, which is why they are the same function: the
         * tokens gather to their pods, the arcs drain, the lanes go out and the
         * die goes back to a resting face. Nothing snaps.
         */
        const openMatch = (line: gsap.core.Timeline, at: number) => {
          line.call(
            () => {
              seat = 0;
              played = 0;
              roll.removeAttribute("data-manual");
              for (const player of PLAYERS) {
                progress.set(player.id, -1);
                setArc(player, -1);
                lightLane(player, -1);
                const token = tokens.get(player.id);
                // A capture leaves the hop layer on some multiple of a whole
                // turn. Zeroing it is invisible; tweening it back would be a
                // token unwinding a spin it already finished.
                if (token) gsap.set(token.hop, { rotation: 0, scale: 1 });
              }
              setActive(PLAYERS[0]);
            },
            undefined,
            at,
          );

          PLAYERS.forEach((player, index) => {
            const token = tokens.get(player.id);
            if (!token) return;
            const when = at + index * 0.07;

            line
              .to(
                token.root,
                {
                  x: () => px(player.pod.x),
                  y: () => px(player.pod.y),
                  duration: 0.58,
                  ease: "power2.inOut",
                },
                when,
              )
              .to(token.hop, { y: () => -px(0.04), duration: 0.29, ease: "power2.out" }, when)
              .to(token.hop, { y: 0, duration: 0.29, ease: "power2.in" }, when + 0.29)
              // scaleX/scaleY rather than scale: the win dims with `scale` and
              // a landing squashes with `scaleX`/`scaleY`, and asking GSAP to
              // reconcile both in one tween is asking it to guess.
              .to(
                token.flourish,
                {
                  scaleX: 1,
                  scaleY: 1,
                  y: 0,
                  opacity: 1,
                  duration: 0.34,
                  ease: ease.out,
                  overwrite: "auto",
                },
                when,
              );
          });

          // The die resets while the tokens are still walking home, so the
          // board settles as one move rather than two. `rollTo` runs 0.92s, and
          // this lands the handover on the last frame of the timeline: nothing
          // may follow it, or `turn` would be cleared out from under a turn
          // that has already started.
          const settled = at + PLAYERS.length * 0.07 + 1.05;
          rollTo(line, OPENING_FACE, settled - 0.92);

          line.call(
            () => {
              turn = undefined;
              phase = "idle";
              queue(OPEN_GAP);
            },
            undefined,
            settled,
          );
        };

        /* ---- The turn ------------------------------------------------------ */

        const playTurn = () => {
          if (!running || phase !== "idle") return;
          phase = "turn";

          const player = PLAYERS[seat];
          const before = progress.get(player.id) ?? -1;
          const face = rollDie();
          // Entering costs the whole roll, so a one puts a token on its entry
          // tile and nobody is ever stuck at home waiting for a six.
          const after = Math.min(FINISH, before < 0 ? face - 1 : before + face);

          setActive(player);

          const line = gsap.timeline({
            onComplete: () => {
              turn = undefined;
              if (phase === "winner") return;
              phase = "idle";
              seat = (seat + 1) % PLAYERS.length;
              played += 1;
              queue(HANDOFF);
            },
          });
          turn = line;

          rollTo(line, face, ROLL_AT);

          let at = MOVE_AT;
          const first = Math.max(0, before + 1);
          for (let value = first; value <= after; value += 1) {
            at = stepTo(line, player, value, at, value === after);
          }

          progress.set(player.id, after);
          at += LAND;

          const landed = ringIndexAt(player, after);
          if (landed !== undefined && !SAFE.has(landed)) {
            const victim = PLAYERS.find(
              (other) =>
                other.id !== player.id &&
                ringIndexAt(other, progress.get(other.id) ?? -1) === landed,
            );
            if (victim) at = takeToken(line, victim, seatFor(player, after), at);
          }

          // A match that has run long is ended rather than left running. It
          // takes a very unlucky run of captures to get here, but "very
          // unlucky" happens on a page that plays itself all day, and the
          // leader finishing is a better ending than no ending.
          let winner: Player | undefined;
          if (after >= FINISH) {
            winner = player;
          } else if (played + 1 >= TURN_LIMIT) {
            winner =
              [...PLAYERS].sort(
                (left, right) =>
                  (progress.get(right.id) ?? -1) - (progress.get(left.id) ?? -1),
              )[0] ?? player;
          }

          if (winner) {
            if (after < FINISH) {
              const from = progress.get(winner.id) ?? -1;
              progress.set(winner.id, FINISH);
              for (let value = Math.max(0, from + 1); value <= FINISH; value += 1) {
                at = stepTo(line, winner, value, at, value === FINISH);
              }
              at += LAND;
            }
            win(line, winner, at + 0.12);
          }
        };

        /* ---- The clock ------------------------------------------------------ */

        const queue = (delay: number) => {
          pending?.kill();
          pending = gsap.delayedCall(delay, tick);
        };

        /**
         * The only scheduler.
         *
         * Autoplay is the default because most visitors will never touch this.
         * A visitor who does gets the board for a few seconds: the tick sees a
         * recent tap and puts itself back to sleep instead of taking the turn,
         * and the die is marked so it reads as theirs to roll.
         */
        const tick = () => {
          if (!running || phase !== "idle") return;

          const since = (performance.now() - lastTouched) / 1000;
          if (lastTouched && since < IDLE_RESUME) {
            roll.dataset.manual = "";
            queue(IDLE_RESUME - since);
            return;
          }

          roll.removeAttribute("data-manual");
          playTurn();
        };

        /* ---- Interaction ---------------------------------------------------- */

        const onRoll = () => {
          lastTouched = performance.now();
          if (!running || phase !== "idle") return;
          pending?.kill();
          roll.dataset.manual = "";
          playTurn();
        };

        /**
         * Tapping a token is a flourish, not a move: it lifts, and its route,
         * pod and lane light up for a moment. It cannot change the game, so it
         * can never disagree with the turn that is playing.
         */
        const spotlight = (player: Player) => {
          // `running` is only ever true inside the motion branch, so this is
          // also what keeps a tap from animating on a board that was asked to
          // hold still, and off a board nobody is looking at.
          if (!running || phase === "winner") return;
          const token = tokens.get(player.id);
          if (!token) return;

          gsap
            .timeline()
            .to(token.flourish, {
              scale: 1.24,
              y: () => -px(0.024),
              duration: 0.16,
              ease: "power2.out",
              overwrite: "auto",
            })
            .to(token.flourish, {
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: "back.out(2.2)",
            });

          field.dataset.focus = player.id;
          focusOff?.kill();
          focusOff = gsap.delayedCall(1.5, () => {
            delete field.dataset.focus;
          });
        };

        const listeners: Array<() => void> = [];
        roll.addEventListener("click", onRoll);
        listeners.push(() => roll.removeEventListener("click", onRoll));

        for (const player of PLAYERS) {
          const token = tokens.get(player.id);
          if (!token) continue;
          const handler = () => spotlight(player);
          token.root.addEventListener("click", handler);
          listeners.push(() => token.root.removeEventListener("click", handler));
        }

        /* ---- Lifecycle -------------------------------------------------------- */

        const media = gsap.matchMedia();

        media.add({ ok: MOTION_QUERY.ok }, (context) => {
          const { ok } = context.conditions as { ok: boolean };
          if (!ok) return;

          // The server painted a match in progress. Hand those positions to
          // GSAP in its own units before anything animates, or the first tween
          // offsets a token that was already offset by its own `left`.
          for (const player of PLAYERS) {
            const token = tokens.get(player.id);
            if (!token) continue;
            const point = seatFor(player, OPENING[player.id]);
            gsap.set(token.root, { left: 0, top: 0, x: px(point.x), y: px(point.y) });
          }

          const pose = diePose(OPENING_FACE);
          gsap.set(die, { rotationX: pose.x, rotationY: pose.y, rotationZ: 0, x: 0, y: 0 });
          gsap.set(trayRing, { autoAlpha: 0.5, scale: 1 });
          // GSAP's own centring, because GSAP owns this element's transform and
          // would zero a CSS `translate` on it. Set once; every later tween
          // touches y/scale only, which compose on top.
          gsap.set(banner, { xPercent: -50, yPercent: -50 });
          gsap.set([banner, scrim], { autoAlpha: 0 });
          gsap.set(sparks, { autoAlpha: 0 });
          gsap.set(impactRing, { autoAlpha: 0 });
          gsap.set(impact, { x: px(0.5), y: px(0.5) });

          const observer = new ResizeObserver(measure);
          observer.observe(field);

          let onScreen = false;

          const sync = () => {
            const live = onScreen && !document.hidden;
            if (live === running) return;
            running = live;

            if (live) {
              gsap.set(moving(), { willChange: "transform" });
              ambient?.play();
              if (turn) turn.play();
              else if (pending) pending.play();
              else if (!opened) {
                opened = true;
                phase = "turn";
                const opening = gsap.timeline();
                turn = opening;
                openMatch(opening, 0.2);
              }
              return;
            }

            turn?.pause();
            pending?.pause();
            ambient?.pause();
            gsap.set(moving(), { clearProps: "willChange" });
          };

          // Ambient, and now only one thing: the goal breathes, because it is
          // what every piece is walking toward.
          //
          // There used to be a warm band crossing the board every few seconds.
          // It read as a reddish light ray sweeping the hero on its own clock,
          // which is a screensaver rather than a game, and it competed with the
          // one moving thing on this board that means something. Gone.
          ambient = gsap
            .timeline({ repeat: -1, paused: true })
            .to(coreCap, { scale: 1.05, duration: 1.9, ease: ease.loop, yoyo: true, repeat: 1 }, 0);

          const watcher = new IntersectionObserver(
            ([entry]) => {
              onScreen = entry?.isIntersecting ?? false;
              sync();
            },
            { threshold: 0.15 },
          );
          watcher.observe(root);
          document.addEventListener("visibilitychange", sync);

          return () => {
            watcher.disconnect();
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
            running = false;
            turn?.kill();
            pending?.kill();
            ambient?.kill();
            halo?.kill();
            focusOff?.kill();
            turn = undefined;
            pending = undefined;
          };
        });

        // Reduced motion keeps the composed board the server painted and turns
        // the one control off, rather than offering a die that cannot roll.
        media.add({ reduced: MOTION_QUERY.reduced }, (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          if (!reduced) return;
          roll.disabled = true;
          return () => {
            roll.disabled = false;
          };
        });

        /**
         * Pointer depth. Desktop only, and small enough to be felt rather than
         * seen: the layers are already separated in z by CSS, so a few degrees
         * of tilt is all it takes for the tokens to stand off the board.
         */
        media.add(
          { ok: MOTION_QUERY.ok, fine: "(hover: hover) and (pointer: fine)" },
          (context) => {
            const { ok, fine } = context.conditions as { ok: boolean; fine: boolean };
            if (!ok || !fine) return;

            const rotateX = gsap.quickTo(tilt, "rotationX", { duration: 0.55, ease: "power2.out" });
            const rotateY = gsap.quickTo(tilt, "rotationY", { duration: 0.55, ease: "power2.out" });
            let box: DOMRect | undefined;

            const capture = () => {
              box = root.getBoundingClientRect();
            };
            const onMove = (event: PointerEvent) => {
              if (!box) capture();
              if (!box) return;
              const nx = (event.clientX - box.left) / box.width - 0.5;
              const ny = (event.clientY - box.top) / box.height - 0.5;
              rotateX(-ny * 5.5);
              rotateY(nx * 6.5);
            };
            const onLeave = () => {
              box = undefined;
              rotateX(0);
              rotateY(0);
            };

            root.addEventListener("pointerenter", capture);
            root.addEventListener("pointermove", onMove);
            root.addEventListener("pointerleave", onLeave);

            return () => {
              root.removeEventListener("pointerenter", capture);
              root.removeEventListener("pointermove", onMove);
              root.removeEventListener("pointerleave", onLeave);
              gsap.set(tilt, { rotationX: 0, rotationY: 0 });
            };
          },
        );

        return () => {
          for (const off of listeners) off();
          media.revert();
        };
      } catch {
        // Whatever broke, the board stays the composed match the server
        // painted. Nothing on this page depends on it moving.
      }
    },
    { scope: stage },
  );

  return (
    <div ref={stage} data-turn="red" className={cn("hero-game-stage", className)}>
      <div data-game-tilt className="hero-game-tilt">
        <Board />
      </div>
    </div>
  );
}
