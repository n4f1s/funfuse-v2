import { Reveal, WordReveal } from "@/components/motion";
import type { GameRuleGroup } from "@/content/games/details";

/**
 * Rule groups, when a game has any. `auto-fit` rather than a fixed column
 * count is what lets this handle one group (3-2-5's 30-card pack), two
 * (Hazari's combinations and card points) or more without a conditional
 * layout per count — a single group fills the row, two sit side by side,
 * and the grid keeps working if a game ever ships a third.
 */
export function GameRules({
  ruleGroups,
}: {
  ruleGroups: readonly GameRuleGroup[];
}) {
  return (
    <div>
      <WordReveal
        as="h2"
        text="Rules"
        className="text-h2 text-heading font-semibold tracking-tightest"
      />

      <Reveal
        stagger
        as="div"
        start="top 90%"
        className="mt-10 grid gap-x-10 gap-y-12"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(17.5rem, 1fr))" }}
      >
        {ruleGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-heading font-display text-h4 font-semibold tracking-tighter">
              {group.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {group.items.map((item) => (
                <li key={item} className="text-body flex gap-3 text-base">
                  <span
                    aria-hidden
                    className="bg-accent mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
