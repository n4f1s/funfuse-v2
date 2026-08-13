import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { getAllGames } from "@/content/games";

import { HeroBoardGame } from "./hero-board-game";

/**
 * The hero.
 *
 * The hero board gives the catalogue a small piece of game motion without
 * repeating the Mini Trick Table further down the homepage.
 *
 * It is decorative. The headline and subtext already carry every fact this
 * page needs to communicate, while a screen reader reading out every board
 * tile would be noise.
 *
 * The headline sits outside every reveal. It is the other LCP candidate, and an
 * element that starts transparent is an element the browser has not painted.
 */

export function Hero() {
  const total = getAllGames().length;

  return (
    <section className="relative">
      {/* Two passes of the same warm light, and the reason the hero reads as
          one composition rather than as copy beside a widget.

          The first is centred on the board and wide enough to carry under the
          headline. The second is a much fainter one low and left, under the
          buttons, so the type side is lit by the same source instead of
          sitting on plain paper next to something that is. Brand hue at low
          chroma: depth, not a glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(58%_62%_at_72%_44%,var(--color-brand-50),transparent_72%),radial-gradient(46%_44%_at_10%_78%,var(--color-brand-50),transparent_78%)]"
      />

      {/* Tall, but capped. A hero pinned to the full viewport height leaves a
          field of empty canvas under the buttons on a laptop, and stopping a
          little short lets the next section show that the page continues. */}
      <Container className="pt-12 pb-16 sm:pt-16 lg:grid lg:min-h-[min(42rem,calc(100dvh-var(--header-height)))] lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:py-14">
        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
          {/* text-h1, not text-hero. At hero scale this headline runs to three
              lines in a half-width column, and a 100px line of type would be
              shouting over the artwork the page is built to show. */}
          <h1 className="text-h1 text-heading font-bold tracking-tightest">
            The games you already know
            <span className="text-accent">.</span>
          </h1>

          <p className="text-muted mt-6 max-w-md text-xl lg:mt-8">
            FunFuse builds offline card and board games from the traditions
            people already play. {total} titles, live on Google Play.
          </p>

          {/* Full width below sm. Neither label fits beside the other at
              375px, and two pills of different widths on separate rows reads
              as a wrap accident rather than a pair. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-10">
            <Button
              href={site.socials.googlePlay}
              size="lg"
              className="w-full sm:w-auto"
            >
              Browse on Google Play
            </Button>
            <Button
              href="#featured"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              See the games
            </Button>
          </div>
        </div>

        {/* Inside the gutters, unlike the fan this replaced: the board's turn
            rail and dice tray hang off its top and bottom edges, and a
            full-bleed board would run them into the edge of a phone.

            On a desktop it fills its half of the grid instead of sitting
            centred in it with slack on both sides. The slack was most of what
            made the board look parked next to the headline rather than set
            opposite it. */}
        <HeroBoardGame className="mx-auto mt-14 w-full max-w-[19rem] sm:mt-16 sm:max-w-[23rem] lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-0 lg:max-w-[32rem] xl:max-w-[36rem]" />
      </Container>
    </section>
  );
}
