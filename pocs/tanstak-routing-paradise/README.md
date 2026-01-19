# TanStack Routing Paradise

A playground application demonstrating TanStack Router's file-based routing strategies with a tabbed UI.

## Requirements

- Bun (latest)
- Node.js 18+ (for compatibility)

## Running the App

```bash
./run.sh
```

Or manually:

```bash
bun install
bun run dev
```

Visit http://localhost:5173

## Routing Strategies

### 1. Index Route

**File:** `src/routes/index.tsx`

The default route that renders at the root path `/`. Index routes serve as the landing page for their parent route segment.

```typescript
export const Route = createFileRoute('/')({
  component: IndexComponent,
})
```

**Use cases:** Home pages, default views in nested layouts

### 2. Static Routing

**File:** `src/routes/static.tsx`

Fixed paths that don't change. The URL `/static` always renders the same component.

```typescript
export const Route = createFileRoute('/static')({
  component: StaticComponent,
})
```

**Trade-offs:**
- Simple and predictable
- Easy to cache
- Cannot handle variable content

### 3. Dynamic Routes

**File:** `src/routes/dynamic.$id.tsx`

URL parameters captured using `$param` syntax. Matches `/dynamic/123`, `/dynamic/abc`, etc.

```typescript
export const Route = createFileRoute('/dynamic/$id')({
  component: DynamicComponent,
})

function DynamicComponent() {
  const { id } = Route.useParams()
}
```

**Trade-offs:**
- Essential for resource-based URLs
- Type-safe parameters
- Requires validation for security

### 4. Nested Routes

**Files:**
- `src/routes/nested/route.tsx` (parent layout)
- `src/routes/nested/index.tsx` (default child)
- `src/routes/nested/$itemId.tsx` (dynamic child)

Parent routes render an `<Outlet />` where child routes appear, enabling shared layouts.

```typescript
function NestedLayoutComponent() {
  return (
    <div>
      <nav>...</nav>
      <Outlet />
    </div>
  )
}
```

**Trade-offs:**
- Enables shared UI components
- Natural URL hierarchy
- Can become complex with deep nesting

### 5. Pathless Layout Routes

**Files:**
- `src/routes/_layout.tsx` (layout without URL segment)
- `src/routes/_layout/protected.tsx` (child at `/protected`)

The underscore prefix creates a layout that wraps children without adding a URL segment.

```typescript
export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})
```

**Trade-offs:**
- Groups routes without URL impact
- Clean URL structure
- Can be confusing to debug

### 6. Protected Routes

**File:** `src/routes/_layout/protected.tsx`

Routes with authentication guards using `beforeLoad`.

```typescript
export const Route = createFileRoute('/_layout/protected')({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: ProtectedComponent,
})
```

**Trade-offs:**
- Prevents unauthorized access
- Runs before component renders
- Can be async for API checks
- Type-safe redirects

### 7. Search Params

**File:** `src/routes/search.tsx`

Type-safe query string parameters with validation.

```typescript
export const Route = createFileRoute('/search')({
  validateSearch: (search): SearchParams => ({
    query: search.query as string | undefined,
    page: Number(search.page) || 1,
    sort: (search.sort as 'asc' | 'desc') || 'asc',
  }),
  component: SearchComponent,
})

function SearchComponent() {
  const { query, page, sort } = Route.useSearch()
}
```

**Trade-offs:**
- Shareable URLs with encoded state
- Browser history integration
- URL length limits for complex state

### 8. Lazy Loading

**Files:**
- `src/routes/code-split.tsx` (route with lazy component)
- `src/components/LazyContent.tsx` (lazy loaded component)

Code-split routes loaded on demand using `lazyRouteComponent()`.

```typescript
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/code-split')({
  component: lazyRouteComponent(() => import('../components/LazyContent')),
})
```

**Trade-offs:**
- Reduces initial bundle size
- Faster initial page load
- Small delay on first navigation
- Can combine with prefetching

### 9. Catch-All / Splat Routes

**File:** `src/routes/splat/$.tsx`

Wildcard routes matching any path depth using `$`.

```typescript
export const Route = createFileRoute('/splat/$')({
  component: SplatComponent,
})

function SplatComponent() {
  const { _splat } = Route.useParams()
}
```

**Trade-offs:**
- Handles unknown URLs gracefully
- Useful for 404 pages
- Less type-safe
- Requires manual path parsing

## File Structure

```
src/
  components/
    LazyContent.tsx    # Lazy loaded component
  routes/
    __root.tsx         # Root layout with tabs
    index.tsx          # Home (/)
    static.tsx         # Static routing (/static)
    dynamic.$id.tsx    # Dynamic params (/dynamic/:id)
    search.tsx         # Search params (/search?...)
    code-split.tsx     # Lazy loaded (/code-split)
    _layout.tsx        # Pathless layout
    _layout/
      protected.tsx    # Protected route (/protected)
    nested/
      route.tsx        # Nested parent (/nested)
      index.tsx        # Nested index (/nested)
      $itemId.tsx      # Nested dynamic (/nested/:itemId)
    splat/
      $.tsx            # Catch-all (/splat/*)
```

## Technologies

- TanStack Router v1.95+
- React 19
- Vite 6
- TypeScript 5.7
- Bun
