# typescript-essentials-generators

Generators and iterators: finite and infinite generators, a lazy `take`, a custom `Symbol.iterator`, and an async generator consumed with `for await`.

### How it works

`src/main.ts` yields a `range`, streams an infinite `fibonacci` capped by a lazy `take`, implements `Iterable<number>` on a `Countdown` class via `[Symbol.iterator]`, and drives an `AsyncGenerator` of timed ticks with `for await`.

### Run

```bash
./run.sh
```

### Output

```
range: [ 0, 1, 2, 3, 4 ]
fibonacci first 8: [ 0, 1, 1, 2, 3, 5, 8, 13 ]
custom iterable: [ 3, 2, 1 ]
async generator: [ 1, 2, 3 ]
```
