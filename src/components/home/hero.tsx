import type { StaticImageData } from "next/image";

import indianRummyArt from "@/assets/games/indian-rummy/cover.webp";
import pokerFullHouseArt from "@/assets/games/poker-full-house/cover.webp";
import tongitsLegendArt from "@/assets/games/tongits-legend/cover.webp";
import { Media, type MediaPriority } from "@/components/media";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { getAllGames } from "@/content/games";

import { HeroStage } from "./hero-stage";

/**
 * The hero.
 *
 * Landscape key art cropped to 3:4 stops reading as a store banner and starts
 * reading as a playing card, which is what lets the fan work at all. Portrait
 * plates are used only here; everything further down the page is 16:9, so the
 * same nine assets carry two registers instead of one repeated shape.
 *
 * The three plates are artwork, not a claim: they carry no title, and none of
 * them is attached to a catalogue record (see src/content/games/art.ts). They
 * are marked decorative because the headline and subtext already carry every
 * fact, and "key art from a card game" is noise in a screen reader.
 *
 * The headline sits outside every reveal. It is the other LCP candidate, and an
 * element that starts transparent is an element the browser has not painted.
 */

type Plate = {
  src: StaticImageData;
  /** Percentages of the stage box, so the fan scales instead of breaking. */
  left: string;
  top: string;
  width: string;
  rotate: number;
  /** Scroll parallax travel in px. Negative rises, positive lags. */
  drift: number;
  /**
   * Horizontal crop centre. The source is 16:9 and the plate is 3:4, so cover
   * only ever crops sideways. The outer two are partly behind the front plate,
   * and this pulls each one's subject and wordmark into the part that shows,
   * instead of leaving a title sliced down the middle.
   */
  position: string;
  priority: MediaPriority;
};

/**
 * Back to front. DOM order is the stacking order and the deal order.
 *
 * The spread is set so roughly three quarters of each outer card stays visible.
 * Tighter than that and they stop reading as cards in a hand and start reading
 * as one image with something broken behind it.
 */
const PLATES: Plate[] = [
  {
    src: indianRummyArt,
    left: "0%",
    top: "20%",
    width: "36%",
    rotate: -12,
    drift: -44,
    position: "58% 50%",
    priority: "eager",
  },
  {
    src: pokerFullHouseArt,
    left: "64%",
    top: "18%",
    width: "36%",
    rotate: 11,
    drift: -20,
    position: "42% 50%",
    priority: "eager",
  },
  {
    src: tongitsLegendArt,
    left: "28%",
    top: "0%",
    width: "44%",
    rotate: -2,
    drift: 26,
    position: "50% 50%",
    priority: "lcp",
  },
];

export function Hero() {
  const total = getAllGames().length;

  return (
    <section className="relative">
      {/* One warm wash behind the fan so the plates sit in light rather than
          floating on flat paper. Tinted with the brand hue at low chroma, not
          a glow: this is depth, not decoration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(70%_60%_at_78%_28%,var(--color-brand-50),transparent_70%)]"
      />

      {/* Tall, but capped. A hero pinned to the full viewport height leaves a
          field of empty canvas under the buttons on a laptop, and stopping a
          little short lets the next section show that the page continues. */}
      <Container className="pt-12 pb-16 sm:pt-16 lg:grid lg:min-h-[min(44rem,calc(100dvh-var(--header-height)))] lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:py-16">
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

        {/* Runs into the gutters below sm. The fan is width-driven, so the
            forty pixels the page margin would take back are forty pixels off
            every card on the narrowest screens we care most about. */}
        <HeroStage className="-mx-5 mt-12 aspect-[7/5] w-[calc(100%+2.5rem)] sm:mx-auto sm:mt-16 sm:w-full sm:max-w-[32rem] lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-0 lg:max-w-none">
          {PLATES.map((plate, index) => (
            <div
              key={plate.src.src}
              data-drift={plate.drift}
              className="absolute"
              style={{ left: plate.left, top: plate.top, width: plate.width }}
            >
              <div
                data-plate
                // The resting rotation lives in the markup, so the fan is
                // already a fan before GSAP runs, or if it never does.
                style={{ transform: `rotate(${plate.rotate}deg)` }}
              >
                <Media
                  src={plate.src}
                  decorative
                  aspect="portrait"
                  sizes="heroCard"
                  position={plate.position}
                  priority={plate.priority}
                  className="plate"
                  // The two behind the front plate are dimmed a touch. Depth
                  // in real light is a loss of contrast, not just a shadow.
                  imageClassName={index === PLATES.length - 1 ? undefined : "opacity-90"}
                />
              </div>
            </div>
          ))}
        </HeroStage>
      </Container>
    </section>
  );
}
