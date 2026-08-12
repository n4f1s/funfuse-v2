import { Reveal } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import type { CareerJob, CareersContent } from "@/content/careers";

import { CareersHeroStage } from "./careers-hero-stage";
import { roleId } from "./role-id";

/**
 * The careers hero.
 *
 * Two things carry it: the headline, and a hand of cards that reacts to the
 * pointer. The role pills under the call to action are not decoration — each
 * one is an anchor into the switcher below, which reads the hash back and
 * opens that role. So the first screen already answers "what are you hiring
 * for", and one tap gets to the answer.
 *
 * The headline sits outside every reveal. It is this route's LCP candidate,
 * and an element that starts transparent is an element the browser has not
 * painted.
 */
export function CareersHero({
  hero,
  jobs,
}: {
  hero: CareersContent["hero"];
  jobs: readonly CareerJob[];
}) {
  return (
    <section className="relative overflow-hidden">
      {/* One warm wash behind the hand so the cards sit in light rather than
          floating on flat paper. Tinted with the brand hue at low chroma, not
          a glow: this is depth, not decoration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(58%_62%_at_76%_34%,var(--color-brand-100),transparent_72%)]"
      />

      <Container className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:grid lg:min-h-[min(42rem,calc(100dvh-var(--header-height)))] lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:py-20">
        <div className="relative z-1 lg:col-span-6 xl:col-span-6">
          {/* The one eyebrow on this page. The count beside it is read from the
              catalogue of jobs, so it cannot drift out of step with the list. */}
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold tracking-wide">
            <span className="text-accent-text">{hero.eyebrow}</span>
            <span aria-hidden className="bg-line-strong h-3 w-px" />
            <span className="text-muted font-medium">
              {jobs.length} open roles
            </span>
          </p>

          <h1
            id="careers-heading"
            className="text-h1 text-heading mt-5 max-w-xl font-bold tracking-tightest"
          >
            {hero.title}
            <span className="text-accent">.</span>
          </h1>

          <Reveal as="div" y="sm" delay={0.06} className="mt-7 max-w-xl lg:mt-8">
            <p className="text-muted text-xl">{hero.description}</p>

            <Button
              href="#open-positions"
              size="lg"
              className="mt-8 w-full sm:w-auto"
            >
              View open positions
            </Button>

            {/* Pills, because they are pressable. Each is a real jump into the
                switcher rather than a label, so the hero is a way in and not a
                second copy of the list below it. */}
            <ul role="list" className="mt-6 flex flex-wrap gap-2">
              {jobs.map((job) => (
                <li key={job.title}>
                  <a
                    href={`#${roleId(job.title)}`}
                    className="border-line bg-surface text-heading shadow-xs hover:border-line-strong hover:bg-surface-muted duration-[var(--duration-press)] inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[transform,background-color,border-color] ease-out active:scale-[0.97]"
                  >
                    <span
                      aria-hidden
                      className="bg-accent h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                    {job.title}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Runs into the gutters below sm. The hand is width-driven, so the
            forty pixels the page margin would take back are forty pixels off
            every card on the narrowest screens we care most about. */}
        <CareersHeroStage className="pointer-events-none -mx-5 mt-14 w-[calc(100%+2.5rem)] sm:mx-auto sm:mt-16 sm:w-full sm:max-w-[30rem] lg:pointer-events-auto lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-0 lg:max-w-none" />
      </Container>
    </section>
  );
}
