# typescript-essentials-basics

TypeScript building blocks: `for`, `while`, looping over collections, arrow functions, `sort` with comparators, and classes with inheritance and parameter properties.

### How it works

`src/main.ts` has one function per concept. `forLoop` sums a range, `whileLoop` halves a number counting steps, `loopOverCollection` uses `map` with an index, `arrows` builds arrow functions, `sorting` sorts tuples by different comparators, and `Animal`/`Dog` show a class with a subclass using constructor parameter properties. Run with `bun`, which transpiles and executes the TypeScript directly.

### Run

```bash
./run.sh
```

### Output

```
forLoop sum 1..5: 15
whileLoop halving steps: 3
loopOverCollection: [ "0:apple", "1:banana", "2:cherry" ]
arrows: [ 25, 7 ]
sorted by age: [ [ "bob", 25 ], [ "alice", 30 ], [ "carol", 35 ] ]
sorted by name desc: [ [ "carol", 35 ], [ "bob", 25 ], [ "alice", 30 ] ]
class describe: Rex has 4 legs
class method: woof
instanceof Animal: true
```
