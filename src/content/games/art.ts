import threeTwoFiveCover from "@/assets/games/3-2-5-offline/cover.webp";
import threeTwoFiveIcon from "@/assets/games/3-2-5-offline/icon.webp";
import beloteCover from "@/assets/games/belote-francaise/cover.webp";
import beloteIcon from "@/assets/games/belote-francaise/icon.webp";
import bhabhiThullaCover from "@/assets/games/bhabhi-thulla/cover.webp";
import bhabhiThullaIcon from "@/assets/games/bhabhi-thulla/icon.webp";
import callbreakCover from "@/assets/games/callbreak-offline/cover.webp";
import callbreakIcon from "@/assets/games/callbreak-offline/icon.webp";
import capsaSusunCover from "@/assets/games/capsa-susun/cover.webp";
import capsaSusunIcon from "@/assets/games/capsa-susun/icon.webp";
import ginRummyCover from "@/assets/games/gin-rummy/cover.webp";
import ginRummyIcon from "@/assets/games/gin-rummy/icon.webp";
import hazariCover from "@/assets/games/hazari-grand/cover.webp";
import hazariIcon from "@/assets/games/hazari-grand/icon.webp";
import luckyNineCover from "@/assets/games/lucky-9/cover.webp";
import luckyNineIcon from "@/assets/games/lucky-9/icon.webp";
import ludoChallengeCover from "@/assets/games/ludo-challenge/cover.webp";
import ludoChallengeIcon from "@/assets/games/ludo-challenge/icon.webp";
import mauMauCover from "@/assets/games/mau-mau/cover.webp";
import mauMauIcon from "@/assets/games/mau-mau/icon.webp";
import okeyCover from "@/assets/games/okey-club/cover.webp";
import okeyIcon from "@/assets/games/okey-club/icon.webp";
import omiCover from "@/assets/games/omi-club/cover.webp";
import omiIcon from "@/assets/games/omi-club/icon.webp";
import pusoyCover from "@/assets/games/pusoy/cover.webp";
import pusoyIcon from "@/assets/games/pusoy/icon.webp";
import pusoyDosCover from "@/assets/games/pusoy-dos/cover.webp";
import pusoyDosIcon from "@/assets/games/pusoy-dos/icon.webp";
import puzzleClubCover from "@/assets/games/puzzle-club/cover.webp";
import puzzleClubIcon from "@/assets/games/puzzle-club/icon.webp";
import tarneebCover from "@/assets/games/tarneeb/cover.webp";
import tarneebIcon from "@/assets/games/tarneeb/icon.webp";
import thousandCover from "@/assets/games/thousand/cover.webp";
import thousandIcon from "@/assets/games/thousand/icon.webp";
import tienLenCover from "@/assets/games/tien-len/cover.webp";
import tienLenIcon from "@/assets/games/tien-len/icon.webp";
import tongitsClubCover from "@/assets/games/tongits-club-offline/cover.webp";
import tongitsClubIcon from "@/assets/games/tongits-club-offline/icon.webp";

import { games } from "./games";
import type { Game, GameArt, GameArtwork } from "./types";

/**
 * Cover and icon artwork, keyed by game slug.
 *
 * **This module is deliberately not re-exported from `./index`.** `index.ts` is
 * imported by `next.config.ts` to build the redirect table, and that runs in a
 * plain Node context where a `.webp` import has no loader and throws. Keeping
 * the static imports in a sibling module means the config stays loadable while
 * components still get build-time dimensions and blur placeholders. Import it
 * as `@/content/games/art`.
 *
 * Every current cover and icon under `src/assets/games/` maps to exactly one
 * catalogue record. The public `puzzle-twist-game` slug is retained because it
 * is an inherited indexed URL, while its current title and art are Puzzle Club.
 *
 * `alt` describes the artwork, not the game. See `GameArtwork` in ./types.
 */
