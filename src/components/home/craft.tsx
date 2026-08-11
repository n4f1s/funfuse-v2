import cardPlayer from "@/assets/decorative/characters/card-player-young-man.png";
import pokerRummyArt from "@/assets/games/poker-rummy/cover.webp";
import { Media } from "@/components/media";
import { Parallax, Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";

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
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)]">
            <Reveal as="div">
              <h2 className="text-h2 text-heading font-semibold tracking-tightest">
                What we do
              </h2>
              <p className="text-muted mt-5 max-w-sm text-lg">
                One team takes a title from the rulebook to the store listing.
              </p>
            </Reveal>

            {/* The studio's own character art, wearing the studio's own mark.
                Bottom-anchored so it sits on the baseline of the sticky column
                rather than floating in the middle of it. */}
            <Media
              src={cardPlayer}
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

          <Parallax distance={-56} className="mt-6">
            <Media
              src={pokerRummyArt}
              alt="FunFuse key art: a card table framed by two carved signboards under a jungle canopy."
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
