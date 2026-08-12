import { Reveal } from "@/components/motion";
import { Section } from "@/components/ui";
import { site } from "@/config/site";

/**
 * The ways to reach us that are not this form.
 *
 * Every value comes from `src/config/site.ts`, so the address in the footer and
 * the address here can never disagree. Nothing is invented: no phone number, no
 * response time, no office hours. If we do not publish it today, it is not on
 * this page.
 *
 * The lift on hover sits on the inner element, not on the reveal target. GSAP
 * leaves an inline transform on whatever it animates, and an inline transform
 * beats a hover class.
 */

const CHANNELS = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    suit: "♠",
  },
  {
    label: "LinkedIn",
    value: "FunFuse Games",
    href: site.socials.linkedin,
    suit: "♥",
  },
  {
    label: "Facebook",
    value: "funfuse.games",
    href: site.socials.facebook,
    suit: "♦",
  },
  {
    label: "Google Play",
    value: "Every title we ship",
    href: site.socials.googlePlay,
    suit: "♣",
  },
] as const;

export function ContactChannels() {
  return (
    <Section tone="sunken">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <Reveal as="div" y="lg" className="lg:col-span-4">
          <h2 className="text-h2 text-heading max-w-xs font-semibold tracking-tightest">
            Other ways round
          </h2>

          <address className="text-muted mt-6 max-w-xs text-base not-italic">
            {site.address.street}
            <br />
            {site.address.locality}, {site.address.region}{" "}
            {site.address.postalCode}
          </address>
        </Reveal>

        <Reveal
          stagger
          as="ul"
          role="list"
          y="base"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:mt-0"
        >
          {CHANNELS.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                rel="noopener noreferrer"
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                className="group border-line bg-surface shadow-xs hover:shadow-md duration-[var(--duration-hover)] relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg border p-6 transition-[transform,box-shadow] ease-out hover:-translate-y-1 active:translate-y-0"
              >
                <span
                  aria-hidden
                  className="text-accent-tint-strong pointer-events-none absolute -top-6 -right-1 text-[5.5rem] leading-none select-none"
                >
                  {channel.suit}
                </span>

                <span className="text-muted relative text-sm font-medium tracking-wide">
                  {channel.label}
                </span>
                <span className="text-heading group-hover:text-accent-text duration-[var(--duration-hover)] relative text-lg font-medium transition-colors ease-out">
                  {channel.value}
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
