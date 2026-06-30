import { useState } from "react";

export default function Nav({ goHomeSection, goBlogList, goHomeTop }) {
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
