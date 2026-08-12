import { Reveal } from "@/components/motion";
import type { PuzzleMode } from "@/content/games/details";

/**
 * Puzzle Club's modes. The catalogue's only puzzle-collection title needs a
 * different shape than a card game's rule steps: modes are parallel choices,
 * not a sequence, so this is a numbered grid rather than the linear
 * `<StepProgress>` rail — the same "optional field, own composition"
 * approach `ruleGroups` and `tips` use elsewhere on this template.
 *
 * Heading is "Modes", not "Pick a challenge" — Puzzle Club's own first
 * `howToPlay` step is already titled "Pick a challenge", and reusing it here
 * would print the same heading twice in a row.
 */
export function GameModes({ modes }: { modes: readonly PuzzleMode[] }) {
  return (
    <div>
      <Reveal
        as="h2"
        y="lg"
        className="text-h2 text-heading font-semibold tracking-tightest"
      >
        Modes
      </Reveal>

      <Reveal
        stagger
        as="ul"
        role="list"
        start="top 90%"
        className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {modes.map((mode, index) => (
          <li key={mode.name} className="border-line border-t pt-6">
            <span className="text-faint font-display text-2xs font-semibold tracking-wide uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-heading font-display text-h4 mt-2 font-semibold tracking-tighter">
              {mode.name}
            </h3>
            <p className="text-muted mt-2 text-base">{mode.description}</p>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
