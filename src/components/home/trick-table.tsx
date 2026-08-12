import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";

import { TrickTableBoard } from "./trick-table-board";
import { SUIT_GLYPH, TRUMP } from "./trick-table-round";

/**
 * A round, playing itself.
 *
 * It sits between what the studio does and the list of what it has shipped,
 * because that is the one place on the page where an argument about craft has
 * just been made in prose and the reader is about to be handed nineteen names.
 * The table is the demonstration in between.
 *
 * Mini Trick Table is invented, and the caption says so. Putting a real title's
 * rules on a decorative loop would teach somebody the wrong ones, and a
 * fictional table cannot be mistaken for a screenshot of a game we sell.
 *
 * Server Component apart from the board itself, which is the only thing here
 * that needs JavaScript.
 */
export function TrickTable() {
  return (
    <Section tone="sunken">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-x-12">
        <Reveal as="div" y="lg" className="max-w-xl">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            What a round feels like
          </h2>
          <p className="text-muted mt-4 text-lg">
            Deal, lead, follow, take the trick. The part we spend real time on
            is not the rules, which every player at the table already knows. It
            is how a hand opens, how a card leaves it, and what happens in the
            second after a trick is won.
          </p>
        </Reveal>

        {/* The legend doubles as the disclaimer. It is the first thing beside
            the heading on a wide screen and the last thing before the table on
            a narrow one, either way it is read before the loop is believed. */}
        <p className="text-faint mt-6 max-w-xs text-sm lg:mt-0 lg:text-right">
          Mini Trick Table is a demo built for this page, not one of our games.
          Highest card of the led suit takes the trick, unless somebody plays a{" "}
          <span className="text-accent-text">{SUIT_GLYPH[TRUMP]}</span>.
        </p>
      </div>

      {/* No <Reveal> around the board. It has an entrance of its own, and a
          fade underneath a deal is two entrances on one moment. */}
      <TrickTableBoard className="mx-auto mt-10 max-w-[26rem] md:max-w-[64rem] lg:mt-14" />
    </Section>
  );
}
