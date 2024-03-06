// Parameters<Type>
//
// Constructs a tuple type from the types used
// in the parameters of a function type Type.
// For overloaded functions, this will be the
// parameters of the last signature; see Inferring Within
// Conditional Types.
//
declare function print(arg: { a: number; b: string }): void;

type P = Parameters<typeof print>;

let printable: P = [{
  a: 42,
  b: "ts works",
}];

export function runParameters():void {
  console.log("Parameters<T>");
  console.log(printable);
}