"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { TerminalLine } from "@/types";

const HOSTNAME = "void-os";
const USER = "root";

const HELP_TEXT = `
VOID OS Terminal v1.0
─────────────────────────────────────
  help        show this message
  whoami      current user
  ls          list directory
  pwd         print working directory
  clear       clear terminal
  date        print date and time
  neofetch    system info
  echo [text] print text
  open [app]  open an application
─────────────────────────────────────
`.trim();

const NEOFETCH = `
        ██╗   ██╗ ██████╗ ██╗██████╗
        ██║   ██║██╔═══██╗██║██╔══██╗
        ██║   ██║██║   ██║██║██║  ██║
        ╚██╗ ██╔╝██║   ██║██║██║  ██║
         ╚████╔╝ ╚██████╔╝██║██████╔╝
          ╚═══╝   ╚═════╝ ╚═╝╚═════╝

  OS:     VOID OS v1.0.0
  Host:   Browser VM
  Kernel: 6.7.0-void
  Shell:  vsh 1.0
  CPU:    Virtual Core @ 3.20GHz
  Memory: 16384 MiB / 16384 MiB
  GPU:    WebGL 2.0
`.trim();

const LS_OUTPUT = `drwxr-xr-x  root  home/
drwxr-xr-x  root  sys/
drwxr-xr-x  root  tmp/
-rw-r--r--  root  README.void
-rwxr-xr-x  root  boot.sh`;

interface Props {
  onOpen?: (app: string) => void;
}

export default function Terminal({ onOpen }: Props) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", text: 'VOID OS Terminal v1.0 — type "help" for commands' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const prompt = `${USER}@${HOSTNAME}:~$`;

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    const newLines: TerminalLine[] = [{ type: "input", text: `${prompt} ${cmd}` }];

    const [base, ...args] = cmd.split(" ");
    const arg = args.join(" ");

    switch (base.toLowerCase()) {
      case "help":
        newLines.push({ type: "output", text: HELP_TEXT });
        break;
      case "whoami":
        newLines.push({ type: "output", text: USER });
        break;
      case "ls":
        newLines.push({ type: "output", text: LS_OUTPUT });
        break;
      case "pwd":
        newLines.push({ type: "output", text: "/root" });
        break;
      case "clear":
        setLines([]);
        setHistory((h) => [cmd, ...h]);
        setHistIdx(-1);
        setInput("");
        return;
      case "date":
        newLines.push({ type: "output", text: new Date().toString() });
        break;
      case "neofetch":
        newLines.push({ type: "output", text: NEOFETCH });
        break;
      case "echo":
        newLines.push({ type: "output", text: arg || "" });
        break;
      case "open":
        if (arg && onOpen) {
          onOpen(arg);
          newLines.push({ type: "output", text: `opening ${arg}...` });
        } else {
          newLines.push({ type: "error", text: "usage: open [terminal|ai|filemanager|editor]" });
        }
        break;
      default:
        newLines.push({
          type: "error",
          text: `vsh: command not found: ${base}. type "help" for commands.`,
        });
    }

    setLines((prev) => [...prev, ...newLines]);
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next]);
    }
  };

  const lineColor = (type: TerminalLine["type"]) => {
    if (type === "input") return "text-white";
    if (type === "error") return "text-white/50";
    if (type === "system") return "text-white/40";
    return "text-white/70";
  };

  return (
    <div
      className="w-full h-full flex flex-col p-3 overflow-hidden cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {lines.map((line, i) => (
          <pre
            key={i}
            className={`text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${lineColor(line.type)}`}
          >
            {line.text}
          </pre>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 mt-2 border-t border-white/5 pt-2 flex-shrink-0">
        <span className="text-[11px] font-mono text-white/40 whitespace-nowrap">{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-[11px] font-mono text-white outline-none border-none caret-white"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
