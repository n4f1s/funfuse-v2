import {
  Catalogue,
  Closing,
  Craft,
  FeaturedGames,
  Hero,
  Origins,
  Studio,
  TrickTable,
} from "@/components/home";
import { site } from "@/config/site";
import { createMetadata } from "@/lib/seo";

/**
 * Homepage.
 *
 * Eight bands, alternating tone so the sections separate without a box being
 * drawn around anything: canvas hero, surface, the one tinted band, canvas,
 * surface, sunken table, canvas, sunken sign-off. Every section is a Server
 * Component; the client islands (`HeroStage`, `Hand`, `Parallax`,
 * `OriginsMarquee`, `TrickTableBoard`) are leaves, and all but the table take
 * server-rendered markup as children.
 *
 * No structured data is added here. The layout already emits Organization and
 * WebSite, and an ItemList of games would point at Play Store URLs rather than
 * pages we own. It belongs in the commit that ships /projects/<slug>/.
 */

export const metadata = createMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Studio />
      <Origins />
      <FeaturedGames />
      <Craft />
      <TrickTable />
      <Catalogue />
      <Closing />
    </>
  );
}
