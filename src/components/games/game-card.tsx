import { Media, type MediaPriority, type SizePreset } from "@/components/media";
import { Link } from "@/components/navigation";
import {
  categoryLabels,
  gameHref,
  regionLabels,
  type Game,
  type GameArtwork,
} from "@/content/games";
import { cn } from "@/lib/cn";

/**
 * The shared game card: a `.plate` cover with title and facts typed below it
 * on bare canvas. Same visual language as the homepage's featured-games
 * card, kept as its own component because it needs a size variant the
 * homepage card doesn't, and it is always linked — never conditionally null.
 */
export function GameCard({
  game,
  cover,
  variant = "regular",
  priority = "lazy",
  sizes,
}: {
  game: Game;
  cover: GameArtwork;
  variant?: "large" | "regular";
  priority?: MediaPriority;
  /** Overrides the variant's default `sizes` — for callers with their own width, e.g. a `<Hand>` rail. */
  sizes?: SizePreset | (string & {});
}) {
  const large = variant === "large";

  return (
    <Link
      href={gameHref(game)}
      aria-label={game.title}
      className="group block rounded-lg focus-visible:outline-offset-4"
    >
      <Media
        src={cover.src}
        alt={cover.alt}
        aspect="wide"
        sizes={sizes ?? (large ? "catalogueLarge" : "catalogueRegular")}
        priority={priority}
        className="plate"
        imageClassName="transition-transform duration-[var(--duration-hover)] ease-out group-hover:scale-[1.04]"
      />

      <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3
            className={cn(
              "text-heading block font-semibold tracking-tighter sm:truncate",
              large ? "text-h3" : "text-h4",
            )}
          >
            {game.title}
          </h3>
          {game.nativeTitle ? (
            // Bricolage Grotesque has no Arabic or Cyrillic coverage, so a
            // native title always drops to Geist.
            <p className="text-muted mt-1 font-sans text-sm sm:truncate">
              {game.nativeTitle}
            </p>
          ) : null}
        </div>

        <p className="text-faint shrink-0 text-sm">
          {regionLabels[game.region]}
          <span className="px-1.5">·</span>
          {categoryLabels[game.category]}
        </p>
      </div>
    </Link>
  );
}
