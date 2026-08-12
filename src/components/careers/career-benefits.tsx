import gem from "@/assets/decorative/props/pink-crystal-gem.png";
import { Media } from "@/components/media";
import { FloatingProp, Reveal } from "@/components/motion";
import { Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { CareerBenefitGroup } from "@/content/careers";

/**
 * Benefits and perks.
 *
 * Two groups, deliberately not two matching boxes on one line: the second card
 * hangs lower than the first, which is the same asymmetry the rest of the site
 * uses to stop a page reading as a grid of tiles. Each card carries a suit at
 * a size where it is texture rather than an icon.
 *
 * Interaction is CSS only. Hover, press and focus retarget when interrupted
 * and run off the main thread; there is no choreography here for GSAP to own.
 * The lift sits on the inner `<article>` rather than on the reveal target,
 * because GSAP leaves an inline transform on whatever it animates and an
 * inline transform beats a hover class.
 */

/** Rotated between groups. The catalogue is mostly card games. */
const SUITS = ["♠", "♥", "♦", "♣"] as const;

export function CareerBenefits({
  title,
  groups,
}: {
  title: string;
  groups: readonly CareerBenefitGroup[];
}) {
  return (
    <Section tone="sunken">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="relative lg:col-span-4">
          <Reveal as="div" y="lg">
            <h2
              id="benefits-heading"
              className="text-h2 text-heading max-w-sm font-semibold tracking-tightest"
            >
              {title}
            </h2>
          </Reveal>

          {/* The heading leaves a tall empty strip in this column on a wide
              screen. One prop, drifting against the scroll, is what gives it
              a back plane instead of a hole. */}
          <FloatingProp
            drift={-120}
            spin={-18}
            className="bottom-0 left-2 hidden w-24 lg:block xl:w-28"
          >
            <Media
              src={gem}
              decorative
              aspect="intrinsic"
              sizes="prop"
              tone="none"
              rounded="none"
              fit="contain"
            />
          </FloatingProp>
        </div>

        <Reveal
          stagger
          as="div"
          y="lg"
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:mt-0 lg:gap-6"
        >
          {groups.map((group, index) => (
            <div key={group.title} className={cn(index % 2 === 1 && "sm:mt-12")}>
              <article className="group border-line bg-surface shadow-xs duration-[var(--duration-hover)] hover:shadow-md relative h-full overflow-hidden rounded-lg border p-6 transition-[transform,box-shadow] ease-out hover:-translate-y-1 sm:p-7">
                <span
                  aria-hidden
                  className="text-accent-tint-strong pointer-events-none absolute -top-8 -right-2 text-[8rem] leading-none select-none"
                >
                  {SUITS[index % SUITS.length]}
                </span>

                <h3 className="text-h3 text-heading relative font-semibold tracking-tighter">
                  {group.title}
                </h3>

                <ul role="list" className="relative mt-5 flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="group/row hover:bg-accent-tint duration-[var(--duration-hover)] -mx-3 grid grid-cols-[0.45rem_1fr] gap-x-3 rounded-md px-3 py-3 transition-colors ease-out"
                    >
                      <span
                        aria-hidden
                        className="bg-accent duration-[var(--duration-hover)] group-hover/row:scale-[1.9] mt-2.5 h-1.5 w-1.5 rounded-full transition-transform ease-out"
                      />
                      <span className="text-muted group-hover/row:text-body duration-[var(--duration-hover)] transition-colors ease-out">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
