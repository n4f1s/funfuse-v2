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

  /**
   * Large landscape plate in a horizontal gallery.
   *
   * 600px, not 640px, on purpose. At DPR 2 a 640px slot asks for 1280 device
   * pixels, which lands above Next's 1200 breakpoint and pulls the 1920 file.
   * 600px asks for 1200 and gets a file roughly a third smaller for a plate
   * nobody can tell apart. Keep this in step with the card width in
   * components/home/featured-games.tsx.
   */
  galleryPlate: "(min-width: 1024px) 600px, (min-width: 640px) 62vw, 84vw",

  /**
   * Transparent character cutout used as a decorative anchor. Keep the widths
   * here and the `w-*` classes on the cutouts in step: the source art tops out
   * around 566px, so an under-declared slot is visibly soft rather than merely
   * wasteful.
   */
  cutout: "(min-width: 1280px) 352px, (min-width: 1024px) 288px, 240px",

  /** The wide brand lockup. */
  lockup: "(min-width: 640px) 420px, 264px",

  /**
   * A small 3D prop used as scenery. The source art is 93px to 250px wide, so
   * this is a ceiling rather than a target: Next caps the request at the
   * asset's own width, and nothing here should ever be displayed near it.
   */
  prop: "(min-width: 1024px) 128px, 88px",

  /** Store icon in a listing row. */
  icon: "(min-width: 768px) 88px, 64px",

  /** Small square thumbnail. */
  thumb: "(min-width: 768px) 128px, 96px",

  /** Person / team photo. */
  avatar: "56px",

  /**
   * Large card in the games listing grid — 4 of 6 columns at lg, 2 of 2 below
   * it. Container 1320px, 6-col track, gap-x-8 (32px): (1320 - 5*32)/6 =
   * 193.3px per unit, so 4 units + 3 internal gaps = 869px. Keep in step with
   * the `lg:col-span-4` card and the grid's `gap-x-8` in
   * components/games/game-grid.tsx.
   */
  catalogueLarge:
    "(min-width: 1400px) 869px, (min-width: 1024px) 62vw, (min-width: 640px) 46vw, 94vw",

  /**
   * Regular card in the games listing grid — 2 of 6 columns at lg. Same
   * container math as `catalogueLarge`: 2 units + 1 internal gap = 419px.
   */
  catalogueRegular:
    "(min-width: 1400px) 419px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw",

  /**
   * Game detail page cover plate — 7 of 12 columns, the same ratio
   * components/home/craft.tsx already uses inline for its own 7-of-12 image.
   */
  heroPlate: "(min-width: 1400px) 740px, (min-width: 1024px) 56vw, 94vw",

  /** Portrait 9:16 screenshot card inside a `<Hand>` scroller. */
  screenshotCard: "(min-width: 640px) 240px, 60vw",

  /**
   * A landscape screen inside a drawn device. Three of the container's five
   * sub-columns in the right-hand half of the Studio translation block:
   * 740px * 0.6 = 444px, minus the device's own padding. Keep in step with
   * the `col-span-3 of 5` grid in components/studio/studio-translation.tsx.
   */
  deviceWide:
    "(min-width: 1400px) 430px, (min-width: 1024px) 32vw, (min-width: 640px) 56vw, 94vw",

  /** The portrait device beside it — two of the same five sub-columns. */
  deviceTall:
    "(min-width: 1400px) 285px, (min-width: 1024px) 21vw, (min-width: 640px) 37vw, 94vw",

  /**
   * A store icon in the Studio shelf: 6 columns at lg, 4 at sm, 3 below it.
   * Container 1320px with gap-x-8 (32px): (1320 - 5*32)/6 = 193px. Keep in
   * step with the grid in components/studio/studio-shelf.tsx. The sources are
   * 600px square, so this is a ceiling rather than a target.
   */
  iconWall:
    "(min-width: 1400px) 194px, (min-width: 1024px) 15vw, (min-width: 640px) 22vw, 29vw",
} as const;

export type SizePreset = keyof typeof sizePresets;

/** Accepts a preset name or a raw `sizes` string. */
export function resolveSizes(value: SizePreset | (string & {})): string {
  return value in sizePresets
    ? sizePresets[value as SizePreset]
    : (value as string);
}
