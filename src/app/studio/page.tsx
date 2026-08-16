import {
  StudioClosing,
  StudioCraft,
  StudioCulture,
  StudioHero,
  StudioPremise,
  StudioProcess,
  StudioShelf,
  StudioTranslation,
} from "@/components/studio";
import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/routes";
import { studioContent } from "@/content/studio";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/jsonld";
import { createMetadata } from "@/lib/seo";

/**
 * The Studio page, served at the new path `/studio/`.
 *
 * **Why this URL.** WordPress split the studio across `/our-team/` for the
 * people and `/services/` for the work. This page carries both, plus the
 * process, the crafts and the catalogue, so neither old title describes what is
 * served here and neither URL was kept. Both 308 into `/studio/`, which is the
 * name the navigation has used for this section since launch. That is the
 * redirect table's "genuinely consolidated" justification, and the cost of it
 * is written down in docs/seo-migration.md.
 *
 * **The order is the argument.** Hero states where a game starts. Premise says
 * the games are not ours, which makes everything after it translation rather
 * than invention. Translation shows that claim on real screens; process is how
 * it happens; craft is who has to be right for it to; the shelf is the whole
 * body of work in one glance; culture is the people; the closing is the two
 * ways out.
 */
export const metadata = createMetadata({
  title: studioContent.hero.eyebrow,
  description: studioContent.hero.lead,
  path: routes.studio.path,
});

export default function StudioPage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([
            { name: "Home", path: routes.home.path },
            { name: studioContent.hero.eyebrow, path: routes.studio.path },
          ]),
        )}
      />

      <StudioHero />
      <StudioPremise />
      <StudioTranslation />
      <StudioProcess />
      <StudioCraft />
      <StudioShelf />
      <StudioCulture />
      <StudioClosing />
    </>
  );
}
