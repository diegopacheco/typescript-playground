type Pet =
  | { kind: "cat"; livesLeft: number }
  | { kind: "dog"; goodBoy: boolean }
  | { kind: "fish"; tankLiters: number };

function describe(pet: Pet): string {
  switch (pet.kind) {
    case "cat":
      return `cat with ${pet.livesLeft} lives`;
    case "dog":
      return `dog goodBoy=${pet.goodBoy}`;
    case "fish":
      return `fish in ${pet.tankLiters}L`;
    default:
      return assertNever(pet);
  }
}

function assertNever(value: never): never {
  throw new Error(`unhandled: ${JSON.stringify(value)}`);
}

function typeofNarrow(value: string | number): string {
  if (typeof value === "string") return value.toUpperCase();
  return value.toFixed(2);
}

interface Bird {
  fly(): string;
}

interface Snake {
  slither(): string;
}

function isBird(animal: Bird | Snake): animal is Bird {
  return "fly" in animal;
}

function move(animal: Bird | Snake): string {
  return isBird(animal) ? animal.fly() : animal.slither();
}

function main(): void {
  console.log(describe({ kind: "cat", livesLeft: 9 }));
  console.log(describe({ kind: "dog", goodBoy: true }));
  console.log(describe({ kind: "fish", tankLiters: 40 }));

  console.log("typeof string:", typeofNarrow("hello"));
  console.log("typeof number:", typeofNarrow(3.14159));

  console.log("in-operator guard:", move({ fly: () => "flap flap" }));
  console.log("type predicate:", move({ slither: () => "sss" }));
}

main();
