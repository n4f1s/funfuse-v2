import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BlogArticle } from "@/components/blog";
import { getBlogHeroArtwork } from "@/components/blog/blog-art";
import { getBlogPostBySlug, getBlogReadingTimeMinutes, getBlogTableOfContents, getNewBlogPosts, getRelatedBlogPosts } from "@/content/blog";
import { createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewBlogPosts().map((post) => ({ slug: post.slug }));
}

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || post.routeKind !== "blog") notFound();

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || post.routeKind !== "blog") notFound();

  return <BlogArticle post={post} tableOfContents={getBlogTableOfContents(post)} readingTime={getBlogReadingTimeMinutes(post)} relatedPosts={getRelatedBlogPosts(post)} />;
}
