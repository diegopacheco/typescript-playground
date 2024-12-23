const pipe = <T>(...fns: Function[]) => (x: T) =>
    fns.reduce((v, f) => f(v), x);
  
  // Example Functions
  const double = (x: number) => x * 2;
  const square = (x: number) => x * x;
  const addOne = (x: number) => x + 1;
  
  // Composed Function
  const doubleThenSquare = pipe(double, square, addOne);
  
  console.log(doubleThenSquare(5)); // Output: 101