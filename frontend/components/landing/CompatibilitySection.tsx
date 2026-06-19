"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Providers SLC runs inside ───────────────────────────────────────────────
// Logos live in /public/logos (served from origin so the strict CSP is happy).
// Each is rendered as [icon] + [name] so every entry is labelled consistently.
type Provider = { name: string; src: string };

const PROVIDERS: Provider[] = [
  { name: "Claude Code",    src: "/logos/claude-code.svg" },
  { name: "Cursor",         src: "/logos/cursor.svg" },
  { name: "GitHub Copilot", src: "/logos/github-copilot.svg" },
  { name: "Codex",          src: "/logos/codex.svg" },
  { name: "Antigravity",    src: "/logos/antigravity-icon.svg" },
];

// One marquee "half" — repeated so the track is wider than any viewport, then
// the whole half is duplicated for a seamless -50% loop.
const HALF = [...PROVIDERS, ...PROVIDERS, ...PROVIDERS];

// The compatibility tiers (the honest caveat: raw chat LLMs lose MCP + automation).
const TIERS: { dot: string; label: string; desc: string }[] = [
  { dot: "#FF4500", label: "Full", desc: "Agentic + MCP — live docs, auto file-read, auto task execution." },
  { dot: "#C8862C", label: "Partial", desc: "Agentic, no MCP — full structure, but no live-docs freshness." },
  { dot: "#6B6B6B", label: "Basic", desc: "Raw chat LLM — paste the spec, keep every guarantee, lose MCP + automation." },
];

export default function CompatibilitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cmp-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const renderItem = (p: Provider, i: number, hidden = false) => (
    <div className="cmp-item" key={`${hidden ? "b" : "a"}-${i}`} aria-hidden={hidden}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="cmp-logo" src={p.src} alt={hidden ? "" : p.name} loading="lazy" />
      <span className="cmp-name">{p.name}</span>
    </div>
  );

  return (
    <section
      id="compatibility"
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A",
        padding: "clamp(72px, 10vw, 110px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Heading block (padded) */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 48px)" }}>
        <p
          className="cmp-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-mono)", fontSize: "0.8rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#FF4500", marginBottom: "24px",
          }}
        >
          Universal Compatibility
        </p>
        <h2
          className="cmp-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 200,
            fontSize: "clamp(1.9rem, 4vw, 3.2rem)", letterSpacing: "-0.035em",
            color: "#F0EEE9", lineHeight: 1.08, margin: "0 0 20px", maxWidth: "16em",
          }}
        >
          Not a tool you switch to.{" "}
          <span style={{ color: "#FF4500" }}>A format your agent already reads.</span>
        </h2>
        <p
          className="cmp-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", color: "#8A8A8A",
            lineHeight: 1.6, margin: 0, maxWidth: "40em",
          }}
        >
          SLC is plain spec files. Anything that can open a file can run it — and in agentic editors
          with MCP, it runs at full power.
        </p>
      </div>

      {/* Marquee (full-bleed) */}
      <div className="cmp-reveal cmp-marquee" style={{ opacity: 0, margin: "clamp(40px, 5vw, 64px) 0 clamp(36px, 5vw, 56px)" }}>
        <div className="cmp-track">
          {HALF.map((p, i) => renderItem(p, i))}
          {HALF.map((p, i) => renderItem(p, i, true))}
        </div>
        {/* Edge fades */}
        <div className="cmp-fade cmp-fade-l" aria-hidden />
        <div className="cmp-fade cmp-fade-r" aria-hidden />
      </div>

      {/* Tier legend (padded) */}
      <div
        className="cmp-reveal cmp-legend"
        style={{ opacity: 0, maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 48px)" }}
      >
        {TIERS.map((t) => (
          <div className="cmp-tier" key={t.label}>
            <span className="cmp-tier-dot" style={{ background: t.dot }} aria-hidden />
            <span className="cmp-tier-label">{t.label}</span>
            <span className="cmp-tier-desc">{t.desc}</span>
          </div>
        ))}
      </div>

      <style>{`
        .cmp-marquee { position: relative; width: 100%; overflow: hidden; }
        .cmp-track {
          display: flex;
          width: max-content;
          gap: clamp(40px, 6vw, 88px);
          padding: 0 clamp(20px, 3vw, 44px);
          animation: cmp-scroll 48s linear infinite;
        }
        .cmp-marquee:hover .cmp-track { animation-play-state: paused; }
        @keyframes cmp-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .cmp-item {
          display: flex; align-items: center; gap: 14px;
          flex: 0 0 auto; opacity: 0.78;
          transition: opacity 0.25s ease;
        }
        .cmp-marquee:hover .cmp-item { opacity: 0.5; }
        .cmp-marquee .cmp-item:hover { opacity: 1; }
        .cmp-logo {
          height: clamp(24px, 3.4vw, 32px); width: auto;
          max-width: 40px; object-fit: contain; display: block;
        }
        .cmp-name {
          font-family: var(--font-display); font-weight: 400;
          font-size: clamp(1rem, 1.7vw, 1.35rem); letter-spacing: -0.01em;
          color: #E8E5DE; white-space: nowrap;
        }

        .cmp-fade { position: absolute; top: 0; bottom: 0; width: clamp(40px, 8vw, 120px); pointer-events: none; z-index: 2; }
        .cmp-fade-l { left: 0;  background: linear-gradient(to right, #0A0A0A, transparent); }
        .cmp-fade-r { right: 0; background: linear-gradient(to left,  #0A0A0A, transparent); }

        .cmp-legend {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2.5vw, 36px);
        }
        .cmp-tier {
          display: grid;
          grid-template-columns: auto auto;
          align-items: center;
          gap: 8px 10px;
          padding-top: 18px;
          border-top: 1px solid #1C1C1C;
        }
        .cmp-tier-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
        .cmp-tier-label {
          font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; color: #F0EEE9;
        }
        .cmp-tier-desc {
          grid-column: 1 / 3;
          font-family: var(--font-display); font-weight: 300;
          font-size: 0.84rem; line-height: 1.5; color: #777;
        }

        @media (max-width: 720px) {
          .cmp-legend { grid-template-columns: 1fr; gap: 0; }
          .cmp-tier { padding: 16px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cmp-track { animation: none; }
          .cmp-marquee { overflow-x: auto; }
        }
      `}</style>
    </section>
  );
}
