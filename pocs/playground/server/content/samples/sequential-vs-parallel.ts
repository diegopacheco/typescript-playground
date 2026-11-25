type Fetch = { readonly name: string; readonly ms: number };

const jobs: readonly Fetch[] = [
  { name: "profile", ms: 150 },
  { name: "settings", ms: 100 },
  { name: "feed", ms: 200 },
];

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function load(job: Fetch): Promise<string> {
  await sleep(job.ms);
  return job.name;
}

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const value = await fn();
  const elapsed = Math.round((performance.now() - start) / 50) * 50;
  console.log(`${label.padEnd(10)} ~${elapsed}ms`);
  return value;
}

async function sequential(): Promise<string[]> {
  const out: string[] = [];
  for (const job of jobs) {
    out.push(await load(job));
  }
  return out;
}

async function parallel(): Promise<string[]> {
  return Promise.all(jobs.map(load));
}

async function startThenAwait(): Promise<string[]> {
  const pending = jobs.map(load);
  const out: string[] = [];
  for (const p of pending) {
    out.push(await p);
  }
  return out;
}

const sum = jobs.reduce((acc, j) => acc + j.ms, 0);
const max = Math.max(...jobs.map((j) => j.ms));
console.log(`expected: sequential ~${sum}ms, parallel ~${max}ms`);
console.log(await timed("sequential", sequential));
console.log(await timed("parallel", parallel));
console.log(await timed("eager", startThenAwait));
