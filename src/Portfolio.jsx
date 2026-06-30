import { useState, useEffect, useRef } from "react";

/* ---------------------------------------------------------
   DATA
--------------------------------------------------------- */
const STACK = [
    "Go", "Python", "Kafka", "Redis", "PostgreSQL", "MongoDB",
    "Docker", "Kubernetes", "AWS", "LangGraph", "RAG Pipelines", "Vector DBs"
];

const PROJECTS = [
    {
        title: "Agentic Real Estate Assistant",
        desc: "A multi-agent due-diligence platform for the Indian residential & commercial market. Planner → RERA → Builder → Location → Price → Comparison → Report — each stage handled by a dedicated agent.",
        tags: ["Python", "FastAPI", "LangGraph", "Pydantic"],
        href: "#"
    },
    {
        title: "Go Agent Framework",
        desc: "Open-source framework for building LLM agents natively in Go — lightweight orchestration without dragging in a Python runtime just to call a model.",
        tags: ["Go", "LLM Tooling", "Open Source"],
        href: "#"
    },
    {
        title: "System Design Question Bot",
        desc: "A cron-job agent that scans GitHub repos and generates HLD/LLD interview questions, delivered straight to Telegram, Slack, or Gmail. Split-model architecture with long-term memory in ChromaDB.",
        tags: ["Gemini", "GPT-4o", "ChromaDB"],
        href: "#"
    }
];

/* Blog post bodies are now markdown strings — supports headings (##),
   bold/italic, inline code, fenced code blocks (```lang), images (![alt](url)),
   links, blockquotes (>), and unordered lists (-). See parseMarkdown() below. */
const POSTS = [
    {
        slug: "agents-in-go-not-python",
        date: "2026-06-12",
        tags: ["Go", "Agentic AI"],
        readTime: "4 min",
        title: "Why I'm Building Agents in Go, Not Python",
        excerpt: "Every agent framework I looked at assumed Python by default. Once you're running agents in production next to services that already live in Go, that assumption gets expensive.",
        bodyMd: `Every agent framework I looked at assumed Python by default — and for good reason, the LLM ecosystem grew up there. But once you're running agents in production, alongside services that already live in Go, the friction of bridging runtimes adds up fast: extra containers, extra serialization, extra places for things to silently break.

Go gives me static typing for tool schemas, predictable concurrency for parallel agent calls, and a single binary I can actually reason about under load. It's not about rejecting Python — I still reach for it when I need the ecosystem. It's about not paying a tax on every request just to glue two languages together.

Here's roughly what a tool-calling agent interface looks like in the framework:

\`\`\`go
type Tool interface {
    Name() string
    Schema() map[string]any
    Run(ctx context.Context, args map[string]any) (string, error)
}

type Agent struct {
    Model Model
    Tools []Tool
}

func (a *Agent) Step(ctx context.Context, input string) (string, error) {
    resp, err := a.Model.Complete(ctx, input, a.Tools)
    if err != nil {
        return "", err
    }
    return resp, nil
}
\`\`\`

Nothing exotic — just interfaces and structs. That's the point. The framework is still early, but the core idea holds: **agent orchestration is a systems problem first, and a prompting problem second.**`
    },
    {
        slug: "cache-aside-vs-cqrs",
        date: "2026-05-28",
        tags: ["System Design"],
        readTime: "5 min",
        title: "Cache-Aside vs CQRS: Picking the Right Pattern",
        excerpt: "These two get lumped together a lot, but they're solving different problems — one is about latency, the other is about shape.",
        bodyMd: `These two get lumped together a lot, but they're solving different problems. Cache-aside is about latency — you're shaving milliseconds off reads by sitting a fast store in front of a slower one, and you accept some staleness in exchange.

CQRS is about shape — your write model and your read model genuinely look different, often because one side needs strong consistency and the other needs to answer twelve kinds of queries fast. Reaching for CQRS just to "add a cache" usually means more moving parts than the problem needed.

A quick way I sanity-check which one I actually need:

- **Same data shape, just slow** → cache-aside
- **Read and write models genuinely differ** → CQRS
- **Need eventual consistency tolerance** → either works, but CQRS scales the read side independently
- **Team can own two models long-term** → CQRS, otherwise it rots into extra complexity nobody maintains

> My rule of thumb: if the data shape is the same and you just want speed, cache-aside. If the read and write workloads have fundamentally different needs, CQRS earns its complexity.`
    },
    {
        slug: "scraping-harera-playwright",
        date: "2026-05-09",
        tags: ["Web Scraping", "Playwright"],
        readTime: "3 min",
        title: "Scraping a JS-Rendered Govt Portal with Playwright",
        excerpt: "The project table on the Gurugram bench portal doesn't exist in the initial HTML at all — it shows up only after the page runs.",
        bodyMd: `While building the RERA data layer for the real-estate assistant, I hit a wall: the project table on the Gurugram bench portal doesn't exist in the initial HTML response at all. It's rendered client-side after a handful of XHR calls, so a plain \`requests.get()\` just returns an empty shell.

![Network tab showing the project table only populating after XHR calls finish](https://picsum.photos/800/400?random=42)

## The fix

Treat the page like a browser would: drive it with Playwright, wait for the network to settle, then read the DOM after it's actually populated.

\`\`\`python
from playwright.sync_api import sync_playwright

def fetch_projects(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        page.wait_for_selector("table.project-list")
        html = page.content()
        browser.close()
        return html
\`\`\`

Slower than a raw HTTP request, but it's the only honest way to get data that genuinely doesn't exist until JavaScript runs.

Lesson for anyone scraping government portals in India: check devtools' Network tab before writing a single line of scraper code. Half the time there's a clean JSON endpoint hiding behind the UI.`
    }
];

