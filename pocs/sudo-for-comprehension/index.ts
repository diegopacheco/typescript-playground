// Helper Functions
const forComprehension = <T>(array: T[]) => ({
  where: (predicate: (x: T) => boolean) => ({
    select: <U>(transform: (x: T) => U) => array.filter(predicate).map(transform),
  }),
});

const numbers = [1, 2, 3, 4, 5];
const result = forComprehension(numbers)
  .where(x => x > 2)
  .select(x => x * 2);

console.log(result); // Output: [6, 8, 10]
