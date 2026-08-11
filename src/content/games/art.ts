import callbreakCover from "@/assets/games/callbreak-offline/cover.webp";
import ginRummyCover from "@/assets/games/gin-rummy/cover.webp";
import hazariCover from "@/assets/games/hazari-grand/cover.webp";
import puzzleTwistCover from "@/assets/games/puzzle-twist/cover.webp";
import tarneebCover from "@/assets/games/tarneeb/cover.webp";

import { games } from "./games";
import type { Game, GameArt, GameArtwork } from "./types";

/**
 * Cover artwork, keyed by game slug.
 *
 * **This module is deliberately not re-exported from `./index`.** `index.ts` is
 * imported by `next.config.ts` to build the redirect table, and that runs in a
 * plain Node context where a `.webp` import has no loader and throws. Keeping
 * the static imports in a sibling module means the config stays loadable while
 * components still get build-time dimensions and blur placeholders. Import it
 * as `@/content/games/art`.
 *
 * Only five of the nine plates under `src/assets/games/` map to a catalogue
 * record. The other four (`tongits-legend`, `indian-rummy`, `poker-rummy`,
 * `poker-full-house`) are FunFuse artwork for titles this catalogue does not
 * list, so they are imported directly by the section that shows them and are
 * never labelled with a game name. `tongits-legend` in particular carries a
 * wordmark that is not "Tongits Club Offline", so attaching it to the `tongit`
 * record would put a contradiction on the page.
 *
 * `alt` describes the artwork, not the game. See `GameArtwork` in ./types.
 */
export const gameArt: Readonly<Record<string, GameArt>> = {
  "callbreak-offline": {
    cover: {
      src: callbreakCover,
      alt: "Call Break key art: a player holding the jack, queen and king of spades as gold coins fall around her.",
    },
  },
  "hazari-grand": {
    cover: {
      src: hazariCover,
      alt: "Hazari key art: three aces above a gold-rimmed card table.",
    },
  },
  tarneeb: {
    cover: {
      src: tarneebCover,
      alt: "Tarneeb key art: a player seated in a high-backed chair above a red card table at sunset.",
    },
  },
  "gin-rummy-master-offline": {
    cover: {
      src: ginRummyCover,
      alt: "Gin Rummy key art: a table laid out mid-hand with the knock and gin buttons either side.",
    },
  },
  "puzzle-twist-game": {
    cover: {
      src: puzzleTwistCover,
      alt: "Puzzle Twist key art: coloured blocks filling the lower rows of a purple grid.",
    },
  },
};

export function getGameArt(slug: string): GameArt | undefined {
  return gameArt[slug];
}

/**
 * Catalogue order, filtered to the titles that have a cover. Drives the
 * featured row on the homepage, so adding a plate to `gameArt` is all it takes
 * to feature a game.
 */
export function getGamesWithCover(): { game: Game; cover: GameArtwork }[] {
  return games.flatMap((game) => {
    const cover = gameArt[game.slug]?.cover;
    return cover ? [{ game, cover }] : [];
  });
}
