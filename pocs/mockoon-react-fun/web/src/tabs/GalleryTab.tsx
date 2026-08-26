import { useCallback, useRef, useState } from 'react';
import { images } from '../api/index.ts';
import { Alert } from '../components/Alert.tsx';
import { Empty } from '../components/Empty.tsx';
import { Panel } from '../components/Panel.tsx';
import { useResource } from '../hooks/useResource.ts';
import { readableSize, toStorableDataUrl } from '../lib/image.ts';
import type { GalleryImage, ImageDraft } from '../types/api.ts';

export const GalleryTab = () => {
  const [remoteUrl, setRemoteUrl] = useState('');
  const [remoteName, setRemoteName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  const filePicker = useRef<HTMLInputElement>(null);

  const load = useCallback(() => images.list(), []);
  const { data, error, loading, run } = useResource<GalleryImage[]>(load, []);

  const store = (draft: Omit<ImageDraft, 'addedAt'>) =>
    run(() => images.create({ ...draft, addedAt: new Date().toISOString() }));

  const addRemote = async () => {
    const url = remoteUrl.trim();
    if (!url) return;
    const ok = await store({
      name: remoteName.trim() || url.split('/').pop() || 'Untitled',
      source: 'url',
      url,
      bytes: 0
    });
    if (ok) {
      setRemoteUrl('');
      setRemoteName('');
    }
  };

  const addFiles = async (files: FileList | File[]) => {
    setLocalError(null);
    const pictures = [...files].filter((file) => file.type.startsWith('image/'));
    if (pictures.length === 0) {
      setLocalError('Only image files can be added to the gallery.');
      return;
    }
    for (const file of pictures) {
      setBusy(file.name);
      try {
        const dataUrl = await toStorableDataUrl(file);
        await store({ name: file.name, source: 'upload', url: dataUrl, bytes: dataUrl.length });
      } catch (cause) {
        setLocalError(cause instanceof Error ? cause.message : String(cause));
      }
    }
    setBusy('');
  };

  const remove = async (image: GalleryImage) => {
    const ok = await run(() => images.remove(image.id));
    if (ok && preview?.id === image.id) setPreview(null);
  };

  return (
    <div className="view">
      <div className="split split--aside" style={{ marginBottom: 18 }}>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void addFiles(event.dataTransfer.files);
          }}
          onClick={() => filePicker.current?.click()}
          style={{
            display: 'grid',
            placeItems: 'center',
            minHeight: 178,
            padding: 22,
            border: `1px dashed ${dragging ? 'var(--signal)' : 'var(--rule-bright)'}`,
            borderRadius: 10,
            background: dragging ? 'rgba(255,180,84,0.07)' : 'rgba(255,255,255,0.014)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color 0.18s ease, background 0.18s ease'
          }}
        >
          <input
            ref={filePicker}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) void addFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, color: '#e8eef8' }}>
              {busy ? `Encoding ${busy}…` : 'Drop pictures here'}
            </div>
            <p className="mono" style={{ margin: '7px 0 0', fontSize: 11, color: 'var(--text-faint)' }}>
              or click to pick files · downscaled in the browser, then POSTed as a data URL
            </p>
          </div>
        </div>

        <Panel title="Add from a URL" note="POST /images">
          <label className="field">
            <span className="field__label">Image URL</span>
            <input
              className="control"
              value={remoteUrl}
              onChange={(event) => setRemoteUrl(event.target.value)}
              placeholder="https://picsum.photos/id/1024/900/600"
            />
          </label>
          <label className="field">
            <span className="field__label">Caption</span>
            <input
              className="control"
              value={remoteName}
              onChange={(event) => setRemoteName(event.target.value)}
              placeholder="Optional"
            />
          </label>
          <button className="btn btn--primary" onClick={() => void addRemote()} disabled={!remoteUrl.trim()}>
            Add to gallery
          </button>
        </Panel>
      </div>

      <Panel title="Gallery" note={loading ? 'loading…' : `${data.length} images in the mock bucket`}>
        <Alert message={localError ?? error} />
        {data.length === 0 && !loading ? (
          <Empty>Nothing here yet. Drop a picture or paste a URL above.</Empty>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 13 }}>
            {data.map((image) => (
              <figure
                key={image.id}
                onClick={() => setPreview(image)}
                style={{
                  margin: 0,
                  border: '1px solid var(--rule)',
                  borderRadius: 9,
                  overflow: 'hidden',
                  background: 'var(--void)',
                  cursor: 'zoom-in'
                }}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  style={{ display: 'block', width: '100%', aspectRatio: '3 / 2', objectFit: 'cover' }}
                />
                <figcaption
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '8px 10px'
                  }}
                >
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 12.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {image.name}
                    </span>
                    <span className="mono" style={{ fontSize: 10 }}>
                      {image.source} · {readableSize(image.bytes)}
                    </span>
                  </span>
                  <button
                    className="btn btn--ghost btn--tiny btn--danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      void remove(image);
                    }}
                  >
                    ✕
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Panel>

      {preview ? (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'grid',
            placeItems: 'center',
            padding: 34,
            background: 'rgba(4, 6, 10, 0.86)',
            backdropFilter: 'blur(4px)',
            cursor: 'zoom-out'
          }}
        >
          <img
            src={preview.url}
            alt={preview.name}
            style={{
              maxWidth: '100%',
              maxHeight: '82vh',
              border: '1px solid var(--rule-bright)',
              borderRadius: 10
            }}
          />
          <p className="mono" style={{ marginTop: 12, color: 'var(--text-dim)' }}>
            {preview.name} · {preview.source} · {readableSize(preview.bytes)}
          </p>
        </div>
      ) : null}
    </div>
  );
};
