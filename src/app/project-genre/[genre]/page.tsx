import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb, GameGrid, ListingIntro } from "@/components/games";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { legacyGenreRoutes } from "@/config/routes";
import { getAllGames } from "@/content/games";
import { getGamesWithCover } from "@/content/games/art";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/jsonld";
import { createMetadata } from "@/lib/seo";

type Params = { genre: string };
type Props = { params: Promise<Params> };

/**
 * `categoryLabels` (e.g. "Card game") is a singular description used inline
 * elsewhere ("Card game · India"), so appending "games" to it here would read
 * "Card game games". This is the plural heading for these two archive pages
 * specifically.
 */
const genreHeadings: Record<string, string> = {
  "card-game": "Card games",
  "board-game": "Board games",
};

/** Only the two categories WordPress had a genre archive for. */
export function generateStaticParams() {
  return Object.keys(legacyGenreRoutes).map((genre) => ({ genre }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const category = legacyGenreRoutes[genre];
  if (!category) notFound();

  const heading = genreHeadings[genre];
  return createMetadata({
    title: heading,
    description: `${heading} from FunFuse Games, playable offline.`,
    path: `/project-genre/${genre}`,
  });
}

export default async function GenrePage({ params }: Props) {
  const { genre } = await params;
  const category = legacyGenreRoutes[genre];
  if (!category) notFound();

  const heading = genreHeadings[genre];
  const entries = getGamesWithCover().filter(({ game }) => game.category === category);
  const trail = [
    { name: "Home", path: "/" },
    { name: "Games", path: "/games" },
    { name: heading, path: `/project-genre/${genre}` },
  ];

  return (
    <>
      <Section tone="canvas">
        <Breadcrumb trail={trail} />
        <ListingIntro
          heading={heading}
          description={`${entries.length} of the ${getAllGames().length} titles, all playable offline.`}
        />
        <GameGrid entries={entries} className="mt-12 lg:mt-16" />
      </Section>

      <JsonLd data={jsonLdGraph(breadcrumbSchema(trail))} />
    </>
  );
}
