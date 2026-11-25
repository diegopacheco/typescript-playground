type Circle = { readonly kind: "circle"; readonly radius: number };
type Rect = { readonly kind: "rect"; readonly width: number; readonly height: number };
type Triangle = { readonly kind: "triangle"; readonly base: number; readonly height: number };

type Shape = Circle | Rect | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rect":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default: {
      const unreachable: never = shape;
      throw new Error(`unknown shape: ${JSON.stringify(unreachable)}`);
    }
  }
}

function isRound(shape: Shape): shape is Circle {
  return shape.kind === "circle";
}

function parseShape(input: unknown): Shape | null {
  if (typeof input !== "object" || input === null || !("kind" in input)) {
    return null;
  }
  const record = input as Record<string, unknown>;
  if (record.kind === "circle" && typeof record.radius === "number") {
    return { kind: "circle", radius: record.radius };
  }
  if (record.kind === "rect" && typeof record.width === "number" && typeof record.height === "number") {
    return { kind: "rect", width: record.width, height: record.height };
  }
  return null;
}

const raw: readonly unknown[] = [
  { kind: "circle", radius: 2 },
  { kind: "rect", width: 3, height: 4 },
  { kind: "hexagon", side: 1 },
  "not a shape",
];

const shapes: Shape[] = raw.map(parseShape).filter((s): s is Shape => s !== null);
shapes.push({ kind: "triangle", base: 6, height: 2 });

for (const shape of shapes) {
  console.log(`${shape.kind.padEnd(8)} area=${area(shape).toFixed(2)} round=${isRound(shape)}`);
}
console.log(`parsed ${shapes.length - 1} of ${raw.length} raw inputs`);
