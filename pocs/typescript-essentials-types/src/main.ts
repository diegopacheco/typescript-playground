type UserId = string;

type Point = { x: number; y: number };

interface User {
  id: UserId;
  name: string;
  admin: boolean;
}

interface Timestamped {
  createdAt: number;
}

interface StoredUser extends User, Timestamped {}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  return shape.kind === "circle"
    ? Math.PI * shape.radius ** 2
    : shape.width * shape.height;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function main(): void {
  const stored: StoredUser = {
    id: "u-1",
    name: "alice",
    admin: true,
    createdAt: 1700000000,
  };
  console.log("interface inheritance:", stored);

  console.log("type alias distance:", distance({ x: 0, y: 0 }, { x: 3, y: 4 }));

  console.log("circle area:", Number(area({ kind: "circle", radius: 2 }).toFixed(4)));
  console.log("rect area:", area({ kind: "rect", width: 3, height: 5 }));

  const literal = "off" as "on" | "off";
  console.log("literal type:", literal);
}

main();
