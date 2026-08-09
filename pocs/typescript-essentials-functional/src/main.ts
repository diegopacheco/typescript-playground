function mapFilterReduce(): [number[], number[], number] {
  const numbers = [1, 2, 3, 4, 5, 6];
  const doubled = numbers.map((x) => x * 2);
  const evens = numbers.filter((x) => x % 2 === 0);
  const total = numbers.reduce((acc, x) => acc + x, 0);
  return [doubled, evens, total];
}

function makeCounter(): () => number {
  let count = 0;
  return () => ++count;
}

function multiplier(factor: number): (x: number) => number {
  return (x) => x * factor;
}

function partial<A, B, R>(fn: (a: A, b: B) => R, a: A): (b: B) => R {
  return (b) => fn(a, b);
}

function compose<T>(...functions: ((value: T) => T)[]): (value: T) => T {
  return (value) => functions.reduceRight((acc, fn) => fn(acc), value);
}

function main(): void {
  console.log("mapFilterReduce:", mapFilterReduce());

  const counter = makeCounter();
  console.log("closure counter:", counter(), counter(), counter());

  const triple = multiplier(3);
  console.log("closure multiplier:", triple(10));

  const power = (base: number, exponent: number) => base ** exponent;
  const squareOf = partial(power, 5);
  console.log("partial 5^2:", squareOf(2));

  const pipeline = compose<number>((x) => x + 1, (x) => x * 2);
  console.log("compose (x*2)+1 of 5:", pipeline(5));
}

main();
