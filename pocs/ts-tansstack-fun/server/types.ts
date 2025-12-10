export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  toppings: string[];
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  pizzas: { pizzaId: string; quantity: number }[];
  total: number;
  status: "pending" | "preparing" | "delivering" | "delivered";
  createdAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  address: string;
  phone: string;
  pizzas: { pizzaId: string; quantity: number }[];
}