/* ---------------------------------------------------------
   GLOBAL STYLES (same design tokens as before, + markdown/code/img styles)
--------------------------------------------------------- */
const GlobalStyles = () => (
    <style>{`
    .pf{
      --bg: #0a0a0c;
      --bg-alt: #0d0f12;
      --surface: #12151a;
      --surface-2: #171b21;
      --border: #232830;
      --text: #dde3e8;
      --text-dim: #8b96a3;
      --text-faint: #545d69;
      --accent: #e8b339;
      --accent-soft: rgba(232,179,57,0.10);
      --accent-soft-strong: rgba(232,179,57,0.18);
      --accent2: #4fd1c5;
      --accent2-soft: rgba(79,209,197,0.10);
      --font-mono: 'JetBrains Mono', ui-monospace, monospace;
      --font-sans: 'Inter', -apple-system, sans-serif;
      --maxw: 880px;

      background: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      min-height: 100vh;
      position: relative;
      -webkit-font-smoothing: antialiased;
    }
    .pf::before{
      content:"";
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
      background-size: 26px 26px;
      pointer-events: none;
      z-index: 0;
    }
    .pf a{ color: inherit; text-decoration: none; }
    .pf *:focus-visible{
      outline: 2px solid var(--accent);
      outline-offset: 3px;
      border-radius: 2px;
    }
    .pf .wrap{
      max-width: var(--maxw);
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    /* nav */
    .pf header.nav{
      position: fixed;
      top:0; left:0; right:0;
      z-index: 50;
      background: rgba(10,10,12,0.78);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }
    .pf .nav-inner{
      max-width: var(--maxw);
      margin: 0 auto;
      padding: 16px 24px;
      display:flex;
      align-items:center;
      justify-content: space-between;
    }
    .pf .nav-logo{
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      background:none; border:none; cursor:pointer;
    }
    .pf .nav-logo span{ color: var(--accent); }
    .pf .nav-links{
      display:flex;
      gap: 22px;
      list-style:none;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-dim);
      margin:0; padding:0;
    }
    .pf .nav-links button{
      background:none; border:none; color: var(--text-dim);
      font-family: var(--font-mono); font-size: 13px; cursor:pointer;
      transition: color .15s ease;
    }
    .pf .nav-links button:hover{ color: var(--accent); }
    .pf .nav-toggle{
      display:none;
      background:none;
      border:1px solid var(--border);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 6px 10px;
      border-radius: 4px;
      cursor:pointer;
    }
    @media (max-width: 640px){
      .pf .nav-links{
        position:absolute;
        top: 100%; left:0; right:0;
        background: var(--bg-alt);
        border-bottom: 1px solid var(--border);
        flex-direction: column;
        padding: 16px 24px;
        gap: 14px;
        display:none;
      }
      .pf .nav-links.open{ display:flex; }
      .pf .nav-toggle{ display:inline-block; }
    }

    /* hero / terminal */
    .pf .hero{ padding: 150px 0 90px; position: relative; z-index:1; }
    .pf .terminal{
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
    }
    .pf .terminal-bar{
      display:flex; align-items:center; gap: 8px;
      padding: 10px 14px;
      background: var(--surface-2);
      border-bottom: 1px solid var(--border);
    }
    .pf .dot{ width:11px; height:11px; border-radius:50%; }
    .pf .dot.red{ background:#ff5f57; }
    .pf .dot.yellow{ background:#febc2e; }
    .pf .dot.green{ background:#28c840; }
    .pf .terminal-title{ margin-left: 8px; font-family: var(--font-mono); font-size: 12px; color: var(--text-faint); }
    .pf .terminal-body{ padding: 26px 24px 30px; font-family: var(--font-mono); font-size: 14.5px; min-height: 250px; }
    @media (min-width:640px){ .pf .terminal-body{ font-size: 16px; } }
    .pf .tline{ white-space: pre-wrap; word-break: break-word; color: var(--text-dim); min-height: 1.5em; }
    .pf .tline .prompt{ color: var(--accent2); }
    .pf .tline.key{ color: var(--text); }
    .pf .tline .str{ color: var(--accent); }
    .pf .tline .field{ color: var(--accent2); }
    .pf .cursor{
      display:inline-block; width: 9px; height: 16px; background: var(--accent);
      margin-left: 4px; animation: pf-blink 1s steps(1) infinite; vertical-align: -2px;
    }
    @keyframes pf-blink{ 50%{ opacity:0; } }

    .pf .hero-sub{ margin-top: 28px; color: var(--text-dim); font-size: 16px; max-width: 560px; }
    .pf .hero-cta{ margin-top: 26px; display:flex; gap: 14px; flex-wrap: wrap; }
    .pf .btn{
      font-family: var(--font-mono); font-size: 13px; padding: 10px 16px; border-radius: 6px;
      border: 1px solid var(--border); transition: all .15s ease; display:inline-flex; align-items:center;
      gap:6px; cursor:pointer; background:none;
    }
    .pf .btn-primary{ background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
    .pf .btn-primary:hover{ background: var(--accent-soft-strong); }
    .pf .btn-ghost{ color: var(--text-dim); }
    .pf .btn-ghost:hover{ border-color: var(--accent2); color: var(--accent2); }

    /* sections */
    .pf section{ padding: 80px 0; position: relative; z-index:1; }
    .pf section + section{ border-top: 1px solid var(--border); }
    .pf .eyebrow{
      font-family: var(--font-mono); font-size: 13px; color: var(--accent2);
      margin-bottom: 14px; display:flex; align-items:center; gap:8px;
    }
    .pf .eyebrow::before{ content:"›"; color: var(--text-faint); }
    .pf h2{ font-family: var(--font-mono); font-size: 24px; font-weight: 600; margin-bottom: 22px; color: var(--text); }
    .pf .section-intro{ color: var(--text-dim); max-width: 600px; margin-bottom: 36px; }

    /* about */
    .pf .about-grid{ display:grid; grid-template-columns: 1.1fr 0.9fr; gap: 36px; align-items: start; }
    @media (max-width: 760px){ .pf .about-grid{ grid-template-columns: 1fr; } }
    .pf .about-text p{ color: var(--text-dim); margin-bottom: 14px; }
    .pf .about-text strong{ color: var(--text); font-weight: 600; }
    .pf .codecard{
      background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
      padding: 18px 20px; font-family: var(--font-mono); font-size: 13px; color: var(--text-dim); line-height: 1.9;
    }
    .pf .codecard .kw{ color: var(--accent2); }
    .pf .codecard .ty{ color: var(--accent); }
    .pf .codecard .com{ color: var(--text-faint); }
    .pf .codecard .strv{ color: var(--accent); }

    /* stack */
    .pf .stack-grid{ display:flex; flex-wrap:wrap; gap: 10px; }
    .pf .pill{
      font-family: var(--font-mono); font-size: 13px; padding: 8px 14px; border-radius: 6px;
      border: 1px solid var(--border); color: var(--text-dim); background: var(--surface); transition: all .15s ease;
    }
    .pf .pill:hover{ border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }

    /* projects */
    .pf .proj-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 18px; }
    .pf .card{
      background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 22px;
      transition: border-color .15s ease, transform .15s ease;
    }
    .pf .card:hover{ border-color: var(--accent2); transform: translateY(-2px); }
    .pf .card-title{
      font-family: var(--font-mono); font-size: 15px; font-weight: 600; color: var(--text);
      margin-bottom: 8px; display:flex; justify-content: space-between; align-items:center; gap: 10px;
    }
    .pf .card-title a{ color: var(--text-faint); font-size: 13px; transition: color .15s; }
    .pf .card-title a:hover{ color: var(--accent); }
    .pf .card-desc{ color: var(--text-dim); font-size: 14px; margin-bottom: 14px; }
    .pf .tag-row{ display:flex; flex-wrap:wrap; gap:6px; }
    .pf .tag{
      font-family: var(--font-mono); font-size: 11px; padding: 3px 8px; border-radius: 4px;
      background: var(--accent2-soft); color: var(--accent2); border: 1px solid rgba(79,209,197,0.25);
    }

    /* blog list / preview cards */
    .pf .post-link{
      width: 100%; text-align: left; background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; margin-bottom: 14px; cursor:pointer; display:block; padding: 18px 20px;
      transition: border-color .15s ease, background .15s ease;
    }
    .pf .post-link:hover{ border-color: var(--accent); background: var(--surface-2); }
    .pf .post-meta{
      font-family: var(--font-mono); font-size: 12px; color: var(--text-faint);
      margin-bottom: 6px; display:flex; gap: 10px; flex-wrap: wrap;
    }
    .pf .post-title{ font-size: 15.5px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .pf .post-excerpt{ font-size: 13.5px; color: var(--text-dim); }
    .pf .view-all{
      font-family: var(--font-mono); font-size: 13px; color: var(--accent2); cursor:pointer;
      background:none; border:none; margin-top: 8px; display:inline-flex; gap:6px; align-items:center;
    }
    .pf .view-all:hover{ color: var(--accent); }

    /* full post page */
    .pf .back-link{
      font-family: var(--font-mono); font-size: 13px; color: var(--text-dim); background:none; border:none;
      cursor:pointer; display:inline-flex; align-items:center; gap:6px; margin-bottom: 30px;
    }
    .pf .back-link:hover{ color: var(--accent); }
    .pf .post-page-title{ font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 14px; line-height: 1.3; }
    .pf .post-tags{ display:flex; gap:6px; margin-bottom: 30px; flex-wrap:wrap; }

    /* markdown body */
    .pf .md-body p{ color: var(--text-dim); margin-bottom: 16px; font-size: 16px; }
    .pf .md-body strong{ color: var(--text); font-weight: 600; }
    .pf .md-body em{ color: var(--text-dim); font-style: italic; }
    .pf .md-h2{ font-family: var(--font-mono); font-size: 19px; font-weight: 600; color: var(--text); margin: 32px 0 14px; }
    .pf .md-h3{ font-family: var(--font-mono); font-size: 16px; font-weight: 600; color: var(--text); margin: 26px 0 12px; }
    .pf .md-ul{ padding-left: 20px; margin-bottom: 18px; color: var(--text-dim); font-size: 15.5px; }
    .pf .md-ul li{ margin-bottom: 9px; }
    .pf .md-ul li::marker{ color: var(--accent2); }
    .pf .md-blockquote{
      border-left: 3px solid var(--accent); padding: 4px 0 4px 18px; margin: 20px 0;
      color: var(--text-dim); font-style: italic; font-size: 15.5px;
    }
    .pf .inline-code{
      font-family: var(--font-mono); font-size: 0.88em; background: var(--surface-2);
      border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--accent2);
    }
    .pf .md-link{ color: var(--accent2); text-decoration: underline; text-decoration-color: rgba(79,209,197,0.4); }
    .pf .md-link:hover{ color: var(--accent); }

    /* markdown image */
    .pf .md-img-wrap{ margin: 26px 0; }
    .pf .md-img-wrap img{
      width: 100%; display: block; border-radius: 8px; border: 1px solid var(--border);
    }
    .pf .md-img-caption{
      font-family: var(--font-mono); font-size: 12px; color: var(--text-faint);
      margin-top: 9px; text-align: center;
    }

    /* markdown / blog code block (mini terminal style) */
    .pf .code-block{
      margin: 22px 0; border: 1px solid var(--border); border-radius: 8px;
      overflow: hidden; background: var(--surface);
    }
    .pf .code-block-bar{
      display:flex; align-items:center; gap: 8px; padding: 9px 14px;
      background: var(--surface-2); border-bottom: 1px solid var(--border);
      font-family: var(--font-mono); font-size: 11.5px; color: var(--text-faint);
    }
    .pf .code-block-lang{ margin-left: 8px; }
    .pf .code-block pre{
      margin: 0; padding: 16px 18px; overflow-x: auto;
      font-family: var(--font-mono); font-size: 13px; line-height: 1.65; color: var(--text-dim);
    }
    .pf .code-line{ white-space: pre; }
    .pf .code-kw{ color: var(--accent2); }
    .pf .code-str{ color: var(--accent); }
    .pf .code-com{ color: var(--text-faint); font-style: italic; }

    /* contact */
    .pf .contact-row{ display:flex; flex-wrap: wrap; gap: 14px; margin-top: 8px; }
    .pf .contact-link{
      font-family: var(--font-mono); font-size: 14px; padding: 12px 18px; border: 1px solid var(--border);
      border-radius: 6px; color: var(--text-dim); transition: all .15s ease; display:flex; align-items:center; gap: 8px;
    }
    .pf .contact-link:hover{ border-color: var(--accent); color: var(--accent); }
    .pf .contact-link .arrow{ color: var(--accent2); }

    .pf footer{
      border-top: 1px solid var(--border); padding: 28px 0 40px; font-family: var(--font-mono);
      font-size: 12px; color: var(--text-faint); text-align:center;
    }

    @media (prefers-reduced-motion: reduce){
      .pf *{ animation: none !important; transition: none !important; }
    }
  `}</style>
);

