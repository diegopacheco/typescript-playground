import { useCallback, useState } from 'react';
import { notes } from '../api/index.ts';
import { Alert } from '../components/Alert.tsx';
import { Empty } from '../components/Empty.tsx';
import { Panel } from '../components/Panel.tsx';
import { useResource } from '../hooks/useResource.ts';
import type { Note, NoteDraft, Todo } from '../types/api.ts';

const blank = (): NoteDraft => ({ title: '', body: '', todos: [], updatedAt: '' });

const toDraft = (note: Note): NoteDraft => ({
  title: note.title,
  body: note.body ?? '',
  todos: note.todos ?? [],
  updatedAt: note.updatedAt ?? ''
});

const newTodoId = (): string => `td-${Math.random().toString(36).slice(2, 10)}`;

export const NotesTab = () => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Note | null>(null);
  const [draft, setDraft] = useState<NoteDraft>(blank);
  const [todoText, setTodoText] = useState('');

  const load = useCallback(() => notes.list({ search }), [search]);
  const { data, error, loading, run } = useResource<Note[]>(load, []);

  const startNew = () => {
    setEditing(null);
    setDraft(blank());
  };

  const startEdit = (note: Note) => {
    setEditing(note);
    setDraft(toDraft(note));
  };

  const save = async () => {
    if (!draft.title.trim()) return;
    const payload: NoteDraft = { ...draft, title: draft.title.trim(), updatedAt: new Date().toISOString() };
    const ok = await run(() => (editing ? notes.update(editing.id, payload) : notes.create(payload)));
    if (ok) startNew();
  };

  const remove = async (note: Note) => {
    const ok = await run(() => notes.remove(note.id));
    if (ok && editing?.id === note.id) startNew();
  };

  const addTodo = () => {
    const text = todoText.trim();
    if (!text) return;
    setDraft({ ...draft, todos: [...draft.todos, { id: newTodoId(), text, done: false }] });
    setTodoText('');
  };

  const updateTodo = (id: string, changes: Partial<Todo>) =>
    setDraft({
      ...draft,
      todos: draft.todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo))
    });

  const dropTodo = (id: string) =>
    setDraft({ ...draft, todos: draft.todos.filter((todo) => todo.id !== id) });

  const toggleSaved = (note: Note, todo: Todo) =>
    run(() =>
      notes.patch(note.id, {
        todos: (note.todos ?? []).map((item) => (item.id === todo.id ? { ...item, done: !item.done } : item)),
        updatedAt: new Date().toISOString()
      })
    );

  const done = draft.todos.filter((todo) => todo.done).length;

  return (
    <div className="view split split--halves">
      <Panel
        title="Notes"
        actions={
          <div className="row" style={{ alignItems: 'center' }}>
            <button className="btn btn--tiny" onClick={startNew}>
              New note
            </button>
            <input
              className="control"
              style={{ width: 170 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes…"
            />
          </div>
        }
      >
        <Alert message={error} />
        {data.length === 0 && !loading ? (
          <Empty>No notes yet.</Empty>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {data.map((note) => {
              const todos = note.todos ?? [];
              const checked = todos.filter((todo) => todo.done).length;
              return (
                <article
                  key={note.id}
                  onClick={() => startEdit(note)}
                  style={{
                    padding: '13px 15px',
                    border: `1px solid ${editing?.id === note.id ? 'rgba(255,180,84,0.42)' : 'var(--rule)'}`,
                    borderRadius: 8,
                    background: editing?.id === note.id ? 'rgba(255,180,84,0.055)' : 'rgba(255,255,255,0.014)',
                    cursor: 'pointer'
                  }}
                >
                  <header style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'var(--display)',
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#e8eef8'
                      }}
                    >
                      {note.title}
                    </h3>
                    <button
                      className="btn btn--ghost btn--tiny btn--danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void remove(note);
                      }}
                    >
                      ✕
                    </button>
                  </header>
                  {note.body ? (
                    <p
                      style={{
                        margin: '6px 0 0',
                        color: 'var(--text-dim)',
                        fontSize: 13,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {note.body}
                    </p>
                  ) : null}
                  {todos.length > 0 ? (
                    <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'grid', gap: 4 }}>
                      {todos.map((todo) => (
                        <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={todo.done}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => void toggleSaved(note, todo)}
                            style={{ accentColor: 'var(--signal)' }}
                          />
                          <span
                            style={{
                              fontSize: 12.5,
                              color: todo.done ? 'var(--text-faint)' : 'var(--text)',
                              textDecoration: todo.done ? 'line-through' : 'none'
                            }}
                          >
                            {todo.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <footer className="mono" style={{ marginTop: 10, fontSize: 10, color: 'var(--text-faint)' }}>
                    {checked}/{todos.length} done · {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : '—'}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel
        title={editing ? 'Edit note' : 'New note'}
        note={editing ? `id ${editing.id}` : 'POST /notes'}
      >
        <label className="field">
          <span className="field__label">Title</span>
          <input
            className="control"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="What is this about?"
          />
        </label>
        <label className="field">
          <span className="field__label">Note</span>
          <textarea
            className="control"
            value={draft.body}
            onChange={(event) => setDraft({ ...draft, body: event.target.value })}
            placeholder="Write freely…"
          />
        </label>

        <span className="field__label">
          Checklist · {done}/{draft.todos.length}
        </span>
        <ul style={{ listStyle: 'none', margin: '0 0 10px', padding: 0, display: 'grid', gap: 6 }}>
          {draft.todos.map((todo) => (
            <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={(event) => updateTodo(todo.id, { done: event.target.checked })}
                style={{ accentColor: 'var(--signal)' }}
              />
              <input
                className="control"
                value={todo.text}
                onChange={(event) => updateTodo(todo.id, { text: event.target.value })}
                style={{
                  padding: '5px 9px',
                  color: todo.done ? 'var(--text-faint)' : 'var(--text)',
                  textDecoration: todo.done ? 'line-through' : 'none'
                }}
              />
              <button className="btn btn--ghost btn--tiny btn--danger" onClick={() => dropTodo(todo.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="row" style={{ marginBottom: 14, flexWrap: 'nowrap' }}>
          <input
            className="control"
            value={todoText}
            onChange={(event) => setTodoText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addTodo();
            }}
            placeholder="Add a todo and press Enter"
          />
          <button className="btn" onClick={addTodo}>
            Add
          </button>
        </div>

        <div className="row">
          <button className="btn btn--primary" onClick={() => void save()} disabled={!draft.title.trim()}>
            {editing ? 'Save note' : 'Create note'}
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
