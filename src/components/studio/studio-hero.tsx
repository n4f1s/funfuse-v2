import colourPlate from "@/assets/studio/hero-1.webp";
import pencilPlate from "@/assets/studio/hero-2.webp";
import { Media } from "@/components/media";
import { getAllGames } from "@/content/games";
import { studioContent } from "@/content/studio";

import { StudioStage } from "./studio-stage";

/**
 * The Studio hero.
 *
 * One screen, two parts: the type at the top, the studio filling everything
 * under it edge to edge. Nothing is set over the artwork and nothing is set
 * under it, so the plate is the whole lower half of the first screen rather
 * than a picture with captions around it.
 *
 * The crop is anchored to the bottom at every width. The artwork's lower half
 * is the table — the cards, the sketches, the board — and its upper third is
 * empty sky that the type block above is already providing. So when the box is
 * shorter than 16:9, which is every desktop viewport, the sky is what goes and
 * the table is what stays. The sky that does survive is white, which is the
 * same white the type sits on, so the two halves read as one surface.
 *
 * The headline sits outside every reveal, as does the plate. Between them they
 * are this route's LCP candidates, and an element that starts transparent is an
 * element the browser has not painted.
 */

/**
 * The stage box.
 *
 * Below sm it is 3:2 — taller than the plates, so the crop comes off the far
 * left and right (the sofa and the window frame) and the whole vertical run of
 * the artwork survives on a phone. From sm it takes whatever height is left
 * under the type on the first screen, which is always shorter than 16:9, so the
 * crop turns vertical and `object-bottom` decides which end of it goes.
 *
 * Both cases are known before the bytes arrive: a declared ratio below sm, a
 * viewport-derived flex height above it. Nothing here can shift.
 */
const STAGE_BOX =
  "aspect-hero w-full sm:aspect-auto sm:min-h-[20rem] sm:flex-1";

/**
 * Both plates take the same fit, or they lose registration and the reveal
 * stops looking like one image changing underneath the pointer.
 */
const PLATE_FIT = "object-bottom";

export function StudioHero() {
  const { hero } = studioContent;
  const total = getAllGames().length;

  return (
    <section className="relative flex flex-col overflow-hidden sm:min-h-[calc(100dvh-var(--header-height))]">
      <div className="max-w-page mx-auto w-full px-6 pt-10 pb-9 text-center sm:px-8 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14">
        {/* The one eyebrow on this page. The count beside it is read from the
            catalogue, so it cannot drift out of step with what we ship. */}
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-semibold tracking-wide">
          <span className="text-accent-text">{hero.eyebrow}</span>
          <span aria-hidden className="bg-line-strong h-3 w-px" />
          <span className="text-muted font-medium">
            {total} games on Google Play
          </span>
        </p>

        {/* `text-wrap: balance` is already on every heading in globals.css, so
            a long viewport gets even lines rather than one orphaned word. */}
        <h1 className="text-h1 text-heading mx-auto mt-4 max-w-4xl font-bold tracking-tightest sm:mt-5">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
      </div>

      <StudioStage
        className={`${STAGE_BOX} relative isolate overflow-hidden`}
        base={
          <div className="absolute inset-0">
            <Media
              src={pencilPlate}
              alt={hero.imageAlt}
              sizes="full"
              aspect="auto"
              priority="lcp"
              rounded="none"
              className="h-full w-full"
              imageClassName={PLATE_FIT}
            />
          </div>
        }
        paint={
          <div className="absolute inset-0">
            {/* Lazy on purpose. It is above the fold, so it still starts as
                soon as layout allows, but it must not compete with the plate
                underneath it for the LCP. `tone="none"` keeps a second loading
                surface from being painted over the first. */}
            <Media
              src={colourPlate}
              decorative
              sizes="full"
              aspect="auto"
              priority="lazy"
              rounded="none"
              tone="none"
              className="h-full w-full"
              imageClassName={PLATE_FIT}
            />
          </div>
        }
      />
    </section>
  );
}
