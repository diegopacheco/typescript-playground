function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function reject(ms: number): Promise<never> {
  return new Promise((_, r) => setTimeout(() => r(new Error("boom")), ms));
}

async function sequential(): Promise<number> {
  const a = await delay(10, 5);
  const b = await delay(20, 5);
  return a + b;
}

async function parallel(): Promise<number[]> {
  return Promise.all([delay(1, 15), delay(2, 5), delay(3, 10)]);
}

async function race(): Promise<number> {
  return Promise.race([delay(1, 30), delay(2, 5)]);
}

async function allSettled(): Promise<string[]> {
  const results = await Promise.allSettled([delay("ok", 5), reject(5)]);
  return results.map((r) => r.status);
}

async function main(): Promise<void> {
  console.log("sequential await:", await sequential());
  console.log("Promise.all:", await parallel());
  console.log("Promise.race winner:", await race());
  console.log("Promise.allSettled:", await allSettled());

  try {
    await reject(1);
  } catch (error) {
    console.log("caught rejection:", (error as Error).message);
  }
}

main();
