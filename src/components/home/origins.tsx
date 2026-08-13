import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getAllGames, getGameRegions, regionLabels } from "@/content/games";

import { OriginsCards } from "./origins-cards";
import { OriginsMarquee } from "./origins-marquee";

/**
 * Where the catalogue comes from.
 *
 * The one band on the page carrying the brand tint, and the one that moves on
 * its own. It sits between the studio and the artwork because that is where
 * the page changes subject: it stops talking about us and starts showing the
 * games, and the honest thing to say in between is that none of them are ours.
 *
 * Both rows are read from `src/content/games`. The places are
 * `getGameRegions()`, which excludes `international` on purpose, so this is a
 * roll call of real traditions rather than a padded list. Nothing here is
 * typed in by hand, so a title added to the catalogue joins the band with it.
 *
 * No figure is printed. The catalogue further down already counts the titles
 * and the traditions, and saying it twice on one page makes it a slogan.
 */

/** Rotated between places. The catalogue is mostly card games. */
const SUITS = ["♠", "♥", "♦", "♣"] as const;

export function Origins() {
  const regions = getGameRegions();
  const games = getAllGames();

  const places = regions.map((region, index) => (
    <span
      key={region}
      className="flex items-center gap-5 pr-5 whitespace-nowrap md:gap-9 md:pr-9"
    >
      <span className="font-display text-h1 text-heading font-semibold tracking-tightest">
        {regionLabels[region]}
      </span>
      {/* Large and decorative, so `accent` rather than `accent-text`. */}
      <span className="text-accent text-h3 leading-none">
        {SUITS[index % SUITS.length]}
      </span>
    </span>
  ));

  const titles = games.map((game) => (
    <span
      key={game.slug}
      className="flex items-center gap-2.5 pr-2.5 whitespace-nowrap md:gap-3.5 md:pr-3.5"
    >
      <span className="bg-brand-300 h-1 w-1 shrink-0 rounded-full" />
      {/* Uppercase and tracked out, so the lower row reads as a ticker rather
          than as a second copy of the catalogue index. */}
      <span className="text-muted text-2xs md:text-xs font-medium tracking-wide uppercase">
        {game.title}
      </span>
    </span>
  ));

  return (
    <Section tone="accent" bleed>
      <Container className="lg:flex lg:items-center lg:justify-between lg:gap-x-12">
        <Reveal as="div" y="lg" className="max-w-xl">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            Played at these tables first
          </h2>
          <p className="text-muted mt-4 text-lg">
            None of these games were invented here. Each one belongs to the
            places below, and to the tables that were playing it long before
            there was an app.
          </p>
        </Reveal>

        {/* From lg only, which is the width at which the copy stops filling
            the row and leaves a hole beside it. Below that there is no hole to
            fill, and an infinite timeline is not scenery a phone should pay
            for. */}
        <OriginsCards className="hidden shrink-0 lg:block lg:w-64" />
      </Container>

      {/* Outside the container and outside any reveal: the rows are already
          arriving from off screen, and fading in something that is moving
          reads as a dropped frame. */}
      <div className="mt-10 md:mt-14">
        <OriginsMarquee places={places} titles={titles} />
      </div>
    </Section>
  );
}
