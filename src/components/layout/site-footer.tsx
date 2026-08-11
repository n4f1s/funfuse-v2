import Link from "next/link";

import { Container } from "@/components/ui/container";
import { footerNav, site } from "@/config/site";

import { Wordmark } from "./wordmark";

const socialLinks = [
  { label: "Google Play", href: site.socials.googlePlay },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Facebook", href: site.socials.facebook },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-line mt-auto border-t">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24">
          <div className="max-w-sm">
            <Wordmark className="text-2xl" />
            <p className="text-muted mt-4 text-sm">{site.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-heading transition-colors duration-[var(--duration-hover)] ease-out"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-16">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-heading font-sans text-sm font-semibold tracking-normal">
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-muted hover:text-heading transition-colors duration-[var(--duration-hover)] ease-out"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rule-soft mt-14 lg:mt-20" />

        <div className="text-faint mt-6 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <address className="not-italic">
            {site.address.street}, {site.address.locality},{" "}
            {site.address.region} {site.address.postalCode}
          </address>
        </div>
      </Container>
    </footer>
  );
}
