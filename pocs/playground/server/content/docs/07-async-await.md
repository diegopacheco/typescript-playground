# Async and Await

`async` and `await` let you write promise code that reads top to bottom like sync code.

## The basics

An `async` function always returns a promise. `await` pauses that function until a promise settles, without blocking the thread.

```ts
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function greet(name: string): Promise<string> {
  await sleep(30);
  return "hello " + name;
}

const message = await greet("ts");
console.log(message);
console.log(greet("x") instanceof Promise);
```

| Inside async fn | Effect on returned promise |
|---|---|
| `return value` | fulfills with `value` |
| `return promise` | follows that promise |
| `throw error` | rejects with `error` |
| `await rejected` | throws at that line |

## Errors with try/catch

A rejected promise throws at the `await`. Use normal `try/catch/finally`.

```ts
async function fetchScore(user: string): Promise<number> {
  await new Promise((r) => setTimeout(r, 20));
  if (user === "ghost") {
    throw new Error("user not found: " + user);
  }
  return user.length * 10;
}

for (const user of ["ada", "ghost"]) {
  try {
    console.log(user, "score", await fetchScore(user));
  } catch (e) {
    console.log("failed:", e instanceof Error ? e.message : String(e));
  } finally {
    console.log("checked", user);
  }
}
```

## Sequential vs parallel

Each `await` in a loop waits for the previous one. If the calls are independent, start them all and await together.

```ts
const job = (ms: number): Promise<number> => new Promise((r) => setTimeout(() => r(ms), ms));

let start = performance.now();
const a = await job(100);
const b = await job(100);
console.log("sequential", a + b, Math.round((performance.now() - start) / 100) * 100, "ms");

start = performance.now();
const [c, d] = await Promise.all([job(100), job(100)]);
console.log("parallel", c + d, Math.round((performance.now() - start) / 100) * 100, "ms");
```

> [!TIP] Ask "does call B need the result of call A?" If not, run them in parallel.

## Async in array methods

`forEach` does not wait for async callbacks. Use `for...of` for order, or `map` plus `Promise.all` for speed.

```ts
const double = async (n: number): Promise<number> => {
  await new Promise((r) => setTimeout(r, 10));
  return n * 2;
};

const seen: number[] = [];
[1, 2, 3].forEach(async (n) => {
  seen.push(await double(n));
});
console.log("forEach right after:", seen.length);

const results = await Promise.all([1, 2, 3].map(double));
console.log("map + all:", results);
```

> [!WARNING] A promise you never await is fire and forget. Its errors become unhandled rejections.

## Key takeaways

- `async` functions always return promises.
- `await` pauses the function, not the thread.
- Use `try/catch` around `await` for errors.
- Await independent work together with `Promise.all`.
- Never pass async callbacks to `forEach`.
