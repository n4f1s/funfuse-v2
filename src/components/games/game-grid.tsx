import { Reveal } from "@/components/motion";
import { cn } from "@/lib/cn";
import type { Game, GameArtwork } from "@/content/games";

import { GameCard } from "./game-card";

/**
 * The listing grid: a deterministic two-tier rhythm rather than a wall of
 * equal cards. Every fifth title runs large across 4 of 6 columns, the rest
 * take 2 — both divide the 6-column track evenly, so rows never leave an
 * orphaned gap regardless of how many large cards land in a given page.
 *
 * Collapses to a plain 2-up grid at sm and a single column below it; the
 * size rhythm is a desktop-only device; below `lg` every card reads the same.
 */
export function GameGrid({
  entries,
  className,
}: {
  entries: { game: Game; cover: GameArtwork }[];
  className?: string;
}) {
  return (
    <Reveal
      stagger={0.025}
      as="ul"
      role="list"
      start="top 90%"
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-6 lg:gap-y-20",
        className,
      )}
    >
      {entries.map(({ game, cover }, index) => {
        const large = index % 5 === 0;
        return (
          <li key={game.slug} className={large ? "lg:col-span-4" : "lg:col-span-2"}>
            <GameCard
              game={game}
              cover={cover}
              variant={large ? "large" : "regular"}
              // The whole grid sits behind a scroll-triggered reveal, so no
              // card here is a valid `priority="lcp"` candidate — an element
              // that starts at opacity 0 has not been painted. The intro
              // heading above (see ListingIntro) is the real LCP element and
              // stays outside any reveal. The first, largest card still
              // loads eagerly rather than lazily, since it is likely visible
              // at first paint.
              priority={index === 0 ? "eager" : "lazy"}
            />
          </li>
        );
      })}
    </Reveal>
  );
}
