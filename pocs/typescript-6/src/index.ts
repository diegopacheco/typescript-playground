import { sum, clamp } from "./utils/math.js";

function es2025SetMethods(): void {
  const frontend = new Set(["typescript", "react", "css", "html"]);
  const backend = new Set(["typescript", "go", "rust", "java"]);

  const shared = frontend.intersection(backend);
  const allLangs = frontend.union(backend);
  const onlyFrontend = frontend.difference(backend);
  const onlyBackend = backend.difference(frontend);
  const symmetric = frontend.symmetricDifference(backend);
  const isSubset = new Set(["typescript"]).isSubsetOf(frontend);
  const isSuperset = allLangs.isSupersetOf(frontend);
  const isDisjoint = onlyFrontend.isDisjointFrom(onlyBackend);

  console.log("=== ES2025 Set Methods ===");
  console.log("Frontend:", [...frontend]);
  console.log("Backend:", [...backend]);
  console.log("Intersection:", [...shared]);
  console.log("Union:", [...allLangs]);
  console.log("Only Frontend:", [...onlyFrontend]);
  console.log("Only Backend:", [...onlyBackend]);
  console.log("Symmetric Difference:", [...symmetric]);
  console.log("Is ['typescript'] subset of frontend?", isSubset);
  console.log("Is union superset of frontend?", isSuperset);
  console.log("Is onlyFrontend disjoint from onlyBackend?", isDisjoint);
}

function es2025PromiseWithResolvers(): void {
  console.log("\n=== ES2025 Promise.withResolvers ===");
  const { promise, resolve } = Promise.withResolvers<string>();
  resolve("Hello from Promise.withResolvers!");
  promise.then((msg) => console.log(msg));
}

function strictModeByDefault(): void {
  console.log("\n=== TypeScript 6 Strict Mode by Default ===");

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

function improvedTypeInference(): void {
  console.log("\n=== Improved Type Inference for Methods ===");

  const items = [1, "two", 3, "four", 5];
  const numbers = items.filter((item): item is number => typeof item === "number");
  const strings = items.filter((item): item is string => typeof item === "string");

  console.log("Numbers:", numbers);
  console.log("Strings:", strings);

  const mapped = numbers.map((n) => ({ value: n, doubled: n * 2 }));
  console.log("Mapped:", mapped);
}

function es2025ArrayFeatures(): void {
  console.log("\n=== ES2025 Iterator Helpers ===");

  const nums = [10, 20, 30, 40, 50];
  const iter = nums.values();
  const doubled = iter.map((n) => n * 2);
  const filtered = doubled.filter((n) => n > 40);

  console.log("Doubled & filtered (>40):", [...filtered]);

  const range = Iterator.from([1, 2, 3, 4, 5]);
  const taken = range.take(3);
  console.log("Take 3 from iterator:", [...taken]);

  const dropped = Iterator.from([1, 2, 3, 4, 5]).drop(2);
  console.log("Drop 2 from iterator:", [...dropped]);
}

function utilsFeature(): void {
  console.log("\n=== Utils with ES Module Imports ===");
  const numbers = [10, 20, 30, 40, 50];
  console.log("Sum:", sum(numbers));
  console.log("Clamp 150 to [0,100]:", clamp(150, 0, 100));
  console.log("Clamp -5 to [0,100]:", clamp(-5, 0, 100));
}

async function main(): Promise<void> {
  console.log("*** TypeScript 6 Features ***\n");
  es2025SetMethods();
  es2025PromiseWithResolvers();
  strictModeByDefault();
  improvedTypeInference();
  es2025ArrayFeatures();
  utilsFeature();
}

main();
