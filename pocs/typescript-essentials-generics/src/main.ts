function identity<T>(value: T): T {
  return value;
}

function first<T>(items: T[]): T | undefined {
  return items[0];
}

interface HasLength {
  length: number;
}

function longest<T extends HasLength>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  get(): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

function main(): void {
  console.log("identity:", identity<number>(42), identity("hi"));
  console.log("first:", first([10, 20, 30]));
  console.log("longest string:", longest("cat", "elephant"));
  console.log("longest array length:", longest([1, 2], [1, 2, 3]).length);

  const user = { id: 1, name: "alice" };
  console.log("prop name:", prop(user, "name"));

  const boxed = new Box(5).map((x) => x * 2).map((x) => `value=${x}`);
  console.log("generic box:", boxed.get());
}

main();
