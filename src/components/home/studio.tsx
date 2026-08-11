import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { getAllGames, getGameRegions } from "@/content/games";

/**
 * What the studio is, and the only three figures on the page.
 *
 * Every number here is either counted from `src/content/games` at build time or
 * already published on funfusegames.com. Nothing about downloads, ratings,
 * awards or players appears anywhere on this site: the live WordPress counters
 * read zero, and a figure we cannot stand behind is worse than no figure.
 */

export function Studio() {
  const figures = [
    { value: String(getAllGames().length), label: "titles live on Google Play" },
    { value: String(getGameRegions().length), label: "card and board traditions" },
    // The only figure not counted from our own data. It restates
    // "a global team of over 10 seasoned professionals" from funfusegames.com.
    { value: "10+", label: "people, working across several countries" },
  ];

  return (
    <Section tone="surface">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <Reveal as="div" className="lg:col-span-7 xl:col-span-6">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            A studio built around games that already have players
          </h2>
        </Reveal>

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

      <Reveal
        stagger
        as="dl"
        className="mt-12 grid gap-9 sm:grid-cols-3 sm:gap-8 lg:mt-16"
      >
        {/* Reversed rather than duplicated: the value reads on top, while the
            DOM keeps term before description so a screen reader gets
            "titles live on Google Play, 19" once, not the label twice. */}
        {figures.map((figure) => (
          <div
            key={figure.label}
            className="border-line flex flex-col-reverse border-t pt-6"
          >
            <dt className="text-muted mt-4 max-w-56 text-sm">{figure.label}</dt>
            <dd className="font-display text-h1 text-accent tabular leading-none font-bold tracking-tightest">
              {figure.value}
            </dd>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
