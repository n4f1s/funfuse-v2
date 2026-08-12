"use client";

import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { celebrate } from "@/lib/motion/confetti";
import { gsap, MOTION_QUERY, registerGsap, useGSAP } from "@/lib/motion/gsap";
import { ease } from "@/lib/motion/tokens";

import { PlayerSeat, PlayingCard, TrickPile } from "./trick-table-parts";
import {
  CARDS,
  COMPACT,
  NEAR_SEAT,
  SUIT_GLYPH,
  TRUMP,
  WIDE,
  cardsIn,
  deckPose,
  fanPose,
  handOf,
  pilePose,
  restFaceUp,
  restPose,
  toTransform,
  toVars,
  type Layout,
  type Point,
  type Pose,
  type SeatId,
} from "./trick-table-round";

/**
 * Mini Trick Table: a card table that deals itself, plays two tricks and
 * clears, for as long as it is on screen.
 *
 * Why it animates: the catalogue is trick taking games, and no still image
 * says what one feels like. A round playing itself is the argument the section
 * is making, so the motion is the content rather than decoration on it.
 *
 * How it is put together:
 *   - every position is a fraction of the board in `trick-table-round.ts`, and
 *     reaches GSAP as `xPercent` / `yPercent`, percentages of the card's own
 *     size. Nothing is ever measured, so a resize cannot strand a card
 *     mid-flight and the timeline never rebuilds on one.
 *   - two compositions, not one scaled down. Four seats around a wide table
 *     from `md`, three on a portrait board below it, with a shorter round and
 *     fewer cards moving at once.
 *   - the timeline is paused unless the section is on screen and the tab is
 *     in front. An idle loop behind a scrolled-past section is exactly the
 *     cost that never shows up in a screenshot.
 *   - reduced motion never reaches this code. The resting tableau is a CSS
 *     rule in `globals.css`, fed by the same layout config, so a visitor who
 *     asked for less motion still gets a table mid-round rather than a stack.
 */

/** Must match the `md:` variants here and the breakpoint in globals.css. */
const WIDE_QUERY = "(min-width: 48rem)";

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

type CardRefs = { root: HTMLElement; flip: HTMLElement; glow: HTMLElement };

type Round = { timeline: ReturnType<typeof gsap.timeline>; cards: HTMLElement[] };

/**
 * Builds one round as a single repeating timeline.
 *
 * Every flight goes through `move()`, which splits the travel into an x tween
 * and a y tween with opposite curves. Two eases across two axes is what turns
 * a straight line into an arc over the table, and it costs nothing: no motion
 * path plugin, no extra bundle.
 */
