export type Identified = { id: string };

export type BookDraft = {
  title: string;
  author: string;
  isbn: string;
  year: number;
  genre: string;
  rating: number;
  createdAt: string;
};
export type Book = Identified & BookDraft;

export type Operator = '+' | '-' | '*' | '/' | '%';
export type CalculationDraft = { a: number; op: Operator; b: number };
export type Calculation = Identified & CalculationDraft & { result: number; computedAt: string };

export type ImageSource = 'url' | 'upload';
export type ImageDraft = {
  name: string;
  source: ImageSource;
  url: string;
  bytes: number;
  addedAt: string;
};
export type GalleryImage = Identified & ImageDraft;

export type Todo = { id: string; text: string; done: boolean };
export type NoteDraft = { title: string; body: string; todos: Todo[]; updatedAt: string };
export type Note = Identified & NoteDraft;

export type Move = 'rock' | 'paper' | 'scissors';
export type Outcome = 'win' | 'draw' | 'loss';
export type Round = Identified & {
  playerMove: Move;
  computerMove: Move;
  outcome: Outcome;
  playedAt: string;
};

export type PostDraft = {
  title: string;
  author: string;
  body: string;
  tags: string[];
  imageUrl: string;
  youtubeUrl: string;
  publishedAt: string;
};
export type Post = Identified & PostDraft;

export type ApiError = { error: string; message: string };

export type ListQuery = {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};
