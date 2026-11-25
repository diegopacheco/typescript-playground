type Order = { readonly id: string; readonly items: readonly string[] };
type Priced = Order & { readonly total: number };
type Receipt = Priced & { readonly paid: boolean };

const prices: Readonly<Record<string, number>> = { book: 12, pen: 2, lamp: 30 };

const delay = <T>(ms: number, value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function loadOrder(id: string): Promise<Order> {
  return delay(50, { id, items: ["book", "pen", "lamp"] });
}

function price(order: Order): Promise<Priced> {
  const total = order.items.reduce((sum, item) => sum + (prices[item] ?? 0), 0);
  return delay(30, { ...order, total });
}

function pay(order: Priced): Promise<Receipt> {
  if (order.total > 100) {
    return Promise.reject(new Error(`limit exceeded for ${order.id}`));
  }
  return delay(40, { ...order, paid: true });
}

function checkout(id: string): Promise<string> {
  return loadOrder(id)
    .then((order) => {
      console.log(`[${id}] loaded ${order.items.length} items`);
      return price(order);
    })
    .then((priced) => {
      console.log(`[${id}] total $${priced.total}`);
      return id === "o-2" ? pay({ ...priced, total: priced.total * 10 }) : pay(priced);
    })
    .then((receipt) => `[${id}] paid=${receipt.paid}`)
    .catch((error: unknown) => `[${id}] failed: ${error instanceof Error ? error.message : String(error)}`)
    .finally(() => console.log(`[${id}] done`));
}

console.log(await checkout("o-1"));
console.log(await checkout("o-2"));
