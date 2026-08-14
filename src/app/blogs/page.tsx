import { BlogIndex } from "@/components/blog";
import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/routes";
import { blogIndexContent, getAllBlogPosts } from "@/content/blog";
import { blogIndexSchema, jsonLdGraph } from "@/lib/jsonld";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  titleAbsolute: blogIndexContent.seoTitle,
  description: blogIndexContent.seoDescription,
  path: routes.blogs.path,
});

export default function BlogsPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <JsonLd data={jsonLdGraph(blogIndexSchema(posts))} />
      <BlogIndex posts={posts} />
    </>
  );
}
