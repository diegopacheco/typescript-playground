# typescript-essentials-json

JSON in TypeScript: `stringify`, pretty printing, parsing with a reviver that rebuilds `Date` objects, and a typed `safeParse` that returns a result instead of throwing.

### How it works

`src/main.ts` serializes an `Order` (its `Date` becomes an ISO string), pretty-prints a subset with the indent argument, parses back with a reviver that turns `createdAt` into a real `Date`, and wraps `JSON.parse` in `safeParse<T>` returning `{ ok, value }` or `{ ok, error }`.

### Run

```bash
./run.sh
```

### Output

```
stringify: {"id":7,"total":42.5,"createdAt":"2026-01-01T00:00:00.000Z","items":["book","pen"]}
pretty: {
  "id": 7,
  "items": [
    "book",
    "pen"
  ]
}
reviver date is Date: true
reviver year: 2026
safeParse ok: true
safeParse bad: false JSON Parse error: Expected '}'
```
