import { GENRES, type Book, type Genre } from "../data/books.ts";

export const SORT_KEYS = ["title", "year", "rating"] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export type CatalogSearch = {
  q: string;
  genre: Genre | "all";
  sort: SortKey;
  dir: "asc" | "desc";
};

export const DEFAULT_CATALOG_SEARCH: CatalogSearch = { q: "", genre: "all", sort: "title", dir: "asc" };

const isOneOf = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && (values as readonly string[]).includes(value);

export function parseCatalogSearch(raw: Record<string, unknown>): CatalogSearch {
  return {
    q: typeof raw.q === "string" ? raw.q : DEFAULT_CATALOG_SEARCH.q,
    genre: isOneOf(GENRES, raw.genre) ? raw.genre : DEFAULT_CATALOG_SEARCH.genre,
    sort: isOneOf(SORT_KEYS, raw.sort) ? raw.sort : DEFAULT_CATALOG_SEARCH.sort,
    dir: raw.dir === "desc" ? "desc" : DEFAULT_CATALOG_SEARCH.dir,
  };
}

function compare(a: Book, b: Book, key: SortKey): number {
  if (key === "title") return a.title.localeCompare(b.title);
  return a[key] - b[key];
}

export function searchBooks(books: readonly Book[], search: CatalogSearch): Book[] {
  const term = search.q.trim().toLowerCase();
  const sign = search.dir === "asc" ? 1 : -1;
  return books
    .filter((book) => search.genre === "all" || book.genre === search.genre)
    .filter((book) => term === "" || `${book.title} ${book.author}`.toLowerCase().includes(term))
    .sort((a, b) => sign * compare(a, b, search.sort));
}
