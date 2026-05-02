"use client";

import { create } from "zustand";
import { WindowState, AppId, AppDefinition } from "@/types";

export const APP_DEFINITIONS: Record<AppId, AppDefinition> = {
  terminal: {
    id: "terminal",
    label: "TERMINAL",
    icon: ">_",
    defaultSize: { width: 640, height: 420 },
  },
  ai: {
    id: "ai",
    label: "VOID.AI",
    icon: "AI",
    defaultSize: { width: 560, height: 500 },
  },
  filemanager: {
    id: "filemanager",
    label: "FILE SYSTEM",
    icon: "FS",
    defaultSize: { width: 480, height: 400 },
  },
  editor: {
    id: "editor",
    label: "EDITOR",
    icon: "ED",
    defaultSize: { width: 720, height: 500 },
  },
  about: {
    id: "about",
    label: "ABOUT VOID",
    icon: "??",
    defaultSize: { width: 440, height: 340 },
  },
};

interface WindowStore {
  windows: WindowState[];
  topZ: number;
  openWindow: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, w: number, h: number) => void;
}

let idCounter = 0;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZ: 10,

  openWindow: (appId) => {
    const def = APP_DEFINITIONS[appId];
    const newZ = get().topZ + 1;
    const offset = (get().windows.length % 6) * 28;

    const newWindow: WindowState = {
      id: `${appId}-${++idCounter}`,
      appId,
      title: def.label,
      x: 80 + offset,
      y: 60 + offset,
      width: def.defaultSize.width,
      height: def.defaultSize.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      isFocused: true,
    };

    set((s) => ({
      windows: [
        ...s.windows.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ],
      topZ: newZ,
    }));
  },

  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized, isFocused: false } : w
      ),
    })),

  maximizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    })),

  focusWindow: (id) => {
    const newZ = get().topZ + 1;
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? { ...w, zIndex: newZ, isFocused: true, isMinimized: false }
          : { ...w, isFocused: false }
      ),
      topZ: newZ,
    }));
  },

  updatePosition: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  updateSize: (id, width, height) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    })),
}));
