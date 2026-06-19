"use client";
import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── The capabilities, named ─────────────────────────────────────────────────
// Marks per system come from research.md §5. The bar counts below are computed
// from THIS table, so "15 built-in" is provable row-by-row — not a loose claim.
type Mark = "full" | "partial" | "none";

const COLS = ["Claude Code", "Copilot", "Cursor", "AGENTS.md", "Spec Kit", "SLC"];
const SLC_I = COLS.length - 1;

const LOGO: Record<string, string | null> = {
  "Claude Code": "/logos/claude-code.svg",
  "Copilot": "/logos/github-copilot.svg",
  "Cursor": "/logos/cursor.svg",
  "AGENTS.md": null,
  "Spec Kit": "/logos/speckit.webp",
  "SLC": null,
};
const BAR_NAME: Record<string, string> = { Copilot: "GitHub Copilot" };

const GROUPS: { title: string; rows: { cap: string; v: Mark[] }[] }[] = [
  {
    title: "Spec structure",
    rows: [
      { cap: "Typed, machine-parseable block grammar", v: ["none", "none", "partial", "none", "partial", "full"] },
      { cap: "Explicit per-item priority", v: ["none", "none", "partial", "none", "partial", "full"] },
      { cap: "Separate ARCH / CONTRACT / TASKS artifacts", v: ["none", "none", "none", "none", "full", "full"] },
      { cap: "Single source of truth for task status", v: ["partial", "none", "none", "none", "partial", "full"] },
    ],
  },
  {
    title: "Dependencies & determinism",
    rows: [
      { cap: "Dependency graph (depends_on)", v: ["none", "none", "none", "none", "partial", "full"] },
      { cap: "Mandatory read-order routing", v: ["none", "none", "none", "partial", "partial", "full"] },
      { cap: "Conflict-authority hierarchy", v: ["none", "none", "none", "partial", "partial", "full"] },
      { cap: "Frontend derives from backend contract", v: ["none", "none", "none", "none", "none", "full"] },
    ],
  },
  {
    title: "Context economy",
    rows: [
      { cap: "Context tiering (HOT / WARM / COLD)", v: ["partial", "partial", "partial", "none", "partial", "full"] },
      { cap: "File-split protocol with index", v: ["none", "none", "partial", "partial", "partial", "full"] },
      { cap: "Live-docs freshness rule (MCP)", v: ["partial", "partial", "partial", "none", "none", "full"] },
      { cap: "Anti-hallucination memory anchor", v: ["partial", "partial", "partial", "partial", "full", "full"] },
    ],
  },
  {
    title: "Integrity & safety",
    rows: [
      { cap: "Mandatory security-redaction law", v: ["none", "none", "none", "none", "none", "full"] },
      { cap: "Hash / version drift detection", v: ["none", "none", "none", "none", "none", "full"] },
      { cap: "Structured diagnostics / error codes", v: ["none", "none", "none", "none", "partial", "full"] },
    ],
  },
];

const ROWS = GROUPS.flatMap((g) => g.rows);
const TOTAL = ROWS.length;
const COUNTS = COLS.map((_, ci) => ROWS.filter((r) => r.v[ci] === "full").length);

const MARK: Record<Mark, { glyph: string; color: string }> = {
  full:    { glyph: "●", color: "#FF4500" },
  partial: { glyph: "◐", color: "#C8862C" },
  none:    { glyph: "–", color: "#3A3A3A" },
};

