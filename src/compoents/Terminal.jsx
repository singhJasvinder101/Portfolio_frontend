import { useState, useEffect, useRef } from "react";

export default function HeroTerminal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [doneLines, setDoneLines] = useState(() => reduceMotion ? HERO_LINES : []);
    const [typingIdx, setTypingIdx] = useState(() => reduceMotion ? HERO_LINES.length : 0);
    const [typingText, setTypingText] = useState("");
    const [finished, setFinished] = useState(reduceMotion);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (reduceMotion) {
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
    }, [reduceMotion]);

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

