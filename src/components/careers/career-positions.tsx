import { Reveal, WordReveal } from "@/components/motion";
import { Button, Section } from "@/components/ui";
import type { CareerJob } from "@/content/careers";

import { applyHash, roleId } from "./role-id";
import { RoleSwitcher } from "./role-switcher";

/**
 * Open positions.
 *
 * A rail of role titles beside one open role. Every requirement of every role
 * is in the server HTML, so a crawler and a reader with no JavaScript get the
 * full listing; the switcher only decides which one is on top.
 *
 * `[data-role-row]` marks the lines that arrive in reading order when a role
 * opens. Nothing else in here knows about motion.
 */

function Qualifications({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <h4
        data-role-row
        className="text-accent-text text-xs font-semibold tracking-wide uppercase"
      >
        {title}
      </h4>
      <ul role="list" className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            data-role-row
            className="text-muted grid grid-cols-[0.45rem_1fr] gap-x-3"
          >
            <span aria-hidden className="bg-accent mt-2.5 h-1.5 w-1.5 rounded-full" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CareerPositions({ jobs }: { jobs: readonly CareerJob[] }) {
  const roles = jobs.map((job) => ({ id: roleId(job.title), title: job.title }));

  return (
    <Section id="open-positions" tone="canvas">
      <div className="max-w-2xl">
        <WordReveal
          as="h2"
          id="positions-heading"
          text="Open positions"
          className="text-h2 text-heading font-semibold tracking-tightest"
        />
        <Reveal as="p" y="lg" className="text-muted mt-4 text-lg">
          Choose a role to see what it asks for.
        </Reveal>
      </div>

      <div className="mt-10 lg:mt-14">
        <RoleSwitcher roles={roles}>
          {jobs.map((job, index) => (
            <div
              key={job.title}
              id={`${roles[index].id}-panel`}
              role="tabpanel"
              aria-labelledby={roles[index].id}
              tabIndex={0}
              data-role-panel
              data-active={index === 0}
              className="role-panel"
            >
              <div className="border-line bg-surface shadow-sm rounded-lg border p-6 sm:p-8 lg:p-10">
                <div className="grid gap-8 pb-8 sm:grid-cols-2 sm:gap-x-10">
                  <Qualifications title="Requirements" items={job.requirements} />
                  <Qualifications title="Good to have" items={job.goodToHave} />
                </div>

                <div
                  data-role-row
                  className="border-line flex flex-col gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-muted text-sm">
                    Applications go to {job.applyEmail}
                  </p>
                  {/* Straight to the form at the foot of this page, which reads
                      the hash back and preselects this role. A plain anchor, so
                      it still scrolls to the form with no JavaScript. */}
                  <Button
                    href={`#${applyHash(job.title)}`}
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    Apply for this role
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </RoleSwitcher>
      </div>
    </Section>
  );
}
