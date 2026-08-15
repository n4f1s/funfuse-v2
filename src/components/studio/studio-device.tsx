import { Media } from "@/components/media";
import { cn } from "@/lib/cn";
import type { GameArtwork } from "@/content/games";

/**
 * A shipped screen, in the object it ships on.
 *
 * The device is drawn rather than photographed: a white body, one hairline, a
 * real shadow and a speaker slot. That is deliberate — a dark phone render
 * would be the only black object on a light-only site, and this page is making
 * an argument about the game inside the screen rather than about hardware.
 *
 * Orientation follows the artwork, not a template. Half the catalogue is
 * played with the phone turned sideways because that is how you fit four
 * players and a trick around a table, so a landscape capture gets a landscape
 * device and a portrait one gets a portrait device. Cropping either into the
 * other would misrepresent the game.
 *
 * The screenshot slot is the same shape as its source file, so nothing is
 * cropped and nothing is stretched.
 */
export function StudioDevice({
  artwork,
  orientation,
  caption,
  note,
  className,
}: {
  artwork: GameArtwork;
  orientation: "landscape" | "portrait";
  /** The game's own title. Printed under the device. */
  caption: string;
  /** One factual line about the game, from the catalogue. */
  note?: string;
  className?: string;
}) {
  const landscape = orientation === "landscape";

  return (
    <figure className={cn("group/device", className)}>
      <div className="border-line bg-surface shadow-lg relative rounded-xl border p-2 sm:p-2.5">
        {/* The earpiece slot. One detail is enough to read as a device; two
            would start being a drawing of a phone. */}
        <span
          aria-hidden
          className={cn(
            "bg-line absolute rounded-full",
            landscape
              ? "top-1/2 left-1 h-8 w-1 -translate-y-1/2"
              : "top-1 left-1/2 h-1 w-8 -translate-x-1/2",
          )}
        />

        <Media
          src={artwork.src}
          alt={artwork.alt}
          aspect={landscape ? "wide" : "screenshot"}
          sizes={landscape ? "deviceWide" : "deviceTall"}
          rounded="lg"
        />
      </div>

      <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-heading text-sm font-semibold">{caption}</span>
        {note ? <span className="text-muted text-sm">{note}</span> : null}
      </figcaption>
    </figure>
  );
}
