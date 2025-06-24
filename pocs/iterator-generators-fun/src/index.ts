function* fibonacciGenerator(max: number) {
    let [a, b] = [0, 1];
    while (a <= max) {
        yield a;
        [a, b] = [b, a + b];
    }
}

function fibonacci(max: number) {
    return Array.from(fibonacciGenerator(max));
}

var max:number = 100;
console.log(`Fibonacci sequence up to ${max}:`, fibonacci(max));