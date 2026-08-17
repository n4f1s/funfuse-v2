import { randomInt } from "node:crypto";
import { connection } from "next/server";

import { BlogCard } from "@/components/blog";
import { Reveal, WordReveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getAllBlogPosts, type BlogPost } from "@/content/blog";

/**
 * A changing selection of guides gives the homepage a reason to reward a
 * return visit without turning the full archive into a second catalogue.
 * `connection()` moves the selection to request time, while the Suspense
 * fallback reserves the section's shape before those cards resolve.
 */
export async function HomeBlog() {
  await connection();

  return <HomeBlogContent posts={pickRandomPosts(getAllBlogPosts(), 3)} />;
}

/** Keeps the request-time card selection from shifting the page while loading. */
export function HomeBlogFallback() {
  return (
    <Section id="guides" tone="surface">
      <BlogSectionHeader />
      <div
        aria-hidden="true"
        className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-10"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
            <div className="aspect-wide animate-shimmer rounded-lg bg-surface-muted" />
            <div className="mt-5 h-3 w-24 rounded-full bg-surface-muted" />
            <div className="mt-3 h-7 w-4/5 rounded-md bg-surface-muted" />
            <div className="mt-4 h-4 w-full rounded-full bg-surface-muted" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function HomeBlogContent({ posts }: { posts: readonly BlogPost[] }) {
  return (
    <Section id="guides" tone="surface">
      <BlogSectionHeader />
      <Reveal
        stagger
        as="div"
        className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-10"
      >
        {posts.map((post, index) => (
          <BlogCard
            key={post.slug}
            post={post}
            className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}
          />
        ))}
      </Reveal>
    </Section>
  );
}

function BlogSectionHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-8">
      <div className="max-w-2xl">
        <WordReveal
          as="h2"
          text="More to learn before the next hand"
          className="text-h2 font-semibold tracking-tightest text-heading"
        />
        <Reveal as="p" y="lg" className="mt-4 text-lg text-muted">
          Rules, strategy and useful details for the games we build and the
          tables they come from.
        </Reveal>
      </div>

      <Reveal y="lg" className="flex">
        <Button href="/blogs/" variant="secondary">
          Explore all guides
        </Button>
      </Reveal>
    </div>
  );
}

function pickRandomPosts(posts: readonly BlogPost[], count: number): BlogPost[] {
  const pool = [...posts];
  const selection: BlogPost[] = [];

  while (selection.length < count && pool.length > 0) {
    selection.push(pool.splice(randomInt(pool.length), 1)[0]);
  }

  return selection;
}