// Bars, sorted so SLC leads.
const BARS = COLS
  .map((name, i) => ({ name, count: COUNTS[i], slc: i === SLC_I }))
  .sort((a, b) => b.count - a.count);

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cm-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".cm-bar-fill").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.0, delay: 0.15 + i * 0.09, ease: "power3.out",
            scrollTrigger: { trigger: ".cm-chart", start: "top 80%", once: true },
          }
        );
      });
      gsap.utils.toArray<HTMLElement>(".cm-trow").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 12 },
          {
            opacity: 1, y: 0, duration: 0.4,
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="compare"
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid #1A1A1A",
        padding: "clamp(96px, 12vw, 140px) clamp(16px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Heading */}
        <p
          className="cm-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-mono)", fontSize: "0.8rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#FF4500", marginBottom: "24px",
          }}
        >
          SLC vs the Field
        </p>
        <h2
          className="cm-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 200,
            fontSize: "clamp(2rem, 4.4vw, 3.4rem)", letterSpacing: "-0.04em",
            color: "#F0EEE9", lineHeight: 1.06, margin: "0 0 20px", maxWidth: "18em",
          }}
        >
          Every other system leaves it to the agent.{" "}
          <span style={{ color: "#FF4500" }}>SLC builds it into the framework.</span>
        </h2>
        <p
          className="cm-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", color: "#8A8A8A",
            lineHeight: 1.6, margin: "0 0 clamp(40px, 5vw, 56px)", maxWidth: "44em",
          }}
        >
          {TOTAL} capabilities that make an AI build deterministically instead of guessing. Below:
          which are <em style={{ color: "#C8C4BC", fontStyle: "normal" }}>built into</em> each system,
          which are partial, which are missing entirely.
        </p>

        {/* ── Bar summary (counts computed from the matrix below) ── */}
        <div className="cm-chart">
          {BARS.map((b) => {
            const pct = (b.count / TOTAL) * 100;
            return (
              <div className={`cm-brow ${b.slc ? "cm-brow-slc" : ""}`} key={b.name}>
                <div className="cm-blabel">
                  {LOGO[b.name] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="cm-blogo" src={LOGO[b.name] as string} alt={b.name} loading="lazy" />
                  ) : (
                    <span className={`cm-bmark ${b.slc ? "cm-bmark-slc" : ""}`}>{b.slc ? "[SLC]" : "▦"}</span>
                  )}
                  <span className="cm-bname">{BAR_NAME[b.name] ?? b.name}</span>
                </div>
                <div className="cm-btrack">
                  <div className="cm-bar-fill" style={{ width: `${pct}%`, background: b.slc ? "#FF4500" : "#33312E" }} />
                </div>
                <div className={`cm-bcount ${b.slc ? "cm-bcount-slc" : ""}`}>
                  {b.count}<span className="cm-bcount-total">/{TOTAL}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="cm-reveal cm-legend">
          {(["full", "partial", "none"] as Mark[]).map((m) => (
            <span key={m} className="cm-leg-item">
              <span style={{ color: MARK[m].color }}>{MARK[m].glyph}</span>
              <span className="cm-leg-text">
                {m === "full" ? "Built in" : m === "partial" ? "Partial / by convention" : "Absent"}
              </span>
            </span>
          ))}
        </div>

        {/* ── The detailed matrix — the actual points ── */}
        <div className="cm-reveal cm-table-wrap">
          <table className="cm-table">
            <thead>
              <tr>
                <th className="cm-cap-head" />
                {COLS.map((c, i) => (
                  <th key={c} className={`cm-col-head ${i === SLC_I ? "cm-slc" : ""}`}>
                    <span className="cm-col-head-inner">
                      {LOGO[c] && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img className="cm-hlogo" src={LOGO[c] as string} alt="" aria-hidden loading="lazy" />
                      )}
                      <span>{c}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => (
                <Fragment key={g.title}>
                  <tr className="cm-group-row">
                    <td className="cm-group" colSpan={COLS.length + 1}>{g.title}</td>
                  </tr>
                  {g.rows.map((row) => (
                    <tr key={row.cap} className="cm-trow">
                      <td className="cm-cap">{row.cap}</td>
                      {row.v.map((m, i) => (
                        <td key={i} className={`cm-cell ${i === SLC_I ? "cm-slc" : ""}`}>
                          <span style={{ color: MARK[m].color }}>{MARK[m].glyph}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
              {/* Total row */}
              <tr className="cm-total-row">
                <td className="cm-cap cm-total-label">Built in</td>
                {COUNTS.map((n, i) => (
                  <td key={i} className={`cm-cell cm-total ${i === SLC_I ? "cm-slc" : ""}`}>{n}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verdict */}
        <p
          className="cm-reveal"
          style={{
            opacity: 0,
            paddingTop: "clamp(28px, 3vw, 40px)",
            borderTop: "1px solid #1A1A1A",
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(1.05rem, 1.7vw, 1.45rem)", color: "#C8C4BC",
            lineHeight: 1.5, margin: "clamp(40px, 5vw, 56px) 0 0", maxWidth: "36em",
          }}
        >
          {COUNTS[SLC_I]} of {TOTAL}, built in. The nearest rival manages {Math.max(...COUNTS.filter((_, i) => i !== SLC_I))}.{" "}
          <span style={{ color: "#F0EEE9" }}>On structure, SLC isn&apos;t ahead of the field — it&apos;s
          a different category.</span>
        </p>
      </div>

      <style>{`
        /* ── Bars ── */
        .cm-chart { display: flex; flex-direction: column; gap: clamp(12px, 1.6vw, 18px); margin-bottom: clamp(28px, 3.5vw, 44px); }
        .cm-brow { display: grid; grid-template-columns: clamp(120px, 16vw, 188px) 1fr clamp(46px, 6vw, 70px); align-items: center; gap: clamp(12px, 2vw, 24px); }
        .cm-blabel { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .cm-blogo { height: 20px; width: auto; max-width: 26px; object-fit: contain; flex: none; }
        .cm-bmark { font-family: var(--font-mono); font-size: 0.85rem; color: #555; width: 26px; text-align: center; flex: none; }
        .cm-bmark-slc { color: #FF4500; font-weight: 700; font-size: 0.7rem; width: auto; }
        .cm-bname { font-family: var(--font-display); font-size: clamp(0.8rem, 1.2vw, 0.98rem); color: #B8B5AE; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cm-brow-slc .cm-bname { display: none; }
        .cm-btrack { position: relative; height: 11px; background: #161514; border: 1px solid #211F1D; overflow: hidden; }
        .cm-brow-slc .cm-btrack { height: 17px; }
        .cm-bar-fill { position: absolute; left: 0; top: 0; bottom: 0; transform-origin: left center; will-change: transform; }
        .cm-brow-slc .cm-bar-fill { box-shadow: 0 0 24px rgba(255,69,0,0.45); }
        .cm-bcount { font-family: var(--font-display); font-weight: 300; font-size: clamp(0.95rem, 1.4vw, 1.25rem); color: #6E6B66; text-align: right; white-space: nowrap; }
        .cm-bcount-total { font-size: 0.6em; color: #444; }
        .cm-bcount-slc { color: #FF4500; font-weight: 500; }
        .cm-bcount-slc .cm-bcount-total { color: rgba(255,69,0,0.4); }

        /* ── Legend ── */
        .cm-legend { opacity: 0; display: flex; gap: 22px; flex-wrap: wrap; margin: 0 0 22px; }
        .cm-leg-item { display: inline-flex; align-items: center; gap: 8px; }
        .cm-leg-text { font-family: var(--font-mono); font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase; color: #666; }

        /* ── Matrix ── */
        .cm-table-wrap { opacity: 0; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .cm-table { width: 100%; min-width: 760px; border-collapse: collapse; font-family: var(--font-display); }
        .cm-cap-head { width: 36%; }
        .cm-col-head { padding: 0 8px 16px; vertical-align: bottom; }
        .cm-col-head-inner { display: flex; flex-direction: column; align-items: center; gap: 7px; font-family: var(--font-mono); font-size: clamp(0.58rem, 0.95vw, 0.7rem); font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #888; white-space: nowrap; }
        .cm-hlogo { height: 20px; width: auto; max-width: 24px; object-fit: contain; }
        .cm-col-head.cm-slc .cm-col-head-inner { color: #FF4500; font-weight: 700; }

        .cm-group-row td { padding: 22px 0 8px; }
        .cm-group { font-family: var(--font-mono); font-size: 0.64rem; letter-spacing: 0.18em; text-transform: uppercase; color: #FF4500; border-bottom: 1px solid #211F1D; }

        .cm-cap { font-size: clamp(0.82rem, 1.15vw, 0.98rem); font-weight: 400; color: #C8C4BC; padding: 13px 18px 13px 0; border-top: 1px solid #161616; }
        .cm-cell { text-align: center; font-size: 1.02rem; padding: 13px 8px; border-top: 1px solid #161616; }
        .cm-cell.cm-slc, .cm-col-head.cm-slc { background: rgba(255, 69, 0, 0.06); }

        .cm-total-row .cm-cap, .cm-total-row .cm-cell { border-top: 1px solid #2A2A2A; padding-top: 18px; }
        .cm-total { font-family: var(--font-display); font-weight: 300; font-size: clamp(1rem, 1.6vw, 1.4rem); color: #9A9A9A; }
        .cm-total.cm-slc { color: #FF4500; font-weight: 600; }
        .cm-total-label { font-family: var(--font-mono); font-size: 0.64rem !important; letter-spacing: 0.12em; text-transform: uppercase; color: #666 !important; }

        @media (max-width: 560px) {
          .cm-brow { grid-template-columns: clamp(92px, 30vw, 130px) 1fr 40px; gap: 10px; }
          .cm-blogo { height: 17px; max-width: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cm-reveal, .cm-trow { opacity: 1 !important; transform: none !important; }
          .cm-bar-fill { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
