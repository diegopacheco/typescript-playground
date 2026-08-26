import { buildQuery, request } from './client.ts';
import type { Identified, ListQuery } from '../types/api.ts';

export type Resource<TItem extends Identified, TDraft> = {
  list: (query?: ListQuery) => Promise<TItem[]>;
  get: (id: string) => Promise<TItem>;
  create: (draft: TDraft) => Promise<TItem>;
  update: (id: string, draft: TDraft) => Promise<TItem>;
  patch: (id: string, changes: Partial<TDraft>) => Promise<TItem>;
  remove: (id: string) => Promise<void>;
  replaceAll: (items: TItem[]) => Promise<TItem[]>;
};

export const resource = <TItem extends Identified, TDraft>(path: string): Resource<TItem, TDraft> => ({
  list: (query) => request<TItem[]>('GET', `${path}${buildQuery(query)}`),
  get: (id) => request<TItem>('GET', `${path}/${id}`),
  create: (draft) => request<TItem>('POST', path, draft),
  update: (id, draft) => request<TItem>('PUT', `${path}/${id}`, draft),
  patch: (id, changes) => request<TItem>('PATCH', `${path}/${id}`, changes),
  remove: (id) => request<void>('DELETE', `${path}/${id}`),
  replaceAll: (items) => request<TItem[]>('PUT', path, items)
});
