# Narrowing and Unions

Union types say a value can be one of several shapes, and narrowing is how you safely find out which one you have.

## Union types

A union `A | B` means the value is an `A` or a `B`. You can only use what both have in common until you narrow.

```ts
function format(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value.toUpperCase();
}

console.log(format(3.14159));
console.log(format("ok"));
```

## Narrowing tools

| Check | Narrows | Works on |
|---|---|---|
| `typeof x === "string"` | primitives | string, number, boolean, bigint, symbol, function |
| `x instanceof Date` | class instances | anything with a constructor |
| `"key" in x` | object shapes | objects |
| `x.kind === "a"` | discriminated unions | tagged objects |
| `x === null` | null / undefined | any |
| custom `x is T` | anything | type predicates |

## Discriminated unions

Give each variant a literal tag like `kind`. A `switch` on the tag narrows each branch. A `never` check in `default` makes the compiler tell you when a new variant is not handled.

```ts
type Event =
  | { readonly kind: "click"; readonly x: number; readonly y: number }
  | { readonly kind: "key"; readonly key: string }
  | { readonly kind: "scroll"; readonly delta: number };

function describe(e: Event): string {
  switch (e.kind) {
    case "click":
      return "click at " + e.x + "," + e.y;
    case "key":
      return "key " + e.key;
    case "scroll":
      return "scroll " + e.delta;
    default: {
      const unreachable: never = e;
      return unreachable;
    }
  }
}

const events: readonly Event[] = [
  { kind: "click", x: 10, y: 20 },
  { kind: "key", key: "Enter" },
  { kind: "scroll", delta: -3 },
];
events.forEach((e) => console.log(describe(e)));
```

> [!TIP] Always add the `never` check. When someone adds a fourth variant, every unhandled `switch` becomes a compile error.

## Type predicates

A function returning `value is T` teaches the compiler a custom check. It is great with `filter`.

```ts
type User = { readonly id: number; readonly email: string };

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    typeof value.id === "number" &&
    typeof value.email === "string"
  );
}

const raw: unknown[] = [{ id: 1, email: "a@mail.test" }, { id: "2" }, null, { id: 3, email: "c@mail.test" }];
const users = raw.filter(isUser);
console.log(users.map((u) => u.email));
```

> [!WARNING] A type predicate is a promise you make to the compiler. If the check is wrong, the compiler trusts it anyway.

## Optional values

```ts
type Config = { readonly port?: number; readonly host?: string };

function address(config: Config): string {
  const host = config.host ?? "localhost";
  const port = config.port ?? 3000;
  return host + ":" + port;
}

console.log(address({}));
console.log(address({ port: 8080 }));
console.log(address({ host: "api.local", port: 0 }));
```

Use `??` instead of `||` for defaults. `||` also replaces `0` and `""`, which are often valid.

## Key takeaways

- Unions model "one of these" precisely.
- Narrow with `typeof`, `instanceof`, `in`, equality or a tag.
- Discriminated unions plus a `never` check give exhaustive handling.
- Type predicates make reusable guards.
- Use `??` for defaults, not `||`.
