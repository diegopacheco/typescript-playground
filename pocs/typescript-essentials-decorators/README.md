# typescript-essentials-decorators

Decorators: a class decorator that seals the class, plus method decorators that wrap calls with logging and mark a method non-writable.

### How it works

`src/main.ts` uses `@sealed` on the `Calculator` class and `@log` / `@readonly` on its methods. `log` wraps the original method to print each call; `readonly` flips `descriptor.writable`. `tsconfig.json` enables `experimentalDecorators` so `bun` applies them.

### Run

```bash
./run.sh
```

### Output

```
call add(2, 3)
add result: 5
call mul(4, 5)
mul result: 20
sealed: true
```
