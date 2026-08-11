/**
 * `sizes` presets.
 *
 * A wrong `sizes` string is the most common cause of a page downloading a
 * 2000px image into a 300px box, so `<Media>` requires one. These presets are
 * written against the real layout (page container 1320px, breakpoints below)
 * — pick the one that matches the slot instead of hand-writing a string.
 *
 * Breakpoints match Tailwind's defaults: sm 640, md 768, lg 1024, xl 1280.
 */
export const sizePresets = {
  /** Edge-to-edge, full-bleed sections. */
  full: "100vw",

  /** Inside the page container, full width of it. */
  container: "(min-width: 1400px) 1320px, 94vw",

  /** Half the container on desktop, full width below lg. */
  half: "(min-width: 1400px) 660px, (min-width: 1024px) 47vw, 94vw",

  /** 3-up grid: 1 col mobile, 2 col sm, 3 col lg. */
  gridThird:
    "(min-width: 1400px) 424px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw",

  /** 4-up grid: 1 col mobile, 2 col sm, 3 col lg, 4 col xl. */
  gridQuarter:
    "(min-width: 1400px) 314px, (min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw",

  /** Horizontal scroller cards — fixed-ish width at every breakpoint. */
  carouselCard: "(min-width: 768px) 320px, 72vw",

  /** Store icon in a listing row. */
  icon: "(min-width: 768px) 88px, 64px",

  /** Small square thumbnail. */
  thumb: "(min-width: 768px) 128px, 96px",

  /** Person / team photo. */
  avatar: "56px",
} as const;

export type SizePreset = keyof typeof sizePresets;

/** Accepts a preset name or a raw `sizes` string. */
export function resolveSizes(value: SizePreset | (string & {})): string {
  return value in sizePresets
    ? sizePresets[value as SizePreset]
    : (value as string);
}
