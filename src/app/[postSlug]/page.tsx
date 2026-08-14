import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BlogArticle } from "@/components/blog";
import { getBlogHeroArtwork } from "@/components/blog/blog-art";
import { getBlogPostBySlug, getBlogReadingTimeMinutes, getBlogTableOfContents, getLegacyBlogPosts, getRelatedBlogPosts } from "@/content/blog";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLegacyBlogPosts().map((post) => ({ postSlug: post.slug }));
}

type LegacyBlogPostPageProps = { params: Promise<{ postSlug: string }> };

export async function generateMetadata({ params }: LegacyBlogPostPageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const post = getBlogPostBySlug(postSlug);
  if (!post || post.routeKind !== "legacy-root") notFound();

  const art = getBlogHeroArtwork(post);
  return createMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: post.canonicalPath,
    type: "article",
    keywords: [post.seo.primaryKeyword, ...post.seo.secondaryKeywords],
    ...(art ? { image: { url: art.src.src, width: art.src.width, height: art.src.height, alt: post.hero?.alt ?? art.alt } } : {}),
  });
}

export default async function LegacyBlogPostPage({ params }: LegacyBlogPostPageProps) {
  const { postSlug } = await params;
  const post = getBlogPostBySlug(postSlug);
  if (!post || post.routeKind !== "legacy-root") notFound();

  return <BlogArticle post={post} tableOfContents={getBlogTableOfContents(post)} readingTime={getBlogReadingTimeMinutes(post)} relatedPosts={getRelatedBlogPosts(post)} />;
}
