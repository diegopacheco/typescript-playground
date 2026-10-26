import { SEED_BOOKS, type Book } from "./books.ts";

export type NewBook = Omit<Book, "id" | "favorite" | "rating">;

export type Review = { id: number; bookId: number; text: string; stars: number };

export type Stats = { total: number; favorites: number; averageRating: number };

export type Api = ReturnType<typeof createApi>;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function createApi(latencyMs: number) {
  let books: Book[] = SEED_BOOKS.map((book) => ({ ...book, tags: [...book.tags] }));
  let failNextWrite = false;

  return {
    async listBooks(): Promise<Book[]> {
      await wait(latencyMs);
      return books.map((book) => ({ ...book }));
    },

    async getBook(id: number): Promise<Book | undefined> {
      await wait(latencyMs);
      const book = books.find((b) => b.id === id);
      return book ? { ...book } : undefined;
    },

    setFailNextWrite(value: boolean) {
      failNextWrite = value;
    },

    async toggleFavorite(id: number): Promise<Book> {
      await wait(latencyMs);
      if (failNextWrite) {
        failNextWrite = false;
        throw new Error("Server rejected the update");
      }
      const book = books.find((b) => b.id === id);
      if (!book) throw new Error(`Book ${id} not found`);
      book.favorite = !book.favorite;
      return { ...book };
    },

    async isIsbnTaken(isbn: string): Promise<boolean> {
      await wait(latencyMs);
      return books.some((b) => b.isbn === isbn);
    },

    async addBook(input: NewBook): Promise<Book> {
      await wait(latencyMs);
      if (books.some((b) => b.isbn === input.isbn)) {
        throw new Error(`ISBN ${input.isbn} already exists`);
      }
      const id = Math.max(0, ...books.map((b) => b.id)) + 1;
      const book: Book = { ...input, id, rating: 0, favorite: false };
      books = [...books, book];
      return { ...book };
    },

    async stats(): Promise<Stats> {
      await wait(latencyMs);
      const total = books.length;
      const favorites = books.filter((b) => b.favorite).length;
      const averageRating = Math.round((books.reduce((sum, b) => sum + b.rating, 0) / total) * 100) / 100;
      return { total, favorites, averageRating };
    },

    async reviews(delayMs: number): Promise<Review[]> {
      await wait(delayMs);
      return books.slice(0, 4).map((book, index) => ({
        id: index + 1,
        bookId: book.id,
        text: `${book.title} by ${book.author} is a must read.`,
        stars: Math.round(book.rating),
      }));
    },
  };
}

export const api = createApi(400);
