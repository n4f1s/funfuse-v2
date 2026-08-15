import { StudioHero } from "@/components/studio";
import { routes } from "@/config/routes";
import { studioContent } from "@/content/studio";
import { createMetadata } from "@/lib/seo";

/**
 * The Studio page, served at the preserved WordPress path `/our-team/`.
 *
 * The nav has said "Studio" and pointed here since before this page existed
 * (`primaryNav` in src/config/site.ts), and `/our-team/` is one of the 22 URLs
 * carried over untouched from WordPress. The label is ours; the URL is not, and
 * a tidier `/studio/` would cost the page its history for nothing. See
 * docs/seo-migration.md.
 *
 * This ships the hero. Further sections go under it, in this file, fed from
 * `src/content/studio.ts` — nothing in the hero needs to move for that.
 */
export const metadata = createMetadata({
  title: studioContent.hero.eyebrow,
  description: studioContent.hero.lead,
  path: routes.ourTeam.path,
});

export default function StudioPage() {
  return <StudioHero />;
}
