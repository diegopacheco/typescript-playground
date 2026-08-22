# typescript-essentials-workers

Real OS threads with `node:worker_threads`: a CPU-bound prime count split across four workers and compared against the single-threaded result.

### How it works

`src/main.ts` is both the main thread and the worker body. On the main thread it counts primes below 100000 directly, then spawns four `Worker`s over disjoint ranges (each re-runs this same file) and sums their `postMessage` results — proving the parallel total matches the sequential one.

### Run

```bash
./run.sh
```

### Output

```
single-thread primes < 100000: 9592
worker parts: [ 2762, 2371, 2260, 2199 ]
workers total: 9592
```
