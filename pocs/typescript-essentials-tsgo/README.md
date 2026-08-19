# typescript-essentials-tsgo

The **TypeScript 7** native compiler (`tsgo`, the Go port shipped as `@typescript/native-preview`): type-check a strict project with the new compiler, then run it.

### How it works

`src/main.ts` uses `readonly` tuple types, a typed `dot`/`scale`, and the `satisfies` operator. `install-deps.sh` adds `@typescript/native-preview`. `run.sh` prints the compiler version (`7.0.0-dev...`), type-checks the project against `tsconfig.json` in `strict` mode with `bunx @typescript/native-preview --noEmit`, and only then runs the file with `bun`.

### Run

```bash
./install-deps.sh
./run.sh
```

### Output

```
tsgo version:
Version 7.0.0-dev.20260707.2
typechecking with the TypeScript 7 native compiler:
typecheck passed, running:
dot product: 32
scaled: [ 2, 4, 6 ]
satisfies: localhost 8080
```
