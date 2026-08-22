import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function countPrimes(from: number, to: number): number {
  let count = 0;
  for (let i = from; i < to; i++) if (isPrime(i)) count++;
  return count;
}

function runWorker(from: number, to: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), { workerData: { from, to } });
    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

async function main(): Promise<void> {
  const ranges: [number, number][] = [
    [2, 25000],
    [25000, 50000],
    [50000, 75000],
    [75000, 100000],
  ];

  const single = countPrimes(2, 100000);
  console.log("single-thread primes < 100000:", single);

  const parts = await Promise.all(ranges.map(([from, to]) => runWorker(from, to)));
  console.log("worker parts:", parts);
  console.log("workers total:", parts.reduce((a, b) => a + b, 0));
}

if (isMainThread) {
  main();
} else {
  const { from, to } = workerData as { from: number; to: number };
  parentPort!.postMessage(countPrimes(from, to));
}
