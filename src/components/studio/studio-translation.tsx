import { Parallax, Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { getAllGames, regionLabels, type Game } from "@/content/games";
// Not from the barrel: `./screenshots` pulls the generated static imports, and
// the barrel is loaded by next.config.ts in a plain Node context.
import { getGameScreenshots } from "@/content/games/screenshots";
import { studioContent } from "@/content/studio";

import { StudioDevice } from "./studio-device";

/**
 * What "translation" actually means, shown rather than claimed.
 *
 * The three plates are real screenshots of shipped titles, pulled through the
 * same generated screenshot module the game detail pages use. If a capture is
 * missing the plate simply does not render, so this section can never invent a
 * screen that does not exist.
 *
 * Two of them are landscape and one is portrait because that is how the games
 * are actually played, and that difference is half the argument: the device is
 * held the way the table sat.
 *
 * The two groups drift at different rates on desktop, which is the only reason
 * this reads as a composition rather than as three pictures in a box. On a
 * phone they stack and the drift is off — a scroll-linked tween per plate is
 * not a cost a mid-range Android should carry for depth nobody asked for.
 */

/** Which capture of the five to use, per plate. */
const SHOT_INDEX = 0;

type Plate = {
  game: Game;
  artwork: NonNullable<ReturnType<typeof getGameScreenshots>[number]>;
  note: string;
};

function buildPlates(): Plate[] {
  const games = getAllGames();

  return studioContent.translation.plates.flatMap((entry) => {
    const game = games.find((candidate) => candidate.slug === entry.slug);
    if (!game) return [];

    const artwork = getGameScreenshots(game.slug, game.title)[SHOT_INDEX];
    if (!artwork) return [];

    return [{ game, artwork, note: entry.note }];
  });
}

export function StudioTranslation() {
  const { translation } = studioContent;
  const plates = buildPlates();

  // Landscape captures lead; the portrait one is the counterweight beside
  // them. Split by the file's own shape rather than by a hardcoded index, so
  // adding a plate cannot put a 9:16 capture in a 16:9 frame.
  const wide = plates.filter(
    (plate) => plate.artwork.src.width >= plate.artwork.src.height,
  );
  const tall = plates.filter(
    (plate) => plate.artwork.src.width < plate.artwork.src.height,
  );

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <Reveal as="div" y="lg">
            <h2 className="text-h2 text-heading font-semibold tracking-tightest">
              {translation.title}
            </h2>
            <p className="text-muted mt-5 max-w-md text-lg">
              {translation.body}
            </p>
          </Reveal>

          {/* Term over detail, under a hairline each. Three claims that can be
              checked against the plates on the right, which is why they are
              beside them rather than in a column of their own. */}
          <Reveal
            stagger
            as="dl"
            delay={0.08}
            className="mt-10 flex flex-col lg:mt-12"
          >
            {translation.keeps.map((keep) => (
              <div key={keep.term} className="border-line border-t py-5">
                <dt className="text-heading font-display font-semibold tracking-tight">
                  {keep.term}
                </dt>
                <dd className="text-muted mt-2 max-w-md">{keep.detail}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-5 sm:gap-6">
            <Parallax distance={-28} className="sm:col-span-3">
              <div className="flex flex-col gap-8 sm:gap-6">
                {wide.map((plate) => (
                  <StudioDevice
                    key={plate.game.slug}
                    artwork={plate.artwork}
                    orientation="landscape"
                    caption={plate.game.title}
                    note={plate.note}
                  />
                ))}
              </div>
            </Parallax>

            {/* Offset down and drifting faster, so the column reads as two
                planes instead of a two-by-two grid. */}
            <Parallax distance={-92} className="sm:col-span-2 sm:mt-16">
              <div className="flex flex-col gap-8 sm:gap-6">
                {tall.map((plate) => (
                  <StudioDevice
                    key={plate.game.slug}
                    artwork={plate.artwork}
                    orientation="portrait"
                    caption={plate.game.title}
                    note={regionLabels[plate.game.region]}
                  />
                ))}
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </Section>
  );
}
