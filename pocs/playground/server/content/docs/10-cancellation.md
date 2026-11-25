# Cancellation

Promises can not be cancelled on their own, so the platform uses `AbortController` and `AbortSignal` to tell work to stop.

## The model

An `AbortController` owns a `signal`. You pass the `signal` to the work. Calling `controller.abort(reason)` flips `signal.aborted` to true and fires an `abort` event.

| API | What it does |
|---|---|
| `new AbortController()` | creates a controller and its signal |
| `controller.abort(reason?)` | aborts the signal with an optional reason |
| `signal.aborted` | true once aborted |
| `signal.reason` | the abort reason |
| `signal.throwIfAborted()` | throws the reason if aborted |
| `AbortSignal.timeout(ms)` | a signal that aborts itself after `ms` |
| `AbortSignal.any([...])` | aborts when any input signal aborts |

## Making work abortable

Listen for `abort`, clean up, and reject with `signal.reason`.

```ts
function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const id = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      reject(signal.reason);
    }, { once: true });
  });
}

const controller = new AbortController();
setTimeout(() => controller.abort(new Error("cancelled by user")), 50);

try {
  await sleep(1000, controller.signal);
  console.log("finished");
} catch (e) {
  console.log("stopped:", e instanceof Error ? e.message : e);
}
```

> [!WARNING] Aborting only sends a message. If the work never checks the signal, it keeps running.

## Timeouts with AbortSignal.timeout

`AbortSignal.timeout(ms)` aborts with a `TimeoutError` `DOMException`.

```ts
async function poll(signal: AbortSignal): Promise<never> {
  let rounds = 0;
  while (true) {
    signal.throwIfAborted();
    rounds++;
    await new Promise((r) => setTimeout(r, 20));
    console.log("round", rounds);
  }
}

try {
  await poll(AbortSignal.timeout(100));
} catch (e) {
  if (e instanceof DOMException && e.name === "TimeoutError") {
    console.log("gave up: timeout");
  } else {
    throw e;
  }
}
```

## Combining signals

Use `AbortSignal.any` to stop on whichever comes first: the user or a deadline.

```ts
const user = new AbortController();
const signal = AbortSignal.any([user.signal, AbortSignal.timeout(500)]);

signal.addEventListener("abort", () => {
  const reason: unknown = signal.reason;
  console.log("aborted by:", reason instanceof Error ? reason.message : String(reason));
});

setTimeout(() => user.abort(new Error("user closed the tab")), 30);
await new Promise((r) => setTimeout(r, 60));
console.log("signal.aborted =", signal.aborted);
```

> [!TIP] Pass one `signal` down through every layer. One abort then stops the whole tree of work.

## Cancelling parallel work

One controller can stop many tasks at once. When the first task fails, abort the rest.

```ts
const step = (name: string, ms: number, fail: boolean, signal: AbortSignal): Promise<string> =>
  new Promise((resolve, reject) => {
    const id = setTimeout(() => (fail ? reject(new Error(name + " failed")) : resolve(name)), ms);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      console.log("  cancelled", name);
      reject(signal.reason);
    }, { once: true });
  });

const group = new AbortController();
const tasks = [step("a", 200, false, group.signal), step("b", 40, true, group.signal), step("c", 300, false, group.signal)];

try {
  await Promise.all(tasks.map((t) => t.catch((e: unknown) => {
    group.abort(e);
    throw e;
  })));
} catch (e) {
  console.log("group stopped:", e instanceof Error ? e.message : e);
}
await Promise.allSettled(tasks);
```

## Key takeaways

- Promises are not cancellable; signals are the standard way to stop work.
- Abortable work must check the signal and clean up.
- `AbortSignal.timeout` gives deadlines with no manual timers.
- `AbortSignal.any` merges user cancel and timeouts.
- Abort sibling tasks when one fails to save resources.