/* ---------------------------------------------------------
   MARKDOWN ENGINE
   Lightweight, dependency-free. Supports:
   - Headings (## / ###)
   - Bold **x**, italic *x*, inline `code`, [links](url)
   - Fenced code blocks ```lang ... ```  (with light syntax highlighting)
   - Images ![alt](url) — rendered as a figure with caption
   - Blockquotes (> )
   - Unordered lists (- or *)
   - Paragraphs
--------------------------------------------------------- */

function parseMarkdown(md) {
    const lines = md.split("\n");
    const blocks = [];
    let i = 0;
    let paraBuf = [];

    const flushPara = () => {
        if (paraBuf.length) {
            blocks.push({ type: "p", text: paraBuf.join(" ") });
            paraBuf = [];
        }
    };

    while (i < lines.length) {
        const line = lines[i];

        const fenceMatch = line.match(/^```(\w*)\s*$/);
        if (fenceMatch) {
            flushPara();
            const lang = fenceMatch[1];
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].match(/^```\s*$/)) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;
            blocks.push({ type: "code", lang, code: codeLines.join("\n") });
            continue;
        }

        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
        if (imgMatch) {
            flushPara();
            blocks.push({ type: "img", alt: imgMatch[1], src: imgMatch[2] });
            i++;
            continue;
        }

        const headingMatch = line.match(/^(#{2,3})\s+(.*)$/);
        if (headingMatch) {
            flushPara();
            blocks.push({ type: headingMatch[1].length === 2 ? "h2" : "h3", text: headingMatch[2] });
            i++;
            continue;
        }

        if (/^>\s?/.test(line)) {
            flushPara();
            const quoteLines = [];
            while (i < lines.length && /^>\s?/.test(lines[i])) {
                quoteLines.push(lines[i].replace(/^>\s?/, ""));
                i++;
            }
            blocks.push({ type: "quote", text: quoteLines.join(" ") });
            continue;
        }

        if (/^[-*]\s+/.test(line)) {
            flushPara();
            const items = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^[-*]\s+/, ""));
                i++;
            }
            blocks.push({ type: "ul", items });
            continue;
        }

        if (line.trim() === "") {
            flushPara();
            i++;
            continue;
        }

        paraBuf.push(line.trim());
        i++;
    }
    flushPara();
    return blocks;
}

