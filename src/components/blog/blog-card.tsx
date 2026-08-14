import { Media, type MediaPriority, type SizePreset } from "@/components/media";
import { Link } from "@/components/navigation";
import type { BlogPost } from "@/content/blog";
import { getBlogReadingTimeMinutes } from "@/content/blog";
import { cn } from "@/lib/cn";

import { getBlogHeroArtwork } from "./blog-art";

/**
 * The one guide card. Used by the index grid and by "keep reading" at the foot
 * of an article, so a guide looks the same wherever it is offered.
 *
 * Hover is CSS only: the art scales inside its own frame, the title takes the
 * accent, and the cue arrow slides. All three are the same gesture from three
 * elements, which is what makes the whole card read as one target.
 */
export function BlogCard({
  post,
  sizes = "gridThird",
  priority = "lazy",
  className,
}: {
  post: BlogPost;
  sizes?: SizePreset;
  priority?: MediaPriority;
  className?: string;
}) {
  const art = getBlogHeroArtwork(post);
  const readingTime = getBlogReadingTimeMinutes(post);

  return (
    <article className={cn("group flex", className)}>
      <Link
        href={post.canonicalPath}
        className="flex w-full flex-col rounded-lg focus-visible:outline-offset-4"
      >
        <div className="relative">
          {art ? (
            <Media
              src={art.src}
              alt={post.hero?.alt ?? art.alt}
              aspect="wide"
              sizes={sizes}
              priority={priority}
              className="plate"
              imageClassName="transition-transform duration-[var(--duration-overlay)] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <BlogCardFallbackArt />
          )}
          <span className="absolute left-3 top-3 z-2 rounded-md bg-surface/92 px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.1em] text-heading backdrop-blur-sm">
            {post.categories[0]}
          </span>
        </div>

        <p className="mt-5 text-2xs font-semibold uppercase tracking-[0.13em] text-accent-text">
          {post.eyebrow}
        </p>
        <h3 className="mt-2.5 text-h4 font-semibold text-balance text-heading transition-colors duration-[var(--duration-hover)] ease-out group-hover:text-accent-text">
          {post.title}
        </h3>
        <p className="mt-3 mb-6 line-clamp-3 text-sm leading-relaxed text-pretty text-muted">
          {post.excerpt}
        </p>

        <span className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4 text-xs text-muted">
          <span>{readingTime} min read</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-heading transition-colors duration-[var(--duration-hover)] ease-out group-hover:text-accent-text">
            Read guide
            <span
              aria-hidden="true"
              className="transition-transform duration-[var(--duration-hover)] ease-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}

/**
 * Stands in for the one guide with no catalogue artwork. A skeleton would read
 * as a broken image on a card that is never going to get a photo.
 */
export function BlogCardFallbackArt({
  aspect = "wide",
  className,
}: {
  aspect?: "wide" | "feature";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "blog-card-fallback relative overflow-hidden rounded-lg border border-line",
        aspect === "feature" ? "aspect-feature" : "aspect-wide",
        className,
      )}
    >
      <span className="blog-card-fallback-suit blog-card-fallback-suit--one">&spades;</span>
      <span className="blog-card-fallback-suit blog-card-fallback-suit--two">&hearts;</span>
    </div>
  );
}
