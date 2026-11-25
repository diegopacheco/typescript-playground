const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const id = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(signal.reason);
      },
      { once: true },
    );
  });

async function download(name: string, chunks: number, signal: AbortSignal): Promise<string> {
  for (let i = 1; i <= chunks; i++) {
    await sleep(40, signal);
    console.log(`  ${name}: chunk ${i}/${chunks}`);
  }
  return `${name} complete`;
}

function reason(e: unknown): string {
  if (e instanceof DOMException) {
    return `${e.name}`;
  }
  return e instanceof Error ? e.message : String(e);
}

async function attempt(label: string, work: (signal: AbortSignal) => Promise<string>, signal: AbortSignal): Promise<void> {
  console.log(label);
  try {
    console.log(" ", await work(signal));
  } catch (e) {
    console.log("  aborted:", reason(e));
  }
}

await attempt("fast enough", (s) => download("small.bin", 2, s), AbortSignal.timeout(200));
await attempt("too slow", (s) => download("large.bin", 10, s), AbortSignal.timeout(130));

const controller = new AbortController();
setTimeout(() => controller.abort(new Error("user pressed cancel")), 90);
await attempt("manual cancel", (s) => download("video.mp4", 10, s), controller.signal);

const user = new AbortController();
const combined = AbortSignal.any([user.signal, AbortSignal.timeout(100)]);
await attempt("any(user, timeout)", (s) => download("backup.tar", 10, s), combined);
