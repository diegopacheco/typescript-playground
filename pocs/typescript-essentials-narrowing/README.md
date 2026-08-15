# typescript-essentials-narrowing

Type narrowing: discriminated-union `switch` with `never` exhaustiveness, `typeof` guards, the `in` operator, and user-defined type predicates.

### How it works

`src/main.ts` narrows a `Pet` union by its `kind` and proves exhaustiveness with `assertNever(value: never)`, narrows `string | number` with `typeof`, and distinguishes `Bird` from `Snake` using an `in` check wrapped in an `animal is Bird` type predicate.

### Run

```bash
./run.sh
```

### Output

```
cat with 9 lives
dog goodBoy=true
fish in 40L
typeof string: HELLO
typeof number: 3.14
in-operator guard: flap flap
type predicate: sss
```
