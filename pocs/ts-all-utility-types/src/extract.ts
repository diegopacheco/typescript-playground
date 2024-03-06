// 
// Extract<Type, Union>
// 
// Constructs a type by extracting from Type all union
// members that are assignable to Union.
// 
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
 
type Circle = Extract<Shape, { kind: "circle" }>

let circulo:Circle = {
   kind: "circle",
   radius: 1.0,   
};

export function runExtract():void {
   console.log("Extract<T,O>");
   console.log(circulo);
}