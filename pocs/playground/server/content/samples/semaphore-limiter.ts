class Semaphore {
  private available: number;
  private readonly waiters: Array<() => void> = [];

  constructor(permits: number) {
    this.available = permits;
  }

  async acquire(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return;
    }
    await new Promise<void>((resolve) => this.waiters.push(resolve));
  }

  release(): void {
    const next = this.waiters.shift();
    if (next) {
      next();
    } else {
      this.available++;
    }
  }

  async use<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const limit = 2;
const semaphore = new Semaphore(limit);
let active = 0;
let peak = 0;

async function job(id: number): Promise<number> {
  return semaphore.use(async () => {
    active++;
    peak = Math.max(peak, active);
    console.log(`start job ${id} (active=${active})`);
    await sleep(40 + (id % 3) * 20);
    active--;
    console.log(`end   job ${id}`);
    return id * id;
  });
}

const ids = [1, 2, 3, 4, 5, 6];
const results = await Promise.all(ids.map(job));
console.log("results:", results);
console.log(`peak concurrency: ${peak} (limit ${limit})`);
