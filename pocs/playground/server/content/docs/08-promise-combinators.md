# Promise Combinators

`Promise.all`, `allSettled`, `race` and `any` combine many promises into one, each with a different rule for when it settles.

## Pick the right one

| Combinator | Fulfills when | Rejects when | Use it for |
|---|---|---|---|
| `all` | every promise fulfills | the first one rejects | all results required |
| `allSettled` | every promise settles | never | batch jobs, reports |
| `race` | the first one settles with a value | the first one settles with an error | timeouts |
| `any` | the first one fulfills | all reject (`AggregateError`) | fastest healthy mirror |

## Promise.all

Fail fast. Results keep the input order, not the finish order.

```ts
const after = <T>(ms: number, value: T): Promise<T> => new Promise((r) => setTimeout(() => r(value), ms));

const [user, posts, count] = await Promise.all([
  after(60, { name: "ada" }),
  after(20, ["p1", "p2"]),
  after(40, 7),
]);
console.log(user.name, posts.length, count);

try {
  await Promise.all([after(30, 1), Promise.reject(new Error("posts failed"))]);
} catch (e) {
  console.log("all rejected:", e instanceof Error ? e.message : e);
}
```

> [!NOTE] `Promise.all` does not cancel the other promises when one fails. They keep running; their results are ignored.

## Promise.allSettled

Never rejects. You get a status for each input.

```ts
const check = (name: string, ok: boolean): Promise<string> =>
  ok ? Promise.resolve(name + " healthy") : Promise.reject(new Error(name + " down"));

const results = await Promise.allSettled([check("db", true), check("cache", false), check("queue", true)]);

for (const r of results) {
  if (r.status === "fulfilled") {
    console.log("ok  ", r.value);
  } else {
    console.log("fail", r.reason instanceof Error ? r.reason.message : r.reason);
  }
}
```

## Promise.race

Settles with the first promise to settle, success or failure. Classic use: a timeout.

```ts
function withTimeout<T>(task: Promise<T>, ms: number): Promise<T> {
  let id: ReturnType<typeof setTimeout> | undefined;
  const timer = new Promise<never>((_, reject) => {
    id = setTimeout(() => reject(new Error("timed out after " + ms + "ms")), ms);
  });
  return Promise.race([task, timer]).finally(() => clearTimeout(id));
}

const slow = new Promise<string>((r) => setTimeout(() => r("slow done"), 200));
const fast = new Promise<string>((r) => setTimeout(() => r("fast done"), 20));

console.log(await withTimeout(fast, 100));
try {
  await withTimeout(slow, 50);
} catch (e) {
  console.log(e instanceof Error ? e.message : e);
}
```

> [!TIP] Clear the timer in `finally`. A leftover timer keeps the process alive and fires for nothing.

## Promise.any

First success wins. Rejections are ignored unless every promise rejects.

```ts
const mirror = (host: string, ms: number, ok: boolean): Promise<string> =>
  new Promise((resolve, reject) => setTimeout(() => (ok ? resolve(host) : reject(new Error(host))), ms));

console.log("fastest healthy:", await Promise.any([
  mirror("a.mirror", 20, false),
  mirror("b.mirror", 60, true),
  mirror("c.mirror", 40, true),
]));

try {
  await Promise.any([mirror("x", 10, false), mirror("y", 20, false)]);
} catch (e) {
  if (e instanceof AggregateError) {
    console.log("all failed:", e.errors.length, "errors");
  }
}
```

## Key takeaways

- `all`: need everything, fail fast.
- `allSettled`: need a report on everything.
- `race`: first to settle wins; great for timeouts.
- `any`: first success wins; `AggregateError` if none.
- None of them cancel the losers. Use `AbortController` for that.
