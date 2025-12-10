import type { Pizza, Order } from "./types.ts";

export const pizzas: Pizza[] = [
  {
    id: "1",
    name: "Margherita",
    description: "Classic tomato sauce, mozzarella, and basil",
    price: 12.99,
    toppings: ["tomato sauce", "mozzarella", "basil"],
  },
  {
    id: "2",
    name: "Pepperoni",
    description: "Tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    toppings: ["tomato sauce", "mozzarella", "pepperoni"],
  },
  {
    id: "3",
    name: "Hawaiian",
    description: "Tomato sauce, mozzarella, ham, and pineapple",
    price: 15.99,
    toppings: ["tomato sauce", "mozzarella", "ham", "pineapple"],
  },
  {
    id: "4",
    name: "Quattro Formaggi",
    description: "Four cheese blend: mozzarella, gorgonzola, parmesan, fontina",
    price: 16.99,
    toppings: ["mozzarella", "gorgonzola", "parmesan", "fontina"],
  },
  {
    id: "5",
    name: "Veggie Supreme",
    description: "Tomato sauce, mozzarella, bell peppers, onions, mushrooms, olives",
    price: 15.99,
    toppings: ["tomato sauce", "mozzarella", "bell peppers", "onions", "mushrooms", "olives"],
  },
];

export const orders: Order[] = [];

let orderIdCounter = 1;

export function generateOrderId(): string {
  return String(orderIdCounter++);
}
