import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/nested')({
  component: NestedLayoutComponent,
})

function NestedLayoutComponent() {
  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Nested Routes</h2>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What are Nested Routes?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Nested routes create parent/child relationships. The parent renders an <code style={{ color: '#e94560' }}>Outlet</code> where
          child routes appear. This enables shared layouts and hierarchical navigation.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Link
          to="/nested"
          activeOptions={{ exact: true }}
          style={{ padding: '8px 16px', background: '#0f3460', borderRadius: '4px', color: '#aaa', textDecoration: 'none' }}
          activeProps={{ style: { padding: '8px 16px', background: '#e94560', borderRadius: '4px', color: '#fff', textDecoration: 'none' } }}
        >
          Nested Index
        </Link>
        <Link
          to="/nested/$itemId"
          params={{ itemId: 'item-1' }}
          style={{ padding: '8px 16px', background: '#0f3460', borderRadius: '4px', color: '#aaa', textDecoration: 'none' }}
          activeProps={{ style: { padding: '8px 16px', background: '#e94560', borderRadius: '4px', color: '#fff', textDecoration: 'none' } }}
        >
          Item 1
        </Link>
        <Link
          to="/nested/$itemId"
          params={{ itemId: 'item-2' }}
          style={{ padding: '8px 16px', background: '#0f3460', borderRadius: '4px', color: '#aaa', textDecoration: 'none' }}
          activeProps={{ style: { padding: '8px 16px', background: '#e94560', borderRadius: '4px', color: '#fff', textDecoration: 'none' } }}
        >
          Item 2
        </Link>
      </div>
      <div style={{ background: '#0f3460', padding: '16px', borderRadius: '8px', border: '2px dashed #e94560' }}>
        <p style={{ color: '#aaa', marginBottom: '8px', fontSize: '12px' }}>Child route renders here (Outlet):</p>
        <Outlet />
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>File Structure</h3>
        <pre style={{ color: '#aaa' }}>
{`src/routes/nested/
  route.tsx      <- Parent layout (this file)
  index.tsx      <- Default child (/nested)
  $itemId.tsx    <- Dynamic child (/nested/item-1)`}
        </pre>
      </div>
    </div>
  )
}
