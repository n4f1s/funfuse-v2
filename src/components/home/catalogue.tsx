import jeepney from "@/assets/decorative/props/orange-jeepney.png";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { site } from "@/config/site";
import {
  categoryLabels,
  getAllGames,
  getGameRegions,
  regionLabels,
  type Game,
} from "@/content/games";
import { cn } from "@/lib/cn";

import { gameLinkHref } from "./game-link";
import { Prop } from "./prop";

/**
 * Every title, as type.
 *
 * Only five games have artwork, so a grid of covers here would be mostly empty
 * frames. A list is not the fallback: it is the point. Nineteen names, each one
 * a game somebody's family plays, is the most convincing thing this studio can
 * put on a page, and it needs no images to land.
 *
 * Laid out column-major so it reads down each column rather than across the
 * page, while the DOM keeps catalogue order for keyboard and screen readers.
 */
export function Catalogue() {
  const games = getAllGames();
  const regions = getGameRegions();
  const rows = Math.ceil(games.length / 2);

  return (
    <Section id="catalogue" tone="canvas">
      {/* The band between the paragraph and the button is the widest gap on
          the page. The jeepney fills it and earns the spot: the sentence right
          beside it starts in Manila, and six of the nineteen titles are
          Filipino. */}
      <div className="relative">
        <Reveal
          as="div"
          y="lg"
          className="flex flex-wrap items-end justify-between gap-8"
        >
          <div className="max-w-xl">
            <h2 className="text-h2 text-heading font-semibold tracking-tightest">
              The full catalogue
            </h2>
            <p className="text-muted mt-4 text-lg">
              {games.length} titles drawn from {regions.length} traditions, from
              Tongits in Manila to Belote in France. All of them play offline.
            </p>
          </div>

          <Button href={site.socials.googlePlay} variant="secondary">
            Open Google Play
          </Button>
        </Reveal>

        <Prop
          src={jeepney}
          sizes="(min-width: 1280px) 240px, 200px"
          drift={-120}
          spin={-8}
          bob={false}
          className="hidden w-50 lg:top-1 lg:left-[52%] lg:block xl:w-60"
        />
      </div>

      <Reveal
        stagger={0.025}
        as="ul"
        role="list"
        start="top 90%"
        className="mt-12 lg:grid lg:grid-flow-col lg:gap-x-14 xl:gap-x-20"
        style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
      >
        {games.map((game) => (
          <CatalogueRow key={game.slug} game={game} />
        ))}
      </Reveal>
    </Section>
  );
}

function CatalogueRow({ game }: { game: Game }) {
  const href = gameLinkHref(game);

  const inner = (
    <>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "font-display text-heading block text-lg font-semibold tracking-tighter sm:text-xl",
            "transition-transform duration-[var(--duration-hover)] ease-out",
            href && "group-hover:translate-x-1",
          )}
        >
          {game.title}
        </span>
        {game.nativeTitle ? (
          // Geist, not Bricolage: the display face has no Arabic or Cyrillic.
          <span className="text-faint mt-0.5 block font-sans text-sm">
            {game.nativeTitle}
          </span>
        ) : null}
      </span>

      <span className="text-faint mt-1 shrink-0 text-sm sm:mt-0 sm:pt-1">
        {regionLabels[game.region]}
        <span className="text-line-strong px-2">/</span>
        {categoryLabels[game.category]}
      </span>
    </>
  );

  // The hairline belongs to the row, the tint to the control inside it: a
  // rounded background under a straight border would show square corners.
  //
  // Stacked below sm. Sharing one line at 375px leaves "Hazari Grand - 1000
  // Points Game" fighting its own region label for the same forty pixels.
  const shared =
    "-mx-3 flex flex-col rounded-md px-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:py-5";

  return (
    <li className="border-line border-t">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${game.title} on Google Play`}
          className={cn(
            shared,
            "group hover:bg-surface-muted transition-colors duration-[var(--duration-hover)] ease-out",
          )}
        >
          {inner}
        </a>
      ) : (
        <div className={shared}>{inner}</div>
      )}
    </li>
  );
}
