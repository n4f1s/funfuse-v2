import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { getAllGames } from "@/content/games";
import { createMetadata } from "@/lib/seo";

/**
 * Holding page.
 *
 * The real homepage is not designed yet. This exists so the foundation is
 * exercised end to end (fonts, tokens, layout shell, GSAP reveal, metadata)
 * and so nothing ships pointing at routes that do not exist.
 */

export const metadata = createMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const total = getAllGames().length;

  return (
    <Container className="flex min-h-[calc(100dvh-var(--header-height))] flex-col justify-center py-20">
      <div className="max-w-4xl">
        {/* The headline is the LCP element, so it is deliberately outside the
            reveal: nothing above the fold starts at opacity 0. */}
        <h1 className="text-h1 text-heading font-bold tracking-tightest">
          We make the games people already know
          <span className="text-accent">.</span>
        </h1>

        <Reveal stagger>
          <p className="text-muted mt-7 max-w-xl text-xl">
            FunFuse builds offline card and board games for the players who grew
            up with them. {total} titles are live on Google Play.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={site.socials.googlePlay} size="lg">
              Browse on Google Play
            </Button>
            <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
              Contact us
            </Button>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
