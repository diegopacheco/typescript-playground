function sealed(constructor: Function): void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function log(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`call ${key}(${args.join(", ")})`);
    return original.apply(this, args);
  };
  return descriptor;
}

function readonly(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  descriptor.writable = false;
  return descriptor;
}

@sealed
class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }

  @log
  @readonly
  mul(a: number, b: number): number {
    return a * b;
  }
}

function main(): void {
  const calc = new Calculator();
  console.log("add result:", calc.add(2, 3));
  console.log("mul result:", calc.mul(4, 5));
  console.log("sealed:", Object.isSealed(Calculator));
}

main();
