# VOID OS — Setup Guide

## Prerequisites
- Node.js 18+ (install from https://nodejs.org — free)
- A free Groq API key (https://console.groq.com — no credit card)

## 1. Install dependencies
```bash
cd void-os
npm install
```

## 2. Set up environment
```bash
cp .env.local.example .env.local
# Open .env.local and paste your Groq API key
```

## 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000 — you'll see the boot sequence.

## 4. Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
# Follow prompts — add GROQ_API_KEY as environment variable
```

## Double-clicking icons
Double-click any desktop icon to open an app.
All windows are draggable and resizable.

## Apps
- TERMINAL — interactive shell with custom commands
- VOID.AI  — AI assistant powered by Groq (LLaMA-3.3-70B, free)
- FILE SYSTEM — virtual file browser
- EDITOR — code editor with syntax highlighting
- ABOUT — system info
