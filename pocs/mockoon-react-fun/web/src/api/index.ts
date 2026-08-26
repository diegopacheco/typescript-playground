import { request } from './client.ts';
import { resource } from './resource.ts';
import type {
  Book,
  BookDraft,
  Calculation,
  CalculationDraft,
  GalleryImage,
  ImageDraft,
  Move,
  Note,
  NoteDraft,
  Post,
  PostDraft,
  Round
} from '../types/api.ts';

export const books = resource<Book, BookDraft>('/books');
export const images = resource<GalleryImage, ImageDraft>('/images');
export const notes = resource<Note, NoteDraft>('/notes');
export const posts = resource<Post, PostDraft>('/posts');

const calculationsResource = resource<Calculation, CalculationDraft>('/calculations');
export const calculations = {
  list: calculationsResource.list,
  remove: calculationsResource.remove,
  clear: () => calculationsResource.replaceAll([]),
  evaluate: (draft: CalculationDraft) => request<Calculation>('POST', '/calculations', draft)
};

const roundsResource = resource<Round, never>('/rounds');
export const rounds = {
  list: roundsResource.list,
  clear: () => roundsResource.replaceAll([]),
  play: (move: Move) => request<Round>('POST', '/rounds', { move })
};
