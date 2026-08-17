import { BlogCard } from "@/components/blog";
import { Reveal, WordReveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getNewBlogPosts, type BlogPost } from "@/content/blog";

/**
 * The three guides the homepage leads with.
 *
 * This used to reshuffle per visit, which meant `connection()` and which meant
 * `/` was the one route on the site that could not be prerendered — the whole
 * homepage re-rendered on every request so that three cards could change
 * order. That is a poor trade for the site's most important page: it costs
 * every visitor the origin round trip that the other fifty-five routes avoid,
 * and it costs them before the hero can paint.
 *
 * So the selection is now the first three guides in authored order, which
 * makes it an editorial choice held in src/content/blog.ts rather than an
 * arbitrary one. Reordering that file changes which guides lead; no runtime
 * decision is involved.
 *
 * `getNewBlogPosts()` rather than `getAllBlogPosts()` on purpose. The full
 * list opens with the three posts inherited from WordPress, so taking the
 * first three of it would have pinned this section to the imported archive
 * and hidden all seventeen of the guides written for the new site — the ones
 * the "Explore all guides" button beside this heading is pointing at. The
 * legacy three keep their own URLs and their place in the blog index; they
 * are just not what the homepage leads with.
 *
 * Deliberately synchronous. Nothing here awaits, so there is nothing for a
 * Suspense boundary to wait on, and the one that used to wrap this in
 * app/page.tsx went with the randomness.
 */
const FEATURED_COUNT = 3;

export function HomeBlog() {
  return <HomeBlogContent posts={getNewBlogPosts().slice(0, FEATURED_COUNT)} />;
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
