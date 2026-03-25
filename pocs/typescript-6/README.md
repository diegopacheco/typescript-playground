# TypeScript 6

TypeScript 6.0.2 project showcasing the new features from the official release.
TypeScript 6 is the last release based on the JavaScript compiler codebase before
the native Go rewrite (TypeScript 7+).

## TypeScript 6 Features Showcased

* **Temporal API Types** - built-in types for the Temporal proposal (stage 4), instant, dates, durations, zoned date-times
* **RegExp.escape** - new `RegExp.escape()` function via `es2025` lib, auto-escapes special regex characters
* **ES2025 Set Methods** - `intersection`, `union`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`
* **ES2025 Iterator Helpers** - `map`, `filter`, `take`, `drop`, `flatMap` directly on iterators
* **Promise.withResolvers** - create a promise with externally accessible `resolve` and `reject`
* **Strict mode by default** - `strict: true`, `module: esnext`, `target: es2025` are now defaults
* **Less context-sensitivity on this-less functions** - improved inference when functions never use `this`
* **es2025 target/lib** - new compiler target and lib option

## New Defaults in TypeScript 6

| Option | Old Default | New Default |
|--------|-------------|-------------|
| `strict` | false | true |
| `module` | commonjs | esnext |
| `target` | es2020 | es2025 |
| `types` | all @types | `[]` (empty) |

## Deprecations

* `target: es5` removed (ES2015 minimum)
* `module: amd`, `umd`, `systemjs` removed
* `moduleResolution: classic` removed
* `outFile` removed
* `baseUrl` deprecated (use `paths` instead)

## How to Build
```bash
npm install
npm run build
```

## How to Run
```bash
./run.sh
```

## Output
```
*** TypeScript 6.0 Features ***

=== Temporal API Types (TS6) ===
Now (instant): 2026-03-25T03:01:15.299715072Z
Today: 2026-03-24
Meeting: 2026-04-15T14:30:00
Deadline (+30 days): 2026-04-23
Duration: PT2H30M
Zoned now: 2026-03-24T20:01:15.30600704-07:00[America/Los_Angeles]

=== RegExp.escape (TS6 / es2025) ===
Original: price is $10.00 (USD)
Escaped: \x70rice\x20is\x20\$10\.00\x20\(USD\)
Match found: true
Dangerous: a.b+c*d?e[f]g{h}i^j$k|l\m
Safe: \x61\.b\+c\*d\?e\[f\]g\{h\}i\^j\$k\|l\\m

=== ES2025 Set Methods ===
Frontend: [ 'typescript', 'react', 'css', 'html' ]
Backend: [ 'typescript', 'go', 'rust', 'java' ]
Intersection: [ 'typescript' ]
Union: [ 'typescript', 'react', 'css', 'html', 'go', 'rust', 'java' ]
Difference: [ 'react', 'css', 'html' ]
Symmetric Diff: [ 'react', 'css', 'html', 'go', 'rust', 'java' ]
Is subset: true
Is superset: true
Is disjoint: true

=== ES2025 Iterator Helpers ===
Doubled & filtered (>40): [ 60, 80, 100 ]
Take 3: [ 1, 2, 3 ]
Drop 2: [ 3, 4, 5 ]
FlatMap: [ 1, 10, 2, 20 ]

=== Promise.withResolvers ===

=== Strict Mode by Default (TS6) ===
strict: true is now the default in TS6
module: esnext is now the default
target: es2025 is now the default
Hello Diego, age 30
Hello Alice, age 25 (alice@ts6.dev)

=== Less Context-Sensitivity on this-less Functions ===
Applied double: [ 2, 4, 6 ]
Filtered numbers: [ 1, 3, 5 ]
Filtered strings: [ 'two', 'four' ]

=== Utils (ES Module Imports) ===
Sum [10,20,30,40,50]: 150
Clamp 150 to [0,100]: 100
Clamp -5 to [0,100]: 0
Hello from Promise.withResolvers!
```
