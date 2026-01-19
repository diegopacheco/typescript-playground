import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div style={{ border: '3px solid #e94560', borderRadius: '8px', padding: '16px' }}>
      <div style={{ background: '#e94560', color: '#fff', padding: '8px 16px', borderRadius: '4px', marginBottom: '16px', display: 'inline-block' }}>
        Pathless Layout Wrapper
      </div>
      <Outlet />
    </div>
  )
}
