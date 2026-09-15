import Link from "next/link";
import TimeAgo from "./TimeAgoClient";
import HeroTerminal from "./Terminal";
import { PROJECTS, STACK } from "@/lib/constants";
import { SITE_NAME, SITE_ROLE, SITE_COMPANY } from "@/lib/site-config";

export default function HomePage({ posts, postsStatus }) {
    const recentPosts = posts.slice(0, 2);

    return (
        <main>
            <section className="hero">
                <div className="wrap">
                    <h1 className="sr-only">{SITE_NAME} — {SITE_ROLE} at {SITE_COMPANY}</h1>
                    <HeroTerminal />
                    <p className="hero-sub">
                        {SITE_ROLE} at {SITE_COMPANY}, building services in Go and chasing the harder problem of
                        making AI agents reason reliably. Currently deep in a multi-agent systems.
                    </p>
                    <div className="hero-cta">
                        <a className="btn btn-primary" href="#projects">$ open ./projects</a>
                        <Link className="btn btn-ghost" href="/blog">$ tail -f blog.log</Link>
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
                                I&apos;m a <strong>{SITE_ROLE}</strong> working on backend microservices and agentic AI
                                systems. Most days I&apos;m in Go - building Kafka-driven pipelines, Redis-backed caches, and
                                APIs that need to hold up under real production load.
                            </p>
                            <p>
                                Outside of work, I&apos;m deep in the agentic AI rabbit hole: multi-agent orchestration with
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
                            <div><span className="com">{"// current state"}</span></div>
                            <div>e := <span className="ty">Engineer</span>{"{"}</div>
                            <div>&nbsp;&nbsp;Name: <span className="strv">&quot;Jasvinder&quot;</span>,</div>
                            <div>&nbsp;&nbsp;Role: <span className="strv">&quot;{SITE_ROLE} @ {SITE_COMPANY}&quot;</span>,</div>
                            <div>&nbsp;&nbsp;Building: <span className="strv">&quot;agents that don&apos;t hallucinate&quot;</span>,</div>
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
                    {postsStatus === "fallback" && <div className="blog-state">api offline - showing bundled posts</div>}
                    {recentPosts.map((p) => (
                        <Link className="post-link" key={p.slug} href={`/blog/${p.slug}`}>
                            <div className="post-meta">
                                <span><TimeAgo date={p.date} /></span><span>·</span><span>{p.readTime}</span><span>·</span><span>{p.tags.join(", ")}</span>
                            </div>
                            <div className="post-title">{p.title}</div>
                            <div className="post-excerpt">{p.excerpt}</div>
                        </Link>
                    ))}
                    {recentPosts.length === 0 && (
                        <div className="blog-state">no posts published yet</div>
                    )}
                    <Link className="view-all" href="/blog">$ ls blog/ --all →</Link>
                </div>
            </section>

            <section id="contact">
                <div className="wrap">
                    <div className="eyebrow">./contact.sh</div>
                    <h2>Get in touch</h2>
                    <p className="section-intro">Open to interesting backend and AI-agent problems. Easiest way to reach me below.</p>
                    <div className="contact-row">
                        <a className="contact-link" href="https://github.com/singhJasvinder101" target="_blank" rel="noopener noreferrer">
                            <span className="arrow">→</span> github
                        </a>
                        <a className="contact-link" href="https://www.linkedin.com/in/jasvinder-singh-466a72256/" target="_blank" rel="noopener noreferrer">
                            <span className="arrow">→</span> linkedin
                        </a>
                        <a className="contact-link" href="mailto:jasvindersingh3593@gmail.com">
                            <span className="arrow">→</span> email
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
