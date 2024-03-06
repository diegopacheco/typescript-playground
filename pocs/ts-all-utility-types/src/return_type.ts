// ReturnType<Type>
//
// Constructs a type consisting of the return
// type of function Type.
// 
// For overloaded functions, this will be the return
// type of the last signature; see Inferring Within
// Conditional Types.
//
declare function print(): { a: number; b: string };

type T = ReturnType<typeof print>;

let config:T = {
    a: 3000,
    b: "127.0.0.1"
};

export function runReturnType(){
    console.log("RetrunType<T>");
    console.log(config);
}