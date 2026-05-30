"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BEATS = ["Memory.", "Overrides.", "Creativity."];

export default function InsightSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".beat-word");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: stickyRef.current,
          pinSpacing: false,
        },
      });

      // First word is already visible; second and third snap in
      tl.set(words[0], { opacity: 1, yPercent: 0 })
        .fromTo(words[1], { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, ease: "power3.out" }, 0.3)
        .fromTo(words[2], { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, ease: "power3.out" }, 0.6)
        // Subline fades in
        .fromTo(".insight-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.85);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    /* Outer wrapper sets the total scroll height for the pin */
    <div ref={outerRef} style={{ height: "240vh", background: "#0A0A0A" }}>
      <div
        ref={stickyRef}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 clamp(16px, 4vw, 48px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost watermark */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-0.1em",
            right: "-0.02em",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(10rem, 28vw, 32rem)",
            color: "rgba(255,69,0,0.04)",
            letterSpacing: "-0.06em",
            userSelect: "none",
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          LAW
        </span>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#FF4500",
            marginBottom: "48px",
          }}
        >
          The Law
        </p>

        {/* Words */}
        <div style={{ overflow: "visible" }}>
          {BEATS.map((word, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <h2
                className="beat-word"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(2.6rem, 11vw, 11rem)",
                  letterSpacing: "-0.045em",
                  lineHeight: 0.93,
                  color: i === 2 ? "#FF4500" : "#F0EEE9",
                  opacity: i === 0 ? 1 : 0,
                  display: "block",
                  margin: 0,
                }}
              >
                {word}
              </h2>
            </div>
          ))}
        </div>

        <p
          className="insight-sub"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            color: "#C8C4BC",
            lineHeight: 1.65,
            maxWidth: "520px",
            marginTop: "48px",
            opacity: 0,
          }}
        >
          SLC puts a{" "}<span style={{ color: "#F0EEE9", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>MEMORY.md</span>{" "}
          at the root of every project. Every decision, every constraint,
          every assumption — recorded and numbered. When the AI contradicts
          any of it, execution stops. That’s not a workaround.
          That’s the spec.
        </p>
      </div>
    </div>
  );
}
