"use client";

import { useEffect, useState } from "react";
import { useWindowStore, APP_DEFINITIONS } from "@/store/windowStore";
import { AppId } from "@/types";

const DOCK_APPS: AppId[] = ["terminal", "ai", "filemanager", "editor"];

export default function Taskbar() {
  const { windows, openWindow, focusWindow, minimizeWindow } = useWindowStore();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setDate(
        now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleAppClick = (appId: AppId) => {
    const existing = windows.find((w) => w.appId === appId && !w.isMinimized);
    if (existing) {
      if (existing.isFocused) minimizeWindow(existing.id);
      else focusWindow(existing.id);
    } else {
      const minimized = windows.find((w) => w.appId === appId && w.isMinimized);
      if (minimized) focusWindow(minimized.id);
      else openWindow(appId);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9000] flex items-center justify-between px-4"
      style={{
        height: 40,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Left — VOID wordmark */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-mono">
          VOID
        </span>
        <div className="w-px h-4 bg-white/10" />

        {/* Dock icons */}
        {DOCK_APPS.map((appId) => {
          const def = APP_DEFINITIONS[appId];
          const isOpen = windows.some((w) => w.appId === appId);
          const isFocused = windows.some((w) => w.appId === appId && w.isFocused && !w.isMinimized);

          return (
            <button
              key={appId}
              onClick={() => handleAppClick(appId)}
              className="flex items-center gap-1.5 group transition-all"
              title={def.label}
            >
              <span
                className={`text-[10px] font-mono transition-colors ${
                  isFocused
                    ? "text-white"
                    : isOpen
                    ? "text-white/60"
                    : "text-white/25 group-hover:text-white/60"
                }`}
              >
                {def.icon}
              </span>
              {isOpen && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: isFocused ? "#fff" : "rgba(255,255,255,0.3)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right — clock */}
      <div className="flex items-center gap-3 text-right">
        <span className="text-[10px] text-white/30 font-mono uppercase">{date}</span>
        <span className="text-[11px] text-white/70 font-mono">{time}</span>
      </div>
    </div>
  );
}
