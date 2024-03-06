// InstanceType<Type>
//
// Constructs a type consisting of the 
// instance type of a constructor function in Type.
//
class Point {
    x = 0;
    y = 0;
}

type Coordinates = InstanceType<typeof Point>;

let c:Coordinates = {
    x: 10,
    y: 20,
}

export function runInstanceType():void {
    console.log("InstanceType<Type>");
    console.log(c);
}