type Task = {
  readonly id: number;
  readonly name: string;
  readonly ms: number;
  readonly fails: boolean;
};

type Outcome =
  | { readonly kind: "ok"; readonly name: string; readonly ms: number }
  | { readonly kind: "failed"; readonly name: string; readonly reason: string };

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function run(task: Task): Promise<Outcome> {
  await sleep(task.ms);
  if (task.fails) {
    return { kind: "failed", name: task.name, reason: "upstream timeout" };
  }
  return { kind: "ok", name: task.name, ms: task.ms };
}

function describe(outcome: Outcome): string {
  switch (outcome.kind) {
    case "ok":
      return `✔ ${outcome.name} finished in ${outcome.ms}ms`;
    case "failed":
      return `✘ ${outcome.name} failed: ${outcome.reason}`;
    default: {
      const unreachable: never = outcome;
      return unreachable;
    }
  }
}

const tasks: readonly Task[] = [
  { id: 1, name: "fetch users", ms: 120, fails: false },
  { id: 2, name: "fetch orders", ms: 80, fails: false },
  { id: 3, name: "fetch invoices", ms: 60, fails: true },
];

const started = Date.now();
const outcomes = await Promise.all(tasks.map(run));
outcomes.forEach((outcome) => console.log(describe(outcome)));

const okCount = outcomes.filter((o) => o.kind === "ok").length;
console.log(`${okCount}/${outcomes.length} succeeded in ~${Math.round((Date.now() - started) / 10) * 10}ms total`);
