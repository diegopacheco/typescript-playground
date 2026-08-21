# typescript-essentials-utility-types

Built-in utility types: `Partial`, `Omit`, `Pick`, `Readonly`, `Record`, and `ReturnType`.

### How it works

`src/main.ts` starts from a `User` interface and derives new types from it: a `Partial` patch merged with the spread operator, an `Omit` for a public view, a `Pick` for credentials, a `Readonly` alias, a `Record<number, User>` lookup table, and `ReturnType<typeof greeter>` inferred from a function.

### Run

```bash
./run.sh
```

### Output

```
Partial patch: { id: 1, name: "alice2", email: "a@x.com", admin: true }
Omit: { id: 1, name: "alice" }
Pick: { email: "a@x.com" }
Readonly name: alice
Record lookup: alice
ReturnType: hi bob
```
