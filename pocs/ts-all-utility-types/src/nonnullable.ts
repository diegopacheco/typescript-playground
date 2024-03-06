// NonNullable<Type>
//
// Constructs a type by excluding null
// and undefined from Type.
//
type ValidConfig = NonNullable<string | number | undefined>;

let hostname:ValidConfig = "127.0.0.1";
let port:ValidConfig = 3000;

// Type 'null' is not assignable to type 'ValidConfig'.ts(2322)
// let port2:ValidConfig = null;

// Type 'undefined' is not assignable to type 'ValidConfig'.ts(2322)
// let port3:ValidConfig = undefined;

export function runNonNullable():void {
    console.log("NonNullable<Type>");
    console.log(hostname);
    console.log(port);
}