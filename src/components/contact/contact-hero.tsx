import { Reveal } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import { contactContent } from "@/content/contact";

import { ContactHeroStage } from "./contact-hero-stage";

/**
 * The contact hero.
 *
 * The deck beside the headline is being idly shuffled, which is the only thing
 * a contact page can say before a word has been exchanged: somebody is here.
 * It is a different gesture from the table below, which is progress on a form,
 * and from the fan on the careers page, which is an offer.
 *
 * The headline sits outside every reveal: it is this route's LCP candidate,
 * and an element that starts transparent is an element the browser has not
 * painted.
 */
export function ContactHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(46%_58%_at_72%_26%,var(--color-brand-100),transparent_70%)]"
      />

      <Container className="relative pt-12 pb-14 sm:pt-16 sm:pb-16 lg:grid lg:min-h-[min(34rem,calc(100dvh-var(--header-height)))] lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:py-20">
        <div className="relative z-1 lg:col-span-6">
          <p className="text-accent-text text-sm font-semibold tracking-wide">
            {contactContent.eyebrow}
          </p>

          <h1 className="text-h1 text-heading mt-5 max-w-xl font-bold tracking-tightest">
            {contactContent.title}
            <span className="text-accent">.</span>
          </h1>

          <Reveal as="div" y="sm" delay={0.06} className="mt-7 max-w-xl">
            <p className="text-muted text-xl">{contactContent.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="#message" size="lg" className="w-full sm:w-auto">
                {contactContent.formTitle}
              </Button>
              {/* Applications have their own form on the careers page, and a
                candidate who lands here should not have to work that out from
                a topic list that does not mention them. */}
              <Button
                href="/careers/#apply"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Applying for a role
              </Button>
            </div>
          </Reveal>
        </div>

        <ContactHeroStage className="mx-auto mt-14 max-w-[22rem] sm:mt-16 sm:max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:max-w-none" />
      </Container>
    </section>
  );
}