function buildRound(root: HTMLElement, layout: Layout): Round {
  const cards = cardsIn(layout);

  const refs = new Map<string, CardRefs>();
  for (const card of cards) {
    const element = root.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
    const flip = element?.querySelector<HTMLElement>(".trick-flip");
    const glow = element?.querySelector<HTMLElement>(".trick-glow");
    if (element && flip && glow) refs.set(card.id, { root: element, flip, glow });
  }

  /** Throws into the caller's catch, which fails the scene open. */
  const card = (id: string): CardRefs => {
    const found = refs.get(id);
    if (!found) throw new Error(`Mini Trick Table: card ${id} is not in the DOM`);
    return found;
  };

  const seatOf = (id: SeatId) => {
    const geo = layout.seats[id];
    if (!geo) throw new Error(`Mini Trick Table: seat ${id} is not in this layout`);
    return geo;
  };

  const pick = <T extends HTMLElement>(selector: string): T => {
    const found = root.querySelector<T>(selector);
    if (!found) throw new Error(`Mini Trick Table: ${selector} is not in the DOM`);
    return found;
  };

  const chipOf = (seat: SeatId) => pick(`[data-seat-chip="${seat}"]`);
  const countOf = (seat: SeatId) => pick(`[data-seat-count="${seat}"]`);
  const pileOf = (seat: SeatId) => pick(`[data-pile="${seat}"]`);
  const banner = pick("[data-banner]");
  const bannerText = pick("[data-banner-text]");
  const deckBase = pick("[data-deck]");

  const all = cards.map((entry) => card(entry.id).root);
  const vars = (pose: Pose) => toVars(layout, pose);

  /** Where each card is at this point in the build, for the arc direction. */
  const here = new Map<string, Pose>();
  const faceUp = new Set<string>();

  const reset = () => {
    cards.forEach((entry, index) => {
      const pose = deckPose(layout, index);
      const parts = card(entry.id);
      gsap.set(parts.root, { ...vars(pose), zIndex: 10 + index });
      gsap.set(parts.flip, { rotationY: 0 });
      gsap.set(parts.glow, { autoAlpha: 0, scale: 0.85 });
      here.set(entry.id, pose);
    });

    for (const seat of layout.order) {
      countOf(seat).textContent = "0";
      gsap.set([chipOf(seat), pileOf(seat)], { scale: 1 });
    }

    gsap.set(deckBase, { autoAlpha: 1 });
    gsap.set(banner, { autoAlpha: 0, scale: 0.94, y: 6 });
  };

  reset();

  const timeline = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay: 0.7,
    onRepeat: reset,
  });

  const move = (
    id: string,
    to: Pose,
    when: number,
    duration: number,
    options: { lift?: number; z?: number } = {},
  ) => {
    const parts = card(id);
    const from = here.get(id) ?? to;
    // Bow every path over the table rather than through it: whichever axis is
    // leaving first gets the fast curve.
    const rising = to.y < from.y;
    const target = vars(to);
    const lift = options.lift ?? 1.06;
    const peak = duration * 0.42;

    if (options.z !== undefined) {
      timeline.set(parts.root, { zIndex: options.z }, when);
    }

    timeline
      .to(
        parts.root,
        {
          xPercent: target.xPercent,
          duration,
          ease: rising ? "power2.in" : "power2.out",
        },
        when,
      )
      .to(
        parts.root,
        {
          yPercent: target.yPercent,
          duration,
          ease: rising ? "power2.out" : "power2.in",
        },
        when,
      )
      .to(parts.root, { rotation: target.rotation, duration, ease: ease.out }, when)
      // The lift is what stops a card from looking like it slid across the
      // felt: it comes up off the table, travels, and settles back onto it.
      .to(
        parts.root,
        { scale: target.scale * lift, duration: peak, ease: "power2.out" },
        when,
      )
      .to(
        parts.root,
        { scale: target.scale, duration: duration - peak, ease: "power2.in" },
        when + peak,
      );

    here.set(id, to);
  };

  const turnOver = (id: string, when: number, duration: number) => {
    timeline.to(card(id).flip, { rotationY: 180, duration, ease: ease.out }, when);
    faceUp.add(id);
  };

  let at = 0;

  // ---- The deck squares up ------------------------------------------------
  // A riffle rather than a shuffle: the top of the stack spreads a little and
  // snaps back. It is the gesture that says "a hand is about to start".
  const riffle = cards.slice(0, Math.min(7, cards.length)).map((entry) => card(entry.id).root);
  const middle = (riffle.length - 1) / 2;

  timeline
    .to(
      riffle,
      {
        xPercent: (index: number) => vars(deckPose(layout, index)).xPercent + (index - middle) * 26,
        rotation: (index: number) => (index - middle) * 4,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.025,
      },
      at,
    )
    .to(
      riffle,
      {
        xPercent: (index: number) => vars(deckPose(layout, index)).xPercent,
        rotation: (index: number) => deckPose(layout, index).rotate,
        duration: 0.42,
        ease: "back.out(1.7)",
        stagger: { each: 0.022, from: "end" },
      },
      at + 0.36,
    )
    .to(all, { scale: 0.955, duration: 0.18, ease: "power2.in" }, at + 0.62)
    .to(all, { scale: 1, duration: 0.34, ease: "back.out(2.2)" }, at + 0.8);

  at += 1.2;

  // ---- The deal -----------------------------------------------------------
  // Round robin, one card to each seat in turn, and each one lands squared up
  // rather than fanned. Opening the hand is its own beat.
  const dealAt = at;
  const size = handOf(layout, layout.order[0]).length;
  let dealt = 0;

  for (let round = 0; round < size; round += 1) {
    for (const seat of layout.order) {
      const id = handOf(layout, seat)[round];
      if (!id) continue;

      const geo = seatOf(seat);
      const drift = round * 0.0025;
      const squared: Pose = {
        x: geo.axis === "x" ? geo.hand.x + drift : geo.hand.x - drift,
        y: geo.axis === "x" ? geo.hand.y - drift : geo.hand.y + drift,
        rotate: geo.tilt + (round % 2 === 0 ? -1.8 : 1.8),
      };

      move(id, squared, dealAt + dealt * 0.085, 0.46, { lift: 1.12, z: 20 + dealt });
      dealt += 1;
    }
  }

  timeline.to(deckBase, { autoAlpha: 0, duration: 0.3, ease: ease.out }, dealAt + 0.55);

  at = dealAt + dealt * 0.085 + 0.46 + 0.1;

  // ---- Hands open ---------------------------------------------------------
  const fanAt = at;
  layout.order.forEach((seat, index) => {
    const geo = seatOf(seat);
    const hand = handOf(layout, seat);

    hand.forEach((id, slot) => {
      move(id, fanPose(geo, slot, hand.length), fanAt + index * 0.08 + slot * 0.05, 0.5, {
        lift: 1.03,
        z: 20 + slot,
      });
    });
  });

  // The near seat turns its cards over as the fan opens. The others stay face
  // down: a table where you can see everybody's hand is not a game.
  handOf(layout, NEAR_SEAT).forEach((id, slot) => {
    turnOver(id, fanAt + 0.18 + slot * 0.06, 0.42);
  });

  at = fanAt + 0.95;

  // ---- Two tricks ---------------------------------------------------------
  const inHand = new Map<SeatId, string[]>(
    layout.order.map((seat) => [seat, [...handOf(layout, seat)]]),
  );
  const won = new Map<SeatId, number>();

  layout.tricks.forEach((trick, index) => {
    // The second trick runs a little quicker. The table has taught its rules
    // by then, and repeating a beat at the same tempo is what makes a loop
    // feel like a loop.
    const pace = index === 0 ? 1 : 0.88;
    const step = 0.44 * pace;
    const flight = 0.5 * pace;
    const playAt = at;

    trick.plays.forEach((play, order) => {
      const geo = seatOf(play.seat);
      const when = playAt + order * step;

      move(play.card, geo.play, when, flight, { lift: 1.16, z: 60 + order });
      turnOver(play.card, when + 0.05, 0.34 * pace);

      // The rest of that hand closes the gap the card left behind.
      const left = inHand.get(play.seat)?.filter((id) => id !== play.card) ?? [];
      inHand.set(play.seat, left);
      left.forEach((id, slot) => {
        move(id, fanPose(geo, slot, left.length), when + 0.14, 0.42, {
          lift: 1.01,
          z: 20 + slot,
        });
      });
    });

    // ---- The trick is taken ----
    const settle = playAt + (trick.plays.length - 1) * step + flight;
    const winner = card(trick.card);

    timeline
      .set(winner.root, { zIndex: 80 }, settle)
      .to(winner.root, { scale: 1.13, duration: 0.3, ease: "back.out(2.4)" }, settle + 0.08)
      .to(winner.glow, { autoAlpha: 1, scale: 1.08, duration: 0.32, ease: ease.out }, settle + 0.08)
      .set(banner, { scale: 0.94, y: 6 }, settle + 0.1)
      .call(
        (text: string) => {
          bannerText.textContent = text;
        },
        [trick.banner],
        settle + 0.1,
      )
      .to(banner, { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: ease.out }, settle + 0.12)
      .to(banner, { autoAlpha: 0, scale: 0.96, duration: 0.26, ease: ease.out }, settle + 1.16);

    // ---- and swept up ----
    const squareAt = settle + 1.05;
    trick.plays.forEach((play, order) => {
      move(
        play.card,
        { ...layout.centre, rotate: order % 2 === 0 ? -2.5 : 2.5, scale: 0.98 },
        squareAt,
        0.3,
        { lift: 1, z: 60 + order },
      );
    });
    timeline.to(winner.glow, { autoAlpha: 0, duration: 0.24, ease: ease.out }, squareAt);

    const sweepAt = squareAt + 0.34;
    const geo = seatOf(trick.winner);
    const depth = (won.get(trick.winner) ?? 0) * trick.plays.length;

    trick.plays.forEach((play, order) => {
      move(play.card, pilePose(geo, depth + order), sweepAt + order * 0.035, 0.5, {
        lift: 1.06,
        z: 30 + depth + order,
      });
    });
    won.set(trick.winner, (won.get(trick.winner) ?? 0) + 1);

    // ---- and counted ----
    const landed = sweepAt + 0.52;
    const total = won.get(trick.winner) ?? 1;
    const chip = chipOf(trick.winner);
    const pile = pileOf(trick.winner);

    timeline
      .call(
        (seat: SeatId, value: number) => {
          countOf(seat).textContent = String(value);
        },
        [trick.winner, total],
        landed,
      )
      .to(pile, { scale: 1.14, duration: 0.18, ease: "back.out(3)" }, landed)
      .to(pile, { scale: 1, duration: 0.3, ease: ease.out }, landed + 0.18)
      .to(chip, { scale: 1.09, duration: 0.18, ease: "back.out(3)" }, landed)
      .to(chip, { scale: 1, duration: 0.32, ease: ease.out }, landed + 0.18);

    at = landed + 0.4;
  });

  // ---- The celebration ----------------------------------------------------
  // Real confetti, from canvas-confetti, fired out of the burst anchor so the
  // paper comes off the table rather than out of the middle of the window.
  //
  // This used to be twelve divs on fixed paths. Handing it to the library that
  // is already in the bundle for the contact form buys a far bigger burst for
  // less code, and the two celebrations on the site now look like the same
  // studio said them.
  //
  // Safe to fire on every repeat: the timeline only runs while the section is
  // on screen and the tab is in front, so this cannot go off behind a
  // scrolled-past page, and reduced motion never builds the timeline at all.
  timeline.call(
    () => {
      const anchor = root.querySelector<HTMLElement>("[data-burst]");
      if (anchor) celebrate(anchor, "huge");
    },
    undefined,
    at - 0.3,
  );

  // ---- Back to a deck -----------------------------------------------------
  // The loop ends exactly where it began, so the repeat has nothing to hide.
  const gatherAt = at;
  cards.forEach((entry, index) => {
    move(entry.id, deckPose(layout, index), gatherAt + index * 0.028, 0.55, {
      lift: 1.07,
      z: 10 + index,
    });
  });

  timeline
    .to(
      [...faceUp].map((id) => card(id).flip),
      { rotationY: 0, duration: 0.36, ease: ease.out, stagger: 0.02 },
      gatherAt + 0.24,
    )
    .to(deckBase, { autoAlpha: 1, duration: 0.35, ease: ease.out }, gatherAt + 0.3)
    .call(
      () => {
        for (const seat of layout.order) countOf(seat).textContent = "0";
      },
      undefined,
      gatherAt + cards.length * 0.028 + 0.45,
    );

  const squared = gatherAt + cards.length * 0.028 + 0.55;
  timeline
    .to(all, { scale: 0.96, duration: 0.18, ease: "power2.in" }, squared)
    .to(all, { scale: 1, duration: 0.32, ease: "back.out(2)" }, squared + 0.18);

  return { timeline, cards: all };
}

