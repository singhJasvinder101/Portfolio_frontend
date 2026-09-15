
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

import CodeBlock from "./CodeBlock";

export default function MarkdownContent({ md }) {
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
