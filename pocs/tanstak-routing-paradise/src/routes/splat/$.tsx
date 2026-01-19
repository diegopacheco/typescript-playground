import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/splat/$')({
  component: SplatComponent,
})

function SplatComponent() {
  const { _splat } = Route.useParams()
  const segments = _splat ? _splat.split('/') : []

  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Catch-All / Splat Routes</h2>
      <div style={{ background: '#0f3460', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #e94560' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Captured Path</h3>
        <p style={{ fontSize: '20px', color: '#e94560', marginBottom: '8px' }}>
          _splat = "{_splat}"
        </p>
        <div style={{ marginTop: '12px' }}>
          <p style={{ color: '#aaa', marginBottom: '8px' }}>Segments:</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {segments.map((seg, i) => (
              <span key={i} style={{ background: '#1a1a2e', padding: '4px 12px', borderRadius: '4px', color: '#00d9ff' }}>
                {seg}
              </span>
            ))}
          </div>
        </div>
        <p style={{ marginTop: '12px', color: '#aaa', fontSize: '12px' }}>
          Try: /splat/anything/you/want/here
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What are Splat Routes?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Splat routes use <code style={{ color: '#e94560' }}>$</code> to match any remaining path segments.
          The file <code style={{ color: '#e94560' }}>$.tsx</code> captures everything after /splat/ into the _splat parameter.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/splat/
  $.tsx    <- Matches /splat/* (any depth)`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Code</h3>
        <pre style={{ color: '#aaa', overflow: 'auto' }}>
{`export const Route = createFileRoute('/splat/$')({
  component: SplatComponent,
})

function SplatComponent() {
  const { _splat } = Route.useParams()
  // _splat contains: "any/path/here"
}`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Useful for 404 pages and file browsers</li>
          <li>Handles unknown URL structures gracefully</li>
          <li>Can be used for wildcard matching</li>
          <li>Less type-safe than specific routes</li>
          <li>Requires manual path parsing</li>
        </ul>
      </div>
    </div>
  )
}
