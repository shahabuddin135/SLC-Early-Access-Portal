"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Real, defensible proof points — edit the copy here, not the markup.
const PROOF: { value: string; title: string; desc: string }[] = [
  {
    value: "End-to-end",
    title: "An enterprise backend, built on SLC",
    desc: "A full production backend specified and shipped through the framework — not vibe-coded, every module declared and tracked.",
  },
  {
    value: "0 drift",
    title: "Frontend derived from the backend",
    desc: "That project's entire frontend contract was generated from the backend CONTRACT — the FE-derives-from-BE rule, in production.",
  },
  {
    value: "Repeatable",
    title: "Multiple shipped projects",
    desc: "Completed, real-world projects walked the same deterministic path — the result is reproducible, not a one-off.",
  },
];

export default function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prf-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".prf-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.5, delay: i * 0.08,
            scrollTrigger: { trigger: ".prf-cards", start: "top 88%", once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proof"
      ref={sectionRef}
      style={{
        background: "#F0EEE9",
        padding: "clamp(96px, 12vw, 140px) clamp(16px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost watermark */}
      <span
        aria-hidden
        style={{
          position: "absolute", bottom: "-0.12em", left: "-0.02em",
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(7rem, 18vw, 20rem)", color: "rgba(11,11,11,0.03)",
          letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}
      >
        proof
      </span>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <p
          className="prf-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-mono)", fontSize: "0.8rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#FF4500", marginBottom: "24px",
          }}
        >
          Proven in Production
        </p>
        <h2
          className="prf-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 200,
            fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)", letterSpacing: "-0.04em",
            color: "#0A0A0A", lineHeight: 1.05, margin: "0 0 22px",
          }}
        >
          Not a theory. <span style={{ color: "#FF4500" }}>Shipped.</span>
        </h2>
        <p
          className="prf-reveal"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(1rem, 1.5vw, 1.22rem)", color: "#5A5A5A",
            lineHeight: 1.62, margin: 0, maxWidth: "36em",
          }}
        >
          SLC has already built real software — including an entire enterprise backend, with its
          frontend specs derived straight from it. This is disciplined, tracked engineering, not
          guesswork dressed up as AI.
        </p>

        {/* Proof cards */}
        <div
          className="prf-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(12px, 2vw, 20px)",
            marginTop: "clamp(48px, 6vw, 72px)",
          }}
        >
          {PROOF.map((p) => (
            <div
              key={p.title}
              className="prf-card"
              style={{
                opacity: 0,
                background: "#FBFAF7",
                border: "1px solid rgba(11,11,11,0.08)",
                padding: "clamp(24px, 2.6vw, 34px)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 200,
                  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", letterSpacing: "-0.03em",
                  color: "#FF4500", lineHeight: 1, margin: "0 0 18px",
                }}
              >
                {p.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: "clamp(1rem, 1.4vw, 1.12rem)", color: "#0A0A0A",
                  letterSpacing: "-0.01em", lineHeight: 1.25, margin: "0 0 10px",
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 300,
                  fontSize: "0.9rem", color: "#7A7A7A", lineHeight: 1.6, margin: 0,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Why the token math holds (provable by architecture) ── */}
        <div
          className="prf-reveal"
          style={{
            opacity: 0,
            marginTop: "clamp(56px, 7vw, 88px)",
            paddingTop: "clamp(36px, 4vw, 52px)",
            borderTop: "1px solid rgba(11,11,11,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.72rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#9A9A9A", marginBottom: "14px",
            }}
          >
            Why the token math holds — it&apos;s the architecture, not a benchmark
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)", fontWeight: 200,
              fontSize: "clamp(1.5rem, 3vw, 2.4rem)", letterSpacing: "-0.03em",
              color: "#0A0A0A", lineHeight: 1.12, margin: "0 0 36px", maxWidth: "20em",
            }}
          >
            The savings aren&apos;t a number we hope to hit. They&apos;re a property of the
            dependency graph.
          </h3>

          <div className="prf-law">
            {/* Monolithic */}
            <div className="prf-law-card prf-law-bad">
              <span className="prf-law-tag" style={{ color: "#B4503C" }}>Monolithic context</span>
              <p className="prf-law-formula" style={{ color: "#B4503C" }}>cost ∝ project size</p>
              <p className="prf-law-text">
                Every task re-loads the whole accumulated context. As the codebase grows, so does the
                bill — each session pays for the entire history again, and the middle of the window
                rots.
              </p>
            </div>

            {/* SLC */}
            <div className="prf-law-card prf-law-good">
              <span className="prf-law-tag" style={{ color: "#0A0A0A" }}>SLC context</span>
              <p className="prf-law-formula" style={{ color: "#FF4500" }}>cost ∝ one task&apos;s deps</p>
              <p className="prf-law-text">
                Every task loads the SPEC read-order anchors plus only the <code>depends_on</code>
                {" "}arch and contract sections it needs. The cost stays flat as the repo scales — because
                you load what the task depends on, and nothing else.
              </p>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-display)", fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.3vw, 1.08rem)", color: "#5A5A5A",
              lineHeight: 1.6, margin: "32px 0 0", maxWidth: "44em",
            }}
          >
            That gap — a constant versus something that grows with the project — is the ~90% reduction.
            It follows necessarily from the tiering and split protocol; no measurement is required to
            see why it must be true.
          </p>
        </div>
      </div>

      <style>{`
        .prf-law {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 2vw, 20px);
        }
        .prf-law-card { padding: clamp(24px, 2.8vw, 36px); border: 1px solid rgba(11,11,11,0.1); }
        .prf-law-bad  { background: #F6EFEB; }
        .prf-law-good { background: #0A0A0A; }
        .prf-law-good .prf-law-tag { color: #F0EEE9 !important; }
        .prf-law-good .prf-law-text { color: #B8B5AE; }
        .prf-law-good code { color: #FF4500; font-family: var(--font-mono); font-size: 0.85em; }
        .prf-law-bad code  { font-family: var(--font-mono); font-size: 0.85em; }
        .prf-law-tag {
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; display: block; margin-bottom: 14px;
        }
        .prf-law-formula {
          font-family: var(--font-mono); font-size: clamp(1.05rem, 1.8vw, 1.5rem);
          letter-spacing: -0.01em; margin: 0 0 18px;
        }
        .prf-law-text {
          font-family: var(--font-display); font-weight: 300;
          font-size: 0.95rem; line-height: 1.62; color: #6A6A6A; margin: 0;
        }
        @media (max-width: 720px) {
          .prf-cards { grid-template-columns: 1fr !important; }
          .prf-law { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
