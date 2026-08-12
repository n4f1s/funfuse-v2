import { Reveal } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import type { CareersContent } from "@/content/careers";

import { CareersHeroStage } from "./careers-hero-stage";

export function CareersHero({
  hero,
}: {
  hero: CareersContent["hero"];
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(56%_62%_at_78%_38%,var(--color-brand-100),transparent_72%)]"
      />

      <Container className="relative pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid lg:min-h-[min(39rem,calc(100dvh-var(--header-height)))] lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:py-20">
        <div className="relative z-1 lg:col-span-7 xl:col-span-6">
          <p className="text-accent-text text-sm font-semibold tracking-wide">
            {hero.eyebrow}
          </p>
          {/* The route's largest text stays painted. Only the supporting copy
              arrives with motion, so an animation cannot delay this page's LCP. */}
          <h1
            id="careers-heading"
            className="text-h1 text-heading mt-4 max-w-xl font-bold tracking-tightest"
          >
            {hero.title}
            <span className="text-accent">.</span>
          </h1>

          <Reveal
            as="div"
            y="sm"
            delay={0.06}
            className="mt-7 max-w-xl lg:mt-8"
          >
            <p className="text-muted text-xl">{hero.description}</p>
            <Button
              href="#open-positions"
              size="lg"
              className="mt-8 w-full sm:w-auto"
            >
              View open positions
            </Button>
          </Reveal>
        </div>

        <CareersHeroStage className="pointer-events-none mx-auto mt-12 max-w-[24rem] sm:mt-16 sm:max-w-[28rem] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:max-w-none" />
      </Container>
    </section>
  );
}
