import colourPlate from "@/assets/studio/hero/studio-hero-1.webp";
import pencilPlate from "@/assets/studio/hero/studio-hero-2.webp";
import { Media } from "@/components/media";
import { getAllGames } from "@/content/games";
import { studioContent } from "@/content/studio";

import { StudioStage } from "./studio-stage";

const PLATE_POSITION = "object-bottom";

export function StudioHero() {
  const { hero } = studioContent;
  const total = getAllGames().length;

  return (
    <section
      aria-labelledby="studio-hero-title"
      className="
        relative
        h-[calc(100svh-var(--header-height))]
        min-h-[36rem]
        w-full
        overflow-hidden
        bg-white
        sm:h-[calc(100dvh-var(--header-height))]
        sm:min-h-[42rem]
        lg:min-h-[46rem]
      "
    >
      {/* Full-bleed hero artwork.
          The colour/monochrome reveal interaction remains unchanged. */}
      <StudioStage
        className="absolute inset-0 isolate h-full w-full overflow-hidden"
        base={
          <div className="absolute inset-0">
            <Media
              src={pencilPlate}
              alt={hero.imageAlt}
              sizes="full"
              aspect="auto"
              fit="cover"
              priority="lcp"
              rounded="none"
              className="h-full w-full"
              imageClassName={PLATE_POSITION}
            />
          </div>
        }
        paint={
          <div className="absolute inset-0">
            <Media
              src={colourPlate}
              decorative
              sizes="full"
              aspect="auto"
              fit="cover"
              priority="lazy"
              rounded="none"
              tone="none"
              className="h-full w-full"
              imageClassName={PLATE_POSITION}
            />
          </div>
        }
      />

      {/* 
        Text is intentionally removed from normal document flow.

        The artwork already contains a large white/light area at the top,
        so the content sits directly over that negative space.

        pointer-events-none is important so this overlay does not interfere
        with StudioStage's pointer/reveal interaction underneath.
      */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          mx-auto
          flex
          w-full
          justify-center
          px-5
          pt-[clamp(2.25rem,7vh,5.5rem)]
          sm:px-8
          lg:px-10
        "
      >
        <div className="max-w-page mx-auto w-full text-center">
          <p
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-3
              gap-y-1
              text-xs
              font-semibold
              tracking-wide
              sm:text-sm
            "
          >
            <span className="text-accent-text">{hero.eyebrow}</span>

            <span
              aria-hidden
              className="bg-line-strong h-3 w-px"
            />

            <span className="text-muted font-medium">
              {total} games on Google Play
            </span>
          </p>

          <h1
            id="studio-hero-title"
            className="
              text-heading
              mx-auto
              mt-3
              max-w-[18ch]
              text-[clamp(2.5rem,8vw,4.5rem)]
              leading-[0.95]
              font-bold
              tracking-tightest
              sm:mt-4
              sm:max-w-4xl
              sm:text-[clamp(3.25rem,6vw,5.5rem)]
              lg:mt-5
            "
          >
            {hero.title}
            <span className="text-accent">.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}