import { sum, clamp } from "./utils/math.js";

function temporalTypes(): void {
  console.log("=== Temporal API Types (TS6) ===");
  const now = Temporal.Now.instant();
  console.log("Now (instant):", now.toString());

  const today = Temporal.Now.plainDateISO();
  console.log("Today:", today.toString());

  const meeting = Temporal.PlainDateTime.from("2026-04-15T14:30:00");
  console.log("Meeting:", meeting.toString());

  const deadline = today.add({ days: 30 });
  console.log("Deadline (+30 days):", deadline.toString());

  const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
  console.log("Duration:", duration.toString());

  const zonedNow = Temporal.Now.zonedDateTimeISO();
  console.log("Zoned now:", zonedNow.toString());
}

function regexpEscape(): void {
  console.log("\n=== RegExp.escape (TS6 / es2025) ===");

  const userInput = "price is $10.00 (USD)";
  const escaped = RegExp.escape(userInput);
  console.log("Original:", userInput);
  console.log("Escaped:", escaped);

  const pattern = new RegExp(escaped);
  const text = "The price is $10.00 (USD) today";
  console.log("Match found:", pattern.test(text));

  const dangerousChars = "a.b+c*d?e[f]g{h}i^j$k|l\\m";
  console.log("Dangerous:", dangerousChars);
  console.log("Safe:", RegExp.escape(dangerousChars));
}

function es2025SetMethods(): void {
  console.log("\n=== ES2025 Set Methods ===");

  const frontend = new Set(["typescript", "react", "css", "html"]);
  const backend = new Set(["typescript", "go", "rust", "java"]);

  console.log("Frontend:", [...frontend]);
  console.log("Backend:", [...backend]);
  console.log("Intersection:", [...frontend.intersection(backend)]);
  console.log("Union:", [...frontend.union(backend)]);
  console.log("Difference:", [...frontend.difference(backend)]);
  console.log("Symmetric Diff:", [...frontend.symmetricDifference(backend)]);
  console.log("Is subset:", new Set(["typescript"]).isSubsetOf(frontend));
  console.log("Is superset:", frontend.union(backend).isSupersetOf(frontend));
  console.log("Is disjoint:", new Set(["python"]).isDisjointFrom(frontend));
}

function iteratorHelpers(): void {
  console.log("\n=== ES2025 Iterator Helpers ===");

  const nums = [10, 20, 30, 40, 50];
  const result = nums.values().map((n) => n * 2).filter((n) => n > 40);
  console.log("Doubled & filtered (>40):", [...result]);

  const taken = Iterator.from([1, 2, 3, 4, 5]).take(3);
  console.log("Take 3:", [...taken]);

  const dropped = Iterator.from([1, 2, 3, 4, 5]).drop(2);
  console.log("Drop 2:", [...dropped]);

  const chained = Iterator.from([1, 2]).flatMap((n) => [n, n * 10]);
  console.log("FlatMap:", [...chained]);
}

function promiseWithResolvers(): void {
  console.log("\n=== Promise.withResolvers ===");
  const { promise, resolve } = Promise.withResolvers<string>();
  resolve("Hello from Promise.withResolvers!");
  promise.then((msg) => console.log(msg));
}

function strictModeByDefault(): void {
  console.log("\n=== Strict Mode by Default (TS6) ===");
  console.log("strict: true is now the default in TS6");
  console.log("module: esnext is now the default");
  console.log("target: es2025 is now the default");

  type User = {
    name: string;
    age: number;
    email?: string;
  };

  const user: User = { name: "Diego", age: 30 };

  function greet(u: User): string {
    const emailPart = u.email ? ` (${u.email})` : "";
    return `Hello ${u.name}, age ${u.age}${emailPart}`;
  }

  console.log(greet(user));
  console.log(greet({ name: "Alice", age: 25, email: "alice@ts6.dev" }));
}

function lessContextSensitivity(): void {
  console.log("\n=== Less Context-Sensitivity on this-less Functions ===");

  function double(n: number): number {
    return n * 2;
  }

  function applyToAll(arr: number[], fn: (n: number) => number): number[] {
    return arr.map(fn);
  }

  const result = applyToAll([1, 2, 3], double);
  console.log("Applied double:", result);

  const items = [1, "two", 3, "four", 5];
  const numbers = items.filter((item): item is number => typeof item === "number");
  const strings = items.filter((item): item is string => typeof item === "string");
  console.log("Filtered numbers:", numbers);
  console.log("Filtered strings:", strings);
}

function utilsDemo(): void {
  console.log("\n=== Utils (ES Module Imports) ===");
  console.log("Sum [10,20,30,40,50]:", sum([10, 20, 30, 40, 50]));
  console.log("Clamp 150 to [0,100]:", clamp(150, 0, 100));
  console.log("Clamp -5 to [0,100]:", clamp(-5, 0, 100));
}

async function main(): Promise<void> {
  console.log("*** TypeScript 6.0 Features ***\n");
  temporalTypes();
  regexpEscape();
  es2025SetMethods();
  iteratorHelpers();
  promiseWithResolvers();
  strictModeByDefault();
  lessContextSensitivity();
  utilsDemo();
}

main();
