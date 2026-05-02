"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IDLE_MS = 30_000;

export default function Screensaver() {
  const [idle, setIdle] = useState(false);
  const [time, setTime] = useState("");

  const resetTimer = useCallback(() => setIdle(false), []);

  useEffect(() => {
    let t = setTimeout(() => setIdle(true), IDLE_MS);
    const reset = () => {
      clearTimeout(t);
      setIdle(false);
      t = setTimeout(() => setIdle(true), IDLE_MS);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("mousedown", reset);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("mousedown", reset);
    };
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {idle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9990] bg-black flex flex-col items-center justify-center cursor-none"
          onClick={resetTimer}
        >
          <div className="scanlines" />
          <div className="scanline-sweep" />

          <div className="ss-text text-center select-none">
            <div
              className="font-mono font-bold text-white"
              style={{ fontSize: "20vw", lineHeight: 1, letterSpacing: "-0.04em" }}
            >
              {time}
            </div>
            <p className="text-[11px] font-mono text-white/20 tracking-[0.5em] uppercase mt-4">
              void os · move to wake
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
