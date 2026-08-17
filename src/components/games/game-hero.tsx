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
 * reveal, since it is the page's LCP element on a desktop.
 *
 * **The title block is outside every reveal too, and that is the point.**
 * The cover is only the LCP candidate where it is actually on screen. At
 * `lg` the two columns sit side by side and it is; below `lg` the layout
 * stacks and the cover lands after the icon, the title, the meta row, the
 * description and the button — well past the fold on a phone, which makes the
 * `<h1>` the largest thing painted. A `<Reveal>` starts its subtree at
 * `visibility: hidden` (see `.will-reveal` in globals.css) and only resolves
 * it once the bundle has landed, GSAP has registered and a ScrollTrigger has
 * fired, so leaving the heading inside one made mobile LCP wait on all three.
 * That is precisely what AGENTS.md means by never putting the LCP element
 * behind a reveal.
 *
 * So the left column is now a plain grid child holding three blocks in the
 * same visual order as before: the icon reveals, the title block does not,
 * the facts and CTA reveal. Nothing moved and nothing lost its motion except
 * the heading, which is the one element that could not afford it. There is no
 * layout shift either way — `visibility: hidden` reserves its box, which is
 * why this is an LCP fix rather than a CLS one.
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
      <div className="lg:col-span-5">
        <Reveal as="div" y="lg">
          <Media
            src={icon?.src}
            {...iconAlt}
            aspect="icon"
            sizes="icon"
            rounded="xl"
            placeholderLabel="Icon"
            className="plate w-14 sm:w-16"
          />
        </Reveal>

        {/* Server-rendered, painted on first frame, never waiting on GSAP. */}
        <div className="mt-4 min-w-0">
          <h1 className="text-h1 text-heading font-bold tracking-tightest">
            {game.title}
          </h1>
          {game.nativeTitle ? (
            // Bricolage Grotesque has no Arabic or Cyrillic coverage, so a
            // native title always drops to Geist.
            <p className="text-muted mt-1 font-sans text-lg">{game.nativeTitle}</p>
          ) : null}
        </div>

        <Reveal as="div" y="lg">
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
      </div>

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
