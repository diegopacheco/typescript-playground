import { createFileRoute, useNavigate } from '@tanstack/react-router'

type SearchParams = {
  query?: string
  page?: number
  sort?: 'asc' | 'desc'
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      query: search.query as string | undefined,
      page: Number(search.page) || 1,
      sort: (search.sort as 'asc' | 'desc') || 'asc',
    }
  },
  component: SearchComponent,
})

function SearchComponent() {
  const { query, page, sort } = Route.useSearch()
  const navigate = useNavigate()

  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      to: '/search',
      search: (prev) => ({ ...prev, ...updates }),
    })
  }

  return (
    <div>
      <h2 style={{ color: '#e94560', marginBottom: '16px' }}>Search Parameters</h2>
      <div style={{ background: '#0f3460', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #e94560' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '12px' }}>Current Search State</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '4px' }}>Query</label>
            <input
              type="text"
              value={query || ''}
              onChange={(e) => updateSearch({ query: e.target.value || undefined })}
              placeholder="Type to search..."
              style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '100%', background: '#1a1a2e', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '4px' }}>Page</label>
            <input
              type="number"
              value={page}
              onChange={(e) => updateSearch({ page: Number(e.target.value) || 1 })}
              min={1}
              style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '100%', background: '#1a1a2e', color: '#fff' }}
            />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '4px' }}>Sort</label>
            <select
              value={sort}
              onChange={(e) => updateSearch({ sort: e.target.value as 'asc' | 'desc' })}
              style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '100%', background: '#1a1a2e', color: '#fff' }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <p style={{ marginTop: '12px', color: '#aaa', fontSize: '12px' }}>
          URL: /search?query={query || ''}&page={page}&sort={sort}
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>What are Search Params?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Search params are type-safe query string parameters. TanStack Router validates them using
          <code style={{ color: '#e94560' }}> validateSearch</code> and provides typed access via
          <code style={{ color: '#e94560' }}> useSearch()</code>.
        </p>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Code</h3>
        <pre style={{ color: '#aaa', overflow: 'auto', fontSize: '12px' }}>
{`export const Route = createFileRoute('/search')({
  validateSearch: (search): SearchParams => ({
    query: search.query as string | undefined,
    page: Number(search.page) || 1,
    sort: (search.sort as 'asc' | 'desc') || 'asc',
  }),
  component: SearchComponent,
})

const { query, page, sort } = Route.useSearch()`}
        </pre>
      </div>
      <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ color: '#00d9ff', marginBottom: '8px' }}>Trade-offs</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Shareable URLs with state encoded</li>
          <li>Type-safe validation prevents runtime errors</li>
          <li>Browser history integration (back/forward)</li>
          <li>URL length limits for complex state</li>
        </ul>
      </div>
    </div>
  )
}
