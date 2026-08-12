import { Reveal } from "@/components/motion";
import type { GameFact } from "@/content/games/details";

/**
 * "At a glance" — a compact facts rail, not a grid of SaaS stat tiles.
 *
 * Each row is a hairline, an index number and a label/value pair typed in
 * place, echoing the catalogue row and figure-rail idioms already established
 * on the homepage rather than introducing a boxed, shadowed card.
 */
export function GameFacts({ facts }: { facts: readonly GameFact[] }) {
  return (
    <div>
      <Reveal
        as="h2"
        y="base"
        className="font-display text-h4 text-heading font-semibold tracking-tighter"
      >
        At a glance
      </Reveal>

      <Reveal stagger as="dl" start="top 90%" className="mt-6 flex flex-col">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className="border-line flex items-baseline justify-between gap-6 border-t py-4 first:border-t-0 first:pt-0"
          >
            <dt className="text-muted min-w-0 text-sm">
              <span className="text-faint tabular mr-2 text-2xs">
                {String(index + 1).padStart(2, "0")}
              </span>
              {fact.label}
            </dt>
            <dd className="text-heading font-display shrink-0 text-right text-base font-semibold tracking-tight">
              {fact.value}
            </dd>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
