import {
  CareerBenefits,
  CareerClosing,
  CareerPositions,
  CareersHero,
} from "@/components/careers";
import { careersContent } from "@/content/careers";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo";

/**
 * The preserved WordPress careers URL. This page deliberately has no job
 * schema: the source content does not supply the employment type, location,
 * posting date, or other fields needed to make a valid JobPosting truthful.
 */
export const metadata = createMetadata({
  title: careersContent.hero.eyebrow,
  description: careersContent.hero.description,
  path: routes.careers.path,
});

export default function CareersPage() {
  const applicationEmail = careersContent.jobs[0]?.applyEmail;

  return (
    <>
      <CareersHero hero={careersContent.hero} jobs={careersContent.jobs} />
      <CareerBenefits
        title={careersContent.benefits.title}
        groups={careersContent.benefits.groups}
      />
      <CareerPositions jobs={careersContent.jobs} />
      {applicationEmail ? (
        <CareerClosing
          email={applicationEmail}
          description={careersContent.hero.description}
        />
      ) : null}
    </>
  );
}