function renderInline(text, baseKey = "k") {
    const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|(\*[^*]+\*)/;
    const nodes = [];
    let remaining = text;
    let key = 0;

    while (remaining.length) {
        const m = remaining.match(pattern);
        if (!m) {
            nodes.push(remaining);
            break;
        }
        const idx = m.index;
        if (idx > 0) nodes.push(remaining.slice(0, idx));
        const token = m[0];

        if (token.startsWith("`")) {
            nodes.push(<span className="inline-code" key={`${baseKey}-${key++}`}>{token.slice(1, -1)}</span>);
        } else if (token.startsWith("**")) {
            nodes.push(<strong key={`${baseKey}-${key++}`}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith("[")) {
            const lm = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            nodes.push(
                <a className="md-link" href={lm[2]} target="_blank" rel="noopener noreferrer" key={`${baseKey}-${key++}`}>
                    {lm[1]}
                </a>
            );
        } else if (token.startsWith("*")) {
            nodes.push(<em key={`${baseKey}-${key++}`}>{token.slice(1, -1)}</em>);
        }
        remaining = remaining.slice(idx + token.length);
    }
    return nodes;
}

const CODE_KEYWORDS = [
    "func", "package", "import", "return", "if", "else", "for", "range", "var", "const", "type",
    "struct", "interface", "map", "chan", "go", "defer", "switch", "case", "break", "continue",
    "nil", "true", "false", "def", "class", "from", "as", "with", "async", "await", "try", "except",
    "finally", "lambda", "yield", "pass", "elif", "while", "in", "is", "not", "and", "or",
    "None", "True", "False", "function", "let", "extends", "new", "this", "export", "default"
];
const KEYWORD_PATTERN = new RegExp(`\\b(${CODE_KEYWORDS.join("|")})\\b`);
const TOKEN_PATTERN = new RegExp(
    `(//.*$|#.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|${KEYWORD_PATTERN.source}`
);

function tokenizeCodeLine(line) {
    if (line.trim() === "") return [];
    const parts = [];
    let remaining = line;
    let consumed = 0;

    while (remaining.length) {
        const m = remaining.match(TOKEN_PATTERN);
        if (!m) {
            parts.push({ type: "plain", text: remaining });
            break;
        }
        const idx = m.index;
        if (idx > 0) parts.push({ type: "plain", text: remaining.slice(0, idx) });
        if (m[1]) parts.push({ type: "com", text: m[1] });
        else if (m[2]) parts.push({ type: "str", text: m[2] });
        else if (m[3]) parts.push({ type: "kw", text: m[3] });
        remaining = remaining.slice(idx + m[0].length);
    }
    return parts;
}

function CodeBlock({ code, lang }) {
    const lines = code.split("\n");
    return (
        <div className="code-block">
            <div className="code-block-bar">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="code-block-lang">{lang || "code"}</span>
            </div>
            <pre>
                <code>
                    {lines.map((line, i) => (
                        <div className="code-line" key={i}>
                            {line.trim() === "" ? (
                                "\u00A0"
                            ) : (
                                tokenizeCodeLine(line).map((part, j) => {
                                    if (part.type === "plain") return <span key={j}>{part.text}</span>;
                                    const cls = part.type === "com" ? "code-com" : part.type === "str" ? "code-str" : "code-kw";
                                    return <span className={cls} key={j}>{part.text}</span>;
                                })
                            )}
                        </div>
                    ))}
                </code>
            </pre>
        </div>
    );
}

function MarkdownContent({ md }) {
    const blocks = parseMarkdown(md);
    return (
        <div className="md-body">
            {blocks.map((b, i) => {
                switch (b.type) {
                    case "p":
                        return <p key={i}>{renderInline(b.text, `p${i}`)}</p>;
                    case "h2":
                        return <h3 className="md-h2" key={i}>{renderInline(b.text, `h${i}`)}</h3>;
                    case "h3":
                        return <h4 className="md-h3" key={i}>{renderInline(b.text, `h${i}`)}</h4>;
                    case "quote":
                        return <blockquote className="md-blockquote" key={i}>{renderInline(b.text, `q${i}`)}</blockquote>;
                    case "ul":
                        return (
                            <ul className="md-ul" key={i}>
                                {b.items.map((it, j) => <li key={j}>{renderInline(it, `li${i}-${j}`)}</li>)}
                            </ul>
                        );
                    case "img":
                        return (
                            <figure className="md-img-wrap" key={i}>
                                <img src={b.src} alt={b.alt} loading="lazy" />
                                {b.alt && <figcaption className="md-img-caption">{b.alt}</figcaption>}
                            </figure>
                        );
                    case "code":
                        return <CodeBlock code={b.code} lang={b.lang} key={i} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}

/* ---------------------------------------------------------
   HERO TERMINAL (typing effect)
--------------------------------------------------------- */
const HERO_LINES = [
    { plain: "$ go run whoami.go", prompt: true },
    { plain: "" },
    { plain: "Engineer{", key: true },
    { plain: '  Name:     "Jasvinder",', key: true, field: "Name" },
    { plain: '  Role:     "Software Engineer @ Omniful",', key: true, field: "Role" },
    { plain: '  Stack:    []string{"Go", "Python", "Kafka", "LangGraph"},', key: true, field: "Stack" },
    { plain: '  Building: "an AI agent that understands Indian real estate",', key: true, field: "Building" },
    { plain: "}", key: true },
    { plain: "" }
];

function renderLineContent(line, textOverride) {
    const text = textOverride !== undefined ? textOverride : line.plain;
    if (line.prompt) {
        return (
            <>
                <span className="prompt">$</span>
                {text.slice(1)}
            </>
        );
    }
    if (line.field && text.trim().startsWith(line.field)) {
        const idx = text.indexOf(line.field);
        const before = text.slice(0, idx);
        const afterFieldStart = idx + line.field.length;
        const after = text.slice(afterFieldStart);
        const qMatch = after.match(/"([^"]*)"/);
        if (qMatch) {
            const qStart = after.indexOf(qMatch[0]);
            const pre = after.slice(0, qStart);
            const post = after.slice(qStart + qMatch[0].length);
            return (
                <>
                    {before}
                    <span className="field">{line.field}</span>
                    {pre}
                    <span className="str">"{qMatch[1]}"</span>
                    {post}
                </>
            );
        }
        return (
            <>
                {before}
                <span className="field">{line.field}</span>
                {after}
            </>
        );
    }
    return text;
}

function HeroTerminal() {
    const [doneLines, setDoneLines] = useState([]);
    const [typingIdx, setTypingIdx] = useState(0);
    const [typingText, setTypingText] = useState("");
    const [finished, setFinished] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            setDoneLines(HERO_LINES);
            setTypingIdx(HERO_LINES.length);
            setFinished(true);
            return;
        }

        let li = 0;
        let ci = 0;

        function step() {
            if (li >= HERO_LINES.length) {
                setFinished(true);
                return;
            }
            const line = HERO_LINES[li];
            if (line.plain.length === 0) {
                setDoneLines((d) => [...d, line]);
                li++;
                ci = 0;
                timeoutRef.current = setTimeout(step, 60);
                return;
            }
            ci++;
            setTypingIdx(li);
            setTypingText(line.plain.slice(0, ci));
            if (ci < line.plain.length) {
                timeoutRef.current = setTimeout(step, 14);
            } else {
                setDoneLines((d) => [...d, line]);
                li++;
                ci = 0;
                setTypingText("");
                timeoutRef.current = setTimeout(step, 90);
            }
        }
        timeoutRef.current = setTimeout(step, 200);
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const currentLine = HERO_LINES[typingIdx];

    return (
        <div className="terminal">
            <div className="terminal-bar">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="terminal-title">jasvinder — go run whoami.go</span>
            </div>
            <div className="terminal-body">
                {doneLines.map((line, i) => (
                    <div className={`tline ${line.key ? "key" : ""}`} key={i}>
                        {renderLineContent(line)}
                    </div>
                ))}
                {!finished && currentLine && (
                    <div className={`tline ${currentLine.key ? "key" : ""}`}>
                        {renderLineContent(currentLine, typingText)}
                    </div>
                )}
                {finished && (
                    <div className="tline">
                        <span className="prompt">$</span> <span className="cursor"></span>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------------------------------------------------------
   NAV
--------------------------------------------------------- */
function Nav({ goHomeSection, goBlogList, goHomeTop }) {
    const [open, setOpen] = useState(false);
    const handle = (fn) => () => {
        setOpen(false);
        fn();
    };
    return (
        <header className="nav">
            <div className="nav-inner">
                <button className="nav-logo" onClick={handle(goHomeTop)}>
                    jas<span>@</span>portfolio:~$
                </button>
                <button
                    className="nav-toggle"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                >
                    menu
                </button>
                <ul className={`nav-links ${open ? "open" : ""}`}>
                    <li><button onClick={handle(() => goHomeSection("about"))}>~/about</button></li>
                    <li><button onClick={handle(() => goHomeSection("stack"))}>~/stack</button></li>
                    <li><button onClick={handle(() => goHomeSection("projects"))}>~/projects</button></li>
                    <li><button onClick={handle(goBlogList)}>~/blog</button></li>
                    <li><button onClick={handle(() => goHomeSection("contact"))}>~/contact</button></li>
                </ul>
            </div>
        </header>
    );
}


/* ---------------------------------------------------------
   APP (page router via state — no react-router needed)
--------------------------------------------------------- */
export default function App() {
    const [page, setPage] = useState("home"); // 'home' | 'blogList' | 'post'
    const [activeSlug, setActiveSlug] = useState(null);
    const [pendingScroll, setPendingScroll] = useState(null);

    useEffect(() => {
        if (page === "home" && pendingScroll) {
            const el = document.getElementById(pendingScroll);
            if (el) el.scrollIntoView({ behavior: "smooth" });
            setPendingScroll(null);
        } else if (page !== "home") {
            window.scrollTo(0, 0);
        }
    }, [page, pendingScroll]);

    const goHomeSection = (id) => {
        if (page === "home") {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        } else {
            setPendingScroll(id);
            setPage("home");
        }
    };
    const goHomeTop = () => {
        setPage("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const goBlogList = () => setPage("blogList");
    const openPost = (slug) => {
        setActiveSlug(slug);
        setPage("post");
    };

    return (
        <div className="pf">
            <GlobalStyles />
            <Nav goHomeSection={goHomeSection} goBlogList={goBlogList} goHomeTop={goHomeTop} />

            {page === "home" && <HomePage onOpenPost={openPost} onViewAllPosts={goBlogList} />}
            {page === "blogList" && <BlogListPage onOpenPost={openPost} onBack={goHomeTop} />}
            {page === "post" && (
                <PostPage slug={activeSlug} onBack={goBlogList} onBackHome={goHomeTop} />
            )}

            <footer>built with Go-brain &amp; late-night coffee · © 2026 jasvinder</footer>
        </div>
    );
}
