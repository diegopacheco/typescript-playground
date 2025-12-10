import { Hono } from "hono";
import { cors } from "hono/cors";
import { pizzas, orders, generateOrderId } from "./data.ts";
import type { CreateOrderInput, Order } from "./types.ts";

const app = new Hono();

app.use("/*", cors());

app.get("/api/pizzas", (c) => {
  return c.json(pizzas);
});

app.get("/api/pizzas/:id", (c) => {
  const pizza = pizzas.find((p) => p.id === c.req.param("id"));
  if (!pizza) {
    return c.json({ error: "Pizza not found" }, 404);
  }
  return c.json(pizza);
});

app.get("/api/orders", (c) => {
  return c.json(orders);
});

app.get("/api/orders/:id", (c) => {
  const order = orders.find((o) => o.id === c.req.param("id"));
  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }
  return c.json(order);
});

app.post("/api/orders", async (c) => {
  const body = await c.req.json<CreateOrderInput>();
  let total = 0;
  for (const item of body.pizzas) {
    const pizza = pizzas.find((p) => p.id === item.pizzaId);
    if (pizza) {
      total += pizza.price * item.quantity;
    }
  }
  const order: Order = {
    id: generateOrderId(),
    customerName: body.customerName,
    address: body.address,
    phone: body.phone,
    pizzas: body.pizzas,
    total: Math.round(total * 100) / 100,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return c.json(order, 201);
});

app.patch("/api/orders/:id/status", async (c) => {
  const order = orders.find((o) => o.id === c.req.param("id"));
  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }
  const { status } = await c.req.json<{ status: Order["status"] }>();
  order.status = status;
  return c.json(order);
});

console.log("Server running on http://localhost:3000");

export default {
  port: 3000,
  fetch: app.fetch,
};
