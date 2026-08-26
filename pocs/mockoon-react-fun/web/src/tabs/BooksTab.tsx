import { useCallback, useMemo, useState } from 'react';
import { books } from '../api/index.ts';
import { Alert } from '../components/Alert.tsx';
import { Empty } from '../components/Empty.tsx';
import { Panel } from '../components/Panel.tsx';
import { TextField } from '../components/Field.tsx';
import { useResource } from '../hooks/useResource.ts';
import type { Book, BookDraft } from '../types/api.ts';

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'genre', label: 'Genre' },
  { key: 'year', label: 'Year' },
  { key: 'rating', label: 'Rating' }
] as const;

const blank = (): BookDraft => ({
  title: '',
  author: '',
  isbn: '',
  year: new Date().getFullYear(),
  genre: '',
  rating: 3,
  createdAt: ''
});

const toDraft = (book: Book): BookDraft => ({
  title: book.title,
  author: book.author,
  isbn: book.isbn ?? '',
  year: book.year ?? 0,
  genre: book.genre ?? '',
  rating: book.rating ?? 0,
  createdAt: book.createdAt ?? ''
});

const Stars = ({ rating }: { rating: number }) => {
  const score = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <span className="stars" title={`${score} of 5`}>
      {'★'.repeat(score)}
      <i>{'★'.repeat(5 - score)}</i>
    </span>
  );
};

export const BooksTab = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [editing, setEditing] = useState<Book | null>(null);
  const [draft, setDraft] = useState<BookDraft>(blank);

  const load = useCallback(() => books.list({ search, sort, order }), [search, sort, order]);
  const { data, error, loading, run } = useResource<Book[]>(load, []);

  const startNew = () => {
    setEditing(null);
    setDraft(blank());
  };

  const startEdit = (book: Book) => {
    setEditing(book);
    setDraft(toDraft(book));
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.author.trim()) return;
    const payload: BookDraft = {
      ...draft,
      title: draft.title.trim(),
      author: draft.author.trim(),
      createdAt: draft.createdAt || new Date().toISOString()
    };
    const ok = await run(() => (editing ? books.update(editing.id, payload) : books.create(payload)));
    if (ok) startNew();
  };

  const remove = async (book: Book) => {
    const ok = await run(() => books.remove(book.id));
    if (ok && editing?.id === book.id) startNew();
  };

  const toggleSort = (key: string) => {
    if (sort === key) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key);
      setOrder('asc');
    }
  };

  const summary = useMemo(() => {
    const genres = new Set(data.map((book) => book.genre).filter(Boolean));
    return `${data.length} shown · ${genres.size} genres`;
  }, [data]);

  return (
    <div className="view split split--aside">
      <Panel
        title="Catalogue"
        actions={
          <div className="row" style={{ alignItems: 'center' }}>
            <span className="panel__note">{loading ? 'loading…' : summary}</span>
            <input
              className="control"
              style={{ width: 210 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search every field…"
            />
          </div>
        }
      >
        <Alert message={error} />
        {data.length === 0 && !loading ? (
          <Empty>No book matches. The bucket is served straight from Mockoon.</Empty>
        ) : (
          <table className="grid-table">
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => toggleSort(column.key)}
                    aria-sort={sort === column.key ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    {column.label}
                  </th>
                ))}
                <th aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {data.map((book) => (
                <tr key={book.id} onClick={() => startEdit(book)} aria-selected={editing?.id === book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td className="mono">{book.genre || '—'}</td>
                  <td className="mono">{book.year || '—'}</td>
                  <td>
                    <Stars rating={book.rating} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn--ghost btn--tiny btn--danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void remove(book);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <Panel title={editing ? 'Edit book' : 'New book'} note={editing ? `id ${editing.id}` : 'POST /books'}>
        <TextField label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <TextField label="Author" value={draft.author} onChange={(author) => setDraft({ ...draft, author })} />
        <div className="row" style={{ marginBottom: 12 }}>
          <TextField label="Genre" value={draft.genre} onChange={(genre) => setDraft({ ...draft, genre })} />
          <TextField
            label="Year"
            type="number"
            value={String(draft.year)}
            onChange={(year) => setDraft({ ...draft, year: Number(year) || 0 })}
          />
        </div>
        <TextField label="ISBN" value={draft.isbn} onChange={(isbn) => setDraft({ ...draft, isbn })} />
        <label className="field">
          <span className="field__label">Rating · {draft.rating}</span>
          <input
            className="control"
            type="range"
            min={0}
            max={5}
            value={draft.rating}
            onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })}
          />
        </label>
        <div className="row">
          <button className="btn btn--primary" onClick={() => void save()} disabled={!draft.title || !draft.author}>
            {editing ? 'Save changes' : 'Add book'}
          </button>
          {editing ? (
            <button className="btn" onClick={startNew}>
              Cancel
            </button>
          ) : null}
        </div>
      </Panel>
    </div>
  );
};
