type RetryOptions = {
  readonly attempts: number;
  readonly baseMs: number;
  readonly factor: number;
  readonly shouldRetry: (error: unknown) => boolean;
};

class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
  }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function retry<T>(fn: (attempt: number) => Promise<T>, options: RetryOptions): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt === options.attempts || !options.shouldRetry(error)) {
        break;
      }
      const wait = options.baseMs * options.factor ** (attempt - 1);
      console.log(`  attempt ${attempt} failed (${String(error)}), retrying in ${wait}ms`);
      await sleep(wait);
    }
  }
  throw lastError;
}

function flaky(failures: readonly number[]): (attempt: number) => Promise<string> {
  return async (attempt) => {
    const status = failures[attempt - 1];
    if (status !== undefined) {
      throw new HttpError(status);
    }
    return `ok on attempt ${attempt}`;
  };
}

const options: RetryOptions = {
  attempts: 4,
  baseMs: 25,
  factor: 2,
  shouldRetry: (e) => e instanceof HttpError && e.status >= 500,
};

const scenarios: ReadonlyArray<readonly [string, readonly number[]]> = [
  ["recovers", [503, 502]],
  ["client error", [404]],
  ["gives up", [500, 500, 500, 500]],
];

for (const [label, failures] of scenarios) {
  console.log(label);
  try {
    console.log(" ", await retry(flaky(failures), options));
  } catch (e) {
    console.log("  final error:", String(e));
  }
}
