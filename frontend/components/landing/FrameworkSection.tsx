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

export default function FrameworkSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".fw-row").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -32 },
          {
            opacity: 1, x: 0, duration: 0.45, delay: i * 0.025,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
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
      style={{ background: "#F0EEE9", padding: "120px clamp(16px, 4vw, 48px)", position: "relative" }}
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
        }}
      >
        02
      </span>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header — label + title inline */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(16px, 3vw, 40px)", marginBottom: "52px", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#FF4500",
              flexShrink: 0,
            }}
          >
            The Framework
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 200,
              fontSize: "clamp(2.3rem, 3.5vw, 3.2rem)",
              color: "#0A0A0A",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Eight steps. <span style={{ color: "#FF4500" }}>Zero ambiguity.</span>
          </h2>
        </div>

        {/* Editorial numbered rows */}
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          {STEPS.map(({ step, title, desc }, i) => (
            <div
              key={i}
              className="fw-row"
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(36px, 4.5vw, 60px) 1fr clamp(0px, 30vw, 310px)",
                alignItems: "start",
                gap: "clamp(16px, 3vw, 40px)",
                padding: "clamp(22px, 3vw, 30px) 0",
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
    </section>
  );
}
