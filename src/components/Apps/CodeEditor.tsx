"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

const STARTER_FILES: Record<string, { lang: string; content: string }> = {
  "main.js": {
    lang: "javascript",
    content: `// VOID OS — Code Editor
// Welcome, developer.

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const results = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log("Fibonacci sequence:", results);

class VoidOS {
  constructor(name) {
    this.name = name;
    this.version = "1.0.0";
  }

  boot() {
    return \`[\${this.name}] booting v\${this.version}...\`;
  }
}

const os = new VoidOS("VOID");
console.log(os.boot());
`,
  },
  "index.ts": {
    lang: "javascript",
    content: `// TypeScript — type-safe void
interface Window {
  id: string;
  title: string;
  x: number;
  y: number;
}

const createWindow = (title: string): Window => ({
  id: crypto.randomUUID(),
  title,
  x: Math.floor(Math.random() * 400) + 80,
  y: Math.floor(Math.random() * 300) + 60,
});

const w = createWindow("Terminal");
console.log(w);
`,
  },
  "style.css": {
    lang: "css" as string,
    content: `/* VOID OS — style */
:root {
  --void-black: #000000;
  --void-white: #ffffff;
}

body {
  background: var(--void-black);
  color: var(--void-white);
  font-family: 'Space Mono', monospace;
  overflow: hidden;
}
`,
  },
};

export default function CodeEditor() {
  const [activeFile, setActiveFile] = useState("main.js");
  const [files, setFiles] = useState(STARTER_FILES);

  const updateContent = (val: string) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: { ...prev[activeFile], content: val },
    }));
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/10 flex-shrink-0 overflow-x-auto">
        {Object.keys(files).map((name) => (
          <button
            key={name}
            onClick={() => setActiveFile(name)}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap border-r border-white/10 transition-colors ${
              activeFile === name
                ? "text-white bg-white/5"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={files[activeFile].content}
          onChange={updateContent}
          height="100%"
          theme="dark"
          style={{
            height: "100%",
            fontSize: 11,
            fontFamily: "'Space Mono', monospace",
          }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-white/10 flex-shrink-0">
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
          {files[activeFile].lang}
        </span>
        <span className="text-[9px] font-mono text-white/20">
          {files[activeFile].content.split("\n").length} lines
        </span>
      </div>
    </div>
  );
}
