class Animal {
  constructor(public name: string, public legs: number) {}

  describe(): string {
    return `${this.name} has ${this.legs} legs`;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name, 4);
  }

  sound(): string {
    return "woof";
  }
}

function forLoop(): number {
  let total = 0;
  for (let i = 1; i <= 5; i++) total += i;
  return total;
}

function whileLoop(): number {
  let n = 10;
  let steps = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }
  return steps;
}

function loopOverCollection(): string[] {
  const fruits = ["apple", "banana", "cherry"];
  return fruits.map((fruit, i) => `${i}:${fruit}`);
}

function arrows(): [number, number] {
  const square = (x: number) => x * x;
  const add = (a: number, b: number) => a + b;
  return [square(5), add(3, 4)];
}

function sorting(): [[string, number][], [string, number][]] {
  const people: [string, number][] = [["alice", 30], ["bob", 25], ["carol", 35]];
  const byAge = [...people].sort((a, b) => a[1] - b[1]);
  const byNameDesc = [...people].sort((a, b) => b[0].localeCompare(a[0]));
  return [byAge, byNameDesc];
}

function main(): void {
  console.log("forLoop sum 1..5:", forLoop());
  console.log("whileLoop halving steps:", whileLoop());
  console.log("loopOverCollection:", loopOverCollection());
  console.log("arrows:", arrows());

  const [byAge, byNameDesc] = sorting();
  console.log("sorted by age:", byAge);
  console.log("sorted by name desc:", byNameDesc);

  const dog = new Dog("Rex");
  console.log("class describe:", dog.describe());
  console.log("class method:", dog.sound());
  console.log("instanceof Animal:", dog instanceof Animal);
}

main();
