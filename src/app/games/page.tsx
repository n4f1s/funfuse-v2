import { GameGrid, ListingIntro } from "@/components/games";
import { Section } from "@/components/ui/section";
import { getAllGames, getGameRegions } from "@/content/games";
import { getGamesWithCover } from "@/content/games/art";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Games",
  description: `${getAllGames().length} card and board games from FunFuse Games, free on Google Play and playable offline.`,
  path: "/games",
});

export default function GamesPage() {
  const entries = getGamesWithCover();

  return (
    <Section tone="canvas">
      <ListingIntro
        heading="Every game we've made"
        description={`${entries.length} titles across ${getGameRegions().length} traditions, from Tongits in Manila to Belote in France. All of them play offline.`}
      />
      <GameGrid entries={entries} className="mt-12 lg:mt-16" />
    </Section>
  );
}
