/**
 * ReturnType<Type>
 * Constructs a type consisting of the return type of function Type.
 */
declare function funcRet(i:number): { a: number; b: string };

type T0 = ReturnType<typeof funcRet>;

let t0:T0 = {
    a: 42,
    b: "str",
};

export let returnTypeResult = t0;