# TanStack Routing Paradise - Implementation Plan

## Overview
Create a TanStack Router playground/paradise application with a tabbed UI where each tab demonstrates a different routing strategy. Built with Bun, Vite, React, and TypeScript.

## Requirements Summary
1. Add TanStack Router to the project
2. Create separate TypeScript files for each routing strategy in `src/`
3. Tabbed UI - each tab demonstrates a different routing strategy
4. Use latest versions: Bun, Vite, TypeScript, TanStack Router
5. `run.sh` must start the app successfully
6. README.md with documentation of all routing strategies, explanations, and trade-offs

## Files to Create/Modify

### Configuration Files
- `package.json` - Dependencies (TanStack Router, React, Vite)
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite + TanStack Router plugin
- `index.html` - HTML entry point
- `run.sh` - Update to run Vite dev server

### Core Application Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app with tabbed navigation
- `src/router.tsx` - Router configuration
- `src/routes/__root.tsx` - Root route with tab layout

### Routing Strategy Files (one per strategy)
Each file demonstrates a specific routing pattern:

| File | Strategy | Description |
|------|----------|-------------|
| `src/routes/index.tsx` | Index Route | Home/default route |
| `src/routes/static.tsx` | Static Routing | Fixed path routes |
| `src/routes/dynamic.$id.tsx` | Dynamic Routes | URL parameters with `$param` |
| `src/routes/nested/route.tsx` | Nested Routes | Parent/child hierarchy |
| `src/routes/nested/index.tsx` | Nested Index | Child index route |
| `src/routes/nested/$itemId.tsx` | Nested Dynamic | Dynamic child |
| `src/routes/_layout.tsx` | Pathless Layout | Layout without URL segment |
| `src/routes/_layout/protected.tsx` | Protected Route | Auth guard with beforeLoad |
| `src/routes/search.tsx` | Search Params | Type-safe query params |
| `src/routes/lazy.lazy.tsx` | Lazy Loading | Code-split route |
| `src/routes/splat/$.tsx` | Catch-All/Splat | Wildcard routes |

### Documentation
- `README.md` - Full documentation with:
  - All routing strategies explained
  - Code examples for each
  - Trade-offs and use cases
  - How to run the project

## Implementation Steps

### Step 1: Project Setup
- Create `package.json` with dependencies:
  - `@tanstack/react-router`
  - `@tanstack/router-plugin`
  - `react`, `react-dom`
  - `vite`, `@vitejs/plugin-react`
  - TypeScript types
- Create `tsconfig.json`
- Create `vite.config.ts` with TanStack Router plugin
- Create `index.html`

### Step 2: Core Application
- Create `src/main.tsx` - React entry point with RouterProvider
- Create `src/router.tsx` - Router instance and route tree
- Create `src/routes/__root.tsx` - Root layout with tabs UI

### Step 3: Routing Strategy Implementations
Create each strategy file with:
- Working route component
- Visual demonstration of the strategy
- Display of relevant route data (params, search, etc.)

### Step 4: Tab Navigation UI
- Tabs at top of the page
- Each tab links to a different routing strategy route
- Visual styling to show active tab
- Brief description of each strategy in the tab content

### Step 5: Update Scripts
- Update `run.sh` to execute `bun run dev`
- Ensure app starts and all routes work

### Step 6: Documentation
- Write comprehensive README.md with all strategies documented

## Routing Strategies to Demonstrate

1. **Static Routing** - Fixed paths (`/about`, `/contact`)
2. **Dynamic Routes** - URL parameters (`/users/$userId`)
3. **Nested Routes** - Parent/child with Outlet
4. **Index Routes** - Default child route
5. **Pathless Layout** - Shared wrapper without URL segment
6. **Protected Routes** - Auth guards with beforeLoad
7. **Search Params** - Type-safe query parameters
8. **Lazy Loading** - Code-split routes
9. **Catch-All/Splat** - Wildcard matching

## Verification
1. Run `./run.sh` - app should start on localhost
2. Navigate to each tab - all routes should render
3. Test dynamic routes with different IDs
4. Test search params by modifying URL query
5. Verify lazy route loads on demand
6. Test catch-all route with arbitrary paths

## Dependencies (Latest Versions)
```json
{
  "@tanstack/react-router": "^1.95.1",
  "@tanstack/router-plugin": "^1.95.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "vite": "^6.0.0",
  "@vitejs/plugin-react": "^4.3.0",
  "typescript": "^5.7.0"
}
```
