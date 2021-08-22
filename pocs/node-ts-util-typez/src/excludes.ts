type T0 = Exclude<"a" | "b" | "c", "a">; 
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
type T2 = Exclude<string | number | (() => void), Function>;

let x:T0 = "b";
let y:T1 = "c";
let z:T2 = 42;
export let resultExclude = "T0 == " + x + " T1 == " + y + " T2 == " + z;