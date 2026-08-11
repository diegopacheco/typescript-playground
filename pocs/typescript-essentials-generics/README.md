# typescript-essentials-generics

Generics in TypeScript: generic functions, `extends` constraints, `keyof` indexing, and a generic class with a `map` method.

### How it works

`src/main.ts` defines `identity` and `first`, constrains `longest` to anything with a `length`, reads a property safely with `prop<T, K extends keyof T>`, and builds a `Box<T>` that maps its value into a `Box<U>`.

### Run

```bash
./run.sh
```

### Output

```
identity: 42 hi
first: 10
longest string: elephant
longest array length: 3
prop name: alice
generic box: value=10
```
