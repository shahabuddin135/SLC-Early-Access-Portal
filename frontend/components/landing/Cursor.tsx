"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.38, ease: "power2.out" });
    };

    const onEnterLink = () => {
      gsap.to(ring, { scale: 2.4, opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 0.5, duration: 0.25, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);

    const links = document.querySelectorAll("a, button, [data-cursor]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          width: "5px",
          height: "5px",
          background: "#FF4500",
          borderRadius: "0",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          top: 0,
          left: 0,
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          width: "28px",
          height: "28px",
          border: "1.5px solid #FF4500",
          borderRadius: "0",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          top: 0,
          left: 0,
          opacity: 0.5,
        }}
      />
    </>
  );
}
