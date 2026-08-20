# typescript-essentials-types

Type aliases vs interfaces: aliasing primitives, object shapes, interface inheritance with `extends`, discriminated unions, and literal types.

### How it works

`src/main.ts` aliases `UserId` and `Point`, extends two interfaces into `StoredUser`, discriminates a `Shape` union by its `kind` to compute `area`, measures distance between points, and pins a value to a string literal union.

### Run

```bash
./run.sh
```

### Output

```
interface inheritance: { id: "u-1", name: "alice", admin: true, createdAt: 1700000000 }
type alias distance: 5
circle area: 12.5664
rect area: 15
literal type: off
```
