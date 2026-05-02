"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "VOID OS v1.0.0 — initialising kernel...", delay: 0 },
  { text: "loading hardware abstraction layer...", delay: 320 },
  { text: "mounting virtual file system...", delay: 600 },
  { text: "starting memory allocator...", delay: 850 },
  { text: "booting network interface...", delay: 1100 },
  { text: "loading AI inference engine...", delay: 1400 },
  { text: "spawning window compositor...", delay: 1700 },
  { text: "✓ all systems nominal", delay: 2050 },
  { text: "entering desktop environment...", delay: 2400 },
];

interface Props {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
    });

    // Aggressive glitch bursts
    const flickers = [
      [600, 640], [650, 670],
      [1200, 1240], [1260, 1300], [1310, 1360],
      [2100, 2120], [2140, 2180],
    ];
    flickers.forEach(([on, off]) => {
      setTimeout(() => setGlitching(true), on);
      setTimeout(() => setGlitching(false), off);
    });

    // Complete
    setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 600);
    }, 3200);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* CRT flicker overlay */}
          <div className="scanlines" />
          <div className="scanline-sweep" />

          <div
            className={`w-full max-w-2xl px-8 transition-all duration-75 ${
              glitching ? "opacity-20 scale-[1.002]" : "opacity-100 scale-100"
            }`}
            style={{ filter: glitching ? "blur(0.5px)" : "none" }}
          >
            {/* Logo */}
            <div className="mb-10">
              <h1
                className="glitch text-7xl font-bold tracking-tighter leading-none"
                data-text="VOID"
                style={{
                  textShadow: glitching
                    ? "-3px 0 rgba(255,0,80,0.8), 3px 0 rgba(0,200,255,0.8)"
                    : "none",
                }}
              >
                VOID
              </h1>
              <p className="text-xs text-white/30 mt-2 tracking-[0.6em] uppercase font-mono">
                operating system · v1.0.0
              </p>
            </div>

            {/* Boot log */}
            <div className="space-y-1 mb-8 min-h-[200px]">
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={
                    visibleLines.includes(i)
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -8 }
                  }
                  transition={{ duration: 0.15 }}
                  className={`text-xs font-mono ${
                    line.text.startsWith("✓")
                      ? "text-white"
                      : "text-white/50"
                  }`}
                >
                  <span className="text-white/20 mr-3 select-none">
                    {String(i).padStart(2, "0")}
                  </span>
                  {line.text}
                </motion.div>
              ))}

              {/* Blinking cursor at end */}
              {visibleLines.length > 0 && (
                <div className="text-xs font-mono text-white/50 flex items-center gap-1">
                  <span className="text-white/20 mr-3">
                    {String(visibleLines.length).padStart(2, "0")}
                  </span>
                  <span className="cursor-blink">█</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/20 tracking-widest uppercase">
                boot
              </span>
              <span className="text-[10px] text-white/40 font-mono">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
