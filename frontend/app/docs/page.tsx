"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SECTIONS, UI, type Block, type Lang } from "./docs-content";

const ORANGE = "#FF4500";
const ORANGE_SOFT = "#FF6B33";

const TONE: Record<string, { bar: string; bg: string }> = {
  tip: { bar: ORANGE_SOFT, bg: "rgba(255,107,51,0.07)" },
  warn: { bar: "#E0533A", bg: "rgba(224,83,58,0.08)" },
  info: { bar: "#6B86A8", bg: "rgba(107,134,168,0.08)" },
};

function CodeBlock({ block }: { block: Extract<Block, { t: "code" }> }) {
  return (
    <div className="docs-code" dir="ltr">
      {block.lang && <span className="docs-code-lang">{block.lang}</span>}
      <pre>
        <code>{block.code}</code>
      </pre>
    </div>
  );
}

function BlockView({ block, lang }: { block: Block; lang: Lang }) {
  switch (block.t) {
    case "p":
      return <p className="docs-p">{block[lang]}</p>;
    case "h3":
      return <h3 className="docs-h3">{block[lang]}</h3>;
    case "ul":
      return (
        <ul className="docs-list">
          {block[lang].map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="docs-list docs-list-ol">
          {block[lang].map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case "code":
      return <CodeBlock block={block} />;
    case "callout":
      return (
        <div
          className="docs-callout"
          style={{ borderInlineStartColor: TONE[block.tone].bar, background: TONE[block.tone].bg }}
        >
          {block[lang]}
        </div>
      );
  }
}

export default function DocsPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [active, setActive] = useState(SECTIONS[0].id);
  const mainRef = useRef<HTMLDivElement>(null);

  // Restore saved language (client-only; must run in an effect to stay
  // hydration-safe — localStorage isn't available during SSR).
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("slc-docs-lang") : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing a persisted preference from localStorage
    if (saved === "en" || saved === "ur") setLang(saved);
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      window.localStorage.setItem("slc-docs-lang", l);
    } catch {}
  };

  // Scrollspy
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -75% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ur = lang === "ur";

  return (
    <div className="docs-root">
      {/* Top bar */}
      <header className="docs-topbar">
        <div className="docs-topbar-inner">
          <Link href="/" className="docs-back">
            <span aria-hidden>&larr;</span>
            <span className="docs-back-text">{UI.back[lang]}</span>
          </Link>
          <div className="docs-brand">
            <span className="docs-brand-slc">[SLC]</span>
            <span className="docs-brand-sep" />
            <span className="docs-brand-docs">DOCS</span>
          </div>
          <div className="docs-lang" role="group" aria-label={UI.langLabel[lang]}>
            <button
              className={`docs-lang-btn ${!ur ? "is-active" : ""}`}
              onClick={() => changeLang("en")}
              aria-pressed={!ur}
            >
              English
            </button>
            <button
              className={`docs-lang-btn docs-lang-ur ${ur ? "is-active" : ""}`}
              onClick={() => changeLang("ur")}
              aria-pressed={ur}
            >
              اردو
            </button>
          </div>
        </div>
      </header>

      <div className="docs-shell">
        {/* Sidebar */}
        <aside className="docs-side">
          <p className="docs-side-label" dir={ur ? "rtl" : "ltr"}>
            {UI.onThisPage[lang]}
          </p>
          <nav>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`docs-side-link ${active === s.id ? "is-active" : ""}`}
                dir={ur ? "rtl" : "ltr"}
              >
                <span className="docs-side-num">{s.num}</span>
                <span className={ur ? "docs-ur-text" : ""}>{s.title[lang]}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className={`docs-main ${ur ? "docs-ur" : ""}`} ref={mainRef} dir={ur ? "rtl" : "ltr"}>
          <div className="docs-hero">
            <p className="docs-eyebrow">{UI.eyebrow[lang]}</p>
            <h1 className="docs-title">{UI.title[lang]}</h1>
            <p className="docs-subtitle">{UI.subtitle[lang]}</p>
          </div>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="docs-section">
              <div className="docs-section-head">
                <span className="docs-section-num">{s.num}</span>
                <h2 className="docs-section-title">{s.title[lang]}</h2>
              </div>
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} lang={lang} />
              ))}
            </section>
          ))}

          <footer className="docs-foot">
            <div className="docs-foot-line" />
            <p>{UI.footer[lang]}</p>
            <Link href="/" className="docs-back">
              <span aria-hidden>&larr;</span>
              <span>{UI.back[lang]}</span>
            </Link>
          </footer>
        </main>
      </div>

      <style>{`
        .docs-root {
          min-height: 100vh;
          background:
            radial-gradient(120% 60% at 50% 0%, rgba(255,69,0,0.10) 0%, transparent 45%),
            #0A0A0A;
          color: #E8E5DF;
        }

        /* ── Top bar ── */
        .docs-topbar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(10,10,10,0.86);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #1A1A1A;
        }
        .docs-topbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 14px clamp(16px, 4vw, 40px);
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .docs-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: #9A958C; text-decoration: none;
          transition: color 0.2s ease;
        }
        .docs-back:hover { color: ${ORANGE_SOFT}; }
        .docs-brand { display: flex; align-items: center; gap: 10px; }
        .docs-brand-slc { font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.18em; color: ${ORANGE}; }
        .docs-brand-sep { width: 1px; height: 13px; background: #333; }
        .docs-brand-docs { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.22em; color: #8C887F; }
        .docs-lang { display: inline-flex; background: #141414; border: 1px solid #232323; border-radius: 999px; padding: 3px; }
        .docs-lang-btn {
          font-family: var(--font-sans); font-size: 0.74rem; font-weight: 600;
          color: #9A958C; background: transparent; border: none; cursor: pointer;
          padding: 6px 14px; border-radius: 999px; transition: color 0.2s, background 0.2s;
        }
        .docs-lang-ur { font-family: var(--font-urdu); font-size: 0.92rem; line-height: 1; }
        .docs-lang-btn.is-active { color: #0A0A0A; background: ${ORANGE}; }
        .docs-lang-btn:not(.is-active):hover { color: #E8E5DF; }

        /* ── Shell ── */
        .docs-shell {
          max-width: 1200px; margin: 0 auto;
          padding: clamp(28px, 4vw, 56px) clamp(16px, 4vw, 40px) 96px;
          display: grid; grid-template-columns: 230px minmax(0, 1fr);
          gap: clamp(28px, 5vw, 72px); align-items: start;
        }
        .docs-side { position: sticky; top: 96px; }
        .docs-side-label {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #5F5B53; margin: 0 0 16px;
        }
        .docs-side-link {
          display: flex; align-items: baseline; gap: 10px;
          padding: 7px 12px; border-radius: 8px; text-decoration: none;
          font-family: var(--font-sans); font-size: 0.86rem; color: #9A958C;
          border-inline-start: 2px solid transparent; transition: color 0.18s, background 0.18s, border-color 0.18s;
          line-height: 1.4;
        }
        .docs-side-link:hover { color: #E8E5DF; background: rgba(255,255,255,0.03); }
        .docs-side-link.is-active { color: ${ORANGE_SOFT}; border-inline-start-color: ${ORANGE}; background: rgba(255,69,0,0.06); }
        .docs-side-num { font-family: var(--font-mono); font-size: 0.6rem; color: #5F5B53; flex-shrink: 0; }
        .docs-side-link.is-active .docs-side-num { color: ${ORANGE}; }
        .docs-ur-text { font-family: var(--font-urdu); font-size: 1.02rem; }

        /* ── Content ── */
        .docs-main { min-width: 0; max-width: 760px; }
        .docs-hero { padding-bottom: 40px; margin-bottom: 40px; border-bottom: 1px solid #1A1A1A; }
        .docs-eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.24em; text-transform: uppercase; color: ${ORANGE_SOFT}; margin: 0 0 18px; }
        .docs-title { font-family: var(--font-display); font-weight: 200; font-size: clamp(2.4rem, 6vw, 4rem); letter-spacing: -0.04em; line-height: 1.05; color: #F7F2EA; margin: 0 0 18px; }
        .docs-subtitle { font-family: var(--font-display); font-weight: 300; font-size: clamp(1rem, 1.7vw, 1.2rem); line-height: 1.7; color: #9A958C; margin: 0; max-width: 620px; }

        .docs-section { scroll-margin-top: 90px; padding: clamp(34px, 5vw, 56px) 0; border-bottom: 1px solid #161616; }
        .docs-section:last-of-type { border-bottom: none; }
        .docs-section-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 24px; }
        .docs-section-num { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em; color: ${ORANGE}; flex-shrink: 0; }
        .docs-section-title { font-family: var(--font-display); font-weight: 300; font-size: clamp(1.7rem, 3.4vw, 2.4rem); letter-spacing: -0.03em; color: #F5F0E8; margin: 0; line-height: 1.1; }

        .docs-p { font-family: var(--font-display); font-weight: 300; font-size: 1.02rem; line-height: 1.75; color: #C8C4BC; margin: 0 0 18px; }
        .docs-h3 { font-family: var(--font-display); font-weight: 500; font-size: 1.18rem; color: #F0EBE2; margin: 30px 0 14px; letter-spacing: -0.01em; }
        .docs-list { margin: 0 0 18px; padding-inline-start: 1.3em; display: flex; flex-direction: column; gap: 10px; }
        .docs-list li { font-family: var(--font-display); font-weight: 300; font-size: 1.0rem; line-height: 1.7; color: #C8C4BC; }
        .docs-list li::marker { color: ${ORANGE_SOFT}; }
        .docs-list-ol li::marker { font-family: var(--font-mono); font-size: 0.85em; }

        .docs-callout {
          border-inline-start: 3px solid ${ORANGE_SOFT};
          padding: 16px 18px; border-radius: 8px; margin: 6px 0 22px;
          font-family: var(--font-display); font-weight: 300; font-size: 0.98rem; line-height: 1.65; color: #D6D1C8;
        }

        .docs-code {
          position: relative; margin: 6px 0 22px;
          background: #0C0C0C; border: 1px solid #1C1C1C; border-radius: 10px; overflow: hidden;
        }
        .docs-code-lang {
          position: absolute; top: 0; right: 0;
          font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: #5F5B53; padding: 7px 12px;
        }
        .docs-code pre { margin: 0; padding: 18px 18px; overflow-x: auto; }
        .docs-code code { font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.7; color: #C7D0C2; white-space: pre; }

        .docs-foot { padding-top: 40px; display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
        .docs-foot-line { width: 100%; height: 1px; background: #1A1A1A; }
        .docs-foot p { font-family: var(--font-display); font-weight: 300; font-size: 0.95rem; color: #6B6B73; margin: 0; }

        /* ── Urdu (RTL) prose ── */
        .docs-ur .docs-p,
        .docs-ur .docs-list li,
        .docs-ur .docs-callout,
        .docs-ur .docs-subtitle { font-family: var(--font-urdu); line-height: 2.15; font-weight: 400; }
        .docs-ur .docs-h3,
        .docs-ur .docs-section-title { font-family: var(--font-urdu); line-height: 1.8; font-weight: 500; }
        .docs-ur .docs-p { font-size: 0.98rem; }
        .docs-ur .docs-list li { font-size: 0.96rem; }
        /* Code is always left-to-right, even in Urdu mode */
        .docs-ur .docs-code code { font-family: var(--font-mono); line-height: 1.7; }

        /* ── Mobile ── */
        @media (max-width: 920px) {
          .docs-shell { grid-template-columns: 1fr; }
          .docs-side { display: none; }
        }
        @media (max-width: 520px) {
          .docs-back-text { display: none; }
        }
      `}</style>
    </div>
  );
}
