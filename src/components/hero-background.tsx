"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const orbAY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbBY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <motion.div
        style={{ y: orbAY, opacity: fade }}
        className="glow-orb absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-[60%]"
      />
      <motion.div
        style={{ y: orbBY, opacity: fade }}
        className="glow-orb absolute -top-10 left-1/2 h-[26rem] w-[26rem] translate-x-[10%] opacity-70"
      />
    </div>
  );
}
