import player from "@/assets/studio/closing/studio-closing-player.png";
import mark from "@/assets/studio/props/studio-mark.png";
import { Media } from "@/components/media";
import { Parallax, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { studioContent } from "@/content/studio";

/**
 * The sign-off: the two things a reader of this page can actually do.
 *
 * Both destinations are real routes that ship today. The page has spent its
 * length arguing that the games belong to their players and the work belongs
 * to three crafts, so the two ways out are exactly those: play one, or come
 * and make the next one.
 *
 * Deliberately not a repeat of the homepage's closing. That one is a single
 * lockup and a Google Play button aimed at a player; this one is a fork, and
 * it does not send anyone to the store, because somebody who has read to the
 * bottom of the Studio page is asking a different question.
 */
export function StudioClosing() {
  const { closing } = studioContent;

  return (
    <Section tone="sunken" className="relative overflow-hidden">
      <div className="relative z-1">
        <Reveal as="div" y="lg" className="flex items-center gap-5">
          <Media
            src={mark}
            decorative
            aspect="intrinsic"
            sizes="prop"
            tone="none"
            rounded="none"
            fit="contain"
            className="w-12 sm:w-14"
          />
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            {closing.title}
          </h2>
        </Reveal>

        {/* Two columns under one rule each, rather than two cards. A fork is a
            choice between equals, and boxing them would make one look like the
            offer and the other like the alternative. */}
        <Reveal
          stagger
          as="div"
          delay={0.08}
          className="mt-10 grid gap-x-12 gap-y-10 sm:mt-12 lg:grid-cols-2"
        >
          {closing.routes.map((route) => (
            <div key={route.title} className="border-line border-t pt-7">
              <h3 className="text-h3 text-heading font-semibold tracking-tighter">
                {route.title}
              </h3>
              <p className="text-muted mt-4 max-w-md text-lg">{route.body}</p>
              <Button
                href={route.cta.href}
                size="lg"
                variant="secondary"
                className="mt-7 w-full sm:w-auto"
              >
                {route.cta.label}
              </Button>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Anchored to the bottom-right and allowed to run off it, so the page
          ends on the studio's own art rather than on empty canvas. From xl
          only: below that the second column's button runs far enough right to
          sit under the cutout, and art behind a call to action is clutter.

          The positioning lives on this wrapper, not on <Media>. Media's frame
          already carries `relative`, and `cn` joins classes without resolving
          Tailwind conflicts. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 bottom-0 hidden w-64 xl:block"
      >
        <Parallax distance={-56}>
          <Media
            src={player}
            decorative
            aspect="intrinsic"
            sizes="cutout"
            tone="none"
            rounded="none"
            fit="contain"
          />
        </Parallax>
      </div>
    </Section>
  );
}
