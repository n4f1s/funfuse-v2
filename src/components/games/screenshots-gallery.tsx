import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Hand } from "@/components/ui/hand";
import type { GameArtwork } from "@/content/games";

/**
 * Phone screenshots for a game, when they exist. No game in the catalogue has
 * any yet (see `src/content/games/art.ts`), so the empty state below is not a
 * placeholder to delete later — it is the shipped design for that state.
 *
 * The empty state is one static tile, not an inert `<Hand>` shell: a scroller
 * with a single item still renders disabled arrows and a 1-of-1 segment bar,
 * which reads as a broken feature rather than an honest "not yet".
 */
export function ScreenshotsGallery({
  screenshots,
  title,
}: {
  screenshots?: GameArtwork[];
  title: string;
}) {
  return (
    <div>
      <Reveal as="h2" y="lg" className="text-h2 text-heading font-semibold tracking-tightest">
        Screenshots
      </Reveal>

      {screenshots && screenshots.length > 0 ? (
        <div className="mt-10">
          <Hand label={`${title} screenshots`} count={screenshots.length}>
            {screenshots.map((shot, index) => (
              <li key={index} className="will-reveal w-[60vw] max-w-60 sm:w-60">
                <Media
                  src={shot.src}
                  alt={shot.alt}
                  aspect="screenshot"
                  sizes="screenshotCard"
                  className="plate"
                />
              </li>
            ))}
          </Hand>
        </div>
      ) : (
        <Reveal as="div" y="base" className="mt-10 w-40 sm:w-60">
          <Media
            src={undefined}
            decorative
            aspect="screenshot"
            sizes="screenshotCard"
            placeholderLabel="Screenshots coming soon"
          />
        </Reveal>
      )}
    </div>
  );
}
