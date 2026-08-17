import { WordReveal } from "@/components/motion";
import type { GameDetails } from "@/content/games/details";

import { StepProgress } from "./step-progress";

/**
 * The page's major section: a numbered progression rather than a
 * documentation list. Big tabular numerals carry the sequence, the accent
 * spine (`<StepProgress>`) carries the sense of "one process, drawn in
 * order," and step counts are whatever `howToPlay` actually has — three
 * steps for Lucky 9, seven for 3-2-5 — so no game is padded or trimmed to
 * match another.
 */
export function GameHowToPlay({ details }: { details: GameDetails }) {
  return (
    <div>
      <WordReveal
        as="h2"
        text="How to play"
        className="text-h2 text-heading font-semibold tracking-tightest"
      />

      <StepProgress className="mt-12 lg:mt-16">
        {details.howToPlay.map((step, index) => (
          <li key={step.title}>
            <span
              aria-hidden
              className="text-accent font-display tabular block text-h1 leading-none font-bold"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-heading font-display text-h4 mt-3 font-semibold tracking-tighter">
              {step.title}
            </h3>
            <p className="text-muted mt-2 max-w-prose text-lg">{step.body}</p>
          </li>
        ))}
      </StepProgress>
    </div>
  );
}
