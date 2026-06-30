import TimeAgo from "react-timeago";
import HeroTerminal from "../compoents/Terminal";
import { PROJECTS, STACK } from "../constants";

export default function HomePage({ posts, postsStatus, onOpenPost, onViewAllPosts }) {
    const recentPosts = posts.slice(0, 2);

    return (
        <main>
            <section className="hero">
                <div className="wrap">
                    <HeroTerminal />
                    <p className="hero-sub">
                        Backend engineer at Omniful, building services in Go and chasing the harder problem of
                        making AI agents reason reliably. Currently deep in a multi-agent systems.
                    </p>
                    <div className="hero-cta">
                        <a className="btn btn-primary" href="#projects">$ open ./projects</a>
                        <button className="btn btn-ghost" onClick={onViewAllPosts}>$ tail -f blog.log</button>
                    </div>
                </div>
            </section>

            <section id="about">
                <div className="wrap">
                    <div className="eyebrow">cat about.md</div>
                    <h2>About</h2>
                    <div className="about-grid">
                        <div className="about-text">
                            <p>
                                I'm a <strong>Software Engineer</strong> working on backend microservices and agentic AI
                                systems. Most days I'm in Go - building Kafka-driven pipelines, Redis-backed caches, and
                                APIs that need to hold up under real production load.
                            </p>
                            <p>
                                Outside of work, I'm deep in the agentic AI rabbit hole: multi-agent orchestration with
                                LangGraph, RAG pipelines, vector search, and an <strong>open-source agent framework
                                    written in Go</strong> - because I think the ecosystem needs fewer Python wrappers and
                                more systems-level thinking.
                            </p>
                            <p>
                                I also write about backend systems, agentic AI, and whatever breaks at 2am. You can find
                                my posts in the <strong>blog</strong> section below.
                            </p>
                            <p>
                                If you want to chat about backend systems, agentic AI, or just want to say hi, reach out
                                via <a href="mailto:jasvindersingh3593@gmail.com">email</a>.
                            </p>
                        </div>
                        <div className="codecard">
                            <div><span className="kw">type</span> <span className="ty">Engineer</span> <span className="kw">struct</span> {"{"}</div>
                            <div>&nbsp;&nbsp;Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ty">string</span></div>
                            <div>&nbsp;&nbsp;Role&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ty">string</span></div>
                            <div>&nbsp;&nbsp;Stack&nbsp;&nbsp;&nbsp;&nbsp;[]<span className="ty">string</span></div>
                            <div>&nbsp;&nbsp;Building&nbsp;<span className="ty">string</span></div>
                            <div>{"}"}</div>
                            <div>&nbsp;</div>
                            <div><span className="com">// current state</span></div>
                            <div>e := <span className="ty">Engineer</span>{"{"}</div>
                            <div>&nbsp;&nbsp;Name: <span className="strv">"Jasvinder"</span>,</div>
                            <div>&nbsp;&nbsp;Role: <span className="strv">"Backend + Agentic AI"</span>,</div>
                            <div>&nbsp;&nbsp;Building: <span className="strv">"agents that don't hallucinate"</span>,</div>
                            <div>{"}"}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="stack">
                <div className="wrap">
                    <div className="eyebrow">ls stack/</div>
                    <h2>Tech Stack</h2>
                    <div className="stack-grid">
                        {STACK.map((s) => (
                            <span className="pill" key={s}>{s}</span>
                        ))}
                    </div>
                </div>
            </section>

            <section id="projects">
                <div className="wrap">
                    <div className="eyebrow">ls projects/ -la</div>
                    <h2>Projects</h2>
                    <p className="section-intro"> Top 3 projects from my library</p>
                    <div className="proj-grid">
                        {PROJECTS.map((p) => (
                            <div className="card" key={p.title}>
                                <div className="card-title">
                                    <a className="text-large" href={p.href} aria-label="View source">{p.title} ↗</a>
                                </div>
                                <p className="card-desc">{p.desc}</p>
                                <div className="tag-row">
                                    {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="blog-preview">
                <div className="wrap">
                    <div className="eyebrow">tail -f blog.log</div>
                    <h2>Recent Writing</h2>
                    <p className="section-intro">Notes on backend systems, agentic AI, and whatever breaks at 2am.</p>
                    {postsStatus === "loading" && <div className="blog-state">loading posts...</div>}
                    {postsStatus === "fallback" && <div className="blog-state">api offline - showing bundled posts</div>}
                    {recentPosts.map((p) => (
                        <button className="post-link" key={p.slug} onClick={() => onOpenPost(p.slug)}>
                            <div className="post-meta">
                                <span><TimeAgo date={p.date} /></span><span>·</span><span>{p.readTime}</span><span>·</span><span>{p.tags.join(", ")}</span>
                            </div>
                            <div className="post-title">{p.title}</div>
                            <div className="post-excerpt">{p.excerpt}</div>
                        </button>
                    ))}
                    {recentPosts.length === 0 && postsStatus !== "loading" && (
                        <div className="blog-state">no posts published yet</div>
                    )}
                    <button className="view-all" onClick={onViewAllPosts}>$ ls blog/ --all →</button>
                </div>
            </section>

            <section id="contact">
                <div className="wrap">
                    <div className="eyebrow">./contact.sh</div>
                    <h2>Get in touch</h2>
                    <p className="section-intro">Open to interesting backend and AI-agent problems. Easiest way to reach me below.</p>
                    <div className="contact-row">
                        <a className="contact-link" href="https://github.com/" target="_blank" rel="noopener noreferrer">
                            <span className="arrow">→</span> github
                        </a>
                        <a className="contact-link" href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
                            <span className="arrow">→</span> linkedin
                        </a>
                        <a className="contact-link" href="mailto:you@example.com">
                            <span className="arrow">→</span> email
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
