# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LuoYing (珞樱) is a virtual AI companion frontend for Wuhan University's AI School. It features a chat interface with streaming SSE responses, Live2D character rendering with lip-sync viseme driving, and a landing page showcasing the character's capabilities.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server on port 3000 (with API proxy to localhost:8000)
npm run build        # type-check (tsc -b) then vite build
npm run lint         # eslint across .ts/.tsx files
npm run preview      # preview production build
```

There are no test scripts — no test framework is configured.

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS 3 + shadcn/ui (new-york style) + Framer Motion + React Router (HashRouter)

**Routing** (`src/App.tsx`): Two routes inside a shared `Layout` (Navbar + Outlet):
- `/` — `Home` page (landing/hero with parallax, capabilities, agent features)
- `/chat` — `Chat` page (full chat UI with sidebar + Live2D panel)

**API proxy** (`vite.config.ts`): Dev server proxies `/luoying-api/*` to `http://127.0.0.1:8000/`. Production uses relative paths (empty base). The backend SSE endpoint is `POST /chat/stream`.

**Chat system** (`src/hooks/useChat.ts`): The central hook managing all chat state. Key behaviors:
- SSE streaming: parses `text_delta`, `audio`, `expression`, `final`, `error` events from the backend
- Speech queue: audio chunks are queued and played sequentially with text reveal synced to audio duration
- Viseme timeline: converts Chinese text to pinyin syllables, maps them to Live2D mouth shapes (a/o/e/i/u/v) with timed frames
- Fallback mode: when the backend returns no audio, uses `speechSynthesis` API for TTS and a character-by-character text drip loop
- Session management: multiple chat sessions with auto-titling from first user message

**Live2D** (`src/components/chat/Live2DPanel.tsx`): Renders a Live2D Cubism 4 model via pixi.js + pixi-live2d-display. Key patterns:
- Dynamic import of pixi.js and pixi-live2d-display (loaded on mount, not at app start)
- Mouth parameter driving: `ParamMouthOpenY`, `ParamMouthForm`, and vowel params (`ParamA/I/U/E/O`) set via `coreModel.setParameterValueById`
- Audio playback: decodes base64 WAV from backend, creates object URL, drives mouth from volume array + viseme timeline using `requestAnimationFrame`
- Mood-to-expression/motion mapping: maps `Live2DMood` states to model expression IDs and motion indices

**Design tokens** (`tailwind.config.js`): Custom color palette centered on `#0067B1` (WHU blue) and `#E36A95` (sakura rose). Uses HSL CSS variables for shadcn/ui theming alongside hardcoded brand colors. Fonts: `Noto Serif SC` (display), `Inter` (body), `JetBrains Mono` (code).

**shadcn/ui** (`components.json`): Configured with `@/` alias pointing to `src/`. UI primitives live in `src/components/ui/`. Components are added via `npx shadcn@latest add <component>`.

## Key Directories

- `src/components/chat/` — Chat-specific components (ChatMessage, ChatInput, ChatSidebar, Live2DPanel, TypingIndicator)
- `src/components/ui/` — shadcn/ui primitive components
- `src/pages/` — Route-level page components
- `src/hooks/` — Custom hooks (useChat, use-mobile)
- `src/types/` — TypeScript type definitions
- `public/live2d/` — Live2D Cubism model assets (mao_pro) and runtime library
- `public/images/` — Static images (campus bg, university logos)
