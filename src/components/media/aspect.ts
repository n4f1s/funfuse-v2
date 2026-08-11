/**
 * Named aspect ratios.
 *
 * Mirrors the `--aspect-*` tokens in globals.css. Every `<Media>` reserves its
 * space through one of these, which is why the site cannot ship layout shift
 * from images: the box exists before the bytes arrive.
 *
 * The class strings are written out literally so Tailwind's scanner sees them.
 */
export const aspectClass = {
  icon: "aspect-icon",
  cover: "aspect-cover",
  portrait: "aspect-portrait",
  feature: "aspect-feature",
  screenshot: "aspect-screenshot",
  wide: "aspect-wide",
  hero: "aspect-hero",
  banner: "aspect-banner",
  square: "aspect-square",
  auto: "",
} as const;

export type AspectName = keyof typeof aspectClass;

/** Numeric ratios, for anything that needs to compute rather than style. */
export const aspectRatio: Record<Exclude<AspectName, "auto">, number> = {
  icon: 1,
  cover: 4 / 5,
  portrait: 3 / 4,
  feature: 1024 / 500,
  screenshot: 9 / 16,
  wide: 16 / 9,
  hero: 3 / 2,
  banner: 21 / 9,
  square: 1,
};
