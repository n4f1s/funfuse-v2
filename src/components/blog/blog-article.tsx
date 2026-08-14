import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Link } from "@/components/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { Button, Container } from "@/components/ui";
import type { BlogPost } from "@/content/blog";
import { getGameBySlug, gameHref, playStoreUrl } from "@/content/games";
import { getGameArt } from "@/content/games/art";
import { articleSchema, breadcrumbSchema, faqSchema, jsonLdGraph } from "@/lib/jsonld";

import { getBlogHeroArtwork } from "./blog-art";
import { BlogCard, BlogCardFallbackArt } from "./blog-card";
import { BlogReadingProgress } from "./blog-reading-progress";
import { BlogTableOfContents, type TocItem } from "./blog-table-of-contents";

/** The article body owns both the progress bar's extent and the TOC's headings. */
const BODY_ID = "guide-body";
const BODY_SELECTOR = `#${BODY_ID}`;

export function BlogArticle({
  post,
  tableOfContents,
  readingTime,
  relatedPosts,
}: {
  post: BlogPost;
  tableOfContents: readonly TocItem[];
  readingTime: number;
  relatedPosts: readonly BlogPost[];
}) {
  const art = getBlogHeroArtwork(post);
  const relatedGame = post.relatedGameSlug ? getGameBySlug(post.relatedGameSlug) : null;
  const relatedGameArt = relatedGame ? getGameArt(relatedGame.slug)?.cover : null;
  const playStoreLink = relatedGame ? playStoreUrl(relatedGame) : null;

  return (
    <div className="bg-canvas pb-24 sm:pb-32">
      <JsonLd
        data={jsonLdGraph(
          articleSchema(post, art),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blogs/" },
            { name: post.title, path: post.canonicalPath },
          ]),
          ...(post.faq.length > 0 ? [faqSchema(post.faq)] : []),
        )}
      />
      <BlogReadingProgress target={BODY_SELECTOR} />

      <header className="border-b border-line bg-surface">
        <Container className="pt-8 pb-20 sm:pt-10 sm:pb-28 lg:pb-32">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:text-heading">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-faint">
                /
              </li>
              <li>
                <Link href="/blogs/" className="hover:text-heading">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true" className="text-faint">
                /
              </li>
              <li className="text-heading" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="mt-9 max-w-4xl sm:mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
              {post.eyebrow}
            </p>
            <h1 className="mt-5 text-h1 font-semibold tracking-tighter text-balance text-heading">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted">
              {post.excerpt}
            </p>
          </div>

          <ArticleMeta post={post} readingTime={readingTime} />
        </Container>
      </header>

      {/* The plate straddles the band edge: the header's own bottom padding is
          empty, so the overlap can never collide with the meta row above it. */}
      <Container>
        <div className="-mt-10 sm:-mt-16 lg:-mt-20">
          {art ? (
            <Media
              src={art.src}
              alt={post.hero?.alt ?? art.alt}
              aspect="feature"
              sizes="container"
              priority="lcp"
              className="plate shadow-lg"
            />
          ) : (
            <BlogCardFallbackArt aspect="feature" className="shadow-lg" />
          )}
        </div>
      </Container>

      <Container className="pt-14 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-16 xl:gap-24">
          <article
            id={BODY_ID}
            className="blog-article-content min-w-0"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />
          {tableOfContents.length >= 3 ? (
            <BlogTableOfContents items={tableOfContents} target={BODY_SELECTOR} />
          ) : null}
        </div>

        {relatedGame ? (
          <Reveal as="section" className="mt-20 sm:mt-28">
            <div className="grid overflow-hidden rounded-lg border border-line bg-surface sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:items-center">
              {relatedGameArt ? (
                <Media
                  src={relatedGameArt.src}
                  alt={relatedGameArt.alt}
                  aspect="wide"
                  sizes="half"
                  rounded="none"
                  className="h-full"
                />
              ) : null}
              <div className="p-6 sm:p-9 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-accent-text">
                  Play the game
                </p>
                <h2 className="mt-4 text-h3 font-semibold tracking-tight text-balance text-heading">
                  {relatedGame.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-pretty text-muted">
                  You have the rules. The game page has the details for the
                  FunFuse version of this title.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {playStoreLink ? (
                    <Button href={playStoreLink}>Download on Google Play</Button>
                  ) : null}
                  <Button href={gameHref(relatedGame)} variant="secondary">
                    View game
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}

        {relatedPosts.length > 0 ? (
          <section className="mt-20 border-t border-line pt-14 sm:mt-28 sm:pt-20">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-accent-text">
                Keep reading
              </p>
              <h2 className="mt-3 text-h2 font-semibold tracking-tight text-balance text-heading">
                More from the table
              </h2>
            </div>
            <Reveal
              stagger
              className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10"
            >
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} />
              ))}
            </Reveal>
          </section>
        ) : null}
      </Container>
    </div>
  );
}

function ArticleMeta({ post, readingTime }: { post: BlogPost; readingTime: number }) {
  const dates = [
    post.publishedAt ? { label: "Published", value: post.publishedAt } : null,
    post.modifiedAt ? { label: "Updated", value: post.modifiedAt } : null,
  ].filter((entry) => entry !== null);

  return (
    <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-3 sm:mt-12">
      <span className="rounded-md bg-accent-tint px-2.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.1em] text-accent-text">
        {readingTime} min read
      </span>
      {post.categories.map((category) => (
        <span
          key={category}
          className="rounded-md bg-surface-sunken px-2.5 py-1.5 text-2xs font-medium text-muted"
        >
          {category}
        </span>
      ))}
      {dates.map((date) => (
        <span key={date.label} className="text-xs text-faint">
          {date.label} {formatDate(date.value)}
        </span>
      ))}
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
