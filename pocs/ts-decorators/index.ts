function logger(originalMethod: any, _context: any) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log("start:", originalMethod.name);
    const result = originalMethod.call(this, ...args);
    console.log("end:", originalMethod.name);
    return result;
  }
  return replacementMethod;
}

class User {
  constructor(private name: string, private age: number) {}

  @logger
  greet() {
    console.log("start: greet");
    console.log(`Hello, my name is ${this.name}.`);
    console.log("end: greet");
  }
}

const user = new User("Harry Potter", 16);
user.greet();