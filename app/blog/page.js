import BlogListPage from "@/components/BlogList";
import { getAllBlogsSafe } from "@/lib/blogs";

export const dynamic = "force-dynamic";

const description = "Notes on backend systems, distributed systems, and agentic AI — newest first.";

export const metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title: "Blog", description },
  twitter: { title: "Blog", description },
};

export default async function Page() {
  const { posts, status, error } = await getAllBlogsSafe();
  return <BlogListPage posts={posts} postsStatus={status} postsError={error} />;
}
