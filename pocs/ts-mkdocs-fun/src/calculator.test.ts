import { expect, test, describe } from "bun:test";
import { add, subtract, multiply, divide } from "./calculator";

describe("calculator", () => {
  test("add returns sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test("subtract returns difference of two numbers", () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(1, 1)).toBe(0);
    expect(subtract(0, 5)).toBe(-5);
  });

  test("multiply returns product of two numbers", () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 100)).toBe(0);
  });

  test("divide returns quotient of two numbers", () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(7, 2)).toBe(3.5);
    expect(divide(0, 5)).toBe(0);
  });

  test("divide throws error when dividing by zero", () => {
    expect(() => divide(5, 0)).toThrow("Cannot divide by zero");
  });
});
