"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── data ──────────────────────────────────────────────────────────────────────

const DUMP_LINES = [
  "Ok so here's the context for this session.",
  "We're building a Next.js 14 / TypeScript SaaS platform.",
  "Backend: FastAPI on Python 3.11, PostgreSQL.",
  "JWT auth — access token 30 min, refresh 7 days.",
  "Admin guard is separate from user auth middleware.",
  "User model: id, email, hashed_password,",
  "  is_verified, is_active, is_admin, timestamps.",
  "Downloads: pre-signed tokens, 15-min expiry.",
  "Users must verify email before downloading.",
  "Rate limiting: 100 req/min auth, 10 req/min tokens.",
  "SlowAPI + Redis. Never expose is_admin publicly.",
  "/api/admin routes live outside the main router.",
  "Don't modify migration files directly.",
  "Tailwind v4 syntax — bg-linear-to-b, not gradient.",
  "Oh and the constraint from session #44 still applies...",
  "  [52 more lines of decisions you re-paste every time]",
];

const SESSION_LINES: { t: "cmd" | "ok" | "sep" | "task" | "reply"; v: string }[] = [
  { t: "cmd",   v: "> read SPEC.md" },
  { t: "ok",    v: "  ✓  global router + read_order loaded" },
  { t: "cmd",   v: "> read MEMORY.md" },
  { t: "ok",    v: "  ✓  12 decisions anchored · drift protection active" },
  { t: "cmd",   v: "> read ARCH.md" },
  { t: "ok",    v: "  ✓  8 modules declared · boundaries clear" },
  { t: "sep",   v: "" },
  { t: "task",  v: '> "add the user profile endpoint"' },
  { t: "reply", v: "  → /routers/profile.py · ARCH §User module\n    existing auth guard · starting now" },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function TokenSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tok-headline",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true } }
      );
      gsap.fromTo(
        ".tok-left-panel",
        { opacity: 0, x: -36 },
        { opacity: 1, x: 0, duration: 0.65, delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true } }
      );
      gsap.fromTo(
        ".tok-right-panel",
        { opacity: 0, x: 36 },
        { opacity: 1, x: 0, duration: 0.65, delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true } }
      );
      gsap.fromTo(
        ".slc-line",
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, delay: 0.35,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true } }
      );
      gsap.fromTo(
        ".tok-stat",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1,
          scrollTrigger: { trigger: ".tok-stats-strip", start: "top bottom", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="tokens"
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        padding: "120px clamp(16px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .tok-panels { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Ghost watermark */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "-0.15em", right: "-0.02em",
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(8rem, 22vw, 26rem)", color: "rgba(255,69,0,0.03)",
          letterSpacing: "-0.06em", lineHeight: 1,
          userSelect: "none", pointerEvents: "none",
        }}
      >
        90%
      </span>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Label */}
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "0.8rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#FF4500", marginBottom: "40px",
        }}>
          The Math
        </p>

        {/* Headline */}
        <p
          className="tok-headline"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 200,
            fontSize: "clamp(1.8rem, 4vw, 3.2rem)", letterSpacing: "-0.03em",
            color: "#F0EEE9", lineHeight: 1.1,
            marginBottom: "64px", maxWidth: "620px",
          }}
        >
          Most of your context window is context{" "}
          <span style={{ color: "#FF4500" }}>you've already explained.</span>
        </p>

        {/* ── Split terminal panels ─────────────────────────────────── */}
        <div
          className="tok-panels"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >

          {/* LEFT — Without SLC ───────────────────────── */}
          <div
            className="tok-left-panel relative overflow-hidden opacity-0"
            style={{ background: "linear-gradient(160deg, #0F0808 0%, #0A0A0A 100%)", border: "1px solid #1A1A1A", borderRadius: "4px", padding: "3.5rem" }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-7">
              <div className="w-2 h-2 rounded-full bg-red-500/70 shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-[#555]">
                Session #47 · Without SLC
              </span>
            </div>

            {/* Context dump */}
            <div className="relative min-h-60">
              <div className="font-mono text-xs leading-7 text-[#3E3E3E]">
                {DUMP_LINES.map((line, i) => (
                  <div
                    key={i}
                    className={
                      i === DUMP_LINES.length - 1
                        ? "text-red-500/55"
                        : i === 0
                        ? "text-[#555]"
                        : "text-[#3A3A3A]"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
              {/* Fade bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-18 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, #0F0808)" }}
              />
            </div>

            {/* Token cost badge */}
            <div className="mt-7 pt-5 border-t border-red-500/8">
              <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-[#333]">
                setup cost
              </p>
              <p
                className="font-display font-thin tracking-[-0.04em] text-red-500/45 leading-none mt-1.5"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                ~8,200
              </p>
              <p className="font-mono text-[0.65rem] text-[#2E2E2E] mt-1.5">
                tokens · before you write a single line of code
              </p>
            </div>
          </div>

          {/* RIGHT — With SLC ────────────────────────── */}
          <div
            className="tok-right-panel opacity-0"
            style={{ background: "#070707", border: "1px solid #1A1A1A", borderRadius: "4px", padding: "3.5rem" }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-7">
              <div className="w-2 h-2 rounded-full bg-[#FF4500] shrink-0" />
              <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-[#555]">
                Every session · With SLC
              </span>
            </div>

            {/* Session lines */}
            <div className="font-mono text-xs leading-[1.9] min-h-60">
              {SESSION_LINES.map((line, i) => {
                if (line.t === "sep") return <div key={i} className="h-2.5" />;
                const colorClass =
                  line.t === "cmd"   ? "text-[#444]" :
                  line.t === "ok"    ? "text-[#3D6B3D]" :
                  line.t === "task"  ? "text-[#F0EEE9]" :
                  line.t === "reply" ? "text-[#FF4500]" : "text-[#333]";
                return (
                  <div
                    key={i}
                    className={`slc-line opacity-0 whitespace-pre-wrap ${colorClass}`}
                  >
                    {line.v}
                  </div>
                );
              })}
            </div>

            {/* Token cost badge */}
            <div className="mt-7 pt-5 border-t border-[#FF4500]/8">
              <p className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-[#333]">
                setup cost
              </p>
              <p
                className="font-display font-thin tracking-[-0.04em] text-[#FF4500] leading-none mt-1.5"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                ~420
              </p>
              <p className="font-mono text-[0.65rem] text-[#FF4500]/50 mt-1.5">
                tokens · AI knows the rest already
              </p>
            </div>
          </div>
        </div>

        {/* ── Delta callout ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "clamp(12px, 2vw, 24px)",
          padding: "52px 0 48px",
        }}>
          <div style={{ flex: 1, height: "1px", background: "#151515" }} />
          <div style={{ textAlign: "center" }}>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 200,
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              color: "#FF4500", letterSpacing: "-0.05em",
              display: "block", lineHeight: 1,
            }}>
              ↓90%
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.52rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#444", display: "block", marginTop: "8px",
            }}>
              context overhead
            </span>
          </div>
          <div style={{ flex: 1, height: "1px", background: "#151515" }} />
        </div>

        {/* ── Stats strip ───────────────────────────────────────────── */}
        <div
          className="tok-stats-strip"
          style={{
            display: "flex",
            gap: "clamp(28px, 5vw, 64px)",
            flexWrap: "wrap",
            paddingTop: "40px",
            borderTop: "1px solid #1A1A1A",
          }}
        >
          {[
            ["~90%",   "token reduction"],
            ["3 tiers", "hot / warm / cold"],
            ["0",       "invented context"],
          ].map(([val, lbl]) => (
            <div key={lbl} className="tok-stat" style={{ opacity: 0 }}>
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 200,
                fontSize: "1.8rem", color: "#F0EEE9",
                letterSpacing: "-0.03em", marginBottom: "4px",
              }}>
                {val}
              </p>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                letterSpacing: "0.15em", textTransform: "uppercase", color: "#555",
              }}>
                {lbl}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

