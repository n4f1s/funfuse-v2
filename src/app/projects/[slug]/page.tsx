import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb, GameHero, RelatedGames, ScreenshotsGallery } from "@/components/games";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import {
  gameHref,
  getAllGames,
  getGameBySlug,
  getRelatedGames,
  type Game,
  type GameArtwork,
} from "@/content/games";
import { getGameArt } from "@/content/games/art";
import { breadcrumbSchema, gameSchema, jsonLdGraph } from "@/lib/jsonld";
import { createMetadata } from "@/lib/seo";

type Params = { slug: string };
type Props = { params: Promise<Params> };

/** All 19 known slugs, built statically. No CMS, no way to add a 20th slug at runtime. */
export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.slug }));
}

/** Any slug outside the 19 above hard-404s rather than attempting a render. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const cover = getGameArt(slug)?.cover;

  return createMetadata({
    title: game.title,
    description: game.description ?? game.summary,
    path: gameHref(game),
    image: cover
      ? {
          url: cover.src.src,
          width: cover.src.width,
          height: cover.src.height,
          alt: cover.alt,
        }
      : undefined,
  });
}

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const art = getGameArt(slug);
  const trail = [
    { name: "Home", path: "/" },
    { name: "Games", path: "/games" },
    { name: game.title, path: gameHref(game) },
  ];

  const related = getRelatedGames(game)
    .map((relatedGame) => ({
      game: relatedGame,
      cover: getGameArt(relatedGame.slug)?.cover,
    }))
    .filter(
      (entry): entry is { game: Game; cover: GameArtwork } => entry.cover !== undefined,
    );

  return (
    <>
      <Section tone="canvas">
        <Breadcrumb trail={trail} />
        <GameHero game={game} cover={art?.cover} icon={art?.icon} />
      </Section>

      <Section tone="surface">
        <ScreenshotsGallery screenshots={art?.screenshots} title={game.title} />
      </Section>

      {related.length > 0 ? (
        <Section tone="canvas">
          <RelatedGames current={game} related={related} />
        </Section>
      ) : null}

      <JsonLd data={jsonLdGraph(gameSchema(game), breadcrumbSchema(trail))} />
    </>
  );
}
