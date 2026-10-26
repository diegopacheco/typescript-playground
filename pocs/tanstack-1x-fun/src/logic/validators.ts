export function validateTitle(value: string): string | undefined {
  const title = value.trim();
  if (title === "") return "Title is required";
  if (title.length < 3) return "Title needs at least 3 characters";
  return undefined;
}

export function validateYear(value: number, currentYear: number): string | undefined {
  if (!Number.isInteger(value)) return "Year must be a whole number";
  if (value < 1450) return "Printing press was invented in 1450";
  if (value > currentYear) return "Year cannot be in the future";
  return undefined;
}

export function validateIsbn(value: string): string | undefined {
  const digits = value.replace(/-/g, "");
  if (!/^\d{13}$/.test(digits)) return "ISBN must have 13 digits";
  const sum = [...digits.slice(0, 12)].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
  const check = (10 - (sum % 10)) % 10;
  if (check !== Number(digits[12])) return "ISBN checksum is invalid";
  return undefined;
}

export function validateTags(tags: readonly string[]): string | undefined {
  if (tags.length === 0) return "Add at least one tag";
  const cleaned = tags.map((tag) => tag.trim().toLowerCase());
  if (cleaned.some((tag) => tag === "")) return "Tags cannot be empty";
  if (new Set(cleaned).size !== cleaned.length) return "Tags must be unique";
  return undefined;
}
