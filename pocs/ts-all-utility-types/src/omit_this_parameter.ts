// OmitThisParameter<Type>
//
// Removes the this parameter from Type.
// If Type has no explicitly declared this parameter,
// the result is simply Type. Otherwise, a new function
// type with no this parameter is created from Type. \
//
// Generics are erased and only the last overload signature
// is propagated into the new function type.
//
function toHex(this: Number):string {
  return this.toString(16);
}

type R = OmitThisParameter<typeof toHex>;

const fiveToHex:R = toHex.bind(5);

export function runOmitThisParameter(): void {
  console.log("OmitThisParameter<T>");
  console.log(fiveToHex);
  console.log(fiveToHex());
}
