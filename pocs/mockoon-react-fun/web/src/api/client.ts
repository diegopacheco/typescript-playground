import type { ApiError, ListQuery } from '../types/api.ts';

export const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001/api';

export type LogEntry = {
  id: number;
  method: string;
  path: string;
  status: number;
  ms: number;
  failed: boolean;
};

type Listener = (entry: LogEntry) => void;

const listeners = new Set<Listener>();
let sequence = 0;

export const onRequest = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export class RequestFailed extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, payload: ApiError | null, fallback: string) {
    super(payload?.message ?? fallback);
    this.status = status;
    this.code = payload?.error ?? 'request_failed';
  }
}

const publish = (entry: LogEntry): void => {
  for (const listener of listeners) listener(entry);
};

export const buildQuery = (query: ListQuery = {}): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '') continue;
    params.set(key, String(value));
  }
  const rendered = params.toString();
  return rendered ? `?${rendered}` : '';
};

export const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
  const startedAt = performance.now();
  sequence += 1;
  const id = sequence;

  let response: Response;
  try {
    const init: RequestInit = { method };
    if (body !== undefined) {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify(body);
    }
    response = await fetch(apiBase + path, init);
  } catch {
    publish({ id, method, path, status: 0, ms: Math.round(performance.now() - startedAt), failed: true });
    throw new RequestFailed(0, null, `Cannot reach the mock at ${apiBase}. Is it running?`);
  }

  const ms = Math.round(performance.now() - startedAt);
  publish({ id, method, path, status: response.status, ms, failed: !response.ok });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    throw new RequestFailed(response.status, payload as ApiError | null, `${method} ${path} returned ${response.status}`);
  }
  return payload as T;
};
