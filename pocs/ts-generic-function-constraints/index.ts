function max<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

console.log(max([1, 2], [1, 2, 3]));  // [ 1, 2, 3 ]
console.log(max("alice", "bob"));     // alice

// 
// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.ts(2345)
// TS complains but it works :-) 
//
console.log(max(10, 100));            // 100 
