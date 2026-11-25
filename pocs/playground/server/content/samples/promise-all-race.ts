type Mirror = { readonly host: string; readonly ms: number; readonly ok: boolean };

const mirrors: readonly Mirror[] = [
  { host: "eu.mirror", ms: 120, ok: true },
  { host: "us.mirror", ms: 60, ok: false },
  { host: "sa.mirror", ms: 90, ok: true },
];

function ping(m: Mirror): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => (m.ok ? resolve(m.host) : reject(new Error(`${m.host} down`))), m.ms);
  });
}

const message = (e: unknown): string => (e instanceof Error ? e.message : String(e));

try {
  await Promise.all(mirrors.map(ping));
} catch (e) {
  console.log("all        -> rejected:", message(e));
}

const settled = await Promise.allSettled(mirrors.map(ping));
const summary = settled.map((r) => (r.status === "fulfilled" ? `ok:${r.value}` : `err:${message(r.reason)}`));
console.log("allSettled ->", summary.join(", "));

try {
  await Promise.race(mirrors.map(ping));
} catch (e) {
  console.log("race       -> rejected:", message(e));
}

console.log("any        -> fulfilled:", await Promise.any(mirrors.map(ping)));

try {
  await Promise.any([ping({ host: "x", ms: 10, ok: false }), ping({ host: "y", ms: 20, ok: false })]);
} catch (e) {
  if (e instanceof AggregateError) {
    console.log("any (none) -> AggregateError:", e.errors.map(message).join(", "));
  }
}

const timeout = (ms: number): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms));

try {
  await Promise.race([ping(mirrors[0]!), timeout(50)]);
} catch (e) {
  console.log("race+timer ->", message(e));
}
