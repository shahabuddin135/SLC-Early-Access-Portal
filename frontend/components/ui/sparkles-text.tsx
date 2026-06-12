"use client";

import { CSSProperties, useEffect, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

const SparkleIcon = ({ id, x, y, color, delay, scale }: Sparkle) => (
  <motion.svg
    key={id}
    className="pointer-events-none absolute z-20"
    initial={{ opacity: 0, left: x, top: y }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, scale, 0],
      rotate: [75, 120, 150],
    }}
    transition={{ duration: 0.8, repeat: Infinity, delay }}
    width="21"
    height="21"
    viewBox="0 0 21 21"
  >
    <path
      d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72107C12.3019 3.92247 12.4791 4.09653 13.6726 4.86197L15.1374 5.79698C15.6915 6.13434 15.6915 6.95572 15.1374 7.29307L13.6726 8.22808C12.4791 8.99352 12.3019 9.16759 11.8618 10.369L11.1746 12.2471C10.9446 12.8757 10.0553 12.8757 9.82531 12.2471L9.13813 10.369C8.69807 9.16759 8.52083 8.99352 7.32737 8.22808L5.86256 7.29307C5.30845 6.95572 5.30845 6.13434 5.86256 5.79698L7.32737 4.86197C8.52083 4.09653 8.69807 3.92247 9.13813 2.72107L9.82531 0.843845Z"
      fill={color}
    />
  </motion.svg>
);

interface SparklesTextProps {
  text: string;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
  style?: CSSProperties;
}

export function SparklesText({
  text,
  className,
  sparklesCount = 12,
  colors = { first: "#FF6B33", second: "#FFC56B" },
  style,
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`;
      const starY = `${Math.random() * 100}%`;
      const color = Math.random() > 0.5 ? colors.first : colors.second;
      const delay = Math.random() * 2;
      const scale = Math.random() * 1 + 0.3;
      const lifespan = Math.random() * 10 + 5;
      const id = `${starX}-${starY}-${Date.now()}-${Math.random()}`;
      return { id, x: starX, y: starY, color, delay, scale, lifespan };
    };

    const initialize = () =>
      setSparkles(Array.from({ length: sparklesCount }, generateStar));

    const tick = () =>
      setSparkles((current) =>
        current.map((s) => (s.lifespan <= 0 ? generateStar() : { ...s, lifespan: s.lifespan - 0.1 })),
      );

    initialize();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount]);

  return (
    <span className={cn("relative inline-block", className)} style={style}>
      {sparkles.map((sparkle) => (
        <SparkleIcon key={sparkle.id} {...sparkle} />
      ))}
      <strong className="relative z-10" style={{ fontWeight: "inherit", fontStyle: "inherit" }}>
        {text}
      </strong>
    </span>
  );
}

export default SparklesText;
