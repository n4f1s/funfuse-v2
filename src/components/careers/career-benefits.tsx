import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui";
import type { CareerBenefitGroup } from "@/content/careers";

export function CareerBenefits({
  title,
  groups,
}: {
  title: string;
  groups: readonly CareerBenefitGroup[];
}) {
  return (
    <Section tone="surface">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8">
        <Reveal as="div" y="lg" className="lg:col-span-4">
          <h2
            id="benefits-heading"
            className="text-h2 text-heading max-w-sm font-semibold tracking-tightest"
          >
            {title}
          </h2>
        </Reveal>

        <Reveal
          stagger
          as="div"
          y="base"
          className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:gap-6"
        >
          {groups.map((group) => (
            <article
              key={group.title}
              className="rounded-lg border border-line bg-surface-muted p-6 sm:p-7"
            >
              <h3 className="text-h3 text-heading font-semibold tracking-tighter">
                {group.title}
              </h3>
              <ul role="list" className="mt-6 divide-y divide-line border-y border-line">
                {group.items.map((item) => (
                  <li key={item} className="py-4 text-muted first:pt-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
