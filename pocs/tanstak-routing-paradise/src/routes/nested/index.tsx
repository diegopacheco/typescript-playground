import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nested/')({
  component: NestedIndexComponent,
})

function NestedIndexComponent() {
  return (
    <div style={{ padding: '12px' }}>
      <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Nested Index Route</h3>
      <p style={{ lineHeight: '1.6' }}>
        This is the default content shown at <code style={{ color: '#e94560' }}>/nested</code>.
        Click the buttons above to navigate to child routes.
      </p>
      <div style={{ marginTop: '16px', padding: '12px', background: '#1a1a2e', borderRadius: '4px' }}>
        <h4 style={{ color: '#e94560', marginBottom: '8px' }}>Trade-offs of Nested Routes</h4>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8', color: '#aaa' }}>
          <li>Enables shared UI (headers, sidebars, navigation)</li>
          <li>Natural hierarchy mirrors URL structure</li>
          <li>Can lead to deep nesting complexity</li>
          <li>Parent always renders, affecting performance</li>
        </ul>
      </div>
    </div>
  )
}
