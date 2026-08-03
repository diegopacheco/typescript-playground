# typescript-essentials-async

Promises and `async`/`await`: sequential awaits, `Promise.all`, `Promise.race`, `Promise.allSettled`, and catching rejections.

### How it works

`src/main.ts` builds typed `delay` and `reject` helpers, awaits two values in sequence, runs three in parallel with `Promise.all`, picks the fastest with `Promise.race`, collects mixed outcomes with `Promise.allSettled`, and catches a rejected promise with `try`/`catch`.

### Run

```bash
./run.sh
```

### Output

```
sequential await: 30
Promise.all: [ 1, 2, 3 ]
Promise.race winner: 2
Promise.allSettled: [ "fulfilled", "rejected" ]
caught rejection: boom
```
