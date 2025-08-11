import { sum, fibonacci, generateMessage, PI_SQUARED } 
from "./utils.js" with { type: "comptime" };

console.log("=== Comptime.ts Examples ===");

const result = sum(42, 8);
console.log(`Sum result: ${result}`);

const fib10 = fibonacci(10);
console.log(`Fibonacci of 10: ${fib10}`);

const piSquared = PI_SQUARED;
console.log(`PI squared: ${piSquared}`);

const message = generateMessage();
console.log(`Message: ${message}`);

console.log("All values above were computed at compile time!");