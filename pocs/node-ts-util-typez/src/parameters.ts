/**
 * ConstructorParameters<Type>
 * Constructs a tuple or array type from the types of a 
 * constructor function type. It produces a tuple type with all
 * the parameter types (or the type never if Type is not a function).
 */
declare function func1(arg: { a: number; b: string }): void;

type T3 = Parameters<typeof func1>;

let t3:T3 = [{
    a: 42,
    b: "str",
}]

export let parametersResult = t3;