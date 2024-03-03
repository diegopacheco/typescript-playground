type Point = { 
    x: number; 
    y: number 
};

// Property of Object Point 
type P = keyof Point;

let prop1:P = "x";
let prop2:P = "y";

// would not work
//let prop3:P = "z";

let p1 = {
    x: 10,
    y: 20
} as Point;
console.log(p1);
console.log(p1[prop1]);
console.log(p1[prop2]);
