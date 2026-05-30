"use client";
import { useEffect, useRef, useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Transition } from "motion/react";

interface TextRotateProps {
  texts: string[];
  mainClassName?: string;
  splitLevelClassName?: string;
  staggerFrom?: "first" | "last" | "center";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initial?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animate?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exit?: Record<string, any>;
  staggerDuration?: number;
  transition?: Transition;
  /** Spring used for the chip width resize — set low damping for jelly bounce */
  layoutTransition?: Transition;
  rotationInterval?: number;
  onIndexChange?: (index: number) => void;
}

export default function TextRotate({
  texts,
  mainClassName = "",
  splitLevelClassName = "",
  staggerFrom = "first",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  staggerDuration = 0.025,
  transition = { type: "spring", damping: 30, stiffness: 400 } as Transition,
  layoutTransition = { type: "spring", damping: 16, stiffness: 180 } as Transition,
  rotationInterval = 3000,
  onIndexChange,
}: TextRotateProps) {
  const [index, setIndex] = useState(0);
  const uid = useId();
  // Keep callback ref so the interval closure never captures a stale value
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;
  // Mirror index into a ref so the interval always sees the latest value
  // without needing it in the dependency array (avoids re-creating the interval)
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % texts.length;
      setIndex(next);
      // Called outside the state updater — safe to update parent state here
      onIndexChangeRef.current?.(next);
    }, rotationInterval);
    return () => clearInterval(timer);
  }, [texts.length, rotationInterval]);

  const chars = texts[index].split("");

  const getDelay = (i: number) => {
    const n = chars.length;
    if (staggerFrom === "last") return (n - 1 - i) * staggerDuration;
    if (staggerFrom === "center")
      return Math.abs(i - Math.floor(n / 2)) * staggerDuration;
    return i * staggerDuration;
  };

  return (
    <motion.span
      layout
      transition={layoutTransition}
      className={`inline-flex ${mainClassName}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${uid}-${index}`}
          className="inline-flex"
          aria-label={texts[index]}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              className={`inline-block overflow-hidden ${splitLevelClassName}`}
              aria-hidden="true"
            >
              <motion.span
                className="inline-block"
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{ ...transition, delay: getDelay(i) }}
              >
                {char === " " ? "\u00a0" : char}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
