# Utility and Mapped Types

Utility and mapped types transform existing types into new ones so you never copy and drift.

## Built-in utility types

| Utility | Result |
|---|---|
| `Partial<T>` | all properties optional |
| `Required<T>` | all properties required |
| `Readonly<T>` | all properties readonly |
| `Pick<T, K>` | only keys `K` |
| `Omit<T, K>` | all keys except `K` |
| `Record<K, V>` | object with keys `K` and values `V` |
| `ReturnType<F>` | return type of a function |
| `Parameters<F>` | parameter tuple of a function |
| `Awaited<T>` | value inside a promise |
| `NonNullable<T>` | removes `null` and `undefined` |

```ts
interface Product {
  readonly id: string;
  name: string;
  price: number;
  stock: number;
}

type NewProduct = Omit<Product, "id">;
type ProductPatch = Partial<Pick<Product, "name" | "price">>;

function patch(product: Product, change: ProductPatch): Product {
  return { ...product, ...change };
}

const draft: NewProduct = { name: "Lamp", price: 30, stock: 4 };
const saved: Product = { id: "p1", ...draft };
console.log(patch(saved, { price: 25 }));
```

## Types from functions

```ts
async function loadUser(id: number, verbose: boolean) {
  return { id, name: "user-" + id, verbose };
}

type LoadArgs = Parameters<typeof loadUser>;
type User = Awaited<ReturnType<typeof loadUser>>;

const args: LoadArgs = [7, false];
const user: User = await loadUser(...args);
console.log(user.name, user.verbose);
```

> [!TIP] Derive types from the source of truth. If the function changes, `ReturnType` follows it automatically.

## Mapped types

A mapped type loops over keys: `{ [K in keyof T]: ... }`. Add `as` to rename keys, and `-readonly` or `?` modifiers to change them.

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Validators<T> = { [K in keyof T]: (value: T[K]) => boolean };
type Setters<T> = { [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void };

type Form = { readonly email: string; readonly age: number };

const rules: Validators<Form> = {
  email: (v) => v.includes("@"),
  age: (v) => v >= 18,
};

const state: Mutable<Form> = { email: "", age: 0 };
const setters: Setters<Form> = {
  setEmail: (v) => { state.email = v; },
  setAge: (v) => { state.age = v; },
};

setters.setEmail("ada@mail.test");
setters.setAge(17);
console.log(state, { email: rules.email(state.email), age: rules.age(state.age) });
```

## Conditional types

`T extends U ? X : Y` picks a type based on another type. With `infer` you can extract parts.

```ts
type ElementOf<T> = T extends readonly (infer E)[] ? E : never;
type Unwrap<T> = T extends Promise<infer V> ? V : T;

const ids = [1, 2, 3] as const;
const one: ElementOf<typeof ids> = 2;
const text: Unwrap<Promise<string>> = "resolved";
const plain: Unwrap<number> = 5;
console.log(one, text, plain);
```

> [!WARNING] Deep conditional types are hard to read and slow to compile. Reach for them in library code, not in every feature.

## Key takeaways

- Build new types from existing ones instead of copying fields.
- `Omit`, `Pick` and `Partial` cover most DTO needs.
- `ReturnType`, `Parameters` and `Awaited` keep types in sync with code.
- Mapped types transform every key at once.
- Conditional types with `infer` extract inner types.
