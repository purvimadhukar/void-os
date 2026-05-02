import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Space Mono", "Courier New", "monospace"],
      },
      colors: {
        void: {
          black: "#000000",
          white: "#ffffff",
          dim: "#888888",
          border: "#222222",
          hover: "#111111",
          accent: "#ffffff",
        },
      },
      keyframes: {
        glitch: {
          "0%":   { clipPath: "inset(0 0 98% 0)",  transform: "translateX(-3px)" },
          "10%":  { clipPath: "inset(30% 0 50% 0)", transform: "translateX(3px)"  },
          "20%":  { clipPath: "inset(70% 0 15% 0)", transform: "translateX(-2px)" },
          "30%":  { clipPath: "inset(10% 0 80% 0)", transform: "translateX(2px)"  },
          "40%":  { clipPath: "inset(50% 0 30% 0)", transform: "translateX(-3px)" },
          "50%":  { clipPath: "inset(80% 0 5% 0)",  transform: "translateX(3px)"  },
          "60%":  { clipPath: "inset(20% 0 60% 0)", transform: "translateX(-2px)" },
          "70%":  { clipPath: "inset(60% 0 25% 0)", transform: "translateX(2px)"  },
          "80%":  { clipPath: "inset(5% 0 85% 0)",  transform: "translateX(-3px)" },
          "90%":  { clipPath: "inset(40% 0 45% 0)", transform: "translateX(3px)"  },
          "100%": { clipPath: "inset(0 0 98% 0)",   transform: "translateX(-3px)" },
        },
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%":      { opacity: "1" },
          "93%":      { opacity: "0.4" },
          "94%":      { opacity: "1" },
          "96%":      { opacity: "0.6" },
          "97%":      { opacity: "1" },
        },
        typewriter: {
          from: { width: "0" },
          to:   { width: "100%" },
        },
      },
      animation: {
        glitch:     "glitch 4s infinite",
        scanline:   "scanline 10s linear infinite",
        blink:      "blink 1s step-end infinite",
        flicker:    "flicker 6s infinite",
        typewriter: "typewriter 0.5s steps(40) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
