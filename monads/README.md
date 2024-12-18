### Tests (test for monadic laws)

```bash
npm run test
```
```
❯ npm run test

> monads@1.0.0 test
> jest

  console.log
    Some { value: 10 }

      at Object.<anonymous> (src/index.ts:33:9)

 PASS  tests/index.test.ts
  OptionTrait Monad Laws
    ✓ Left Identity: return a >>= f is equivalent to f a (6 ms)
    ✓ Right Identity: m >>= return is equivalent to m (2 ms)
    ✓ Associativity: (m >>= f) >>= g is equivalent to m >>= (x -> f x >>= g) (1 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        4.043 s
Ran all test suites.
```