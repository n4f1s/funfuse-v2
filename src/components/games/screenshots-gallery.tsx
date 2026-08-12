import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Hand } from "@/components/ui/hand";
import type { GameArtwork } from "@/content/games";

/**
 * Every game has exactly five screenshot slots — see
 * `src/content/games/screenshots.ts`. A slot is either a real screenshot or
 * `null`, and `null` renders the same polished placeholder tile the gallery
 * has always used for "not shot yet", just per slot instead of for the whole
 * section. The row is always five wide, so a game with zero real screenshots
 * and a game with five look like the same feature at different stages, never
 * like one has something broken.
 *
 * Real screenshots render at their own intrinsic ratio rather than a fixed
 * 9:16 frame: the first real assets in the catalogue are a mix of true phone
 * captures (Belote, portrait) and landscape table captures (CallBreak,
 * Hazari), and cropping the latter to fit a portrait frame would misrepresent
 * them. Only the placeholder tile — which has no real image to measure —
 * uses the fixed `screenshot` (9:16) preset, as a phone-shaped stand-in for
 * whichever orientation eventually lands there.
 */
export function ScreenshotsGallery({
  slots,
  title,
}: {
  slots: readonly (GameArtwork | null)[];
  title: string;
}) {
  return (
    <div>
      <Reveal as="h2" y="lg" className="text-h2 text-heading font-semibold tracking-tightest">
        Screenshots
      </Reveal>

      <div className="mt-10">
        <Hand label={`${title} screenshots`} count={slots.length}>
          {slots.map((shot, index) => (
            <li key={index} className="will-reveal w-[60vw] max-w-60 sm:w-60">
              {shot ? (
                <Media
                  src={shot.src}
                  alt={shot.alt}
                  aspect="intrinsic"
                  sizes="screenshotCard"
                  className="plate"
                />
              ) : (
                <Media
                  src={undefined}
                  decorative
                  aspect="screenshot"
                  sizes="screenshotCard"
                  placeholderLabel="Screenshot coming soon"
                />
              )}
            </li>
          ))}
        </Hand>
      </div>
    </div>
  );
}
