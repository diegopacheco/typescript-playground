import { expect, test, describe } from "bun:test";
import { sum, average, unique, chunk } from "./arrayUtils";

describe("arrayUtils", () => {
  test("sum returns sum of array elements", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([])).toBe(0);
    expect(sum([5])).toBe(5);
  });

  test("average returns average of array elements", () => {
    expect(average([1, 2, 3])).toBe(2);
    expect(average([])).toBe(0);
    expect(average([10])).toBe(10);
  });

  test("unique returns array with unique elements", () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(unique([])).toEqual([]);
    expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
  });

  test("chunk splits array into chunks", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([], 2)).toEqual([]);
  });
});
