import BlogListPage from "@/components/BlogList";
import { getAllBlogsSafe } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "blog — portfolio",
};

export default async function Page() {
  const { posts, status, error } = await getAllBlogsSafe();
  return <BlogListPage posts={posts} postsStatus={status} postsError={error} />;
}
