import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

const tabStyle = {
  display: 'inline-block',
  padding: '10px 16px',
  margin: '0 4px',
  borderRadius: '8px 8px 0 0',
  textDecoration: 'none',
  color: '#aaa',
  background: '#16213e',
  border: '1px solid #0f3460',
  borderBottom: 'none',
  fontSize: '14px',
  transition: 'all 0.2s',
}

const activeProps = {
  style: {
    ...tabStyle,
    background: '#0f3460',
    color: '#e94560',
    fontWeight: 'bold',
  },
}

export const Route = createRootRoute({
  component: () => (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#e94560', marginBottom: '20px' }}>TanStack Routing Paradise</h1>
      <nav style={{
        borderBottom: '2px solid #0f3460',
        paddingBottom: '0',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
      }}>
        <Link to="/" style={tabStyle} activeProps={activeProps} activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to="/static" style={tabStyle} activeProps={activeProps}>
          Static
        </Link>
        <Link to="/dynamic/123" style={tabStyle} activeProps={activeProps}>
          Dynamic
        </Link>
        <Link to="/nested" style={tabStyle} activeProps={activeProps}>
          Nested
        </Link>
        <Link to="/protected" style={tabStyle} activeProps={activeProps}>
          Protected
        </Link>
        <Link to="/search" style={tabStyle} activeProps={activeProps}>
          Search Params
        </Link>
        <Link to="/code-split" style={tabStyle} activeProps={activeProps}>
          Lazy
        </Link>
        <Link to="/splat/any/path/here" style={tabStyle} activeProps={activeProps}>
          Catch-All
        </Link>
      </nav>
      <div style={{
        background: '#16213e',
        padding: '20px',
        borderRadius: '0 8px 8px 8px',
        minHeight: '400px'
      }}>
        <Outlet />
      </div>
    </div>
  ),
})
