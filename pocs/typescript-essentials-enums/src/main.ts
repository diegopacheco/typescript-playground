enum Direction {
  North,
  East,
  South,
  West,
}

enum Status {
  Active = "ACTIVE",
  Disabled = "DISABLED",
}

const enum Priority {
  Low = 1,
  High = 10,
}

function turnRight(direction: Direction): Direction {
  return (direction + 1) % 4;
}

function isActive(status: Status): boolean {
  return status === Status.Active;
}

function main(): void {
  console.log("numeric enum value:", Direction.East);
  console.log("numeric enum name:", Direction[Direction.East]);
  console.log("turnRight North:", Direction[turnRight(Direction.North)]);

  console.log("string enum:", Status.Disabled);
  console.log("isActive:", isActive(Status.Active));

  console.log("const enum inlined:", Priority.High);

  const all = Object.values(Direction).filter((v) => typeof v === "string");
  console.log("all directions:", all);
}

main();
