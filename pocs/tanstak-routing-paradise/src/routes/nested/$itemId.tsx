import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nested/$itemId')({
  component: NestedItemComponent,
})

function NestedItemComponent() {
  const { itemId } = Route.useParams()

  return (
    <div style={{ padding: '12px' }}>
      <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Nested Dynamic Route</h3>
      <p style={{ fontSize: '20px', color: '#e94560', marginBottom: '12px' }}>
        Item ID: "{itemId}"
      </p>
      <p style={{ lineHeight: '1.6', color: '#aaa' }}>
        This component receives the <code style={{ color: '#e94560' }}>$itemId</code> parameter
        while still being rendered inside the parent nested layout.
      </p>
    </div>
  )
}
