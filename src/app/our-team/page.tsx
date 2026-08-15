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
 * The Studio page, served at the preserved WordPress path `/our-team/`.
 *
 * **Why this URL.** The nav has said "Studio" and pointed here since before the
 * page existed (`primaryNav` in src/config/site.ts), and `/our-team/` is one of
 * the URLs carried over untouched from WordPress. A tidier `/studio/` would
 * cost the page its history for nothing. `/services/` used to hold the "what we
 * do" half of this story and is now a 308 into this page, which is the one
 * justification the redirect table accepts for retiring a preserved URL: the
 * content is genuinely consolidated. See docs/seo-migration.md.
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
  path: routes.ourTeam.path,
});

export default function StudioPage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([
            { name: "Home", path: routes.home.path },
            { name: studioContent.hero.eyebrow, path: routes.ourTeam.path },
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
