import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  categoryLabels,
  getAllGames,
  regionLabels,
  type Game,
  type GameArtwork,
} from "@/content/games";
import { getGamesWithCover } from "@/content/games/art";
import { cn } from "@/lib/cn";

import { gameLinkHref } from "./game-link";
import { Hand } from "./hand";

/**
 * Featured games.
 *
 * The row is driven by `getGamesWithCover()`, so it holds exactly the titles
 * that have real key art. Nothing is padded out with a placeholder frame: an
 * empty skeleton in a section called "featured" is worse than a shorter row,
 * and the full catalogue further down carries every title anyway.
 *
 * Full-bleed, because a gallery that stops at the page gutter reads as a widget
 * rather than a wall.
 */
export function FeaturedGames() {
  const featured = getGamesWithCover();
  if (!featured.length) return null;

  return (
    <Section id="featured" bleed tone="canvas">
      <Container>
        <Reveal as="div" className="max-w-2xl">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            Featured games
          </h2>
          <p className="text-muted mt-4 text-lg">
            {featured.length} of the {getAllGames().length} titles, with the key
            art from their store listings.
          </p>
        </Reveal>
      </Container>

      <Reveal as="div" className="mt-10 lg:mt-14">
        <Hand label="Featured games" count={featured.length}>
          {featured.map(({ game, cover }) => (
            <li
              key={game.slug}
              // Matches the `galleryPlate` sizes preset. Change both together.
              className="w-[84vw] max-w-[37.5rem] sm:w-[62vw] lg:w-[37.5rem]"
            >
              <GameCard game={game} cover={cover} />
            </li>
          ))}
        </Hand>
      </Reveal>
    </Section>
  );
}

function GameCard({ game, cover }: { game: Game; cover: GameArtwork }) {
  const href = gameLinkHref(game);

  const body = (
    <>
      <Media
        src={cover.src}
        alt={cover.alt}
        aspect="wide"
        sizes="galleryPlate"
        className="plate"
        imageClassName={cn(
          "transition-transform duration-[var(--duration-hover)] ease-out",
          href && "group-hover:scale-[1.04]",
        )}
      />

      {/* Stacked below sm. Side by side, a 315px card leaves the title barely
          a third of the row and "Hazari Grand - 1000 Points Game" ellipses
          after two words. */}
      <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="text-h4 text-heading font-semibold tracking-tighter sm:truncate">
            {game.title}
          </h3>
          {game.nativeTitle ? (
            // Bricolage Grotesque has no Arabic or Cyrillic coverage, so a
            // native title always drops to Geist.
            <p className="text-muted mt-1 font-sans text-sm sm:truncate">
              {game.nativeTitle}
            </p>
          ) : null}
        </div>

        <p className="text-faint shrink-0 text-sm">
          {regionLabels[game.region]}
          <span className="px-1.5">·</span>
          {categoryLabels[game.category]}
        </p>
      </div>
    </>
  );

  if (!href) return <div>{body}</div>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // An explicit name keeps the link from reading out the artwork
      // description as well as the title. It still contains the visible label.
      aria-label={`${game.title} on Google Play`}
      className="group block rounded-lg focus-visible:outline-offset-4"
    >
      {body}
    </a>
  );
}
