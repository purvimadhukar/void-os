"use client";

export default function About() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center space-y-6">
      <div>
        <h1 className="glitch text-5xl font-bold tracking-tighter" data-text="VOID">
          VOID
        </h1>
        <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mt-1 font-mono">
          operating system
        </p>
      </div>

      <div className="w-full border-t border-white/10" />

      <div className="space-y-2 text-left w-full max-w-xs">
        {[
          ["version",  "1.0.0"],
          ["build",    "2025.04.29"],
          ["runtime",  "Next.js 15 / React 19"],
          ["renderer", "WebGL 2.0 / Canvas"],
          ["ai core",  "Groq LLaMA-3.3-70B"],
          ["theme",    "monochrome / glitch"],
          ["font",     "Space Mono"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-[11px] font-mono">
            <span className="text-white/30 uppercase tracking-wider">{k}</span>
            <span className="text-white/70">{v}</span>
          </div>
        ))}
      </div>

      <div className="w-full border-t border-white/10" />

      <p className="text-[10px] text-white/20 font-mono leading-relaxed">
        built in 15 days.<br />
        zero budget. maximum ambition.
      </p>
    </div>
  );
}
