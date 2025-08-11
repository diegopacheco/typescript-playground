# Comptime.ts Fun

Uses compile-time evaluation to optimize performance like in Zig.

### Run

```bash
./run.sh
```

### Result

```
❯ ./run.sh

> comptime-ts-fun@1.0.0 build
> vite build

vite v6.3.5 building for production...
Computing sum of 42 + 8 at compile time
✓ 1 modules transformed.
dist/index.js  0.35 kB │ gzip: 0.24 kB
✓ built in 1.11s

> comptime-ts-fun@1.0.0 start
> node dist/index.js

=== Comptime.ts Examples ===
Sum result: 50
Fibonacci of 10: 55
PI squared: 9.869604401089358
Message: Generated at compile time: 2025-08-11T02:40:23.795Z
All values above were computed at compile time!
```

final index.js file
```javascript
❯ cat dist/index.js
console.log("=== Comptime.ts Examples ===");const o=50;console.log(`Sum result: ${o}`);const e=55;console.log(`Fibonacci of 10: ${e}`);const l=9.869604401089358;console.log(`PI squared: ${l}`);const s="Generated at compile time: 2025-08-11T02:40:23.795Z";console.log(`Message: ${s}`);console.log("All values above were computed at compile time!");
```
