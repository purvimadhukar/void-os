"use client";

import { useWindowStore, APP_DEFINITIONS } from "@/store/windowStore";
import { AppId } from "@/types";
import Window from "@/components/Window/Window";
import Taskbar from "@/components/Desktop/Taskbar";
import Terminal from "@/components/Apps/Terminal";
import AIAssistant from "@/components/Apps/AIAssistant";
import FileManager from "@/components/Apps/FileManager";
import CodeEditor from "@/components/Apps/CodeEditor";
import About from "@/components/Apps/About";
import Screensaver from "@/components/Desktop/Screensaver";

const DESKTOP_ICONS: { appId: AppId; row: number }[] = [
  { appId: "terminal",    row: 0 },
  { appId: "ai",          row: 1 },
  { appId: "filemanager", row: 2 },
  { appId: "editor",      row: 3 },
  { appId: "about",       row: 4 },
];

function AppContent({ appId, onOpen }: { appId: AppId; onOpen: (id: AppId) => void }) {
  switch (appId) {
    case "terminal":    return <Terminal onOpen={(a) => onOpen(a as AppId)} />;
    case "ai":          return <AIAssistant />;
    case "filemanager": return <FileManager />;
    case "editor":      return <CodeEditor />;
    case "about":       return <About />;
    default:            return null;
  }
}

export default function Desktop() {
  const { windows, openWindow } = useWindowStore();

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#000" }}>
      {/* CRT effects */}
      <div className="scanlines" />
      <div className="scanline-sweep" />

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Desktop icons (left column) */}
      <div className="absolute left-6 top-6 flex flex-col gap-1">
        {DESKTOP_ICONS.map(({ appId }) => {
          const def = APP_DEFINITIONS[appId];
          return (
            <button
              key={appId}
              onDoubleClick={() => openWindow(appId)}
              className="desktop-icon flex items-center gap-3 px-3 py-1.5 hover:bg-white/5 transition-colors group text-left w-40"
            >
              <span className="text-[11px] font-mono text-white/25 group-hover:text-white/60 w-6 text-center flex-shrink-0">
                {def.icon}
              </span>
              <span className="icon-label text-[10px] font-mono text-white/40 group-hover:text-white/70 tracking-wider uppercase">
                {def.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Corner watermark */}
      <div className="absolute bottom-12 right-6 text-right pointer-events-none select-none">
        <p className="text-[9px] font-mono text-white/8 tracking-[0.3em] uppercase">void os</p>
        <p className="text-[8px] font-mono text-white/5 tracking-wider">v1.0.0</p>
      </div>

      {/* Windows */}
      <div className="absolute inset-0" style={{ bottom: 40 }}>
        {windows.map((win) => (
          <Window key={win.id} win={win}>
            <AppContent appId={win.appId} onOpen={openWindow} />
          </Window>
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />

      {/* Screensaver — activates after 30s idle */}
      <Screensaver />
    </div>
  );
}
