# Array Utils

Array manipulation functions.

## Functions

### sum

Returns the sum of all numbers in an array.

```typescript
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}
```

**Usage:**

```typescript
import { sum } from "./arrayUtils";
sum([1, 2, 3]); // returns 6
sum([]); // returns 0
```

### average

Returns the average of all numbers in an array.

```typescript
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}
```

**Usage:**

```typescript
import { average } from "./arrayUtils";
average([1, 2, 3]); // returns 2
average([]); // returns 0
```

### unique

Returns an array with duplicate elements removed.

```typescript
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
```

**Usage:**

```typescript
import { unique } from "./arrayUtils";
unique([1, 2, 2, 3, 3, 3]); // returns [1, 2, 3]
unique(["a", "b", "a"]); // returns ["a", "b"]
```

### chunk

Splits an array into chunks of the specified size.

```typescript
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
```

**Usage:**

```typescript
import { chunk } from "./arrayUtils";
chunk([1, 2, 3, 4, 5], 2); // returns [[1, 2], [3, 4], [5]]
chunk([1, 2, 3], 3); // returns [[1, 2, 3]]
```

## Tests

```typescript
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
```
