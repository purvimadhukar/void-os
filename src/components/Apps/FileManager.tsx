"use client";

import { useState } from "react";
import { FileNode } from "@/types";

const FILE_TREE: FileNode[] = [
  {
    name: "home",
    type: "dir",
    children: [
      {
        name: "root",
        type: "dir",
        children: [
          { name: "README.void", type: "file", content: "Welcome to VOID OS.\n\nThis is a cinematic browser-based desktop environment.\nBuilt with Next.js, TypeScript, and Framer Motion.\n\nProject by a developer who refuses to be ordinary." },
          { name: "notes.txt", type: "file", content: "TODO:\n- finish the transpiler\n- ship void os\n- get hired\n- repeat" },
        ],
      },
    ],
  },
  {
    name: "sys",
    type: "dir",
    children: [
      { name: "kernel.void", type: "file", content: "VOID Kernel v1.0.0\nAll systems nominal." },
      { name: "config.void", type: "file", content: "THEME=monochrome\nGLITCH=enabled\nSCANLINES=enabled\nFONT=space-mono" },
    ],
  },
  {
    name: "tmp",
    type: "dir",
    children: [
      { name: "session.log", type: "file", content: "[BOOT] 00:00:00 kernel started\n[BOOT] 00:00:01 fs mounted\n[BOOT] 00:00:02 desktop ready" },
    ],
  },
  { name: "README.void", type: "file", content: "VOID OS v1.0.0\n\nA browser-based desktop OS.\nMonochrome. Cinematic. Yours." },
];

function FileTree({
  nodes,
  depth,
  onSelect,
}: {
  nodes: FileNode[];
  depth: number;
  onSelect: (node: FileNode) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["home", "root"]));

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      {nodes.map((node) => (
        <div key={node.name}>
          <button
            onClick={() => {
              if (node.type === "dir") toggle(node.name);
              else onSelect(node);
            }}
            className="w-full text-left flex items-center gap-1.5 py-0.5 px-2 hover:bg-white/5 transition-colors group"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <span className="text-[10px] text-white/30 w-3 flex-shrink-0 font-mono">
              {node.type === "dir"
                ? expanded.has(node.name) ? "▾" : "▸"
                : "·"}
            </span>
            <span
              className={`text-[11px] font-mono truncate ${
                node.type === "dir"
                  ? "text-white/70 group-hover:text-white"
                  : "text-white/50 group-hover:text-white/80"
              }`}
            >
              {node.name}
            </span>
          </button>

          {node.type === "dir" && expanded.has(node.name) && node.children && (
            <FileTree nodes={node.children} depth={depth + 1} onSelect={onSelect} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function FileManager() {
  const [selected, setSelected] = useState<FileNode | null>(null);

  return (
    <div className="w-full h-full flex">
      {/* Sidebar tree */}
      <div className="w-48 flex-shrink-0 border-r border-white/10 overflow-y-auto py-2">
        <div className="px-3 pb-2">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-mono">
            filesystem
          </span>
        </div>
        <FileTree nodes={FILE_TREE} depth={0} onSelect={setSelected} />
      </div>

      {/* Preview pane */}
      <div className="flex-1 overflow-auto p-4">
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-mono">
                {selected.name}
              </span>
            </div>
            <pre className="text-[11px] font-mono text-white/60 leading-relaxed whitespace-pre-wrap">
              {selected.content}
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] text-white/15 font-mono uppercase tracking-widest">
              select a file
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
