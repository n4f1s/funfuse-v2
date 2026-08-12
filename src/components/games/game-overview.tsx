import { Reveal } from "@/components/motion";
import type { GameDetails } from "@/content/games/details";

import { GameFacts } from "./game-facts";

/**
 * "About the game": the page's editorial band. A 7/4 asymmetric split —
 * narrative left, facts rail right, one column of negative space between
 * them — the same "variance 8" device `Craft` uses on the homepage, applied
 * at its own ratio so the detail page doesn't feel like a re-skin of it.
 *
 * `objective` and `callout` are both single sentences from `details.ts`, but
 * they do different jobs: objective is read as data (a labelled fact, like
 * the rail beside it), callout is read as a line (a short editorial beat set
 * off with an accent rule). Rendering them identically would waste the
 * distinction the content already makes.
 */
export function GameOverview({ details }: { details: GameDetails }) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-7">
        <Reveal
          as="h2"
          y="lg"
          className="text-h2 text-heading font-semibold tracking-tightest"
        >
          About the game
        </Reveal>

        <Reveal
          stagger
          as="div"
          delay={0.05}
          className="mt-6 flex flex-col gap-5"
        >
          {details.about.map((paragraph) => (
            <p key={paragraph} className="text-body max-w-prose text-lg">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal
          as="div"
          y="base"
          delay={0.1}
          className="border-line-strong mt-10 max-w-prose border-l-2 pl-6"
        >
          <p className="text-faint text-xs font-semibold tracking-wide uppercase">
            Objective
          </p>
          <p className="text-heading mt-2 text-xl font-medium tracking-tight">
            {details.objective}
          </p>
        </Reveal>

        {details.callout ? (
          <Reveal
            as="p"
            y="base"
            delay={0.15}
            className="border-accent text-heading font-display text-h4 mt-10 max-w-prose border-l-2 pl-6 font-semibold tracking-tighter"
          >
            {details.callout}
          </Reveal>
        ) : null}
      </div>

      <div className="mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
        <GameFacts facts={details.facts} />
      </div>
    </div>
  );
}
