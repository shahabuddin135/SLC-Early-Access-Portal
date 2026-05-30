"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { num: "0", unit: "session memory", statement: "by default. Every new AI chat starts cold — no memory of your architecture decisions, no memory of your constraints, no memory of what was already built last time." },
  { num: "N+1", unit: "re-explains", statement: "Stack, structure, conventions, boundaries. You explain the same project in every new session. The model listens, nods, then guesses anyway." },
  { num: "∞", unit: "drift", statement: "without a spec. The AI fills every gap it finds — not with nothing, but with something plausible that quietly contradicts what you decided two sessions ago." },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".prob-label", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.5, scrollTrigger: { trigger: ".prob-label", start: "top 92%" } });
      gsap.utils.toArray<HTMLElement>(".prob-row").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.06, scrollTrigger: { trigger: el, start: "top 93%", toggleActions: "play none none reverse" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#F0EEE9", padding: "120px clamp(16px, 4vw, 48px)", position: "relative" }}>
      <span aria-hidden="true" style={{ position: "absolute", top: "40px", right: "clamp(16px, 4vw, 48px)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(6rem, 16vw, 18rem)", color: "rgba(11,11,11,0.04)", letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>01</span>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p className="prob-label" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#FF4500", marginBottom: "80px" }}>The Diagnosis</p>
        {STATS.map(({ num, unit, statement }, i) => (
          <div key={i} className="prob-row" style={{ borderTop: "1px solid #D0CEC9", padding: "44px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "28px", alignItems: "baseline", opacity: 0 }}>
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 5.5vw, 5.5rem)", color: "#0A0A0A", letterSpacing: "-0.04em", lineHeight: 1, display: "block" }}>{num}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#FF4500", marginTop: "6px", display: "block" }}>{unit}</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", color: "#333", lineHeight: 1.6, maxWidth: "640px" }}>{statement}</p>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #D0CEC9" }} />
      </div>
    </section>
  );
}
