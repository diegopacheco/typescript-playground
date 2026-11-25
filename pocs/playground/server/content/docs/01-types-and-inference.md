# Types and Inference

TypeScript adds a static type layer on top of JavaScript and infers most of it for you.

## Why types

Types catch mistakes before the code runs. The compiler checks every call, every property access and every return value. At runtime the types are gone, so they cost nothing.

You rarely need to write types everywhere. TypeScript infers them from values, returns and usage. Annotate the boundaries: function parameters, public return types and data that comes from outside.

## Primitive and structural types

```ts
const name = "Ada";
const age = 36;
const active = true;
const tags = ["math", "engines"];

type Person = {
  readonly name: string;
  age: number;
  active: boolean;
  tags: string[];
};

const person: Person = { name, age, active, tags };
console.log(typeof person.name, typeof person.age, person.tags.length);
```

TypeScript is *structural*. A value fits a type if it has the right shape. The name of the type does not matter.

```ts
type Point = { x: number; y: number };

function length(p: Point): number {
  return Math.hypot(p.x, p.y);
}

const fromApi = { x: 3, y: 4, label: "corner" };
console.log(length(fromApi));
```

## Inference rules

| Code | Inferred type | Why |
|---|---|---|
| `let n = 1` | `number` | `let` can change, so it widens |
| `const n = 1` | `1` | `const` never changes, so it stays literal |
| `[1, "a"]` | `Array<string or number>` | best common type, a union array |
| `[1, "a"] as const` | `readonly [1, "a"]` | literal tuple |
| `() => 42` | `() => number` | inferred from the return |

```ts
let mutable = "draft";
const fixed = "draft";
const config = { mode: "fast", retries: 3 } as const;

mutable = "published";
const modes: readonly (typeof config.mode)[] = [config.mode];

console.log(mutable, fixed, modes, config.retries);
```

> [!TIP] Use `as const` for config objects and lookup tables. You get literal types and readonly for free.

## any, unknown and never

- `any` turns the checker off. Avoid it.
- `unknown` means "could be anything". You must check it before use.
- `never` means "this can not happen". Functions that always throw return `never`.

```ts
function parse(json: string): unknown {
  return JSON.parse(json);
}

function fail(message: string): never {
  throw new Error(message);
}

const data = parse('{"count": 2}');
if (typeof data === "object" && data !== null && "count" in data && typeof data.count === "number") {
  console.log("count is", data.count);
} else {
  fail("bad payload");
}
```

> [!WARNING] `any` spreads. One `any` value flowing through your code silently turns off checks everywhere it goes.

## satisfies

`satisfies` checks a value against a type without changing its inferred type. You keep the precise literal types.

```ts
type Theme = Record<string, string>;

const theme = {
  primary: "#3178c6",
  danger: "#d32f2f",
} satisfies Theme;

const key: keyof typeof theme = "primary";
console.log(key, theme[key]);
```

## Key takeaways

- Let inference work inside functions. Annotate the boundaries.
- Types are structural: shape matters, names do not.
- `const` and `as const` keep literal types.
- Prefer `unknown` over `any` for untrusted data.
- Use `satisfies` to validate without losing precision.
