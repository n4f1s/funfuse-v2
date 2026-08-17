import boy from "@/assets/decorative/characters/casual-boy-red-jacket.png";
import { Media } from "@/components/media";
import { Parallax, Reveal, WordReveal } from "@/components/motion";
import { Section } from "@/components/ui";
import type { CareerJob } from "@/content/careers";

import { ApplyForm } from "./apply-form";
import { applyHash } from "./role-id";

/**
 * The foot of the careers page: apply, here, without leaving.
 *
 * This is where an Apply button in the role switcher lands, with the role
 * already chosen from the hash. It replaced a `mailto:` link, because a link
 * that opens a mail client is a dead end on a phone with no mail account set
 * up, and it left us with applications in whatever shape somebody's mail app
 * produced.
 *
 * The address stays on the page beside the form. A form is the fast path, not
 * the only one, and a candidate who would rather attach a PDF should not have
 * to hunt for somewhere to send it.
 */
export function CareerApply({
  jobs,
  email,
}: {
  jobs: readonly CareerJob[];
  email: string;
}) {
  return (
    <Section id="apply" tone="sunken" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(48%_64%_at_78%_14%,var(--color-brand-100),transparent_70%)]"
      />

      {/* One named anchor per role, all resolving to the top of this section.
          The Apply buttons in the switcher link here and <ApplyForm> reads the
          same slug back out of the hash: the fragment is carrying which role,
          not where to stop. */}
      <div aria-hidden className="relative">
        {jobs.map((job) => (
          <span
            key={job.title}
            id={applyHash(job.title)}
            className="absolute top-0 block h-0 w-0"
          />
        ))}
      </div>

      <div className="relative z-1 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <WordReveal
            as="h2"
            id="apply-heading"
            text="Apply to join our team"
            className="text-h2 text-heading font-semibold tracking-tightest"
          />

          <Reveal as="div" y="lg">
            <p className="text-muted mt-5 max-w-md text-lg">
              Pick the role, tell us what you have made, and leave us something
              we can open. That is the whole application.
            </p>

            <p className="text-muted mt-8 text-sm">
              Would rather attach a file?{" "}
              <a
                href={`mailto:${email}`}
                className="text-accent-text decoration-brand-200 hover:decoration-accent underline decoration-2 underline-offset-4 transition-[text-decoration-color] duration-[var(--duration-hover)] ease-out"
              >
                {email}
              </a>
            </p>
          </Reveal>

          {/* The heading column runs out well before the form does on a wide
              screen, so the band ends on the studio's own art rather than on
              empty canvas. Hidden below lg, where there is no empty column. */}
          <div
            aria-hidden
            // Matches the `sizes` string below. Change both together.
            className="pointer-events-none mt-10 hidden w-40 lg:block xl:w-48"
          >
            <Parallax distance={-40}>
              <Media
                src={boy}
                decorative
                aspect="intrinsic"
                sizes="(min-width: 1280px) 192px, 160px"
                tone="none"
                rounded="none"
                fit="contain"
              />
            </Parallax>
          </div>
        </div>

        <div className="mt-10 lg:col-span-7 lg:mt-0">
          <ApplyForm roles={jobs.map((job) => job.title)} />
        </div>
      </div>
    </Section>
  );
}
