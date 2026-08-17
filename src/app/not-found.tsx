import { NotFoundCard } from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Page not found",
  description: "That page does not exist on funfusegames.com.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <Container className="flex min-h-[calc(100dvh-var(--header-height))] flex-col justify-center py-20">
      {/* One column until the copy has its full measure beside the prop.
          Below that the card follows the copy at a third of the width, which
          keeps it a garnish rather than the reason to scroll. */}
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-16">
        <div className="max-w-xl">
          <p className="text-accent-text font-display text-h3 font-bold">404</p>
          <h1 className="text-h1 text-heading mt-3 font-bold">
            We cannot find that page
          </h1>
          <p className="text-muted mt-4 text-lg">
            The link may be out of date, or the page may have moved during the
            site rebuild.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/">Back to home</Button>
            <Button href={`mailto:${site.email}`} variant="secondary">
              Report a broken link
            </Button>
          </div>
        </div>
        <NotFoundCard className="w-[min(14rem,56%)] justify-self-start lg:w-full lg:max-w-[26rem] lg:justify-self-center" />
      </div>
    </Container>
  );
}
