import type { StaticImageData } from "next/image";

import craftArtDirection from "@/assets/studio/craft/studio-art-direction.webp";
import craftGameDesign from "@/assets/studio/craft/studio-game-design.webp";
import craftGameDevelopment from "@/assets/studio/craft/studio-game-development.webp";
import { Media } from "@/components/media";
import { Parallax, Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { getAllGames } from "@/content/games";
import { getGameArt } from "@/content/games/art";
import { studioContent } from "@/content/studio";

/**
 * The three craft plates, keyed by the discipline title they sit beside.
 * Studio artwork, 16:9, one per discipline, so the caption can stay
 * evidence-driven (the shipped title the discipline is argued with) while the
 * picture stops pretending to be that game's key art.
 */
const CRAFT_ART: Record<string, StaticImageData> = {
  "Game development": craftGameDevelopment,
  "Game design": craftGameDesign,
  "Art direction": craftArtDirection,
};

/**
 * The three crafts, each with a shipped title as its evidence.
 *
 * These are the disciplines funfusegames.com lists under "Our Expertise", and
 * the homepage names them in one line each. This is the long version, so the
 * copy here is allowed to be specific about what the discipline actually
 * decides.
 *
 * No switcher, no tabs. Three claims that all matter equally do not want a
 * control that hides two of them, and a tab strip would put a keyboard trap
 * and an ARIA pattern between a reader and three paragraphs. The blocks
 * alternate side instead, and the plates drift at alternating rates on
 * desktop, which is what keeps a three-item list from reading as a template.
 *
 * The plate beside each discipline is the studio's own 16:9 craft artwork
 * (`src/assets/studio/craft`), mapped by discipline title. The caption stays
 * evidence-driven: the shipped title that argues for the discipline, pulled
 * from the catalogue by slug. Should a discipline ever lack a plate, its
 * evidence game's cover renders instead rather than the block opening a hole.
 */
export function StudioCraft() {
  const { craft } = studioContent;
  const games = getAllGames();

  return (
    <Section id="what-we-do">
      <Reveal as="div" y="lg" className="max-w-2xl">
        <h2 className="text-h2 text-heading font-semibold tracking-tightest">
          {craft.title}
        </h2>
        <p className="text-muted mt-5 text-lg">{craft.lead}</p>
      </Reveal>

      <div className="mt-14 flex flex-col gap-16 sm:gap-20 lg:mt-20 lg:gap-24">
        {craft.disciplines.map((discipline, index) => {
          const game = games.find(
            (candidate) => candidate.slug === discipline.evidence,
          );
          // The studio plate for this discipline; the evidence game's cover is
          // only a fallback if a discipline ever ships without one.
          const art = CRAFT_ART[discipline.title];
          const cover = art ? undefined : getGameArt(game?.slug ?? "")?.cover;
          const plate = art
            ? { src: art, alt: `Studio artwork for ${discipline.title}.` }
            : cover
              ? { src: cover.src, alt: cover.alt }
              : null;
          // Second block mirrored. Three items means the first and last share
          // a side, which is what makes the middle one read as the turn rather
          // than as a pattern that ran out.
          const mirrored = index % 2 === 1;

          return (
            <article
              key={discipline.title}
              className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12"
            >
              <Reveal
                as="div"
                y="base"
                className={
                  mirrored
                    ? "lg:col-span-5 lg:col-start-8 lg:row-start-1"
                    : "lg:col-span-5"
                }
              >
                <p className="text-accent-text font-display text-h3 leading-none font-bold tracking-tightest">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="text-h3 text-heading mt-4 font-semibold tracking-tighter">
                  {discipline.title}
                </h3>
                <p className="text-muted mt-5 max-w-prose text-lg">
                  {discipline.body}
                </p>
              </Reveal>

              {plate ? (
                <Parallax
                  distance={mirrored ? -52 : -84}
                  className={
                    mirrored
                      ? "mt-8 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:mt-0"
                      : "mt-8 lg:col-span-6 lg:col-start-7 lg:mt-0"
                  }
                >
                  <figure>
                    <Media
                      src={plate.src}
                      alt={plate.alt}
                      aspect="wide"
                      sizes="half"
                      className="plate"
                    />
                    <figcaption className="text-muted mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                      <span className="text-heading font-semibold">
                        {game?.title}
                      </span>
                      <span>{discipline.evidenceNote}</span>
                    </figcaption>
                  </figure>
                </Parallax>
              ) : null}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
