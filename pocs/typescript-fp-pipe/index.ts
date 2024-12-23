const pipe = <T>(...fns: Function[]) => (x: T) =>
    fns.reduce((v, f) => f(v), x);

// Functions
const double = (x: number) => x * 2;
const square = (x: number) => x * x;
const addOne = (x: number) => x + 1;
  
// Composed Function
const composed = pipe(double, square, addOne);
  
console.log(composed(5)); // Output: 101