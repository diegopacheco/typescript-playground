import { describe, expect, test } from "bun:test";
import { createApi } from "../../src/data/api.ts";

const fresh = () => createApi(0);

describe("fake server keeps the catalog consistent", () => {
  test("a failed favorite write leaves the server state untouched, so the UI rollback is correct", async () => {
    const api = fresh();
    api.setFailNextWrite(true);
    await expect(api.toggleFavorite(1)).rejects.toThrow("Server rejected the update");
    expect((await api.getBook(1))?.favorite).toBe(true);
  });

  test("the failure flag only affects one write", async () => {
    const api = fresh();
    api.setFailNextWrite(true);
    await expect(api.toggleFavorite(2)).rejects.toThrow();
    expect((await api.toggleFavorite(2)).favorite).toBe(true);
  });

  test("duplicate ISBNs are refused even if the client skips validation", async () => {
    const api = fresh();
    const input = { title: "Copy", author: "X", genre: "scifi" as const, year: 2000, isbn: "9780441013593", tags: ["x"] };
    await expect(api.addBook(input)).rejects.toThrow("already exists");
    expect(await api.isIsbnTaken("9780441013593")).toBe(true);
  });

  test("a new book gets the next id and shows up in the list and stats", async () => {
    const api = fresh();
    const book = await api.addBook({ title: "New", author: "Y", genre: "tech", year: 2020, isbn: "9780000000002", tags: ["n"] });
    expect(book.id).toBe(13);
    expect((await api.listBooks()).some((b) => b.id === 13)).toBe(true);
    expect((await api.stats()).total).toBe(13);
  });

  test("each api instance owns its data so seed books are never shared mutably", async () => {
    const a = fresh();
    const b = fresh();
    await a.toggleFavorite(1);
    expect((await b.getBook(1))?.favorite).toBe(true);
    expect((await a.getBook(1))?.favorite).toBe(false);
  });
});
