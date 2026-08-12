import { Reveal } from "@/components/motion";
import { Button, Section } from "@/components/ui";
import type { CareerJob } from "@/content/careers";

function Qualifications({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <h4 className="text-heading text-sm font-semibold tracking-wide">{title}</h4>
      <ul role="list" className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-muted grid grid-cols-[0.45rem_1fr] gap-x-3">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CareerPositions({ jobs }: { jobs: readonly CareerJob[] }) {
  return (
    <Section id="open-positions" tone="canvas">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <Reveal as="div" y="lg" className="lg:col-span-5">
          <p className="text-accent-text text-sm font-semibold tracking-wide">
            Careers
          </p>
          <h2
            id="positions-heading"
            className="text-h2 text-heading mt-4 max-w-md font-semibold tracking-tightest"
          >
            Open positions
          </h2>
        </Reveal>

      </div>

      <Reveal stagger as="div" y="lg" className="mt-12 space-y-6 lg:mt-16">
        {jobs.map((job) => (
          <article
            key={job.title}
            className="rounded-lg border border-line bg-surface p-6 shadow-xs sm:p-8 lg:p-10"
          >
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-4">
                <h3 className="text-h3 text-heading font-semibold tracking-tighter">
                  {job.title}
                </h3>
                <Button href={`mailto:${job.applyEmail}`} size="md" className="mt-7">
                  Apply via email
                </Button>
              </div>

              <div className="mt-10 grid gap-10 border-t border-line pt-8 sm:grid-cols-2 lg:col-span-8 lg:mt-0 lg:border-t-0 lg:pt-0">
                <Qualifications title="Requirements" items={job.requirements} />
                <Qualifications title="Good to have" items={job.goodToHave} />
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </Section>
  );
}
