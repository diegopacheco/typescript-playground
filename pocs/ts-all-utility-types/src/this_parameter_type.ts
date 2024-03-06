// ThisParameterType<Type>
//
// Extracts the type of the this parameter
// for a function type, or unknown if the function
// type has no this parameter.
//
function toHex(this: Number): string {
  return this.toString(16);
}

type X = ThisParameterType<typeof toHex>;

function numberToString(n:X) : string {
  return toHex.apply(n);
}

let result:string = numberToString(42);

export function runThisParameterType():void {
    console.log("ThisParameterType<T>");
    console.log(result);
}