/**
 * Extract<Type, Union>
 * Constructs a type by extracting from Type all union members 
 * that are assignable to Union.
 */
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
type T1 = Extract<string | number | (() => void), Function>;

let t0:T0 = "a";
let t1:T1 = ()=>{};
export let extractResult = "T0 == " + t0 + " T1 == " + t1;