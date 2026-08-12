import logo from "@/assets/brand/funfuse-games-logo.webp";
import boys from "@/assets/decorative/characters/cheerful-boys-pair.png";
import { Media } from "@/components/media";
import { Parallax, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { site } from "@/config/site";

/**
 * The sign-off.
 *
 * The only place the full brand lockup appears. The header keeps its
 * typographic wordmark, which stays legible at 20px in a way this mark does
 * not, so the two do not compete.
 *
 * Both destinations are real today. No link on this page points at a route that
 * has not shipped.
 */
export function Closing() {
  return (
    <Section tone="sunken" className="relative overflow-hidden">
      <Reveal as="div" y="lg" className="relative z-1 max-w-2xl">
        <Media
          src={logo}
          alt="FunFuse Games"
          aspect="intrinsic"
          sizes="lockup"
          tone="none"
          rounded="none"
          fit="contain"
          className="w-36 sm:w-52"
        />

        <h2 className="text-h2 text-heading mt-10 font-semibold tracking-tightest">
          Play one you already know
        </h2>

        <p className="text-muted mt-4 max-w-lg text-lg">
          Every title is free on Google Play and plays without a connection. For
          anything else, from support to working together, write to us.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            href={site.socials.googlePlay}
            size="lg"
            className="w-full sm:w-auto"
          >
            Browse on Google Play
          </Button>
          <Button
            href={`mailto:${site.email}`}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {site.email}
          </Button>
        </div>
      </Reveal>

      {/* Anchored to the bottom-right corner and allowed to run off it, so the
          band ends on the studio's own art rather than on empty canvas.

          Only from lg. Below that the buttons run far enough right to sit under
          the art, and a cutout behind a call to action is clutter, not depth.

          The positioning lives on this wrapper, not on <Media>. Media's frame
          already carries `relative`, and `cn` joins classes without resolving
          Tailwind conflicts, so an `absolute` passed in through className is a
          coin toss decided by stylesheet order. */}
      <div
        aria-hidden
        // Widths track the `cutout` sizes preset. Change both together.
        className="pointer-events-none absolute bottom-2 right-4 hidden lg:block lg:w-72 xl:w-[22rem]"
      >
        {/* Drifts up as the footer approaches, so the pair rise out of the
            bottom edge rather than sitting parked on it. */}
        <Parallax distance={-64}>
          <Media
            src={boys}
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
