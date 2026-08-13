/**
 * The rhythm of the intro, in seconds.
 *
 * Every number the master timeline is built from lives here, as data, for two
 * reasons. It puts the whole tempo on one screen where it can be read and
 * argued with. And it makes the total length checkable without a browser: the
 * timeline is these literals and nothing else, so `introDuration()` is the
 * timeline's duration, and there is no input by which a slow network could
 * change it.
 *
 * **This is a brand animation, not a loading indicator.** Nothing here waits on
 * `load`, on fonts, or on any resource. The route carries on rendering behind
 * the overlay and gets revealed in whatever state it has reached when the
 * animation ends.
 */

export type Beat = {
  /** Position on the master timeline. */
  at: number;
  duration: number;
  /** Seconds between one target starting and the next. */
  stagger?: number;
  /**
   * What that stagger adds to the *last* target's start. Declared rather than
   * derived because it depends on the distribution GSAP is given: with five
   * cards `from: "center"` the outermost pair starts two steps late, with four
   * `from: "edges"` the inner pair starts one step late.
   */
  lag?: number;
};

/**
 * Normal motion. Five acts and an exit.
 *
 *   deck arrives    the loose stack squares up and the stage takes the tap
 *   spread          it opens into a fan, from the middle out
 *   turn            the wings turn face up outside in, the ace turns last
 *   presented       the ace lifts clear of the hand while the hand settles
 *   gather          the hand closes back under it
 *   exit            the ace rushes the viewer and dissolves into the page
 */
export const BEAT = {
  square: { at: 0, duration: 0.42, stagger: 0.02, lag: 0.08 },
  tapIn: { at: 0.06, duration: 0.18 },
  tapOut: { at: 0.24, duration: 0.32 },

  spread: { at: 0.55, duration: 0.72, stagger: 0.075, lag: 0.15 },
  lift: { at: 0.55, duration: 0.72 },

  turn: { at: 1.48, duration: 0.52, stagger: 0.085, lag: 0.085 },
  heroTurn: { at: 1.95, duration: 0.58 },
  landIn: { at: 2.42, duration: 0.16 },
  landOut: { at: 2.58, duration: 0.34 },

  present: { at: 2.62, duration: 0.58 },
  level: { at: 3.2, duration: 0.28 },

  gather: { at: 3.28, duration: 0.36, stagger: 0.03, lag: 0.03 },
  drawBack: { at: 3.62, duration: 0.16 },
  caption: { at: 3.7, duration: 0.24 },
  ink: { at: 3.78, duration: 0.16 },
  rush: { at: 3.78, duration: 0.48 },
  reveal: { at: 4.2, duration: 0.3 },
} as const satisfies Record<string, Beat>;

/**
 * The readout, choreographed against those acts rather than measured off the
 * network. It is a count, not a byte total, and no copy anywhere claims
 * otherwise.
 *
 * It lands on exactly 100 at 3.45s: after the hand has gathered, and a clear
 * quarter second before the caption starts to leave at 3.70s, so the figure is
 * read rather than glimpsed.
 */
export const COUNT: readonly (Beat & { to: number })[] = [
  { to: 14, at: 0, duration: 0.5 }, // the deck arrives
  { to: 44, at: 0.55, duration: 0.9 }, // it spreads
  { to: 72, at: 1.48, duration: 1.02 }, // it turns over
  { to: 94, at: 2.55, duration: 0.6 }, // the ace is presented
  { to: 100, at: 3.15, duration: 0.3 }, // the hand closes
];

/**
 * Reduced motion. No card moves; the deck stays exactly as the server painted
 * it. Only the count runs, and then the panel goes. Four seconds of decoration
 * is precisely what this visitor asked not to be given.
 */
export const QUIET = {
  count: { at: 0, duration: 0.7 },
  reveal: { at: 0.85, duration: 0.3 },
} as const satisfies Record<string, Beat>;

const endOf = (beat: Beat) => beat.at + (beat.lag ?? 0) + beat.duration;

/** Longest end across a set of beats — the timeline's own duration. */
export function introDuration(beats: readonly Beat[]): number {
  return Number(Math.max(...beats.map(endOf)).toFixed(3));
}

/** Every beat on the normal-motion master, including the count. */
export const FULL_BEATS: readonly Beat[] = [...Object.values(BEAT), ...COUNT];

export const QUIET_BEATS: readonly Beat[] = Object.values(QUIET);

/** 4.5s. Fixed, and the same on every connection. */
export const FULL_SECONDS = introDuration(FULL_BEATS);

/** 1.15s. */
export const QUIET_SECONDS = introDuration(QUIET_BEATS);

/**
 * How long after the animation should have ended before the island gives up on
 * it and hands the page back itself.
 *
 * This is not part of the timing — it never fires on a working page. It exists
 * because a backgrounded tab stops serving animation frames, so a timeline can
 * legitimately stall mid-flight and would otherwise resume only when the
 * visitor came back to find a loading screen waiting for them.
 */
export const WATCHDOG_SLACK_MS = 2500;
