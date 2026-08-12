import player from "@/assets/decorative/characters/casual-boy-red-jacket.png";
import { Media } from "@/components/media";
import { Parallax, Reveal } from "@/components/motion";
import { Button, Section } from "@/components/ui";

/**
 * The sign-off.
 *
 * The address is the whole call to action, so it is the label on the control
 * rather than a line of copy above it. The second button goes back to the
 * roles, because somebody who has scrolled this far without picking one is
 * the reader most likely to want the list again.
 */
export function CareerClosing({
  email,
  description,
}: {
  email: string;
  description: string;
}) {
  return (
    <Section tone="sunken" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem] bg-[radial-gradient(52%_68%_at_22%_86%,var(--color-brand-100),transparent_70%)]"
      />

      <Reveal as="div" y="lg" className="relative z-1 max-w-2xl">
        <h2
          id="apply-heading"
          className="text-h2 text-heading font-semibold tracking-tightest"
        >
          Apply to join our team
        </h2>
        <p className="text-muted mt-5 max-w-xl text-lg">{description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={`mailto:${email}`} size="lg" className="w-full sm:w-auto">
            {email}
          </Button>
          <Button
            href="#open-positions"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Back to open positions
          </Button>
        </div>
      </Reveal>

      {/* Anchored to the bottom-right corner and allowed to run off it, so the
          band ends on the studio's own art rather than on empty canvas.

          Only from lg. Below that the buttons run far enough right to sit under
          the art, and a cutout behind a call to action is clutter, not depth. */}
      <div
        aria-hidden
        // This cutout is a tall, narrow portrait rather than the wide pair the
        // homepage signs off with, so it is set well under the `cutout` preset
        // ceiling — at 288px wide it would stand taller than the band.
        className="pointer-events-none absolute right-6 bottom-0 hidden lg:block lg:w-44 xl:w-52"
      >
        <Parallax distance={-40}>
          <Media
            src={player}
            decorative
            aspect="intrinsic"
            // Matches the `lg:w-44 xl:w-52` slot above. Keep them in step.
            sizes="(min-width: 1280px) 208px, 176px"
            tone="none"
            rounded="none"
            fit="contain"
          />
        </Parallax>
      </div>
    </Section>
  );
}
