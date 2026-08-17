import { Media } from "@/components/media";
import { Link } from "@/components/navigation";
import { Reveal, WordReveal } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import {
  blogIndexContent,
  getBlogReadingTimeMinutes,
  type BlogPost,
} from "@/content/blog";

import { getBlogHeroArtwork } from "./blog-art";
import { BlogCard, BlogCardFallbackArt } from "./blog-card";
import { BlogDirectory, type BlogDirectoryItem } from "./blog-directory";
import { BlogHeroDeck } from "./blog-hero-deck";

export function BlogIndex({ posts }: { posts: readonly BlogPost[] }) {
  const featured =
    posts.find((post) => post.slug === blogIndexContent.featuredPostSlug) ?? posts[0];
  const rest = posts.filter((post) => post !== featured);
  const categories = [...new Set(posts.flatMap((post) => post.categories))];
  const gamesCovered = new Set(
    posts.map((post) => post.relatedGameSlug).filter(Boolean),
  ).size;

  // Rendered here, on the server, and handed to the client filter as opaque
  // nodes. See the note in blog-directory.tsx.
  const items: BlogDirectoryItem[] = rest.map((post) => ({
    slug: post.slug,
    categories: post.categories,
    card: <BlogCard post={post} />,
  }));

  return (
    <div className="bg-canvas pb-24 sm:pb-32">
      <section className="blog-hero relative isolate overflow-hidden border-b border-line bg-surface">
        <Container className="relative py-14 sm:py-18 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
                {blogIndexContent.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-h1 font-semibold tracking-tighter text-balance text-heading">
                {blogIndexContent.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted">
                {blogIndexContent.description}
              </p>

              <Reveal as="dl" stagger delay={0.1} className="blog-hero-stats mt-10">
                <Stat value={posts.length} label="written guides" />
                <Stat value={categories.length} label="topics covered" />
                <Stat value={gamesCovered} label="games explained" />
              </Reveal>
            </div>

            <BlogHeroDeck />
          </div>
        </Container>
      </section>

      {featured ? <FeaturedGuide post={featured} /> : null}

      <section id="all-guides" className="scroll-mt-28">
        <Container className="pt-16 sm:pt-24">
          <div className="grid gap-6 border-b border-line pb-9 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-12">
            <WordReveal
              as="h2"
              text="Choose a seat, start a game."
              className="max-w-2xl text-h2 font-semibold tracking-tight text-balance text-heading"
            />
            <p className="max-w-sm text-sm leading-relaxed text-pretty text-muted">
              Rules, scoring and strategy for the games in the FunFuse catalogue.
              Pick a topic to narrow the list.
            </p>
          </div>

          <div className="pt-9">
            <BlogDirectory items={items} categories={categories} />
          </div>
        </Container>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-h3 font-semibold tabular-nums text-heading">
          {value}
        </span>
        <span className="mt-1 block text-sm text-muted">{label}</span>
      </dd>
    </div>
  );
}

/**
 * The lead guide. It is the one asymmetric block on the page: full-bleed art
 * against a narrow text column, so the index does not open as a grid of
 * equal cards.
 */
function FeaturedGuide({ post }: { post: BlogPost }) {
  const art = getBlogHeroArtwork(post);
  const readingTime = getBlogReadingTimeMinutes(post);

  return (
    <Container as="section" className="pt-14 sm:pt-20">
      <div className="group grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-center lg:gap-14">
        <Link
          href={post.canonicalPath}
          tabIndex={-1}
          aria-hidden="true"
          className="block rounded-lg focus-visible:outline-offset-4"
        >
          {art ? (
            <Media
              src={art.src}
              alt={post.hero?.alt ?? art.alt}
              aspect="wide"
              sizes="catalogueLarge"
              priority="lcp"
              className="plate"
              imageClassName="transition-transform duration-[var(--duration-overlay)] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <BlogCardFallbackArt />
          )}
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-accent-text">
            Start here
          </p>
          <h2 className="mt-4 text-h2 font-semibold tracking-tight text-balance text-heading">
            <Link
              href={post.canonicalPath}
              className="transition-colors duration-[var(--duration-hover)] ease-out hover:text-accent-text"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted">
            {post.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button href={post.canonicalPath}>Read the guide</Button>
            <span className="text-xs text-muted">{readingTime} min read</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
