# typescript-essentials-semaphores

An async `Semaphore` that bounds concurrency: `acquire`/`release` with a waiter queue and a `run` helper, proving no more than N tasks execute at once.

### How it works

`src/main.ts` implements a `Semaphore` holding a permit count and a queue of pending resolvers. Six tasks are submitted through `run` under a limit of 2; the program tracks peak concurrency and shows it never exceeds the permit count.

### Run

```bash
./run.sh
```

### Output

```
results: [ 1, 2, 3, 4, 5, 6 ]
completion order: [ 1, 2, 3, 4, 5, 6 ]
peak concurrency (limit 2): 2
```
