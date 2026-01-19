import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/static')({
  component: StaticComponent,
})

function StaticComponent() {
  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Static Routing</h2>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What is Static Routing?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Static routes have fixed, predefined paths. The URL <code style={{ color: '#e94560' }}>/static</code> always
          maps to this exact component. No parameters, no dynamic segments.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/
  static.tsx   <- Fixed path /static`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Code</h3>
        <pre style={{ color: '#aaa', overflow: 'auto' }}>
{`export const Route = createFileRoute('/static')({
  component: StaticComponent,
})`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Simple and predictable</li>
          <li>Best for pages that don't need URL parameters</li>
          <li>Easier to cache and optimize</li>
          <li>Cannot handle variable content based on URL</li>
        </ul>
      </div>
    </div>
  )
}
