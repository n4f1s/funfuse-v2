import prototypeTable from "@/assets/studio/process/studio-prototype-table.webp";
import pencil from "@/assets/studio/props/studio-pencil.png";
import { Media } from "@/components/media";
import { Reveal, WordReveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { studioContent } from "@/content/studio";

import { StudioProcessTrack } from "./studio-process-track";
import { StudioProp } from "./studio-prop";

/**
 * How a game gets made here.
 *
 * The copy is careful about what it is: an editorial account of the order these
 * things usually happen in, with the lead saying out loud that the middle of it
 * loops. It is not a certified pipeline, because nothing we can source
 * describes one, and a diagram of an internal process nobody outside can check
 * is the kind of thing an About page invents.
 *
 * The heading column sticks while the five steps pass it, so the section reads
 * as one argument rather than five tiles. That is the same structure the
 * homepage uses for "What we do", on purpose: this page is the long version of
 * that page's short answer, and the shapes should rhyme.
 *
 * Steps ship lit and the line ships full. `<StudioProcessTrack>` is what takes
 * them back to grey, so no-JS gets a finished column rather than an empty one.
 */
export function StudioProcess() {
  const { process } = studioContent;

  return (
    <Section tone="surface" id="how-we-work">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="relative lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)]">
            <WordReveal
              as="h2"
              text={process.title}
              className="text-h2 text-heading font-semibold tracking-tightest"
            />
            <Reveal as="p" y="lg" className="text-muted mt-5 max-w-sm text-lg">
              {process.lead}
            </Reveal>

            {/* The prototype plate. Sits under the heading in the tall empty
                strip a sticky column leaves once it has been read, which is
                the only place on this page a picture of the work itself can
                go without interrupting the steps beside it.

                Desktop only by design: below lg the sticky column becomes a
                normal block and there is no empty strip for it to fill.

                The source is 1086x1448, which is 3:4 to the pixel, so
                `portrait` reserves exactly the box the art wants and nothing
                is cropped. */}
            <div className="mt-10 hidden lg:block">
              <Media
                src={prototypeTable}
                alt={process.imageAlt}
                aspect="portrait"
                sizes="(min-width: 1400px) 400px, 30vw"
              />
            </div>
          </div>

          <StudioProp
            src={pencil}
            drift={-140}
            spin={-22}
            className="hidden w-20 lg:right-[8%] lg:bottom-6 lg:block xl:w-24"
          />
        </div>

        <StudioProcessTrack className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
          {/* The line and the steps share one column so they cannot drift
              apart: the rule is absolutely positioned against this list, and
              every marker sits on the same left edge. */}
          <ol role="list" className="relative">
            <span
              aria-hidden
              className="bg-line absolute inset-y-2 left-[0.4375rem] w-px sm:left-[0.5625rem]"
            />
            <span
              aria-hidden
              data-progress
              className="bg-accent absolute inset-y-2 left-[0.4375rem] w-px origin-top sm:left-[0.5625rem]"
            />

            {process.steps.map((step, index) => (
              <li
                key={step.title}
                data-step
                className="group relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
              >
                {/* Grey until the line arrives, then brand. The ring is the
                    page's canvas so the marker punches a hole in the rule
                    rather than sitting on top of it. */}
                <span
                  aria-hidden
                  className="bg-line-strong ring-surface duration-[var(--duration-overlay)] relative mt-2 h-3.5 w-3.5 shrink-0 rounded-full ring-4 transition-[background-color,transform] ease-out group-data-[lit]:bg-accent group-data-[lit]:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-faint duration-[var(--duration-overlay)] font-display text-sm font-semibold tabular-nums transition-colors ease-out group-data-[lit]:text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-h4 text-heading mt-1 font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted mt-3 max-w-prose text-lg">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </StudioProcessTrack>
      </div>
    </Section>
  );
}
