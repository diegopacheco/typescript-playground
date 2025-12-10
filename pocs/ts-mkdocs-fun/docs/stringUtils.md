# String Utils

String manipulation functions.

## Functions

### reverse

Reverses a string.

```typescript
export function reverse(str: string): string {
  return str.split("").reverse().join("");
}
```

**Usage:**

```typescript
import { reverse } from "./stringUtils";
reverse("hello"); // returns "olleh"
```

### capitalize

Capitalizes the first letter and lowercases the rest.

```typescript
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

**Usage:**

```typescript
import { capitalize } from "./stringUtils";
capitalize("hello"); // returns "Hello"
capitalize("HELLO"); // returns "Hello"
```

### isPalindrome

Checks if a string is a palindrome (ignores case and non-alphanumeric characters).

```typescript
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === reverse(cleaned);
}
```

**Usage:**

```typescript
import { isPalindrome } from "./stringUtils";
isPalindrome("racecar"); // returns true
isPalindrome("A man a plan a canal Panama"); // returns true
isPalindrome("hello"); // returns false
```

### wordCount

Counts the number of words in a string.

```typescript
export function wordCount(str: string): number {
  if (str.trim().length === 0) return 0;
  return str.trim().split(/\s+/).length;
}
```

**Usage:**

```typescript
import { wordCount } from "./stringUtils";
wordCount("hello world"); // returns 2
wordCount("one"); // returns 1
```

## Tests

```typescript
import { expect, test, describe } from "bun:test";
import { reverse, capitalize, isPalindrome, wordCount } from "./stringUtils";

describe("stringUtils", () => {
  test("reverse returns reversed string", () => {
    expect(reverse("hello")).toBe("olleh");
    expect(reverse("")).toBe("");
    expect(reverse("a")).toBe("a");
  });

  test("capitalize returns capitalized string", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("HELLO")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  test("isPalindrome detects palindromes", () => {
    expect(isPalindrome("racecar")).toBe(true);
    expect(isPalindrome("A man a plan a canal Panama")).toBe(true);
    expect(isPalindrome("hello")).toBe(false);
  });

  test("wordCount returns number of words", () => {
    expect(wordCount("hello world")).toBe(2);
    expect(wordCount("one")).toBe(1);
    expect(wordCount("")).toBe(0);
    expect(wordCount("   ")).toBe(0);
  });
});
```
