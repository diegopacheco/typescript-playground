import { describe, expect, test } from "bun:test";
import { SEED_BOOKS } from "../../src/data/books.ts";
import { DEFAULT_CATALOG_SEARCH, parseCatalogSearch, searchBooks } from "../../src/logic/catalog-search.ts";

describe("parseCatalogSearch keeps the URL a safe source of state", () => {
  test("a hand-edited URL with unknown values falls back to defaults instead of breaking the page", () => {
    expect(parseCatalogSearch({ genre: "poetry", sort: "price", dir: "sideways", q: 42 })).toEqual(DEFAULT_CATALOG_SEARCH);
  });

  test("valid values from a shared link are preserved exactly", () => {
    expect(parseCatalogSearch({ q: "dune", genre: "scifi", sort: "year", dir: "desc" })).toEqual({
      q: "dune",
      genre: "scifi",
      sort: "year",
      dir: "desc",
    });
  });
});

describe("searchBooks answers what the user asked for", () => {
  test("genre and text filters combine, and author names are searchable", () => {
    const titles = searchBooks(SEED_BOOKS, { ...DEFAULT_CATALOG_SEARCH, genre: "fantasy", q: "le guin" }).map((b) => b.title);
    expect(titles).toEqual(["A Wizard of Earthsea"]);
  });

  test("descending rating puts the best rated book first", () => {
    const [first] = searchBooks(SEED_BOOKS, { ...DEFAULT_CATALOG_SEARCH, sort: "rating", dir: "desc" });
    expect(first?.title).toBe("Designing Data-Intensive Applications");
  });

  test("oldest first by year", () => {
    const [first] = searchBooks(SEED_BOOKS, { ...DEFAULT_CATALOG_SEARCH, sort: "year" });
    expect(first?.title).toBe("The Hobbit");
  });

  test("searching never mutates the shared catalog order", () => {
    const before = SEED_BOOKS.map((b) => b.id);
    searchBooks(SEED_BOOKS, { ...DEFAULT_CATALOG_SEARCH, sort: "year", dir: "desc" });
    expect(SEED_BOOKS.map((b) => b.id)).toEqual(before);
  });
});
