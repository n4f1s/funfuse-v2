import { Button, Container } from "@/components/ui";
import { faqContent } from "@/content/faq";

export function FaqHero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <Container className="relative z-10 py-16 sm:py-20 lg:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-text">
              {faqContent.eyebrow}
            </p>
            <h1 className="mt-4 text-h1 font-semibold tracking-tightest text-heading">
              {faqContent.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {faqContent.description}
            </p>
          </div>

          <aside className="relative overflow-hidden rounded-lg border border-accent/20 bg-surface p-6 shadow-md sm:p-7">
            <span
              aria-hidden="true"
              className="absolute -right-5 -top-8 font-display text-[7rem] leading-none text-accent-tint-strong"
            >
              ♣
            </span>
            <div className="relative">
              <p className="font-display text-xl font-semibold text-heading">
                {faqContent.support.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {faqContent.support.body}
              </p>
              <Button
                href={`mailto:${faqContent.support.email}`}
                variant="primary"
                size="sm"
                className="mt-5"
              >
                Email support
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
