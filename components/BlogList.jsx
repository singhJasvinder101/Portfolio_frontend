import Link from "next/link";
import TimeAgo from "react-timeago";

export default function BlogListPage({ posts, postsStatus, postsError }) {
    return (
        <main>
            <section style={{ paddingTop: 150 }}>
                <div className="wrap">
                    <Link className="back-link" href="/">$ cd ..</Link>
                    <div className="eyebrow">ls blog/ -la</div>
                    <h2>All Posts</h2>
                    <p className="section-intro">Everything I&apos;ve written so far, newest first.</p>
                    {postsStatus === "fallback" && (
                        <div className="blog-state">api offline - showing bundled posts{postsError ? ` (${postsError})` : ""}</div>
                    )}
                    {posts.map((p) => (
                        <Link className="post-link" key={p.slug} href={`/blog/${p.slug}`}>
                            <div className="post-meta">
                                <span><TimeAgo date={p.date} /></span><span>·</span><span>{p.readTime}</span><span>·</span><span>{p.tags.join(", ")}</span>
                            </div>
                            <div className="post-title">{p.title}</div>
                            <div className="post-excerpt">{p.excerpt}</div>
                        </Link>
                    ))}
                    {posts.length === 0 && (
                        <div className="blog-state">no posts published yet</div>
                    )}
                </div>
            </section>
        </main>
    );
}
