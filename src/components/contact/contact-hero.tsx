import { Reveal } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import { contactContent } from "@/content/contact";

/**
 * The contact hero.
 *
 * Type only. The card set piece on this page is the table beside the form, and
 * a second one up here would be two things doing the same job while the reader
 * is still working out what the page is for.
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

      <Container className="relative pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        <p className="text-accent-text text-sm font-semibold tracking-wide">
          {contactContent.eyebrow}
        </p>

        <h1 className="text-h1 text-heading mt-5 max-w-3xl font-bold tracking-tightest">
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
      </Container>
    </section>
  );
}
