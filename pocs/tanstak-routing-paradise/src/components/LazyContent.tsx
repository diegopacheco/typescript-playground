export default function LazyContent() {
  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Lazy Loading Routes</h2>
      <div style={{ background: '#0f3460', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #00d9ff' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>This component was lazy loaded!</h3>
        <p style={{ lineHeight: '1.6' }}>
          Check your browser's Network tab - this chunk was only loaded when you navigated to this route.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What is Lazy Loading?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Lazy routes are code-split into separate bundles. TanStack Router supports lazy loading via
          <code style={{ color: '#e94560' }}> lazyRouteComponent()</code> which uses dynamic imports.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/
  code-split.tsx        <- Route definition with lazyRouteComponent
src/components/
  LazyContent.tsx       <- Lazy loaded component`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Code</h3>
        <pre style={{ color: '#aaa', overflow: 'auto' }}>
{`import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/code-split')({
  component: lazyRouteComponent(
    () => import('../components/LazyContent')
  ),
})`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Reduces initial bundle size significantly</li>
          <li>Faster initial page load</li>
          <li>Small delay on first navigation to lazy route</li>
          <li>Additional HTTP requests for chunks</li>
          <li>Can combine with prefetching for best UX</li>
        </ul>
      </div>
    </div>
  )
}
