import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  categoryLabels,
  playStoreUrl,
  regionLabels,
  type Game,
  type GameArtwork,
} from "@/content/games";

/**
 * The detail page's top band: a 12-col split reusing the same 5/7 ratio
 * `Craft` already established on the homepage. Facts and the CTA sit left,
 * wrapped in `<Reveal>`. The cover art sits right as one large `.plate` — no
 * fan, no tilt, that device is homepage-specific — and stays outside any
 * reveal, since it is the page's LCP element.
 */
export function GameHero({
  game,
  cover,
  icon,
}: {
  game: Game;
  cover?: GameArtwork;
  icon?: GameArtwork;
}) {
  const playUrl = playStoreUrl(game);
  // `<Media>` types `alt` and `decorative` as a discriminated union — build
  // whichever shape applies rather than passing both conditionally.
  const iconAlt = icon ? { alt: icon.alt } : { decorative: true as const };
  const coverAlt = cover ? { alt: cover.alt } : { decorative: true as const };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12">
      <Reveal as="div" y="lg" className="lg:col-span-5">
        <div className="flex items-center gap-4">
          <Media
            src={icon?.src}
            {...iconAlt}
            aspect="icon"
            sizes="icon"
            rounded="xl"
            placeholderLabel="Icon"
            className="w-16 shrink-0 sm:w-20"
          />
          <div className="min-w-0">
            <h1 className="text-h1 text-heading font-bold tracking-tightest">
              {game.title}
            </h1>
            {game.nativeTitle ? (
              // Bricolage Grotesque has no Arabic or Cyrillic coverage, so a
              // native title always drops to Geist.
              <p className="text-muted mt-1 font-sans text-lg">{game.nativeTitle}</p>
            ) : null}
          </div>
        </div>

        <p className="text-faint mt-5 text-sm">
          {regionLabels[game.region]}
          <span className="px-1.5">·</span>
          {categoryLabels[game.category]}
          {game.releasedAt ? (
            <>
              <span className="px-1.5">·</span>
              Released{" "}
              <time dateTime={game.releasedAt} className="tabular">
                {new Date(game.releasedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          ) : null}
        </p>

        <p className="text-body mt-6 max-w-prose text-lg">
          {game.description ?? game.summary}
        </p>

        {playUrl ? (
          <Button href={playUrl} size="lg" className="mt-8 w-full sm:w-auto">
            Get it on Google Play
          </Button>
        ) : null}
      </Reveal>

      <Media
        src={cover?.src}
        {...coverAlt}
        aspect="wide"
        sizes="heroPlate"
        priority="lcp"
        placeholderLabel="Cover art"
        className="plate mt-10 lg:col-span-7 lg:mt-0"
      />
    </div>
  );
}
