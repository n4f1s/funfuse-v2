import type { GameArtwork } from "@/content/games";
import { getGameArt } from "@/content/games/art";
import type { BlogPost } from "@/content/blog";

/**
 * Resolves blog art through the catalogue's static-import map. Blog content
 * only names a game and an intended slot; it never owns a second image map.
 */
export function getBlogHeroArtwork(post: BlogPost): GameArtwork | null {
  if (post.hero?.kind !== "game-art") return null;

  const art = getGameArt(post.hero.gameSlug);
  return art?.[post.hero.preferredSlot] ?? null;
}
