class Semaphore {
  private available: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.available = permits;
  }

  async acquire(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return;
    }
    await new Promise<void>((resolve) => this.waiting.push(resolve));
  }

  release(): void {
    const next = this.waiting.shift();
    if (next) next();
    else this.available++;
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  const semaphore = new Semaphore(2);
  let active = 0;
  let peak = 0;
  const order: number[] = [];

  const tasks = [1, 2, 3, 4, 5, 6].map((id) =>
    semaphore.run(async () => {
      active++;
      peak = Math.max(peak, active);
      await delay(10);
      order.push(id);
      active--;
      return id;
    }),
  );

  const results = await Promise.all(tasks);
  console.log("results:", results);
  console.log("completion order:", order);
  console.log("peak concurrency (limit 2):", peak);
}

main();
