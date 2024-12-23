function* lazyRange(start: number, end: number): Generator<number> {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

const range = lazyRange(1, 5);
console.log(range.next().value); // Output: 1
console.log(range.next().value); // Output: 2
console.log(range.next().value); // Output: 3
console.log(range.next().value); // Output: 4
console.log(range.next().value); // Output: 5
console.log(range.next().value); // Output: undefined
