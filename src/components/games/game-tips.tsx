import { Reveal, WordReveal } from "@/components/motion";
import type { GameTip } from "@/content/games/details";

/**
 * Tips, when a game has any. Deliberately not another hairline list: a
 * tinted, rounded block is the one place on the detail page that departs
 * from "grouping by negative space", which is what makes a tip read as a
 * distinct aside rather than one more rule.
 */
export function GameTips({ tips }: { tips: readonly GameTip[] }) {
  return (
    <div>
      <WordReveal
        as="h2"
        text="Tips"
        className="text-h2 text-heading font-semibold tracking-tightest"
      />

      <Reveal
        stagger
        as="ul"
        role="list"
        start="top 90%"
        className="mt-10 grid gap-6 sm:grid-cols-2"
      >
        {tips.map((tip) => (
          <li key={tip.title} className="bg-accent-tint rounded-lg p-6 sm:p-8">
            <p className="text-accent-text text-xs font-semibold tracking-wide uppercase">
              Tip
            </p>
            <h3 className="text-heading font-display mt-3 text-lg font-semibold tracking-tighter">
              {tip.title}
            </h3>
            <p className="text-body mt-2 text-base">{tip.body}</p>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
