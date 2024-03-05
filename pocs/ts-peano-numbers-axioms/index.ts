// Peano numbers
type Zero = "Zero";
type Succ<N> = { succ: N; };

// Aliases for convenience
type One = Succ<Zero>;
type Two = Succ<One>;

// Addition
type Add<N, M> = N extends Succ<infer Nminus1>
    ? Succ<Add<Nminus1, M>>
    : M;

function proveExtends<T1, T2 extends T1>() {}

// Example: Only type-checks if 1 + 1 = 2
proveExtends<Add<One, One>, Two>();