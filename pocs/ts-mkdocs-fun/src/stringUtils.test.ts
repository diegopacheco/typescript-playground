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