export function TrickTableBoard({ className }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = stage.current;
      if (!root) return;

      try {
        registerGsap();

        const media = gsap.matchMedia();

        media.add({ ok: MOTION_QUERY.ok, wide: WIDE_QUERY }, (context) => {
          const { ok, wide } = context.conditions as { ok: boolean; wide: boolean };

          // Reduced motion never builds a timeline. The CSS tableau in
          // globals.css is the whole of this branch.
          if (!ok) return;

          const round = buildRound(root, wide ? WIDE : COMPACT);

          let onScreen = false;

          const sync = () => {
            if (onScreen && !document.hidden) {
              // A layer per card, but only while the round is running.
              gsap.set(round.cards, { willChange: "transform" });
              round.timeline.play();
              return;
            }

            round.timeline.pause();
            gsap.set(round.cards, { clearProps: "willChange" });
          };

          const observer = new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting;
              sync();
            },
            { threshold: 0.2 },
          );

          observer.observe(root);
          document.addEventListener("visibilitychange", sync);

          return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
            round.timeline.kill();
          };
        });

        return () => media.revert();
      } catch {
        // Whatever broke, the table should still be a table. This is the same
        // tableau the reduced-motion rule paints, applied by hand because the
        // failure may be GSAP itself.
        const layout = window.matchMedia(WIDE_QUERY).matches ? WIDE : COMPACT;

        for (const entry of CARDS) {
          const element = root.querySelector<HTMLElement>(`[data-card="${entry.id}"]`);
          const pose = restPose(layout, entry.id);
          if (element && pose) element.style.transform = toTransform(layout, pose);
          if (element && restFaceUp(entry.id)) {
            const flip = element.querySelector<HTMLElement>(".trick-flip");
            if (flip) flip.style.transform = "rotateY(180deg)";
          }
        }
      }
    },
    { scope: stage },
  );

  const board = {
    "--board-compact": String(COMPACT.aspect),
    "--board-wide": String(WIDE.aspect),
    "--card-w-compact": pct(COMPACT.card.width),
    "--card-x-compact": pct(COMPACT.deck.x - COMPACT.card.width / 2),
    "--card-y-compact": pct(COMPACT.deck.y - COMPACT.card.height / 2),
    "--card-w-wide": pct(WIDE.card.width),
    "--card-x-wide": pct(WIDE.deck.x - WIDE.card.width / 2),
    "--card-y-wide": pct(WIDE.deck.y - WIDE.card.height / 2),
  } as CSSProperties;

  const anchor = (compact: Point | undefined, wideAt: Point) =>
    ({
      "--anchor-x-compact": compact ? pct(compact.x) : undefined,
      "--anchor-y-compact": compact ? pct(compact.y) : undefined,
      "--anchor-x-wide": pct(wideAt.x),
      "--anchor-y-wide": pct(wideAt.y),
    }) as CSSProperties;

  const seats = Object.keys(WIDE.seats) as SeatId[];

  return (
    // Decorative in full. Every fact the section carries is in the copy around
    // it, and a screen reader reading out sixteen playing cards is noise.
    <div
      ref={stage}
      aria-hidden
      style={board}
      className={cn("trick-stage relative w-full", className)}
    >
      <div className="trick-board absolute inset-0">
        <div className="plate bg-surface absolute inset-0 rounded-[1.5rem] md:rounded-[2.5rem]" />
        {/* Warmth where the action is, so the felt reads as lit rather than
            as a flat white panel. One hue, low chroma: this is depth. */}
        <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(56%_58%_at_50%_50%,var(--color-brand-50),transparent_72%)] md:rounded-[2.5rem]" />
        <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(var(--color-ink-200)_0.5px,transparent_0.5px)] opacity-40 [background-size:13px_13px] md:rounded-[2.5rem]" />

        {/* Table furniture: the name of the game and the suit that beats
            everything. Both are invented, and the caption under the stage
            says so. */}
        <div className="text-2xs md:text-xs absolute top-[1.5%] left-[4%] flex items-center gap-1.5 md:top-[5%] md:left-[2.5%]">
          <span className="bg-accent h-1.5 w-1.5 rounded-full" />
          <span className="text-heading font-medium tracking-wide">
            Mini Trick Table
          </span>
        </div>
        <div className="border-line bg-surface text-2xs md:text-xs absolute top-[1.5%] right-[4%] flex items-center gap-1 rounded-full border px-2 py-0.5 md:top-[5%] md:right-[2.5%]">
          <span className="text-muted">Trump</span>
          <span className="text-accent-strong">{SUIT_GLYPH[TRUMP]}</span>
        </div>

        {/* The trick zone, and the deck slot inside it. */}
        <div
          style={anchor(COMPACT.centre, WIDE.centre)}
          className="trick-anchor border-brand-200/70 h-[38cqw] w-[38cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed md:h-[18cqw] md:w-[18cqw]"
        />
        <div
          data-deck
          className="trick-deck border-line-strong/60 rounded-[1.6cqw] border border-dashed md:rounded-[0.8cqw]"
        />

        {seats.map((seat) => {
          const compact = COMPACT.seats[seat];
          const geo = WIDE.seats[seat];
          if (!geo) return null;

          return (
            <div key={seat} className={cn(!compact && "trick-wide-only")}>
              <PlayerSeat seat={seat} style={anchor(compact?.chip, geo.chip)} />
              <TrickPile seat={seat} style={anchor(compact?.pile, geo.pile)} />
            </div>
          );
        })}

        <ul>
          {CARDS.map((entry) => {
            const wideRest = restPose(WIDE, entry.id);
            const compactRest = entry.compact ? restPose(COMPACT, entry.id) : undefined;
            const lit =
              WIDE.tricks[0].card === entry.id
                ? "wide"
                : COMPACT.tricks[0].card === entry.id
                  ? "compact"
                  : undefined;

            return (
              <PlayingCard
                key={entry.id}
                card={entry}
                faceUp={restFaceUp(entry.id)}
                lit={lit}
                style={
                  {
                    "--rest-wide": wideRest ? toTransform(WIDE, wideRest) : undefined,
                    "--rest-compact": compactRest
                      ? toTransform(COMPACT, compactRest)
                      : undefined,
                  } as CSSProperties
                }
              />
            );
          })}
        </ul>

        {/* Just under the trick, where a player's eyes already are. Close
            enough to clip the bottom card's edge, which is what keeps it
            attached to the trick rather than floating over the table. */}
        <div className="absolute top-[66%] left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[67.5%]">
          <div
            data-banner
            className="bg-heading text-inverse text-2xs md:text-xs rounded-full px-3 py-1 font-medium opacity-0 shadow-md"
          >
            <span data-banner-text>{WIDE.tricks[0].banner}</span>
          </div>
        </div>

        {/* Nothing is drawn here. It is a zero-size marker at the burst point,
            carrying the same layout geometry as everything else on the board,
            and the celebration reads its position off the screen. */}
        <div
          data-burst
          style={anchor(COMPACT.burst, WIDE.burst)}
          className="trick-anchor"
        />
      </div>
    </div>
  );
}
