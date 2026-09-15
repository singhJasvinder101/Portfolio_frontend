"use client";

import { useState } from "react";
import Link from "next/link";

export default function Nav() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <header className="nav">
            <div className="nav-inner">
                <Link className="nav-logo" href="/" onClick={close}>
                    jas<span>@</span>portfolio:~$
                </Link>
                <button
                    className="nav-toggle"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                >
                    menu
                </button>
                <ul className={`nav-links ${open ? "open" : ""}`}>
                    <li><Link href="/#about" onClick={close}>~/about</Link></li>
                    <li><Link href="/#stack" onClick={close}>~/stack</Link></li>
                    <li><Link href="/#projects" onClick={close}>~/projects</Link></li>
                    <li><Link href="/blog" onClick={close}>~/blog</Link></li>
                    <li><Link href="/#contact" onClick={close}>~/contact</Link></li>
                </ul>
            </div>
        </header>
    );
}
