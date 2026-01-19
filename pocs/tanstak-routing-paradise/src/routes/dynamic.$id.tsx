import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dynamic/$id')({
  component: DynamicComponent,
})

function DynamicComponent() {
  const { id } = Route.useParams()

  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Dynamic Routes</h2>
      <div style={{ background: '#0f3460', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #e94560' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Current Parameter</h3>
        <p style={{ fontSize: '24px', color: '#e94560' }}>id = "{id}"</p>
        <p style={{ marginTop: '8px', color: '#aaa' }}>Try changing the URL: /dynamic/456 or /dynamic/hello</p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What are Dynamic Routes?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Dynamic routes use <code style={{ color: '#e94560' }}>$param</code> syntax to capture URL segments.
          The file <code style={{ color: '#e94560' }}>dynamic.$id.tsx</code> matches any path like /dynamic/123 or /dynamic/abc.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/
  dynamic.$id.tsx   <- Captures $id parameter`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Code</h3>
        <pre style={{ color: '#aaa', overflow: 'auto' }}>
{`export const Route = createFileRoute('/dynamic/$id')({
  component: DynamicComponent,
})

function DynamicComponent() {
  const { id } = Route.useParams()
  return <div>ID: {id}</div>
}`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Essential for resource-based URLs (users, products, posts)</li>
          <li>Type-safe parameters with TanStack Router</li>
          <li>Requires validation for security</li>
          <li>More complex data loading logic</li>
        </ul>
      </div>
    </div>
  )
}
