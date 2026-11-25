# Error Handling

In TypeScript a caught error is `unknown`, so robust code narrows it, uses typed `Error` subclasses and sometimes returns errors as values.

## Caught errors are unknown

Anything can be thrown: strings, numbers, objects. With strict mode, `catch (e)` gives you `unknown`. Narrow before reading it.

```ts
function message(e: unknown): string {
  if (e instanceof Error) {
    return e.name + ": " + e.message;
  }
  if (typeof e === "string") {
    return "string thrown: " + e;
  }
  return "unknown value: " + JSON.stringify(e);
}

const throwers: ReadonlyArray<() => never> = [
  () => { throw new TypeError("bad input"); },
  () => { throw "plain text"; },
  () => { throw { code: 42 }; },
];

for (const t of throwers) {
  try {
    t();
  } catch (e) {
    console.log(message(e));
  }
}
```

> [!WARNING] Never `catch (e: any)`. It hides the fact that `e` may not be an `Error` at all.

## Custom error classes

Subclass `Error` to carry structured data. Set `name` so logs are clear. Use `cause` to keep the original error.

```ts
class NotFoundError extends Error {
  override readonly name = "NotFoundError";
  constructor(readonly resource: string, readonly id: string) {
    super(resource + " " + id + " not found");
  }
}

class ServiceError extends Error {
  override readonly name = "ServiceError";
}

function findUser(id: string): string {
  if (id !== "1") {
    throw new NotFoundError("user", id);
  }
  return "ada";
}

function loadProfile(id: string): string {
  try {
    return findUser(id);
  } catch (e) {
    throw new ServiceError("profile load failed", { cause: e });
  }
}

try {
  loadProfile("9");
} catch (e) {
  if (e instanceof ServiceError && e.cause instanceof NotFoundError) {
    console.log(e.message, "->", e.cause.message, "(" + e.cause.resource + ")");
  }
}
```

| Approach | Good for | Cost |
|---|---|---|
| `throw` + `try/catch` | bugs, rare failures | not visible in types |
| custom `Error` classes | typed handling with `instanceof` | still invisible in signatures |
| `Result<T, E>` values | expected failures (validation, parsing) | more verbose call sites |
| `Promise.allSettled` | batches where some may fail | must inspect each result |

## Async errors

Rejected promises throw at the `await`. `finally` runs whether it worked or not.

```ts
async function save(data: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 20));
  if (data.length === 0) {
    throw new RangeError("empty payload");
  }
  return "saved " + data.length + " bytes";
}

for (const data of ["hello", ""]) {
  try {
    console.log(await save(data));
  } catch (e) {
    console.log("save failed:", e instanceof RangeError ? e.message : "unexpected");
  } finally {
    console.log("connection released");
  }
}
```

## The Result type

For expected failures, return the error as a value. The type system then forces callers to handle it.

```ts
type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

type AgeError = "not-a-number" | "negative" | "too-old";

function parseAge(input: string): Result<number, AgeError> {
  const n = Number(input);
  if (Number.isNaN(n)) {
    return { ok: false, error: "not-a-number" };
  }
  if (n < 0) {
    return { ok: false, error: "negative" };
  }
  if (n > 150) {
    return { ok: false, error: "too-old" };
  }
  return { ok: true, value: n };
}

for (const input of ["42", "abc", "-1", "200"]) {
  const r = parseAge(input);
  console.log(input.padEnd(4), r.ok ? "age " + r.value : "error " + r.error);
}
```

> [!TIP] Throw for bugs and things the caller can not fix. Return a `Result` for failures that are part of normal business flow.

## Key takeaways

- `catch` gives `unknown`; narrow it before use.
- Custom `Error` subclasses carry structured context.
- Use `cause` to wrap errors without losing the original.
- `finally` is for cleanup that must always run.
- Model expected failures as `Result` values.
