import spark from "@/assets/studio/props/studio-spark.png";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { getAllGames, getGameRegions } from "@/content/games";
import { studioContent } from "@/content/studio";

import { StudioProp } from "./studio-prop";

/**
 * The thesis, stated once, immediately after the hero.
 *
 * Every other section on this page is a consequence of this one: if the games
 * are not ours, then the work is translation, and translation is what the
 * process, the crafts and the shelf below are all describing.
 *
 * The three figures are counted from `src/content/games` at build time, so
 * they cannot drift from the catalogue. No download total, no headcount, no
 * founding year — nothing here is a number we would have to defend.
 */
export function StudioPremise() {
  const { premise } = studioContent;
  const total = getAllGames().length;
  const traditions = getGameRegions().length;

  const figures = [
    { value: String(total), label: "titles live on Google Play" },
    { value: String(traditions), label: "traditions the catalogue draws from" },
    { value: "Offline", label: "every one, with no connection" },
  ];

  return (
    <Section tone="surface" className="relative overflow-hidden">
      <div className="relative lg:grid lg:grid-cols-12 lg:gap-x-12">
        <Reveal as="div" y="lg" className="lg:col-span-6">
          {/* The one statement on the page set at heading scale with a full
              stop of its own. It is the argument, not a section label. */}
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            {premise.title}
            <span className="text-accent">.</span>
          </h2>
        </Reveal>

        <Reveal
          stagger
          as="div"
          delay={0.08}
          className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-2"
        >
          {premise.body.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0 ? "text-body text-lg" : "text-muted mt-5 text-lg"
              }
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>

      {/* Three columns under one rule rather than three boxes: the figures are
          a footnote to the statement above them, not a scoreboard. */}
      <Reveal
        stagger
        as="dl"
        delay={0.12}
        className="border-line mt-12 grid gap-y-8 border-t pt-8 sm:grid-cols-3 sm:gap-x-8 lg:mt-16"
      >
        {/* Reversed rather than duplicated: the value reads on top, while the
            DOM keeps term before description so a screen reader gets the pair
            in the order the spec promises. */}
        {figures.map((figure) => (
          <div key={figure.label} className="flex flex-col-reverse">
            <dt className="text-muted mt-2 max-w-56 text-sm">{figure.label}</dt>
            <dd className="font-display text-h3 text-heading font-semibold tracking-tightest">
              {figure.value}
            </dd>
          </div>
        ))}
      </Reveal>

      {/* Sits in the gap the two-column head leaves on the right, above the
          figures. Small, because the source art is 130px wide. */}
      <StudioProp
        src={spark}
        drift={-64}
        spin={26}
        className="hidden w-12 lg:top-2 lg:right-[3%] lg:block"
      />
    </Section>
  );
}
