type Tick = { readonly seq: number; readonly price: number };

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function* prices(symbol: string, count: number): AsyncGenerator<Tick, void, undefined> {
  let price = 100;
  for (let seq = 1; seq <= count; seq++) {
    await sleep(20);
    price = Math.round((price + Math.sin(seq) * 3) * 100) / 100;
    yield { seq, price };
  }
  console.log(`[${symbol}] stream closed`);
}

async function* movingAverage(source: AsyncIterable<Tick>, window: number): AsyncGenerator<string> {
  const buffer: number[] = [];
  for await (const tick of source) {
    buffer.push(tick.price);
    if (buffer.length > window) {
      buffer.shift();
    }
    const avg = buffer.reduce((a, b) => a + b, 0) / buffer.length;
    yield `#${tick.seq} price=${tick.price.toFixed(2)} avg${window}=${avg.toFixed(2)}`;
  }
}

async function* take<T>(source: AsyncIterable<T>, n: number): AsyncGenerator<T> {
  if (n <= 0) {
    return;
  }
  let seen = 0;
  for await (const value of source) {
    yield value;
    if (++seen >= n) {
      return;
    }
  }
}

for await (const line of movingAverage(prices("ACME", 6), 3)) {
  console.log(line);
}

console.log("--- first 2 only ---");
for await (const tick of take(prices("BETA", 100), 2)) {
  console.log(tick);
}
