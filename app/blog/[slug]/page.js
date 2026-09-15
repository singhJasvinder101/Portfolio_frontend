import PostPage from "@/components/Blog";
import { getBlogBySlugSafe } from "@/lib/blogs";
import { jsonLdScript } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { post } = await getBlogBySlugSafe(slug);

  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: false } };
  }

  const description = post.excerpt || post.title;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title: post.title,
      description,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: { title: post.title, description },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const { post } = await getBlogBySlugSafe(slug);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || post.title,
        datePublished: post.date,
        dateModified: post.updatedAt || post.date,
        keywords: post.tags?.join(", "),
        author: { "@type": "Person", name: SITE_NAME },
        mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
      )}
      <PostPage slug={slug} post={post} />
    </>
  );
}
