function* range(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) yield i;
}

function* fibonacci(): Generator<number> {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function take<T>(iterable: Iterable<T>, count: number): T[] {
  const out: T[] = [];
  for (const value of iterable) {
    if (out.length >= count) break;
    out.push(value);
  }
  return out;
}

class Countdown implements Iterable<number> {
  constructor(private from: number) {}

  *[Symbol.iterator](): Iterator<number> {
    for (let i = this.from; i > 0; i--) yield i;
  }
}

async function* asyncTicks(count: number): AsyncGenerator<number> {
  for (let i = 1; i <= count; i++) {
    await new Promise((r) => setTimeout(r, 5));
    yield i;
  }
}

async function main(): Promise<void> {
  console.log("range:", [...range(0, 5)]);
  console.log("fibonacci first 8:", take(fibonacci(), 8));
  console.log("custom iterable:", [...new Countdown(3)]);

  const ticks: number[] = [];
  for await (const tick of asyncTicks(3)) ticks.push(tick);
  console.log("async generator:", ticks);
}

main();
