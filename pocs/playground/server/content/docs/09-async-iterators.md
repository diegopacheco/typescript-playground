# Async Iterators

Generators produce values on demand, and async generators do the same for values that arrive over time, consumed with `for await`.

## Generators

A `function*` returns an iterator. Each `yield` hands out one value and pauses until the next one is asked for.

```ts
function* range(start: number, end: number, step = 1): Generator<number> {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

function* naturals(): Generator<number> {
  let n = 1;
  while (true) {
    yield n++;
  }
}

console.log([...range(0, 10, 3)]);
const it = naturals();
console.log(it.next().value, it.next().value, it.next().value);
```

> [!NOTE] Generators are lazy. An infinite generator is fine as long as the consumer stops pulling.

## Iteration protocols

| Protocol | Method | Consumed by |
|---|---|---|
| iterable | `[Symbol.iterator]()` | `for...of`, spread, destructuring |
| async iterable | `[Symbol.asyncIterator]()` | `for await...of` |
| iterator result | `{ value, done }` | `next()` calls |

## Async generators

An `async function*` can `await` and `yield`. Use it for paged APIs, streams and polling.

```ts
type Page = { readonly page: number; readonly items: readonly string[] };

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function* pages(total: number): AsyncGenerator<Page> {
  for (let page = 1; page <= total; page++) {
    await sleep(20);
    yield { page, items: [page + "-a", page + "-b"] };
  }
}

async function* items(source: AsyncIterable<Page>): AsyncGenerator<string> {
  for await (const p of source) {
    yield* p.items;
  }
}

const all: string[] = [];
for await (const item of items(pages(3))) {
  all.push(item);
}
console.log(all);
```

## Stopping early

`break` or `return` inside `for await` calls the generator's `return`, which runs its `finally` block. Cleanup happens automatically.

```ts
async function* ticker(): AsyncGenerator<number> {
  let n = 0;
  try {
    while (true) {
      await new Promise((r) => setTimeout(r, 10));
      yield ++n;
    }
  } finally {
    console.log("ticker cleaned up at", n);
  }
}

for await (const n of ticker()) {
  console.log("tick", n);
  if (n === 3) {
    break;
  }
}
```

> [!TIP] Put resource cleanup (closing connections, clearing timers) in the generator's `finally`. Consumers that `break` early still trigger it.

## Custom async iterable

Any object with `[Symbol.asyncIterator]` works with `for await`.

```ts
class Countdown implements AsyncIterable<number> {
  constructor(private readonly from: number) {}

  async *[Symbol.asyncIterator](): AsyncGenerator<number> {
    for (let i = this.from; i > 0; i--) {
      await new Promise((r) => setTimeout(r, 15));
      yield i;
    }
  }
}

const seen: number[] = [];
for await (const n of new Countdown(4)) {
  seen.push(n);
}
console.log(seen.join(" "), "liftoff");
```

## Key takeaways

- Generators are lazy, pull-based sequences.
- Async generators combine `await` and `yield`.
- Consume them with `for await...of`.
- `break` triggers the generator's `finally` for cleanup.
- Compose small generators into pipelines.
