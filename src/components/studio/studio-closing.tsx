import { Link } from "@/components/navigation";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import { SuitIcon, type SuitName } from "@/components/ui/suits";
import { studioContent } from "@/content/studio";

import { StudioClosingWash } from "./studio-closing-wash";

/**
 * The sign-off: the two things a reader of this page can actually do.
 *
 * Both destinations are real routes that ship today. The page has spent its
 * length arguing that the games belong to their players and the work belongs to
 * three crafts, so the two ways out are exactly those: play one, or come and
 * make the next one.
 *
 * No artwork here on purpose. Every section above it carries a picture, and the
 * page needs one band that is nothing but type on a moving ground — otherwise
 * the last screen is a ninth image and the sign-off reads as another exhibit.
 * The wash behind it is drawn in CSS and moved by GSAP, so the finale costs no
 * bytes at all.
 *
 * Each route is one whole link rather than a paragraph with a button under it.
 * A card that describes a destination and then makes you find a small target
 * inside itself is two decisions where there is only one.
 *
 * Deliberately not a repeat of the homepage's closing. That one is a lockup and
 * a Google Play button aimed at a player; this one is a fork, and it sends
 * nobody to the store, because somebody who has read to the bottom of the
 * Studio page is asking a different question.
 */

/** One per route. The catalogue is card games; the marks are its own. */
const MARKS: readonly SuitName[] = ["spade", "heart"];

export function StudioClosing() {
  const { closing } = studioContent;

  return (
    <Section tone="sunken" className="relative isolate overflow-hidden">
      <StudioClosingWash className="pointer-events-none absolute inset-0 -z-10" />

      <Reveal as="div" y="lg" className="mx-auto max-w-2xl text-center">
        <h2 className="text-h2 text-heading font-semibold tracking-tightest">
          {closing.title}
          <span className="text-accent">.</span>
        </h2>
      </Reveal>

      <Reveal
        stagger
        as="div"
        delay={0.08}
        className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-2 lg:gap-8"
      >
        {closing.routes.map((route, index) => (
          <Link
            key={route.title}
            href={route.cta.href}
            // Translucent, but no `backdrop-blur`. A backdrop filter over four
            // shapes that move every frame is a filter recomputed every frame;
            // plain alpha lets the wash tint the card for nothing.
            className="group border-line bg-surface/80 shadow-xs hover:border-line-strong hover:bg-surface hover:shadow-md duration-[var(--duration-hover)] flex flex-col rounded-lg border p-7 transition-[transform,background-color,border-color,box-shadow] ease-out hover:-translate-y-1 active:scale-[0.99] sm:p-9"
          >
            <SuitIcon
              suit={MARKS[index % MARKS.length] ?? "spade"}
              className="text-accent h-6 w-6"
            />

            <h3 className="text-h3 text-heading mt-6 font-semibold tracking-tighter">
              {route.title}
            </h3>
            <p className="text-muted mt-4 max-w-md text-lg">{route.body}</p>

            {/* Not a button: the whole card is the control. This is the label
                for what just got clicked, so it moves with the hover rather
                than inviting a second, smaller click of its own. */}
            <span className="text-accent-text duration-[var(--duration-hover)] mt-7 inline-flex items-center gap-2 text-sm font-semibold transition-colors ease-out">
              {route.cta.label}
              <span
                aria-hidden
                className="duration-[var(--duration-hover)] transition-transform ease-out group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </Section>
  );
}
