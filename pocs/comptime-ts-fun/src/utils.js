export function sum(a, b) {
  console.log(`Computing sum of ${a} + ${b} at compile time`);
  return a + b;
}

export function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function generateMessage() {
  const timestamp = new Date().toISOString();
  return `Generated at compile time: ${timestamp}`;
}

export const PI_SQUARED = Math.PI * Math.PI;