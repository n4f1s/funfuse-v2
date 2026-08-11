/**
 * Motion tokens.
 *
 * These mirror the `--ease-*`, `--duration-*` and `--stagger-*` values in
 * globals.css. CSS owns hover/press/enter states; GSAP owns choreography and
 * scroll. Both speak the same language, so a GSAP tween and a CSS transition
 * on the same element never disagree.
 *
 * Change a value here and in globals.css together.
 */

/** Seconds — GSAP works in seconds, CSS in milliseconds. */
export const duration = {
  press: 0.14,
  hover: 0.18,
  popover: 0.2,
  overlay: 0.32,
  reveal: 0.62,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.06,
} as const;

/**
 * Cubic-bezier control points. GSAP accepts the CSS notation directly via
 * `gsap.parseEase`, so these strings work as `ease` values on any tween.
 *
 * The stock CSS easings are too weak at these durations — they read as
 * sluggish. `ease-in` is never used on UI: it delays the first frame, which is
 * exactly the moment the user is watching.
 */
export const ease = {
  /** Entering and exiting elements. Starts fast, feels immediate. */
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  /** Movement across the screen that is neither entering nor exiting. */
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  /** iOS-style drawer/sheet curve. */
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
  /** Long scroll reveals — a touch softer at the tail than `out`. */
  entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Constant motion only: marquees, progress. */
  linear: "none",
} as const;

/** Distances, in px, for entrance transforms. Keep them small. */
export const travel = {
  sm: 8,
  base: 16,
  lg: 28,
} as const;
