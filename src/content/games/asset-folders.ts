/**
 * Slug -> asset-folder mapping.
 *
 * Game slugs are public URLs (`src/content/games/games.ts`); asset folder
 * names are filesystem paths under `src/assets/games/`. The two only
 * sometimes match — `tarneeb` is `tarneeb`, but `tongit` is
 * `tongits-club-offline` and `puzzle-twist-game` is `puzzle-club` — so this is
 * the one place that mapping is written down, rather than re-derived by hand
 * in `art.ts`'s imports and, separately, in the screenshot generator.
 *
 * Consumed by `scripts/generate-screenshots.ts` (a plain Node script, run
 * outside the Next/webpack module graph) as well as by app code, so it stays
 * a leaf module with zero imports of its own.
 */
export const gameAssetFolders: Readonly<Record<string, string>> = {
  "3-2-5-offline-fun-card-game": "3-2-5-offline",
  "belote-francaise": "belote-francaise",
  "bhabhi-thulla-card-game": "bhabhi-thulla",
  "callbreak-offline": "callbreak-offline",
  "capsa-susun-offline": "capsa-susun",
  "gin-rummy-master-offline": "gin-rummy",
  "hazari-grand": "hazari-grand",
  "lucky-9-offline": "lucky-9",
  "ludo-challenge-offline-play": "ludo-challenge",
  "mau-mau-offline": "mau-mau",
  "okey-club": "okey-club",
  "omi-club": "omi-club",
  "pusoy-offline": "pusoy",
  "pusoy-dos-offline": "pusoy-dos",
  "puzzle-twist-game": "puzzle-club",
  tarneeb: "tarneeb",
  "thousand-offline": "thousand",
  "tien-len-club": "tien-len",
  tongit: "tongits-club-offline",
} as const;
