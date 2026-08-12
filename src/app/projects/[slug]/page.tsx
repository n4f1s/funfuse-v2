import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  GameHero,
  GameHowToPlay,
  GameModes,
  GameOverview,
  GameRules,
  GameTips,
  RelatedGames,
  ScreenshotsGallery,
} from "@/components/games";
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
import { getGameDetails } from "@/content/games/details";
import { getGameScreenshots } from "@/content/games/screenshots";
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
  const details = getGameDetails(slug);

  return createMetadata({
    title: game.title,
    description: details?.seoDescription ?? game.description ?? game.summary,
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
  const details = getGameDetails(slug);
  const screenshots = getGameScreenshots(slug, game.title);
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

  /**
   * The band list, not fixed `<Section>` tones per slot. `details` is
   * structured, optional data — a game can ship without rule groups, tips or
   * (outside Puzzle Club) modes — and skipping a slot must not also skip its
   * place in the canvas/surface alternation, or two adjacent bands land on
   * the same tone. Building the list first and alternating over what actually
   * rendered keeps every one of the 19 pages visually correct regardless of
   * which optional fields it has, with no per-slug branching.
   */
  const bands: { key: string; node: ReactNode }[] = [
    {
      key: "hero",
      node: (
        <>
          <Breadcrumb trail={trail} />
          <GameHero game={game} cover={art?.cover} icon={art?.icon} />
        </>
      ),
    },
    {
      key: "screenshots",
      node: <ScreenshotsGallery slots={screenshots} title={game.title} />,
    },
  ];

  if (details) {
    bands.push({ key: "overview", node: <GameOverview details={details} /> });
    bands.push({ key: "how-to-play", node: <GameHowToPlay details={details} /> });

    if (details.modes && details.modes.length > 0) {
      bands.push({ key: "modes", node: <GameModes modes={details.modes} /> });
    }
    if (details.ruleGroups && details.ruleGroups.length > 0) {
      bands.push({ key: "rules", node: <GameRules ruleGroups={details.ruleGroups} /> });
    }
    if (details.tips && details.tips.length > 0) {
      bands.push({ key: "tips", node: <GameTips tips={details.tips} /> });
    }
  }

  if (related.length > 0) {
    bands.push({ key: "related", node: <RelatedGames current={game} related={related} /> });
  }

  return (
    <>
      {bands.map((band, index) => (
        <Section key={band.key} tone={index % 2 === 0 ? "canvas" : "surface"}>
          {band.node}
        </Section>
      ))}

      <JsonLd
        data={jsonLdGraph(
          gameSchema(game, details?.seoDescription),
          breadcrumbSchema(trail),
        )}
      />
    </>
  );
}
