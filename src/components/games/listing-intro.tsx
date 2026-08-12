import { Reveal } from "@/components/motion";

/**
 * Heading + one-sentence count line shared by `/games/` and both genre
 * pages, so the three listings read as one family rather than three
 * separately designed headers.
 *
 * The heading sits outside `<Reveal>`: on a page with no hero device above
 * it, this is the likely LCP element, and an element that starts at
 * `opacity: 0` has not been painted yet.
 */
export function ListingIntro({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-h1 text-heading font-bold tracking-tightest">{heading}</h1>
      <Reveal as="p" y="base" className="text-muted mt-5 text-lg">
        {description}
      </Reveal>
    </div>
  );
}
