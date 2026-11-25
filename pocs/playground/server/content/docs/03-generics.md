# Generics

Generics let you write one function or type that works for many types while keeping full type safety.

## The idea

Without generics you either duplicate code or fall back to `unknown` and lose the type. A type parameter like `T` is a placeholder the caller fills in, usually by inference.

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const n = first([10, 20, 30]);
const s = first(["a", "b"]);
const none = first<boolean>([]);
console.log(n, s, none);
```

## Constraints

`T extends X` says "any type, as long as it has what `X` has". Inside the function you can use those members.

```ts
function longest<T extends { readonly length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

console.log(longest("typescript", "go"));
console.log(longest([1, 2], [1, 2, 3]));

const people = [{ name: "Ada", age: 36 }, { name: "Alan", age: 41 }];
console.log(pluck(people, "name"), pluck(people, "age"));
```

| Pattern | Meaning |
|---|---|
| `<T>` | any type |
| `<T extends string>` | string or a string literal |
| `<K extends keyof T>` | a key of `T` |
| `<T = string>` | default type when not inferred |
| `T[K]` | the type of property `K` on `T` |

## Generic types and classes

```ts
type Page<T> = {
  readonly items: readonly T[];
  readonly page: number;
  readonly total: number;
};

class Cache<K, V> {
  private readonly store = new Map<K, V>();

  getOrCreate(key: K, create: () => V): V {
    const hit = this.store.get(key);
    if (hit !== undefined) {
      return hit;
    }
    const value = create();
    this.store.set(key, value);
    return value;
  }
}

const cache = new Cache<number, Page<string>>();
const page = cache.getOrCreate(1, () => ({ items: ["a", "b"], page: 1, total: 2 }));
const again = cache.getOrCreate(1, () => ({ items: [], page: 1, total: 0 }));
console.log(page === again, again.items);
```

> [!TIP] If a type parameter appears only once in a signature, you probably do not need it. Generics exist to connect inputs to outputs.

## Generic async helpers

Generics shine with promises. The helper stays generic and the caller keeps the exact result type.

```ts
async function withTiming<T>(label: string, task: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const value = await task();
  console.log(label, "took about", Math.round((performance.now() - start) / 10) * 10, "ms");
  return value;
}

const delayed = <T>(ms: number, value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const count = await withTiming("count", () => delayed(30, 42));
const names = await withTiming("names", () => delayed(20, ["x", "y"]));
console.log(count + 1, names.join("-"));
```

> [!NOTE] Explicit type arguments like `first<boolean>([])` are only needed when inference has nothing to work with.

## Key takeaways

- Generics connect input types to output types.
- Use `extends` to require capabilities.
- `keyof` and `T[K]` make safe property access helpers.
- Let inference pick `T`; annotate only when it can not.
- Do not add a type parameter that links nothing.
