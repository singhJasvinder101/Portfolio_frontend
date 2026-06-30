export const STACK = [
    "Go", "Python", "Kafka", "Redis", "PostgreSQL", "MongoDB", "GIT",
    "Docker", "Kubernetes", "Microservices", "AWS", "LangGraph", "RAG Pipelines", "Vector DBs"
];

export const PROJECTS = [
    {
        title: "Distributed Order & Inventory System",
        desc: "A distributed order and inventory system built in Go, using SQS for Bulk Orders, Kafka for high throughputevent streaming, and PostgreSQL for consistent data storage. Designed to handle high throughput and ensure eventual consistency across services.",
        tags: ["Golang", "SQS", "Kafka", "PostgreSQL", "Microservices"],
        href: "https://github.com/singhJasvinder101/oms_service"
    },
    {
        title: "Go Agent Framework",
        desc: "A modular AI framework in Go providing unified interfaces for LLM inference, embeddings, prompt templating, and streaming across multiple llms.",
        tags: ["Go", "LLM's", "RAG", "Framework"],
        href: "https://github.com/singhJasvinder101/agentic-go"
    },
    {
        title: "LeetPush",
        desc: "A Chrome extension that allows users to version control their LeetCode solutions by pushing them to a GitHub repository with single click",
        tags: ["React", "Node.js", "Github API", "Chrome Extension"],
        href: "https://github.com/singhJasvinder101/leetpush"
    }
];

/* Blog post bodies are now markdown strings — supports headings (##),
   bold/italic, inline code, fenced code blocks (```lang), images (![alt](url)),
   links, blockquotes (>), and unordered lists (-). See parseMarkdown() below. */
export const POSTS = [
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

export const CODE_KEYWORDS = [
    "func", "package", "import", "return", "if", "else", "for", "range", "var", "const", "type",
    "struct", "interface", "map", "chan", "go", "defer", "switch", "case", "break", "continue",
    "nil", "true", "false", "def", "class", "from", "as", "with", "async", "await", "try", "except",
    "finally", "lambda", "yield", "pass", "elif", "while", "in", "is", "not", "and", "or",
    "None", "True", "False", "function", "let", "extends", "new", "this", "export", "default"
];
export const KEYWORD_PATTERN = new RegExp(`\\b(${CODE_KEYWORDS.join("|")})\\b`);
export const TOKEN_PATTERN = new RegExp(
    `(//.*$|#.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|${KEYWORD_PATTERN.source}`
);
