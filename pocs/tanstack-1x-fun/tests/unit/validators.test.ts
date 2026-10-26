import { describe, expect, test } from "bun:test";
import { SEED_BOOKS } from "../../src/data/books.ts";
import { validateIsbn, validateTags, validateTitle, validateYear } from "../../src/logic/validators.ts";

describe("book form validators reject bad catalog data", () => {
  test("blank or whitespace titles are rejected", () => {
    expect(validateTitle("   ")).toBe("Title is required");
    expect(validateTitle("It")).toBe("Title needs at least 3 characters");
    expect(validateTitle("Dune")).toBeUndefined();
  });

  test("years are bounded by the printing press and the present", () => {
    expect(validateYear(1449, 2026)).toBeDefined();
    expect(validateYear(2027, 2026)).toBe("Year cannot be in the future");
    expect(validateYear(1450, 2026)).toBeUndefined();
    expect(validateYear(Number.NaN, 2026)).toBe("Year must be a whole number");
  });

  test("every seeded ISBN passes the checksum, so the async duplicate check is reachable", () => {
    for (const book of SEED_BOOKS) expect(validateIsbn(book.isbn)).toBeUndefined();
  });

  test("a single typo in an ISBN is caught by the checksum", () => {
    expect(validateIsbn("9780441013594")).toBe("ISBN checksum is invalid");
    expect(validateIsbn("978-0-441")).toBe("ISBN must have 13 digits");
    expect(validateIsbn("978-0441013593")).toBeUndefined();
  });

  test("tags must exist, be non-empty and unique ignoring case", () => {
    expect(validateTags([])).toBe("Add at least one tag");
    expect(validateTags(["epic", " "])).toBe("Tags cannot be empty");
    expect(validateTags(["Epic", "epic"])).toBe("Tags must be unique");
    expect(validateTags(["epic", "space"])).toBeUndefined();
  });
});
