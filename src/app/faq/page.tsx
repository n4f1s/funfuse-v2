import { FaqAccordion, FaqDecor, FaqHero } from "@/components/faq";
import { Link } from "@/components/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui";
import { routes } from "@/config/routes";
import { faqContent } from "@/content/faq";
import { faqSchema, jsonLdGraph } from "@/lib/jsonld";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Frequently asked questions",
  description: faqContent.description,
  path: routes.faq.path,
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph(faqSchema(faqContent.entries))} />

      <main className="relative isolate overflow-clip bg-canvas">
        <FaqDecor />
        <FaqHero />

        <section className="relative z-10 py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="mx-auto grid max-w-[64rem] gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
              <aside className="hidden lg:block">
                <div className="sticky top-[calc(var(--header-height)+2rem)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Quick help
                  </p>
                  <div className="mt-4 h-px w-10 bg-accent" />
                  <p className="mt-4 text-sm leading-6 text-muted">
                    Browse the most common questions from FunFuse players.
                  </p>
                  <Link
                    href="/privacy-policy/"
                    className="mt-5 inline-flex text-sm font-semibold text-accent-text underline decoration-accent/30 underline-offset-4 hover:text-accent-pressed"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </aside>

              <div>
                <FaqAccordion entries={faqContent.entries} />

                <div className="mt-10 rounded-lg border border-line bg-surface-muted px-5 py-6 sm:px-7 sm:py-7">
                  <p className="font-display text-lg font-semibold text-heading">
                    Couldn’t find your answer?
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    Send us the details and our support team will do its best to help.
                  </p>
                  <a
                    href={`mailto:${faqContent.support.email}`}
                    className="mt-4 inline-flex font-semibold text-accent-text underline decoration-accent/30 underline-offset-4 hover:text-accent-pressed"
                  >
                    {faqContent.support.email}
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
