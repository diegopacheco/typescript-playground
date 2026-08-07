# typescript-essentials-error-handling

Error handling: a `Result<T, E>` union instead of throwing, a custom `Error` subclass, `instanceof` narrowing, and the `Error` `cause` option.

### How it works

`src/main.ts` parses ages into a `Result` that is either `{ ok: true, value }` or `{ ok: false, error }`, throws and catches a `ValidationError` narrowed with `instanceof`, and chains errors with `new Error(message, { cause })`.

### Run

```bash
./run.sh
```

### Output

```
parseAge(30) -> 30
parseAge(-4) failed: must be positive
parseAge(abc) failed: not a number
caught custom error: email missing @
error cause: socket closed
```
