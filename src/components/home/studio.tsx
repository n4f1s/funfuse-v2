import gem from "@/assets/decorative/props/pink-crystal-gem.png";
import bolt from "@/assets/decorative/props/yellow-lightning-bolt.png";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { getAllGames } from "@/content/games";

import { Counter } from "./counter";
import { FigureRail, FigureRule } from "./figure-rail";
import { Prop } from "./prop";

/**
 * What the studio is, and the three figures on the page.
 *
 * The catalogue count is counted from `src/content/games` at build time, so it
 * cannot drift from the games we actually ship. Downloads and active users are
 * supplied by the studio: they are not derivable from anything in this repo and
 * nothing here can verify them, so they are recorded in one place, here, and
 * updated deliberately. Do not add a figure we cannot stand behind.
 */

export function Studio() {
  const figures: {
    value: number;
    suffix: string;
    label: string;
    countDecimals?: number;
  }[] = [
    {
      value: getAllGames().length,
      suffix: "",
      label: "Published games",
    },
    // Counted to one decimal in flight. Whole, it is a four-step count that
    // reads as a stutter next to a figure in the hundreds.
    { value: 3, suffix: "M+", countDecimals: 1, label: "Total downloads" },
    { value: 500, suffix: "K+", label: "Active users" },
  ];

  return (
    <Section tone="surface">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* The heading runs two lines against a five-line column, which leaves
            a hole under it on desktop. The bolt is what stands in that hole. */}
        <div className="relative lg:col-span-7 xl:col-span-6">
          <Reveal as="div" y="lg">
            <h2 className="text-h2 text-heading font-semibold tracking-tightest">
              A studio built around games that already have players
            </h2>
          </Reveal>

          {/* Drift is capped at the height of the hole it sits in. Half of
              `drift` is the travel in each direction, so anything past about
              80 swings the bolt up into the headline. */}
          <Prop
            src={bolt}
            drift={-72}
            spin={22}
            // Stays at 64px. The source bolt is only 130px wide, so anything
            // larger is upscaled and goes soft on a retina screen.
            className="hidden w-16 lg:bottom-0 lg:left-[7%] lg:block"
          />
        </div>

        <Reveal
          stagger
          as="div"
          delay={0.08}
          className="mt-8 lg:col-span-5 lg:mt-2 xl:col-span-5 xl:col-start-8"
        >
          {/* No App Store claim. funfusegames.com mentions one, but every
              record in the catalogue carries an Android package and none
              carries an App Store id, so the page would be promising a shelf
              we cannot link to. */}
          <p className="text-body text-lg">
            We build for mobile. Every title is a game people have played for
            generations, rebuilt so it works on a cheap phone, on a bus, with no
            signal.
          </p>
          <p className="text-muted mt-5">
            We would rather a game hold its players for years than spike for a
            season, so we optimise for engagement and retention over a launch
            number.
          </p>
        </Reveal>
      </div>

      <div className="relative">
        {/* Four columns on desktop: the row titles itself in the first one, so
            the figures read as an answer to it rather than as three loose
            numbers. Below lg the title takes the full width and the figures
            share a row; below sm they stack, because "500K+" at display size
            does not survive a third of a phone. */}
        <FigureRail className="mt-12 grid gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
          <div data-figure className="will-reveal relative pt-6">
            <FigureRule tone="accent" />
            <p className="font-display text-h2 text-heading font-semibold tracking-tightest">
              Numbers
              <br />
              <span className="text-accent ">speak.</span>
            </p>
          </div>

          {/* Reversed rather than duplicated: the value reads on top, while the
              DOM keeps term before description so a screen reader gets
              "Completed games, 19" once, not the label twice. */}
          <dl className="grid gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:col-span-3">
            {figures.map((figure) => (
              <div
                key={figure.label}
                data-figure
                className="will-reveal relative flex flex-col-reverse pt-6"
              >
                <FigureRule />
                <dt className="text-muted mt-4 max-w-56 text-sm">
                  {figure.label}
                </dt>
                <dd className="font-display text-h1 text-accent leading-none font-bold tracking-tightest">
                  <Counter
                    value={figure.value}
                    suffix={figure.suffix}
                    countDecimals={figure.countDecimals}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </FigureRail>

        {/* Bottom right of the figures block. The third label is capped at
            14rem, so the corner beside it is clear at every desktop width. */}
        <Prop
          src={gem}
          drift={-56}
          spin={-30}
          className="hidden w-11 lg:right-[2%] lg:bottom-1 lg:block"
        />
      </div>
    </Section>
  );
}
