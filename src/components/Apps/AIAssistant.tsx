"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChatMessage } from "@/types";

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "VOID.AI online. I am your system intelligence. Ask me anything — code, concepts, ideas, or OS diagnostics.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulated += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: accumulated,
            };
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "ERROR: Connection to AI core failed. Check your GROQ_API_KEY in .env.local",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/20 font-mono px-1">
              {msg.role === "user" ? "YOU" : "VOID.AI"}
            </span>
            <div
              className={`max-w-[85%] text-[11px] font-mono leading-relaxed whitespace-pre-wrap p-2.5 ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/80"
              }`}
            >
              {msg.content}
              {loading && i === messages.length - 1 && msg.role === "assistant" && (
                <span className="cursor-blink ml-0.5">█</span>
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex flex-col items-start gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/20 font-mono px-1">
              VOID.AI
            </span>
            <div className="border border-white/10 p-2.5 text-[11px] font-mono text-white/40">
              <span className="cursor-blink">█</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="ask anything... (enter to send)"
            rows={2}
            className="flex-1 bg-transparent text-[11px] font-mono text-white placeholder:text-white/20 outline-none border border-white/10 p-2 resize-none"
            style={{ minHeight: 48 }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="text-[10px] font-mono tracking-widest uppercase border border-white/20 px-3 py-2 text-white/50 hover:text-white hover:border-white/60 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "SEND"}
          </button>
        </div>
        <p className="text-[9px] text-white/15 mt-1 font-mono">shift+enter for new line</p>
      </div>
    </div>
  );
}
