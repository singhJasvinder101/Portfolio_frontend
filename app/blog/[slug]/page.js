import PostPage from "@/components/Blog";
import { getBlogBySlugSafe } from "@/lib/blogs";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { post } = await getBlogBySlugSafe(slug);
  return { title: post ? `${post.title} — portfolio` : "post not found — portfolio" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const { post } = await getBlogBySlugSafe(slug);
  return <PostPage slug={slug} post={post} />;
}
