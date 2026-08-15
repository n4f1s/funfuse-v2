import teamTable from "@/assets/studio/culture/studio-team-table.webp";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { careersContent } from "@/content/careers";
import { studioContent } from "@/content/studio";

/**
 * The people, without inventing any.
 *
 * This is the section an About page usually fills with headshots, a headcount
 * and a founding year. We have none of those from a source we can stand
 * behind, so this one says what is actually documented: the team is remote,
 * three crafts sit around every title, and the culture lines below are the
 * ones published on the careers page.
 *
 * Those lines are **read from `careersContent`, not retyped**. The careers
 * page is the transcription of record from funfusegames.com, and a second copy
 * of a culture claim is how one of the two ends up wrong. The open-role count
 * beside the call to action comes from the same file, so it cannot advertise a
 * job that has been taken down.
 *
 * The one band on this page allowed to carry the brand tint. It goes here
 * because the people are the part of a studio worth colouring.
 */

/** The culture group on the careers page. Matched by title, not by index. */
const CULTURE_GROUP = "Culture";

export function StudioCulture() {
  const { culture } = studioContent;
  const group = careersContent.benefits.groups.find(
    (candidate) => candidate.title === CULTURE_GROUP,
  );
  const openRoles = careersContent.jobs.length;

  return (
    <Section tone="accent" id="the-team">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <Reveal as="div" y="lg" className="lg:col-span-6">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            {culture.title}
          </h2>
          {culture.body.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "text-body mt-6 max-w-xl text-lg"
                  : "text-muted mt-5 max-w-xl text-lg"
              }
            >
              {paragraph}
            </p>
          ))}

          {/* The count is a chip rather than part of the label, and hidden
              from assistive tech: "See open roles 3" is not a sentence. It is
              read from the careers file, so it cannot advertise a listing that
              has come down. */}
          <Button href={culture.cta.href} size="lg" className="mt-8">
            {culture.cta.label}
            <span
              aria-hidden
              className="bg-surface/20 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
            >
              {openRoles}
            </span>
          </Button>
        </Reveal>

        {group ? (
          <Reveal
            stagger
            as="div"
            delay={0.08}
            className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-2"
          >
            <p className="text-accent-text text-sm font-semibold tracking-wide">
              {culture.listTitle}
            </p>

            {/* Hairline per line rather than a card. The claims are quiet and
                specific, and putting a box around them would sell them. */}
            <ul role="list" className="mt-5 flex flex-col">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-accent/20 text-body flex gap-3 border-t py-4 text-lg"
                >
                  <span
                    aria-hidden
                    className="bg-accent mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>

      {/* The one photographic-weight plate on the page after the hero. It runs
          the full width because the sections above it are all split columns,
          and the page needs one moment where the studio simply fills the
          frame before the sign-off.

          `banner` at every width, uncropped. The source is 1916x821, which is
          21:9 to within a fifth of a percent, and the composition is three
          clusters spread the whole way across: cards on the left, the sketches
          and the notebook in the middle, the board and the phones on the
          right. Any narrower box on a phone would have to throw one of those
          away, and the plate's whole argument is that they are on one table. */}
      <Reveal as="div" y="base" delay={0.12} className="mt-14 lg:mt-20">
        <Media
          src={teamTable}
          alt={culture.imageAlt}
          aspect="banner"
          sizes="container"
        />
      </Reveal>
    </Section>
  );
}
