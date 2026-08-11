import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

import { MobileNav } from "./mobile-nav";
import { SiteNav } from "./site-nav";
import { Wordmark } from "./wordmark";

/**
 * Sticky site header. Server Component — only the nav's active state and the
 * mobile sheet are client islands.
 *
 * Height is capped by `--header-height` (64px, 72px from lg) and the primary
 * nav must stay on one line at 1024px. If a link no longer fits, something
 * moves to the footer rather than the bar growing or wrapping.
 */
export function SiteHeader() {
  return (
    <header className="bg-canvas/80 border-line sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-(--header-height) items-center justify-between gap-6">
        <Wordmark />

        <SiteNav className="hidden lg:block" />

        <div className="flex items-center gap-2">
          <Button href="/contact-us" variant="secondary" size="sm" className="hidden sm:inline-flex">
            Contact us
          </Button>
          <MobileNav className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
