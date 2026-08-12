import threeTwoFiveCover from "@/assets/games/3-2-5-offline/cover.webp";
import beloteCover from "@/assets/games/belote-francaise/cover.webp";
import bhabhiThullaCover from "@/assets/games/bhabhi-thulla/cover.webp";
import callbreakCover from "@/assets/games/callbreak-offline/cover.webp";
import capsaSusunCover from "@/assets/games/capsa-susun/cover.webp";
import ginRummyCover from "@/assets/games/gin-rummy/cover.webp";
import hazariCover from "@/assets/games/hazari-grand/cover.webp";
import luckyNineCover from "@/assets/games/lucky-9/cover.webp";
import ludoChallengeCover from "@/assets/games/ludo-challenge/cover.webp";
import mauMauCover from "@/assets/games/mau-mau/cover.webp";
import okeyCover from "@/assets/games/okey-club/cover.webp";
import omiCover from "@/assets/games/omi-club/cover.webp";
import pusoyCover from "@/assets/games/pusoy/cover.webp";
import pusoyDosCover from "@/assets/games/pusoy-dos/cover.webp";
import puzzleClubCover from "@/assets/games/puzzle-club/cover.webp";
import tarneebCover from "@/assets/games/tarneeb/cover.webp";
import thousandCover from "@/assets/games/thousand/cover.webp";
import tienLenCover from "@/assets/games/tien-len/cover.webp";
import tongitsClubCover from "@/assets/games/tongits-club-offline/cover.webp";

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
 * Every current cover under `src/assets/games/` maps to exactly one catalogue
 * record. The public `puzzle-twist-game` slug is retained because it is an
 * inherited indexed URL, while its current title and cover are Puzzle Club.
 *
 * `alt` describes the artwork, not the game. See `GameArtwork` in ./types.
 */
export const gameArt: Readonly<Record<string, GameArt>> = {
  "3-2-5-offline-fun-card-game": {
    cover: {
      src: threeTwoFiveCover,
      alt: "3 2 5 card table with players holding hands of cards in a warmly lit room.",
    },
  },
  "belote-francaise": {
    cover: {
      src: beloteCover,
      alt: "Belote Française card table overlooking Paris with a hand of cards in the foreground.",
    },
  },
  "bhabhi-thulla-card-game": {
    cover: {
      src: bhabhiThullaCover,
      alt: "Bhabhi Thulla card game with players gathered around a red card table.",
    },
  },
  "callbreak-offline": {
    cover: {
      src: callbreakCover,
      alt: "Call Break key art: a player holding the jack, queen and king of spades as gold coins fall around her.",
    },
  },
  "capsa-susun-offline": {
    cover: {
      src: capsaSusunCover,
      alt: "Capsa Susun card table with three stacked hands beneath the Capsa Susun title.",
    },
  },
  "hazari-grand": {
    cover: {
      src: hazariCover,
      alt: "Hazari key art: three aces above a gold-rimmed card table.",
    },
  },
  "gin-rummy-master-offline": {
    cover: {
      src: ginRummyCover,
      alt: "Gin Rummy key art: a table laid out mid-hand with the knock and gin buttons either side.",
    },
  },
  "lucky-9-offline": {
    cover: {
      src: luckyNineCover,
      alt: "Lucky 9 cards and chips arranged on a red card table.",
    },
  },
  "ludo-challenge-offline-play": {
    cover: {
      src: ludoChallengeCover,
      alt: "Ludo board with colorful playing pieces, dice, and players around the table.",
    },
  },
  "mau-mau-offline": {
    cover: {
      src: mauMauCover,
      alt: "Mau Mau card table with players holding cards around a green felt board.",
    },
  },
  "okey-club": {
    cover: {
      src: okeyCover,
      alt: "Okey tile racks arranged on a table with the Okey Club title above them.",
    },
  },
  "omi-club": {
    cover: {
      src: omiCover,
      alt: "Omi Club card table with four players holding cards around green felt.",
    },
  },
  "pusoy-offline": {
    cover: {
      src: pusoyCover,
      alt: "Pusoy card table with arranged poker hands and players around it.",
    },
  },
  "pusoy-dos-offline": {
    cover: {
      src: pusoyDosCover,
      alt: "Pusoy Dos card table with players holding cards beneath the Pusoy Dos title.",
    },
  },
  "puzzle-twist-game": {
    cover: {
      src: puzzleClubCover,
      alt: "Puzzle Club board with colorful numbered blocks, puzzle pieces, and a trophy.",
    },
  },
  tarneeb: {
    cover: {
      src: tarneebCover,
      alt: "Tarneeb card table with a player seated in a high-backed chair.",
    },
  },
  "thousand-offline": {
    cover: {
      src: thousandCover,
      alt: "Thousand card table with players holding cards beside a score board.",
    },
  },
  "tien-len-club": {
    cover: {
      src: tienLenCover,
      alt: "Tiến Lên card game with four players around a green table in Hanoi.",
    },
  },
  tongit: {
    cover: {
      src: tongitsClubCover,
      alt: "Tongits Club card table with players and a tropical sunset behind the title.",
    },
  },
};

const FEATURED_GAME_SLUGS = [
  "tongit",
  "hazari-grand",
  "ludo-challenge-offline-play",
  "tarneeb",
  "okey-club",
  "puzzle-twist-game",
] as const;

export function getGameArt(slug: string): GameArt | undefined {
  return gameArt[slug];
}

/**
 * Catalogue order, filtered to the titles that have a cover.
 */
export function getGamesWithCover(): { game: Game; cover: GameArtwork }[] {
  return games.flatMap((game) => {
    const cover = gameArt[game.slug]?.cover;
    return cover ? [{ game, cover }] : [];
  });
}

/** Curated homepage selection. The full catalogue remains available below. */
export function getFeaturedGames(): { game: Game; cover: GameArtwork }[] {
  return FEATURED_GAME_SLUGS.flatMap((slug) => {
    const game = games.find((candidate) => candidate.slug === slug);
    const cover = gameArt[slug]?.cover;
    return game && cover ? [{ game, cover }] : [];
  });
}
