"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Head-to-head data (from research.md §5 capability matrix + §6 scores) ────
type Mark = "full" | "partial" | "none";

const COLS = ["Claude Code", "Copilot", "Cursor", "AGENTS.md", "Spec Kit", "SLC"];

const ROWS: { cap: string; v: Mark[] }[] = [
  { cap: "Machine-parseable block grammar", v: ["none", "none", "partial", "none", "partial", "full"] },
  { cap: "Dependency graph (depends_on)",   v: ["none", "none", "none", "none", "partial", "full"] },
  { cap: "Context tiering (HOT/WARM/COLD)",  v: ["partial", "partial", "partial", "none", "partial", "full"] },
  { cap: "File-split protocol with index",   v: ["none", "none", "partial", "partial", "partial", "full"] },
  { cap: "Frontend derives from backend",    v: ["none", "none", "none", "none", "none", "full"] },
  { cap: "Mandatory security-redaction law", v: ["none", "none", "none", "none", "none", "full"] },
  { cap: "Hash / version drift detection",   v: ["none", "none", "none", "none", "none", "full"] },
  { cap: "Conflict-authority hierarchy",     v: ["none", "none", "none", "partial", "partial", "full"] },
];

// Weighted totals (/5) — research.md §6.
const SCORES = ["3.3", "3.2", "3.3", "2.6", "3.5", "4.0"];

const MARK: Record<Mark, { glyph: string; color: string }> = {
  full:    { glyph: "●", color: "#FF4500" },
  partial: { glyph: "◐", color: "#C8862C" },
  none:    { glyph: "–", color: "#3A3A3A" },
};

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
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".cm-row").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0, duration: 0.4, delay: i * 0.04,
            scrollTrigger: { trigger: ".cm-table-wrap", start: "top 85%", once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const isSLC = (i: number) => i === COLS.length - 1;

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
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
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
          <span style={{ color: "#FF4500" }}>SLC writes it into the format.</span>
        </h2>
        <p
          className="cm-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", color: "#8A8A8A",
            lineHeight: 1.6, margin: "0 0 14px", maxWidth: "42em",
          }}
        >
          The same capabilities every other tool hopes the model will improvise — SLC encodes them
          as a contract a parser can check.
        </p>

        {/* Legend */}
        <div
          className="cm-reveal"
          style={{ opacity: 0, display: "flex", gap: "20px", flexWrap: "wrap", margin: "0 0 28px" }}
        >
          {(["full", "partial", "none"] as Mark[]).map((m) => (
            <span key={m} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: MARK[m].color, fontSize: "0.9rem" }}>{MARK[m].glyph}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#666" }}>
                {m === "full" ? "Built-in" : m === "partial" ? "Partial / convention" : "Absent"}
              </span>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="cm-reveal cm-table-wrap" style={{ opacity: 0 }}>
          <table className="cm-table">
            <thead>
              <tr>
                <th className="cm-cap-head" />
                {COLS.map((c, i) => (
                  <th key={c} className={`cm-col-head ${isSLC(i) ? "cm-slc" : ""}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.cap} className="cm-row">
                  <td className="cm-cap">{row.cap}</td>
                  {row.v.map((m, i) => (
                    <td key={i} className={`cm-cell ${isSLC(i) ? "cm-slc" : ""}`}>
                      <span style={{ color: MARK[m].color }}>{MARK[m].glyph}</span>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Score row */}
              <tr className="cm-row cm-score-row">
                <td className="cm-cap cm-score-label">Weighted score · /5</td>
                {SCORES.map((s, i) => (
                  <td key={i} className={`cm-cell cm-score ${isSLC(i) ? "cm-slc" : ""}`}>
                    {s}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verdict */}
        <div
          className="cm-reveal"
          style={{
            opacity: 0,
            marginTop: "clamp(44px, 5vw, 64px)",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(18px, 3vw, 40px)",
            alignItems: "start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)", fontWeight: 200,
              fontSize: "clamp(2.6rem, 6vw, 4.4rem)", color: "#FF4500",
              letterSpacing: "-0.04em", lineHeight: 0.9,
            }}
          >
            4.0
          </span>
          <p
            style={{
              fontFamily: "var(--font-display)", fontWeight: 300,
              fontSize: "clamp(1.05rem, 1.7vw, 1.45rem)", color: "#C8C4BC",
              lineHeight: 1.5, margin: 0, maxWidth: "32em",
            }}
          >
            On architecture, SLC leads — measurably. The gap was never the design; it was the tooling
            and the install base. <span style={{ color: "#F0EEE9" }}>That&apos;s what the package
            ships next.</span>
          </p>
        </div>
      </div>

      <style>{`
        .cm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .cm-table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
          font-family: var(--font-display);
        }
        .cm-col-head {
          font-family: var(--font-mono);
          font-size: clamp(0.6rem, 1vw, 0.72rem);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #888;
          text-align: center;
          padding: 0 10px 18px;
          vertical-align: bottom;
          white-space: nowrap;
        }
        .cm-cap-head { width: 38%; }
        .cm-cap {
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          font-weight: 400;
          color: #D8D4CC;
          padding: 16px 18px 16px 0;
          border-top: 1px solid #1A1A1A;
        }
        .cm-cell {
          text-align: center;
          font-size: 1.05rem;
          padding: 16px 10px;
          border-top: 1px solid #1A1A1A;
        }
        /* SLC column emphasis */
        .cm-col-head.cm-slc {
          color: #FF4500;
          font-weight: 700;
          font-size: clamp(0.72rem, 1.2vw, 0.9rem);
        }
        .cm-cell.cm-slc, .cm-col-head.cm-slc {
          background: rgba(255, 69, 0, 0.06);
        }
        .cm-table tbody tr:first-child .cm-cell.cm-slc { box-shadow: inset 0 1px 0 rgba(255,69,0,0.25); }

        .cm-score-row .cm-cap, .cm-score-row .cm-cell { border-top: 1px solid #2A2A2A; padding-top: 22px; }
        .cm-score {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(1.1rem, 1.8vw, 1.5rem);
          color: #9A9A9A;
          letter-spacing: -0.02em;
        }
        .cm-score-label {
          font-family: var(--font-mono);
          font-size: 0.66rem !important;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #666 !important;
        }
        .cm-score.cm-slc { color: #FF4500; font-weight: 500; }

        @media (prefers-reduced-motion: reduce) {
          .cm-reveal, .cm-row { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
