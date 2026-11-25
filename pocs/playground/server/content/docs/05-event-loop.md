# The Event Loop

JavaScript runs your code on one thread, and the event loop decides what runs next: sync code, then all microtasks, then one macrotask.

## The pieces

- **Call stack**: the functions running right now. Sync code runs to completion.
- **Microtask queue**: promise callbacks, `await` continuations and `queueMicrotask`.
- **Macrotask queue**: timers like `setTimeout`, I/O and UI events.

The loop is simple. Run the stack until empty. Drain every microtask. Take one macrotask. Repeat.

| Source | Queue | Runs |
|---|---|---|
| plain code | call stack | immediately |
| `Promise.then` | microtask | after the current stack empties |
| code after `await` | microtask | after the awaited value settles |
| `queueMicrotask` | microtask | after the current stack empties |
| `setTimeout(fn, 0)` | macrotask | after all microtasks |
| Promise executor | call stack | sync, right away |

## Ordering in practice

```ts
console.log("1 sync");
setTimeout(() => console.log("5 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
queueMicrotask(() => console.log("4 queueMicrotask"));
console.log("2 sync");
```

```text
1 sync
2 sync
3 microtask
4 queueMicrotask
5 timeout
```

> [!NOTE] A `setTimeout` of `0` is not "now". It is "after everything already queued, including all microtasks".

## await splits a function

Code before the first `await` runs synchronously. Everything after it becomes a microtask.

```ts
async function work(): Promise<void> {
  console.log("b: inside, before await");
  await null;
  console.log("d: inside, after await");
}

console.log("a: before call");
const pending = work();
console.log("c: after call");
await pending;
console.log("e: done");
```

## Microtasks can starve timers

The loop drains *all* microtasks before any timer. A chain that keeps adding microtasks delays timers until it stops.

```ts
let ticks = 0;
const started = Date.now();

setTimeout(() => console.log("timer ran after", ticks, "microtasks"), 0);

function spin(): void {
  ticks++;
  if (ticks < 100_000) {
    queueMicrotask(spin);
  }
}
spin();

await new Promise((resolve) => setTimeout(resolve, 10));
console.log("elapsed under a second:", Date.now() - started < 1000);
```

> [!WARNING] Long sync loops and endless microtask chains freeze the process. Timers, I/O and UI all wait.

## Yielding to the loop

Split heavy work into chunks and yield with a timer so other tasks get a turn.

```ts
const yieldToLoop = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

async function sumInChunks(n: number, chunk: number): Promise<number> {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
    if (i % chunk === 0) {
      await yieldToLoop();
    }
  }
  return total;
}

setTimeout(() => console.log("heartbeat got a turn"), 0);
console.log("sum:", await sumInChunks(200_000, 50_000));
```

## Key takeaways

- One thread, one stack. Sync code always finishes first.
- All microtasks run before the next macrotask.
- `await` resumes as a microtask.
- `setTimeout(fn, 0)` means "later", not "now".
- Yield with a timer to keep long work from blocking.
