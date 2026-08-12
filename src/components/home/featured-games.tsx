import Link from "next/link";

import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui/container";
import { Hand } from "@/components/ui/hand";
import { Section } from "@/components/ui/section";
import {
  categoryLabels,
  getAllGames,
  regionLabels,
  type Game,
  type GameArtwork,
} from "@/content/games";
import { getFeaturedGames } from "@/content/games/art";
import { cn } from "@/lib/cn";

import { gameLinkHref } from "./game-link";

/**
 * Featured games.
 *
 * The row is driven by a curated subset of the current covers. The full
 * catalogue further down carries every title, so artwork availability alone
 * does not turn this into a nineteen-card wall.
 *
 * Full-bleed, because a gallery that stops at the page gutter reads as a widget
 * rather than a wall.
 */
export function FeaturedGames() {
  const featured = getFeaturedGames();
  if (!featured.length) return null;

  return (
    <Section id="featured" bleed tone="canvas">
      <Container>
        <Reveal as="div" y="lg" className="max-w-2xl">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            Featured games
          </h2>
          <p className="text-muted mt-4 text-lg">
            {featured.length} of the {getAllGames().length} titles, with the key
            art from their store listings.
          </p>
        </Reveal>
      </Container>

      {/* No <Reveal> wrapper. The cards animate individually inside <Hand>,
          and fading the whole block in first would be two entrances stacked on
          one moment. Each card carries `will-reveal` so the very first paint is
          already the pre-animation state, and the CSS escape in globals.css
          shows them if GSAP never runs. */}
      <div className="mt-10 lg:mt-14">
        <Hand label="Featured games" count={featured.length}>
          {featured.map(({ game, cover }) => (
            <li
              key={game.slug}
              // Matches the `galleryPlate` sizes preset. Change both together.
              className="will-reveal w-[84vw] max-w-[37.5rem] sm:w-[62vw] lg:w-[37.5rem]"
            >
              <GameCard game={game} cover={cover} />
            </li>
          ))}
        </Hand>
      </div>
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
          "group-hover:scale-[1.04]",
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

  return (
    <Link
      href={href}
      // An explicit name keeps the link from reading out the artwork
      // description as well as the title. It still contains the visible label.
      aria-label={game.title}
      className="group block rounded-lg focus-visible:outline-offset-4"
    >
      {body}
    </Link>
  );
}
