"use client";

import { useRef } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/store/windowStore";
import { WindowState } from "@/types";

interface Props {
  win: WindowState;
  children: React.ReactNode;
}

export default function Window({ win, children }: Props) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition, updateSize } =
    useWindowStore();

  const isMax = win.isMaximized;

  if (win.isMinimized) return null;

  const rndProps = isMax
    ? { x: 0, y: 0, width: "100vw" as const, height: "calc(100vh - 40px)" as const }
    : { x: win.x, y: win.y, width: win.width, height: win.height };

  return (
    <AnimatePresence>
      <motion.div
        key={win.id}
        initial={{ opacity: 0, scaleY: 0.04, scaleX: 1.04 }}
        animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleY: 0.04, scaleX: 1.04, transition: { duration: 0.1 } }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "absolute", zIndex: win.zIndex, inset: 0, pointerEvents: "none", originX: "50%", originY: "50%" }}
      >
        <Rnd
          {...rndProps}
          disableDragging={isMax}
          enableResizing={!isMax}
          dragHandleClassName="window-drag-handle"
          bounds="parent"
          minWidth={280}
          minHeight={180}
          style={{ pointerEvents: "all", zIndex: win.zIndex }}
          onMouseDown={() => focusWindow(win.id)}
          onDragStop={(_, d) => updatePosition(win.id, d.x, d.y)}
          onResizeStop={(_, __, ref, ___, pos) => {
            updateSize(win.id, ref.offsetWidth, ref.offsetHeight);
            updatePosition(win.id, pos.x, pos.y);
          }}
        >
          <div
            className={`window-chrome flex flex-col w-full h-full ${
              win.isFocused ? "focused" : ""
            }`}
            style={{ borderRadius: 0 }}
          >
            {/* Title bar */}
            <div
              className="window-drag-handle flex items-center justify-between px-3 py-2 border-b border-white/10 flex-shrink-0 cursor-move"
              style={{ background: win.isFocused ? "rgba(255,255,255,0.04)" : "transparent" }}
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-mono select-none">
                {win.title}
              </span>

              <div className="flex items-center gap-1">
                {/* Minimize */}
                <button
                  onClick={() => minimizeWindow(win.id)}
                  className="w-5 h-5 border border-white/20 text-white/40 hover:border-white/60 hover:text-white flex items-center justify-center text-[9px] transition-all"
                  title="Minimise"
                >
                  —
                </button>
                {/* Maximize */}
                <button
                  onClick={() => maximizeWindow(win.id)}
                  className="w-5 h-5 border border-white/20 text-white/40 hover:border-white/60 hover:text-white flex items-center justify-center text-[9px] transition-all"
                  title="Maximise"
                >
                  {isMax ? "⊡" : "□"}
                </button>
                {/* Close */}
                <button
                  onClick={() => closeWindow(win.id)}
                  className="w-5 h-5 border border-white/20 text-white/40 hover:border-white hover:text-white flex items-center justify-center text-[9px] transition-all"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
              {children}
            </div>
          </div>
        </Rnd>
      </motion.div>
    </AnimatePresence>
  );
}
