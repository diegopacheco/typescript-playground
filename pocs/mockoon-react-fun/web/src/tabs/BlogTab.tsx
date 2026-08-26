import { useCallback, useState } from 'react';
import { posts } from '../api/index.ts';
import { Alert } from '../components/Alert.tsx';
import { Empty } from '../components/Empty.tsx';
import { Panel } from '../components/Panel.tsx';
import { useResource } from '../hooks/useResource.ts';
import { toStorableDataUrl } from '../lib/image.ts';
import { youtubeId } from '../lib/youtube.ts';
import type { Post, PostDraft } from '../types/api.ts';

const blank = (): PostDraft => ({
  title: '',
  author: 'Diego Pacheco',
  body: '',
  tags: [],
  imageUrl: '',
  youtubeUrl: '',
  publishedAt: ''
});

const toDraft = (post: Post): PostDraft => ({
  title: post.title,
  author: post.author ?? '',
  body: post.body ?? '',
  tags: post.tags ?? [],
  imageUrl: post.imageUrl ?? '',
  youtubeUrl: post.youtubeUrl ?? '',
  publishedAt: post.publishedAt ?? ''
});

const Tag = ({ label }: { label: string }) => (
  <span
    className="mono"
    style={{
      padding: '2px 8px',
      border: '1px solid var(--rule-bright)',
      borderRadius: 99,
      fontSize: 10,
      color: 'var(--cyan)'
    }}
  >
    #{label}
  </span>
);

export const BlogTab = () => {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Post | null>(null);
  const [draft, setDraft] = useState<PostDraft>(blank);
  const [tagText, setTagText] = useState('');
  const [composing, setComposing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const load = useCallback(() => posts.list({ search, sort: 'publishedAt', order: 'desc' }), [search]);
  const { data, error, loading, run } = useResource<Post[]>(load, []);

  const startNew = () => {
    setEditing(null);
    setDraft(blank());
    setComposing(true);
  };

  const startEdit = (post: Post) => {
    setEditing(post);
    setDraft(toDraft(post));
    setComposing(true);
  };

  const close = () => {
    setEditing(null);
    setDraft(blank());
    setComposing(false);
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.body.trim()) return;
    const payload: PostDraft = {
      ...draft,
      title: draft.title.trim(),
      body: draft.body.trim(),
      publishedAt: draft.publishedAt || new Date().toISOString()
    };
    const ok = await run(() => (editing ? posts.update(editing.id, payload) : posts.create(payload)));
    if (ok) close();
  };

  const addTag = () => {
    const tag = tagText.trim().replace(/^#/, '');
    if (!tag || draft.tags.includes(tag)) return;
    setDraft({ ...draft, tags: [...draft.tags, tag] });
    setTagText('');
  };

  const pickCover = async (file: File | undefined) => {
    if (!file) return;
    setLocalError(null);
    try {
      setDraft({ ...draft, imageUrl: await toStorableDataUrl(file) });
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  return (
    <div className="view">
      <Panel
        title={composing ? (editing ? 'Edit post' : 'New post') : 'Compose'}
        actions={
          <div className="row" style={{ alignItems: 'center' }}>
            <input
              className="control"
              style={{ width: 190 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts…"
            />
            {composing ? (
              <button className="btn btn--tiny" onClick={close}>
                Close
              </button>
            ) : (
              <button className="btn btn--tiny btn--primary" onClick={startNew}>
                Write a post
              </button>
            )}
          </div>
        }
      >
        <Alert message={localError ?? error} />
        {composing ? (
          <div className="split split--halves">
            <div>
              <label className="field">
                <span className="field__label">Title</span>
                <input
                  className="control"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </label>
              <label className="field">
                <span className="field__label">Author</span>
                <input
                  className="control"
                  value={draft.author}
                  onChange={(event) => setDraft({ ...draft, author: event.target.value })}
                />
              </label>
              <label className="field">
                <span className="field__label">Body · blank line starts a paragraph</span>
                <textarea
                  className="control"
                  style={{ minHeight: 190 }}
                  value={draft.body}
                  onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                />
              </label>
            </div>
            <div>
              <label className="field">
                <span className="field__label">YouTube URL</span>
                <input
                  className="control"
                  value={draft.youtubeUrl}
                  onChange={(event) => setDraft({ ...draft, youtubeUrl: event.target.value })}
                  placeholder="https://youtu.be/…"
                />
              </label>
              <label className="field">
                <span className="field__label">Cover picture URL</span>
                <input
                  className="control"
                  value={draft.imageUrl.startsWith('data:') ? '(uploaded picture)' : draft.imageUrl}
                  onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
                  placeholder="https://picsum.photos/id/180/1200/600"
                />
              </label>
              <label className="field">
                <span className="field__label">…or upload one</span>
                <input
                  className="control"
                  type="file"
                  accept="image/*"
                  onChange={(event) => void pickCover(event.target.files?.[0])}
                />
              </label>

              <span className="field__label">Tags</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {draft.tags.map((tag) => (
                  <button
                    key={tag}
                    className="btn btn--ghost btn--tiny"
                    onClick={() => setDraft({ ...draft, tags: draft.tags.filter((item) => item !== tag) })}
                  >
                    #{tag} ✕
                  </button>
                ))}
              </div>
              <div className="row" style={{ marginBottom: 14, flexWrap: 'nowrap' }}>
                <input
                  className="control"
                  value={tagText}
                  onChange={(event) => setTagText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') addTag();
                  }}
                  placeholder="Add a tag"
                />
                <button className="btn" onClick={addTag}>
                  Add
                </button>
              </div>

              <button
                className="btn btn--primary"
                onClick={() => void save()}
                disabled={!draft.title.trim() || !draft.body.trim()}
              >
                {editing ? 'Save post' : 'Publish'}
              </button>
            </div>
          </div>
        ) : (
          <p className="panel__note" style={{ margin: 0 }}>
            {loading ? 'Loading…' : `${data.length} posts served from the mock data bucket.`}
          </p>
        )}
      </Panel>

      <div style={{ display: 'grid', gap: 18, marginTop: 18 }}>
        {data.length === 0 && !loading ? <Empty>Nothing published yet.</Empty> : null}
        {data.map((post) => {
          const video = youtubeId(post.youtubeUrl ?? '');
          return (
            <article key={post.id} className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt=""
                  style={{ display: 'block', width: '100%', maxHeight: 260, objectFit: 'cover' }}
                />
              ) : null}
              <div style={{ padding: '18px 20px 20px' }}>
                <header
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'var(--display)',
                        fontSize: 21,
                        fontWeight: 700,
                        color: '#eef3fa'
                      }}
                    >
                      {post.title}
                    </h3>
                    <p className="mono" style={{ margin: '5px 0 0', fontSize: 10.5, color: 'var(--text-faint)' }}>
                      {post.author || 'anonymous'} ·{' '}
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div className="row" style={{ flexWrap: 'nowrap' }}>
                    <button className="btn btn--tiny" onClick={() => startEdit(post)}>
                      Edit
                    </button>
                    <button
                      className="btn btn--tiny btn--ghost btn--danger"
                      onClick={() => void run(() => posts.remove(post.id))}
                    >
                      Delete
                    </button>
                  </div>
                </header>

                {(post.tags ?? []).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
                    {(post.tags ?? []).map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                ) : null}

                <div className="prose">
                  {post.body.split(/\n{2,}/).map((paragraph, index) => (
                    <p key={index} style={{ margin: '13px 0 0', color: 'var(--text-dim)' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {video ? (
                  <div className="embed">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video}`}
                      title={post.title}
                      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
