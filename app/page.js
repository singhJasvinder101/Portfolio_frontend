import HomePage from "@/components/Home";
import { getAllBlogsSafe } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { posts, status } = await getAllBlogsSafe();
  return <HomePage posts={posts} postsStatus={status} />;
}
