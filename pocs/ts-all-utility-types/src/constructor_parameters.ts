// ConstructorParameters<Type>
//
// Constructs a tuple or array type from the
// types of a constructor function type. It
// produces a tuple type with all the parameter
// types (or the type never if Type is not a function).
//
class Person {
  constructor(id: number, name: string) {}
}

type PT = ConstructorParameters<typeof Person>;

let tuple: PT = [100, "john doe"];

export function runConstructorParameters():void {
    console.log("ConstructorParameters<T>");
    console.log(tuple);
}