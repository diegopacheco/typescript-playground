type T0 = NonNullable<string | null | undefined>;
type T1 = NonNullable<number | null | undefined>;

let t0:T0 = "string value";
let t1:T1 = 42;
export let NonNullableResult = "T0 == " + t0 + " T1 == " + t1;