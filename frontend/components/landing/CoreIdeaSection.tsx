"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CODE_LINES: { text: string; type: "keyword" | "key" | "value" | "comment" | "blank" }[] = [
  { text: "# SLC - Spec Language for Cognition", type: "comment" },
  { text: "# Every block is a contract between spec and machine.", type: "comment" },
  { text: "", type: "blank" },
  { text: "@block INDEX root_index", type: "keyword" },
  { text: "  priority: critical", type: "key" },
  { text: "  intent: \"Global router for execution\"", type: "value" },
  { text: "  failure_if_skipped: true", type: "key" },
  { text: "", type: "blank" },
  { text: "  read_order:", type: "key" },
  { text: "    - CONTEXT.md", type: "value" },
  { text: "    - SECURITY.md", type: "value" },
  { text: "    - ARCH.md", type: "value" },
  { text: "    - tasks/task_index.md", type: "value" },
  { text: "@end", type: "keyword" },
  { text: "", type: "blank" },
  { text: "@block TASK auth_login", type: "keyword" },
  { text: "  priority: critical", type: "key" },
  { text: "  depends_on: [ARCH.auth, SECURITY.tokens]", type: "key" },
  { text: "  memory_tier: hot", type: "key" },
  { text: "", type: "blank" },
  { text: "  content:", type: "key" },
  { text: "    - validate credentials against bcrypt hash", type: "value" },
  { text: "    - issue RS256 JWT with 15min expiry", type: "value" },
  { text: "    - set HttpOnly cookie, SameSite=Strict", type: "value" },
  { text: "@end", type: "keyword" },
  { text: "", type: "blank" },
  { text: "@block ARCH memory_system", type: "keyword" },
  { text: "  scope: global", type: "key" },
  { text: "", type: "blank" },
  { text: "  tiers:", type: "key" },
  { text: "    hot:  always loaded - SPEC, ARCH, SECURITY", type: "value" },
  { text: "    warm: on-demand - task files, contracts", type: "value" },
  { text: "    cold: indexed-only - historical, examples", type: "value" },
  { text: "@end", type: "keyword" },
];

const COLOR_MAP = {
  keyword: "#FF4500",
  key: "#7EB8D4",
  value: "#9FCA7E",
  comment: "#555",
  blank: "transparent",
};

export default function CoreIdeaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".code-reveal-line").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -16 },
          {
            opacity: 1, x: 0, duration: 0.28, delay: i * 0.016,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".syntax-label",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: ".syntax-label", start: "top bottom", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="syntax"
      style={{
        background: "#0A0A0A",
        padding: "120px 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "0 clamp(16px, 4vw, 48px)", marginBottom: "60px" }}>
        <p
          className="syntax-label"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#FF4500",
            marginBottom: "24px",
          }}
        >
          The Syntax
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 200,
            fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
            color: "#F0EEE9",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            maxWidth: "800px",
          }}
        >
          Every block is a contract.{" "}
          <span style={{ color: "#FF4500" }}>Nothing is implied.</span>
        </h2>
      </div>

      {/* Full-bleed terminal */}
      <div style={{ background: "#050505", borderTop: "1px solid #1A1A1A" }}>
        {/* Terminal chrome */}
        <div style={{ display: "flex", gap: "7px", padding: "24px clamp(16px, 4vw, 48px) 0", alignItems: "center" }}>
          <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#FF4500" }} />
          <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#222" }} />
          <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#222" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "#9B958B",
              letterSpacing: "0.1em",
              marginLeft: "12px",
            }}
          >
            spec/SPEC.slc
          </span>
        </div>

        {/* Code with line-number gutter */}
        <div style={{ display: "flex", padding: "28px clamp(16px, 4vw, 48px) 0", overflowX: "auto" }}>
          {/* Gutter */}
          <div
            style={{
              flexShrink: 0,
              width: "32px",
              marginRight: "20px",
              borderRight: "1px solid #181818",
              paddingRight: "10px",
              userSelect: "none",
            }}
          >
            {CODE_LINES.map((_, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  lineHeight: 1.75,
                  color: "#242424",
                  textAlign: "right",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code body */}
          <div style={{ flex: 1 }}>
            {CODE_LINES.map((line, i) => (
              <div
                key={i}
                className="code-reveal-line"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  color: COLOR_MAP[line.type],
                  whiteSpace: "pre",
                  opacity: 0,
                  minHeight: line.type === "blank" ? "1.2em" : undefined,
                  paddingLeft: line.type === "keyword" ? "10px" : undefined,
                  borderLeft:
                    line.type === "keyword"
                      ? "2px solid rgba(255,69,0,0.28)"
                      : "2px solid transparent",
                }}
              >
                {line.text || "\u00A0"}
              </div>
            ))}
          </div>
        </div>

        {/* Annotation strip — 3 equal columns below the code */}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "52px", borderTop: "1px solid #111" }}>
          {[
            { num: "01", label: "Deterministic read order", desc: "AI always loads context in the same sequence. No inference, no drift." },
            { num: "02", label: "Explicit memory tiers", desc: "Hot / warm / cold. Nothing is loaded that isn't needed for this session." },
            { num: "03", label: "Declared dependencies", desc: "Each task block knows exactly what context it requires before execution." },
          ].map(({ num, label, desc }, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 200px",
                padding: "32px 28px 48px",
                borderRight: i < 2 ? "1px solid #111" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "#FF4500",
                  letterSpacing: "0.22em",
                  display: "block",
                  marginBottom: "20px",
                }}
              >
                {num}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "0.95rem",
                  color: "#F0EEE9",
                  letterSpacing: "-0.01em",
                  margin: "0 0 10px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  fontSize: "0.92rem",
                  color: "#4A4A4A",
                  lineHeight: 1.7,
                  margin: 0,
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


const SLC_CODE = `@block TASK auth_login
priority: critical
depends_on: [ARCH.auth]

content:
  - validate credentials
  - create session
  - issue JWT token
@end

@block ARCH auth_system
scope: backend
memory_tier: hot

content:
  - bcrypt password hashing
  - JWT RS256 signing
  - rate-limited endpoints
@end`;

const FEATURES = [
  {
    title: "Deterministic read order",
    desc: "AI follows an exact execution path - no guessing which file matters.",
  },
  {
    title: "Explicit dependencies",
    desc: "Blocks declare what they need. Context is loaded only when required.",
  },
  {
    title: "Machine-first architecture",
    desc: "SLC is structured for parsers, not humans. Every token has purpose.",
  },
  {
    title: "Hot / warm / cold memory tiers",
    desc: "Critical context stays resident. Cold context is loaded on demand.",
  },
  {
    title: "Reduced entropy",
    desc: "Structure replaces narrative. Ambiguity becomes a compile error.",
  },
];

