# typescript-essentials-functional

Functional programming in TypeScript: `map`, `filter`, `reduce`, closures, partial application, and function composition — all with type parameters.

### How it works

`src/main.ts` transforms a list with `map`/`filter`/`reduce`, builds closures that capture state (`makeCounter`, `multiplier`), fixes an argument with a typed `partial`, and composes functions into a pipeline with `reduceRight`.

### Run

```bash
./run.sh
```

### Output

```
mapFilterReduce: [ [ 2, 4, 6, 8, 10, 12 ], [ 2, 4, 6 ], 21 ]
closure counter: 1 2 3
closure multiplier: 30
partial 5^2: 25
compose (x*2)+1 of 5: 11
```
