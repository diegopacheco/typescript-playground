import { createFileRoute, redirect } from '@tanstack/react-router'

const isAuthenticated = () => {
  return true
}

export const Route = createFileRoute('/_layout/protected')({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: ProtectedComponent,
})

function ProtectedComponent() {
  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Protected Route with Pathless Layout</h2>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What is a Pathless Layout?</h3>
        <p style={{ lineHeight: '1.6' }}>
          The <code style={{ color: '#e94560' }}>_layout</code> prefix creates a layout route without adding a URL segment.
          This page is at <code style={{ color: '#e94560' }}>/protected</code>, not <code style={{ color: '#aaa' }}>/layout/protected</code>.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What is a Protected Route?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Protected routes use <code style={{ color: '#e94560' }}>beforeLoad</code> to check authentication before rendering.
          If the check fails, users are redirected (currently auth is mocked as true).
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/
  _layout.tsx           <- Pathless layout (underscore prefix)
  _layout/
    protected.tsx       <- Child route at /protected`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Code</h3>
        <pre style={{ color: '#aaa', overflow: 'auto' }}>
{`export const Route = createFileRoute('/_layout/protected')({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: ProtectedComponent,
})`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Pathless layouts group routes without URL impact</li>
          <li>beforeLoad runs before component renders</li>
          <li>Type-safe redirects with TanStack Router</li>
          <li>Can be async for API-based auth checks</li>
        </ul>
      </div>
    </div>
  )
}
