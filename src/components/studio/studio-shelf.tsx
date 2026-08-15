import { Media } from "@/components/media";
import { Link } from "@/components/navigation";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { gameHref, getAllGames } from "@/content/games";
import { getGameArt } from "@/content/games/art";
import { studioContent } from "@/content/studio";

import { StudioShelfWall } from "./studio-shelf-wall";

/**
 * Everything the studio has shipped, at home-screen size.
 *
 * This is proof, not discovery. `/games/` is where somebody goes to choose
 * something to play, with covers, categories and copy; here the point is the
 * shape of the whole body of work in one glance, which is why it is store
 * icons at the size a phone actually draws them and why the titles are set
 * small underneath rather than given equal weight.
 *
 * Every tile is still a real link, because a wall of nineteen things you
 * cannot click is a picture of a catalogue rather than a catalogue.
 *
 * Counted and drawn from `src/content/games`, so a twentieth title joins the
 * wall by existing.
 */
export function StudioShelf() {
  const { shelf } = studioContent;
  const games = getAllGames();

  return (
    <Section tone="surface">
      <Reveal
        as="div"
        y="lg"
        className="sm:flex sm:items-end sm:justify-between sm:gap-x-8"
      >
        <div className="max-w-xl">
          <h2 className="text-h2 text-heading font-semibold tracking-tightest">
            {shelf.title}
          </h2>
          <p className="text-muted mt-5 text-lg">{shelf.body}</p>
        </div>

        <Button
          href={shelf.cta.href}
          variant="secondary"
          className="mt-6 w-full shrink-0 sm:mt-0 sm:w-auto"
        >
          {shelf.cta.label}
        </Button>
      </Reveal>

      <StudioShelfWall className="mt-12 grid grid-cols-3 gap-x-5 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:mt-16 lg:grid-cols-6 lg:gap-x-8">
        {games.map((game) => {
          const icon = getGameArt(game.slug)?.icon;

          return (
            <li key={game.slug}>
              <Link
                href={gameHref(game)}
                className="group/tile block rounded-lg focus-visible:outline-offset-4"
              >
                {/* The icon carries no alt of its own: the title is printed
                    directly under it and is part of the same link, so a
                    screen reader would otherwise hear the game named twice. */}
                <Media
                  src={icon?.src ?? null}
                  decorative
                  aspect="icon"
                  sizes="iconWall"
                  rounded="lg"
                  className="shadow-sm duration-[var(--duration-hover)] transition-transform ease-out group-hover/tile:-translate-y-1"
                  placeholderLabel={game.title}
                />
                <p className="text-heading duration-[var(--duration-hover)] mt-3 text-xs font-medium transition-colors ease-out group-hover/tile:text-accent-text sm:text-sm">
                  {game.title}
                </p>
              </Link>
            </li>
          );
        })}
      </StudioShelfWall>
    </Section>
  );
}
