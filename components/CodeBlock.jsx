import { TOKEN_PATTERN } from "@/lib/constants";

export default function CodeBlock({ code, lang }) {
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
                                " "
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


function tokenizeCodeLine(line) {
    if (line.trim() === "") return [];
    const parts = [];
    let remaining = line;

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
