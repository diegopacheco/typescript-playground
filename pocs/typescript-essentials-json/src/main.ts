interface Order {
  id: number;
  total: number;
  createdAt: Date;
  items: string[];
}

function stringifyWithDate(order: Order): string {
  return JSON.stringify(order);
}

function parseWithReviver(text: string): Order {
  return JSON.parse(text, (key, value) =>
    key === "createdAt" ? new Date(value) : value,
  );
}

function safeParse<T>(text: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) as T };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

function main(): void {
  const order: Order = {
    id: 7,
    total: 42.5,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    items: ["book", "pen"],
  };

  const text = stringifyWithDate(order);
  console.log("stringify:", text);

  console.log("pretty:", JSON.stringify({ id: order.id, items: order.items }, null, 2));

  const revived = parseWithReviver(text);
  console.log("reviver date is Date:", revived.createdAt instanceof Date);
  console.log("reviver year:", revived.createdAt.getUTCFullYear());

  const good = safeParse<Order>(text);
  console.log("safeParse ok:", good.ok);

  const bad = safeParse<Order>("{ not json ");
  console.log("safeParse bad:", bad.ok, bad.ok ? "" : bad.error);
}

main();
