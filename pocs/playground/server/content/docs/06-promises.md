# Promises

A promise is an object that represents a value that will be ready later, or an error if the work fails.

## States

| State | Meaning | Final |
|---|---|---|
| pending | work in progress | no |
| fulfilled | finished with a value | yes |
| rejected | finished with an error | yes |

A promise settles once. After that its state and value never change.

## Creating promises

Wrap callback APIs with `new Promise`. Call `resolve` on success and `reject` on failure.

```ts
function wait(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

function divide(a: number, b: number): Promise<number> {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject(new Error("division by zero"));
      return;
    }
    resolve(a / b);
  });
}

wait(50).then((ms) => console.log("waited", ms, "ms"));
divide(10, 2).then((v) => console.log("10 / 2 =", v));
divide(1, 0).catch((e: unknown) => console.log("error:", e instanceof Error ? e.message : e));
```

> [!TIP] `Promise.resolve(v)` and `Promise.reject(e)` create already settled promises. Handy in tests and fast paths.

## Chaining

`then` returns a new promise. Return a value to pass it on. Return a promise to wait for it. Throw to jump to the next `catch`.

```ts
type Account = { readonly id: string; readonly balance: number };

const find = (id: string): Promise<Account> => Promise.resolve({ id, balance: 120 });

find("acc-1")
  .then((acc) => ({ ...acc, balance: acc.balance - 50 }))
  .then((acc) => {
    if (acc.balance < 100) {
      throw new Error("balance low: " + acc.balance);
    }
    return acc;
  })
  .then((acc) => console.log("ok", acc))
  .catch((e: unknown) => console.log("caught:", e instanceof Error ? e.message : e))
  .finally(() => console.log("finally always runs"));
```

## Common mistakes

```ts
const load = (n: number): Promise<number> => new Promise((r) => setTimeout(() => r(n * 2), 20));

function broken(): Promise<void> {
  return load(1).then((v) => {
    load(v).then((w) => console.log("lost result, nobody waits:", w));
  });
}

function fixed(): Promise<number> {
  return load(1).then((v) => load(v));
}

await broken();
console.log("broken resolved first");
console.log("fixed result:", await fixed());
```

> [!WARNING] Forgetting to `return` inside `then` breaks the chain. The outer promise resolves before the inner work ends, and its errors go nowhere.

## Unhandled rejections

Every rejection needs a handler. Attach `catch` at the end of the chain, or `await` inside `try/catch`.

```ts
const risky = (): Promise<string> => Promise.reject(new Error("disk full"));

const handled = risky().catch((e: unknown) => "recovered from " + (e instanceof Error ? e.message : "?"));
console.log(await handled);
```

## Key takeaways

- A promise is pending, then fulfilled or rejected, once.
- `then` always returns a new promise.
- Return inner promises to keep the chain flat.
- Throwing inside `then` rejects the chain.
- Always handle rejections.
