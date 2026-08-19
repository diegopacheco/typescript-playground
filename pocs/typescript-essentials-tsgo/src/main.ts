type Vec = readonly [number, number, number];

function dot(a: Vec, b: Vec): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function scale(v: Vec, factor: number): Vec {
  return [v[0] * factor, v[1] * factor, v[2] * factor];
}

const satisfiesCheck = { host: "localhost", port: 8080 } satisfies Record<string, string | number>;

function main(): void {
  const a: Vec = [1, 2, 3];
  const b: Vec = [4, 5, 6];
  console.log("dot product:", dot(a, b));
  console.log("scaled:", scale(a, 2));
  console.log("satisfies:", satisfiesCheck.host, satisfiesCheck.port);
}

main();
