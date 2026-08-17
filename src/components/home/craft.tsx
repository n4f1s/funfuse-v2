import whatWeDoIllustration from "@/assets/decorative/illustrations/what-we-do-card-game.png";
import pencil from "@/assets/decorative/props/pencil.png";
import ludoChallengeArt from "@/assets/games/ludo-challenge/cover.webp";
import { Media } from "@/components/media";
import { Parallax, Reveal, WordReveal } from "@/components/motion";
import { Section } from "@/components/ui/section";

import { Prop } from "./prop";

/**
 * What the studio does.
 *
 * The three disciplines are the ones funfusegames.com already lists under "Our
 * Expertise": game development, game design, art direction. The copy describes
 * how the work is done. It does not claim outcomes we cannot show.
 *
 * Deliberately not three equal cards in a row. The heading column sticks while
 * the disciplines scroll past it, so the section reads as one argument rather
 * than three interchangeable tiles.
 */

const DISCIPLINES = [
  {
    title: "Game development",
    body: "Native builds sized for a mid-range phone on mobile data. Every title runs offline, because the bus, the ferry and the family living room are where these games are actually played.",
  },
  {
    title: "Game design",
    body: "We start from the rules a table already uses, not a generic engine with a new skin. Scoring, bidding and the awkward edge cases are the parts people notice first.",
  },
  {
    title: "Art direction",
    body: "Characters, tables and key art are drawn per title, so a game reads as the one its players know before they have read a single word.",
  },
] as const;

export function Craft() {
  return (
    <Section tone="surface">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* The heading column sticks, so once it has been read this cell is
            a tall empty strip for the rest of the section. The pencil sits at
            the bottom of it, outside the sticky box, where that space is. */}
        <div className="relative lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)]">
            <WordReveal
              as="h2"
              text="What we do"
              className="text-h2 text-heading font-semibold tracking-tightest"
            />
            <Reveal as="p" y="lg" className="text-muted mt-5 max-w-sm text-lg">
              One team takes a title from the rulebook to the store listing.
            </Reveal>

            {/* The studio's own character art, wearing the studio's own mark.
                Bottom-anchored so it sits on the baseline of the sticky column
                rather than floating in the middle of it. */}
            <Media
              src={whatWeDoIllustration}
              decorative
              aspect="intrinsic"
              sizes="cutout"
              tone="none"
              rounded="none"
              fit="contain"
              // Widths track the `cutout` sizes preset. Change both together.
              className="mt-12 hidden lg:block lg:w-72 xl:w-[22rem]"
            />
          </div>

          <Prop
            src={pencil}
            drift={-150}
            spin={-24}
            className="hidden w-24 lg:bottom-4 lg:right-[14%] lg:block xl:w-28"
          />
        </div>

        <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <Reveal stagger as="ul" role="list" className="flex flex-col">
            {DISCIPLINES.map((discipline) => (
              <li key={discipline.title} className="border-line border-t py-8">
                <h3 className="text-h3 text-heading font-semibold tracking-tighter">
                  {discipline.title}
                </h3>
                <p className="text-muted mt-4 max-w-prose text-lg">
                  {discipline.body}
                </p>
              </li>
            ))}
          </Reveal>

          <Parallax distance={-84} className="mt-8">
            <Media
              src={ludoChallengeArt}
              alt="Ludo board with colorful playing pieces, dice, and players around the table."
              aspect="wide"
              // The slot is seven of twelve columns, which `half` under-declares
              // by about fifteen percent at every desktop width.
              sizes="(min-width: 1400px) 740px, (min-width: 1024px) 56vw, 94vw"
              className="plate"
            />
          </Parallax>
        </div>
      </div>
    </Section>
  );
}
