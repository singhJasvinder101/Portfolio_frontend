import { getAllBlogsSafe } from "@/lib/blogs";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap() {
  const { posts } = await getAllBlogsSafe();

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...postEntries,
  ];
}
