"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STEPS = [
  { step: "01", title: "Write CONTEXT.md", desc: "Project identity, constraints, tech stack, and deployment target — in SLC block format." },
  { step: "02", title: "Define ARCH.md", desc: "Every system boundary, module, and cross-cutting concern declared as a named block." },
  { step: "03", title: "Specify SECURITY.md", desc: "Auth patterns, session rules, trust boundaries — loaded in every AI session automatically." },
  { step: "04", title: "Build task_index.md", desc: "All planned work as @block TASK entries with explicit priorities and dependencies." },
  { step: "05", title: "Tag memory tiers", desc: "Decide hot/warm/cold per file. AI only loads what the current session needs." },
  { step: "06", title: "Run SLC-aware agent", desc: "Agent reads the INDEX block first. Read order is deterministic. No guessing." },
  { step: "07", title: "Verify CONTRACT.md", desc: "Every route, schema, and interface declared. Agent never deviates from the contract." },
  { step: "08", title: "Ship with confidence", desc: "No unexplained rewrites. No invented patterns. Architecture is the law." },
];

// Mascot presenting the architecture flow.
const ILLUSTRATION =
  "https://res.cloudinary.com/didt1ywys/image/upload/v1781002981/planned_files_j1sjxd.png";

export default function FrameworkSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fw-art",
        { opacity: 0, x: -48, scale: 0.92 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".fw-intro-copy",
        { opacity: 0, x: 32 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".fw-row").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.45, delay: i * 0.025,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{ background: "#F0EEE9", padding: "120px clamp(16px, 4vw, 48px)", position: "relative", overflow: "hidden" }}
    >
      {/* Ghost 02 */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: "clamp(16px, 4vw, 48px)",
          fontFamily: "var(--font-display)",
          fontWeight: 200,
          fontSize: "clamp(6rem, 16vw, 18rem)",
          color: "rgba(11,11,11,0.03)",
          letterSpacing: "-0.06em",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        02
      </span>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ── Intro band: big mascot left · heading right ── */}
        <div className="fw-intro">
          <div className="fw-art" style={{ position: "relative", minWidth: 0, opacity: 0 }}>
            <span className="fw-glow" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ILLUSTRATION} alt="" aria-hidden loading="lazy" className="fw-mascot" />
          </div>

          <div className="fw-intro-copy" style={{ minWidth: 0, opacity: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#FF4500",
                display: "block",
                marginBottom: "20px",
              }}
            >
              The Framework
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 200,
                fontSize: "clamp(2.3rem, 4vw, 3.6rem)",
                color: "#0A0A0A",
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                margin: "0 0 20px",
              }}
            >
              Eight steps. <span style={{ color: "#FF4500" }}>Zero ambiguity.</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                color: "#5A5A5A",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "440px",
              }}
            >
              Write the spec once. From then on every AI session reads it first and follows the
              same deterministic path — the framework decides what happens next, not guesswork.
            </p>
          </div>
        </div>

        {/* ── Full-width step list ── */}
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", marginTop: "clamp(48px, 6vw, 80px)" }}>
          {STEPS.map(({ step, title, desc }, i) => (
            <div
              key={i}
              className="fw-row"
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(36px, 4.5vw, 60px) 1fr clamp(0px, 30vw, 320px)",
                alignItems: "start",
                gap: "clamp(16px, 3vw, 40px)",
                padding: "clamp(20px, 2.6vw, 28px) 0",
                borderTop: "1px solid rgba(0,0,0,0.07)",
                opacity: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "#FF4500",
                  letterSpacing: "0.16em",
                  paddingTop: "0.4em",
                  display: "block",
                }}
              >
                {step}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 200,
                  fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
                  color: "#0A0A0A",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {title}
              </p>
              <p
                className="fw-desc"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(1rem, 1.3vw, 1.05rem)",
                  color: "#7A7A7A",
                  lineHeight: 1.65,
                  margin: 0,
                  paddingTop: "0.35em",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .fw-intro {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: clamp(28px, 5vw, 80px);
        }
        .fw-art { display: flex; align-items: center; justify-content: center; }
        .fw-glow {
          position: absolute;
          inset: -6%;
          background: radial-gradient(circle, rgba(255,120,40,0.22) 0%, rgba(255,120,40,0) 66%);
          filter: blur(16px);
          z-index: 0;
        }
        .fw-mascot {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: clamp(280px, 40vw, 460px);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 26px 44px rgba(180,90,30,0.22));
        }
        @media (max-width: 860px) {
          .fw-intro { grid-template-columns: 1fr; gap: clamp(22px, 6vw, 40px); }
          .fw-art { order: -1; }
          .fw-mascot { max-width: min(68vw, 340px); }
          .fw-row { grid-template-columns: clamp(30px, 6vw, 46px) 1fr !important; }
          .fw-desc { grid-column: 2 / 3; }
        }
      `}</style>
    </section>
  );
}
