# typescript-essentials-enums

Enums: numeric enums with reverse mapping, string enums, and a `const enum` that is inlined at compile time.

### How it works

`src/main.ts` rotates a `Direction` numeric enum (using its reverse `Direction[value]` mapping), compares a `Status` string enum, reads an inlined `const enum Priority`, and lists the enum names by filtering `Object.values`.

### Run

```bash
./run.sh
```

### Output

```
numeric enum value: 1
numeric enum name: East
turnRight North: East
string enum: DISABLED
isActive: true
const enum inlined: 10
all directions: [ "North", "East", "South", "West" ]
```
