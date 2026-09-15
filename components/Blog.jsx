import Link from "next/link";
import TimeAgo from "react-timeago";
import MarkdownContent from "./Content";

export default function PostPage({ slug, post }) {
    if (!post) {
        return (
            <main>
                <section style={{ paddingTop: 150 }}>
                    <div className="wrap" style={{ maxWidth: 680 }}>
                        <Link className="back-link" href="/blog">$ cd ../blog</Link>
                        <div className="eyebrow">cat {slug || "missing"}.md</div>
                        <h1 className="post-page-title">Post not found</h1>
                        <p className="section-intro">This post is not available in the current blog data.</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section style={{ paddingTop: 150 }}>
                <div className="wrap" style={{ maxWidth: 680 }}>
                    <Link className="back-link" href="/blog">$ cd ../blog</Link>
                    <div className="eyebrow">cat {post.slug}.md</div>
                    <div className="post-meta" style={{ marginBottom: 14 }}>
                        <span> <TimeAgo date={post.date} /></span><span>·</span><span>{post.readTime} read</span>
                    </div>
                    <h1 className="post-page-title">{post.title}</h1>
                    <div className="post-tags">
                        {post.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                    </div>

                    <MarkdownContent md={post.bodyMd} />

                    <Link className="back-link" href="/" style={{ marginTop: 10 }}>
                        $ cd ~/ — back to home
                    </Link>
                </div>
            </section>
        </main>
    );
}