export const gameArt: Readonly<Record<string, GameArt>> = {
  "3-2-5-offline-fun-card-game": {
    cover: {
      src: threeTwoFiveCover,
      alt: "3 2 5 card table with players holding hands of cards in a warmly lit room.",
    },
    icon: {
      src: threeTwoFiveIcon,
      alt: "3 2 5 Grand app icon: a 2, 3 and 5 of hearts above the 235 Grand wordmark.",
    },
  },
  "belote-francaise": {
    cover: {
      src: beloteCover,
      alt: "Belote Française card table overlooking Paris with a hand of cards in the foreground.",
    },
    icon: {
      src: beloteIcon,
      alt: "Belote Française app icon: a scattered ace of spades and ace of hearts around the Belote wordmark.",
    },
  },
  "bhabhi-thulla-card-game": {
    cover: {
      src: bhabhiThullaCover,
      alt: "Bhabhi Thulla card game with players gathered around a red card table.",
    },
    icon: {
      src: bhabhiThullaIcon,
      alt: "Bhabhi Thulla app icon: four queens above the Bhabhi Thulla wordmark on a gold-studded frame.",
    },
  },
  "callbreak-offline": {
    cover: {
      src: callbreakCover,
      alt: "Call Break key art: a player holding the jack, queen and king of spades as gold coins fall around her.",
    },
    icon: {
      src: callbreakIcon,
      alt: "CallBreak Club app icon: a gold-bordered ace of spades on a red starburst background.",
    },
  },
  "capsa-susun-offline": {
    cover: {
      src: capsaSusunCover,
      alt: "Capsa Susun card table with three stacked hands beneath the Capsa Susun title.",
    },
    icon: {
      src: capsaSusunIcon,
      alt: "Capsa Susun app icon: three stacked poker hands above the Capsa Susun wordmark.",
    },
  },
  "hazari-grand": {
    cover: {
      src: hazariCover,
      alt: "Hazari key art: three aces above a gold-rimmed card table.",
    },
    icon: {
      src: hazariIcon,
      alt: "Hazari Grand app icon: three aces fanned above the Hazari Grand wordmark on a wood-grain badge.",
    },
  },
  "gin-rummy-master-offline": {
    cover: {
      src: ginRummyCover,
      alt: "Gin Rummy key art: a table laid out mid-hand with the knock and gin buttons either side.",
    },
    icon: {
      src: ginRummyIcon,
      alt: "Gin Rummy Master app icon: four aces above the Gin Rummy wordmark on a wooden card table.",
    },
  },
  "lucky-9-offline": {
    cover: {
      src: luckyNineCover,
      alt: "Lucky 9 cards and chips arranged on a red card table.",
    },
    icon: {
      src: luckyNineIcon,
      alt: "Lucky 9 app icon: an eight of hearts and ace of spades above the Lucky 9 wordmark.",
    },
  },
  "ludo-challenge-offline-play": {
    cover: {
      src: ludoChallengeCover,
      alt: "Ludo board with colorful playing pieces, dice, and players around the table.",
    },
    icon: {
      src: ludoChallengeIcon,
      alt: "Ludo Challenge app icon: a die and two playing pieces over a four-colour Ludo board.",
    },
  },
  "mau-mau-offline": {
    cover: {
      src: mauMauCover,
      alt: "Mau Mau card table with players holding cards around a green felt board.",
    },
    icon: {
      src: mauMauIcon,
      alt: "Mau Mau Offline app icon: a king, queen and ace of spades fanned on a red background.",
    },
  },
  "okey-club": {
    cover: {
      src: okeyCover,
      alt: "Okey tile racks arranged on a table with the Okey Club title above them.",
    },
    icon: {
      src: okeyIcon,
      alt: "Okey Club app icon: the studio's mascot in a red fez beside two numbered Okey tiles.",
    },
  },
  "omi-club": {
    cover: {
      src: omiCover,
      alt: "Omi Club card table with four players holding cards around green felt.",
    },
    icon: {
      src: omiIcon,
      alt: "Omi Club app icon: an ace, king and queen of diamonds above the Omi wordmark on green felt.",
    },
  },
  "pusoy-offline": {
    cover: {
      src: pusoyCover,
      alt: "Pusoy card table with arranged poker hands and players around it.",
    },
    icon: {
      src: pusoyIcon,
      alt: "Pusoy app icon: a fanned poker hand above the Pusoy wordmark on a purple background.",
    },
  },
  "pusoy-dos-offline": {
    cover: {
      src: pusoyDosCover,
      alt: "Pusoy Dos card table with players holding cards beneath the Pusoy Dos title.",
    },
    icon: {
      src: pusoyDosIcon,
      alt: "Pusoy Dos app icon: four twos fanned above the Pusoy Dos wordmark.",
    },
  },
  "puzzle-twist-game": {
    cover: {
      src: puzzleClubCover,
      alt: "Puzzle Club board with colorful numbered blocks, puzzle pieces, and a trophy.",
    },
    icon: {
      src: puzzleClubIcon,
      alt: "Puzzle Club app icon: numbered merge tiles, a tic-tac-toe board and a block puzzle behind the Puzzle Club wordmark.",
    },
  },
  tarneeb: {
    cover: {
      src: tarneebCover,
      alt: "Tarneeb card table with a player seated in a high-backed chair.",
    },
    icon: {
      src: tarneebIcon,
      alt: "Tarneeb app icon: the Arabic wordmark above a queen, king and ace of spades.",
    },
  },
  "thousand-offline": {
    cover: {
      src: thousandCover,
      alt: "Thousand card table with players holding cards beside a score board.",
    },
    icon: {
      src: thousandIcon,
      alt: "Thousand Offline app icon: a queen and king of diamonds above the 1000 wordmark.",
    },
  },
  "tien-len-club": {
    cover: {
      src: tienLenCover,
      alt: "Tiến Lên card game with four players around a green table in Hanoi.",
    },
    icon: {
      src: tienLenIcon,
      alt: "Tiến Lên Club app icon: four kings above the Tiến Lên wordmark on a maroon banner.",
    },
  },
  tongit: {
    cover: {
      src: tongitsClubCover,
      alt: "Tongits Club card table with players and a tropical sunset behind the title.",
    },
    icon: {
      src: tongitsClubIcon,
      alt: "Tongits Club app icon: an ace, king and queen of diamonds above the Tongits wordmark on a beach backdrop.",
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
