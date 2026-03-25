# TypeScript 6

TypeScript 6.0.2 project showcasing the new features introduced in TypeScript 6.
TypeScript 6 is the last release based on the JavaScript compiler codebase before
the Go rewrite (TypeScript 7+).

## TypeScript 6 Features

* **ES2025 target and lib** - new `es2025` option for target and lib with proper type definitions
* **ES2025 Set Methods** - `intersection`, `union`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`
* **ES2025 Promise.withResolvers** - create a promise with externally accessible `resolve` and `reject`
* **ES2025 Iterator Helpers** - `map`, `filter`, `take`, `drop` directly on iterators
* **Strict mode by default** - TypeScript 6 enables strict mode by default
* **Improved type inference for methods** - better narrowing with type predicates in array methods
* **ES Module resolution** - module resolution defaults to ESM, `es5` target deprecated

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
*** TypeScript 6 Features ***

=== ES2025 Set Methods ===
Frontend: [ 'typescript', 'react', 'css', 'html' ]
Backend: [ 'typescript', 'go', 'rust', 'java' ]
Intersection: [ 'typescript' ]
Union: [ 'typescript', 'react', 'css', 'html', 'go', 'rust', 'java' ]
Only Frontend: [ 'react', 'css', 'html' ]
Only Backend: [ 'go', 'rust', 'java' ]
Symmetric Difference: [ 'react', 'css', 'html', 'go', 'rust', 'java' ]
Is ['typescript'] subset of frontend? true
Is union superset of frontend? true
Is onlyFrontend disjoint from onlyBackend? true

=== ES2025 Promise.withResolvers ===

=== TypeScript 6 Strict Mode by Default ===
Hello Diego, age 30
Hello Alice, age 25 (alice@ts6.dev)

=== Improved Type Inference for Methods ===
Numbers: [ 1, 3, 5 ]
Strings: [ 'two', 'four' ]
Mapped: [ { value: 1, doubled: 2 }, { value: 3, doubled: 6 }, { value: 5, doubled: 10 } ]

=== ES2025 Iterator Helpers ===
Doubled & filtered (>40): [ 60, 80, 100 ]
Take 3 from iterator: [ 1, 2, 3 ]
Drop 2 from iterator: [ 3, 4, 5 ]

=== Utils with ES Module Imports ===
Sum: 150
Clamp 150 to [0,100]: 100
Clamp -5 to [0,100]: 0
Hello from Promise.withResolvers!
```
