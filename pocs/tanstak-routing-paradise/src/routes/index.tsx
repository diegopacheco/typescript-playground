import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Index Route (Home)</h2>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What is an Index Route?</h3>
        <p style={{ lineHeight: '1.6' }}>
          The index route is the default route that renders when visiting the parent path.
          It's defined using <code style={{ color: '#e94560' }}>index.tsx</code> in the routes folder.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/
  index.tsx    <- This file (renders at /)`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Provides a clear entry point for your application</li>
          <li>Works as the fallback when no other route matches at that level</li>
          <li>Essential for nested route hierarchies</li>
        </ul>
      </div>
    </div>
  )
}
