# Qwik Hydration Board

A kanban task board built with **Qwik's resumable architecture**, **TypeScript 6**, and **Bun** runtime. This app showcases how Qwik eliminates traditional hydration overhead by serializing event listeners and state directly into HTML.

## What is Resumability?

Traditional frameworks (React, Vue, Angular) use **hydration**: they download all JS, re-execute every component, and re-attach every listener on page load. This is O(n) with app size.

Qwik uses **resumability**: the server serializes everything into the HTML markup. The browser picks up exactly where the server left off with **zero JS execution at startup**. Code loads on-demand only when users interact.

| Aspect | Hydration (React) | Resumability (Qwik) |
|---|---|---|
| Startup JS | All components downloaded | Zero JS executed |
| Event listeners | Re-attached via JS | Encoded in HTML attributes |
| Scaling | O(n) - grows with app | O(1) - constant regardless of size |
| Interaction | Wait for hydration | Instant |

## Features

- **Kanban board** with To Do, In Progress, and Done columns
- **Add, move, and delete tasks** with priority levels (high/medium/low)
- **Live stats dashboard** showing task counts per status
- **Resumability timer** showing time since page resume
- **Fine-grained reactivity** using `useSignal` and `useStore`
- **Lazy-loaded handlers** every `onClick$` loads JS only on interaction
- **SSR with streaming** via Qwik City and Vite

## Tech Stack

- **Qwik 1.19** - Resumable framework with O(1) startup
- **Qwik City** - Meta-framework for routing and SSR
- **TypeScript 6** - Type-safe development
- **Bun** - Fast JS runtime and package manager
- **Vite** - Build tool and dev server

## How to Run

```bash
./run.sh
```

This installs dependencies with Bun and starts the dev server at `http://localhost:3000`.

## Key Qwik Concepts in This App

### component$
Every component uses the `$` suffix, telling Qwik's optimizer to extract it as a lazy-loadable boundary:
```typescript
export default component$(() => {
  const count = useSignal(0);
  return <button onClick$={() => count.value++}>{count.value}</button>;
});
```

### useSignal / useStore
Fine-grained reactive state that triggers surgical DOM updates:
```typescript
const tasks = useStore<{ items: Task[] }>({ items: [] });
const elapsed = useSignal("0.00");
```

### $ (Dollar Sign)
The `$` suffix marks lazy-load boundaries. Event handlers like `onClick$` are NOT downloaded until the user actually clicks. Open your browser's Network tab and click a button to see this in action.

### useVisibleTask$
Runs code on the client only when the component becomes visible:
```typescript
useVisibleTask$(() => {
  const start = performance.now();
  // runs only in the browser, after resume
});
```

## Project Structure

```
bun-qwik-hydration/
  src/
    routes/
      index.tsx       -- Main kanban board page
      layout.tsx      -- Root layout with caching
    entry.dev.tsx     -- Dev server entry
    entry.ssr.tsx     -- SSR streaming entry
    entry.preview.tsx -- Preview server entry
    root.tsx          -- App shell with QwikCityProvider
    global.css        -- Dark theme styles
  vite.config.ts      -- Vite + Qwik plugins
  tsconfig.json       -- TypeScript configuration
  package.json        -- Dependencies and scripts
  run.sh              -- Quick start script
```
