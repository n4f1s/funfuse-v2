import { Reveal } from "@/components/motion";
import { Hand } from "@/components/ui/hand";
import type { Game, GameArtwork } from "@/content/games";

import { GameCard } from "./game-card";

/**
 * A curated rail on the detail page — same category first, then same
 * region, then whatever is left (see `getRelatedGames` in
 * src/content/games/index.ts). A small, curated set is exactly what `<Hand>`
 * was built for, unlike the full 19-title listing grid.
 */
export function RelatedGames({
  current,
  related,
}: {
  current: Game;
  related: { game: Game; cover: GameArtwork }[];
}) {
  if (related.length === 0) return null;

  return (
    <div>
      <Reveal as="h2" y="lg" className="text-h2 text-heading font-semibold tracking-tightest">
        More games like {current.title}
      </Reveal>

      <div className="mt-10">
        <Hand label="Related games" count={related.length}>
          {related.map(({ game, cover }) => (
            <li
              key={game.slug}
              // Matches the `galleryPlate` sizes preset. Change both together.
              className="will-reveal w-[84vw] max-w-[37.5rem] sm:w-[62vw] lg:w-[37.5rem]"
            >
              <GameCard game={game} cover={cover} sizes="galleryPlate" />
            </li>
          ))}
        </Hand>
      </div>
    </div>
  );
}
