import TimeAgo from "react-timeago";

export default function BlogListPage({ posts, postsStatus, postsError, onOpenPost, onBack }) {
    return (
        <main>
            <section style={{ paddingTop: 150 }}>
                <div className="wrap">
                    <button className="back-link" onClick={onBack}>$ cd ..</button>
                    <div className="eyebrow">ls blog/ -la</div>
                    <h2>All Posts</h2>
                    <p className="section-intro">Everything I've written so far, newest first.</p>
                    {postsStatus === "loading" && <div className="blog-state">loading posts...</div>}
                    {postsStatus === "fallback" && (
                        <div className="blog-state">api offline - showing bundled posts{postsError ? ` (${postsError})` : ""}</div>
                    )}
                    {posts.map((p) => (
                        <button className="post-link" key={p.slug} onClick={() => onOpenPost(p.slug)}>
                            <div className="post-meta">
                                <span><TimeAgo date={p.date} /></span><span>·</span><span>{p.readTime}</span><span>·</span><span>{p.tags.join(", ")}</span>
                            </div>
                            <div className="post-title">{p.title}</div>
                            <div className="post-excerpt">{p.excerpt}</div>
                        </button>
                    ))}
                    {posts.length === 0 && postsStatus !== "loading" && (
                        <div className="blog-state">no posts published yet</div>
                    )}
                </div>
            </section>
        </main>
    );
}
