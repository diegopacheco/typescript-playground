import { useForm } from "@tanstack/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchPizzas, createOrder } from "../api";
import type { Pizza, CreateOrderInput } from "../types";
import { useState } from "react";

export function OrderForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: pizzas = [] } = useQuery({
    queryKey: ["pizzas"],
    queryFn: fetchPizzas,
  });

  const [cart, setCart] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate({ to: "/orders" });
    },
  });

  const form = useForm({
    defaultValues: {
      customerName: "",
      address: "",
      phone: "",
    },
    onSubmit: async ({ value }) => {
      const pizzasInCart = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([pizzaId, quantity]) => ({ pizzaId, quantity }));
      if (pizzasInCart.length === 0) {
        alert("Please add at least one pizza to your order");
        return;
      }
      const orderData: CreateOrderInput = {
        customerName: value.customerName,
        address: value.address,
        phone: value.phone,
        pizzas: pizzasInCart,
      };
      mutation.mutate(orderData);
    },
  });

  const updateCart = (pizzaId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[pizzaId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [pizzaId]: next };
    });
  };

  const total = Object.entries(cart).reduce((sum, [pizzaId, qty]) => {
    const pizza = pizzas.find((p: Pizza) => p.id === pizzaId);
    return sum + (pizza ? pizza.price * qty : 0);
  }, 0);

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold" as const,
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Place Your Order</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Select Pizzas</h3>
          {pizzas.map((pizza: Pizza) => (
            <div
              key={pizza.id}
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{pizza.name}</strong>
                <div style={{ color: "#d32f2f" }}>${pizza.price.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => updateCart(pizza.id, -1)}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "none",
                    background: "#e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <span style={{ minWidth: "20px", textAlign: "center" }}>
                  {cart[pizza.id] || 0}
                </span>
                <button
                  type="button"
                  onClick={() => updateCart(pizza.id, 1)}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "none",
                    background: "#d32f2f",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Delivery Details</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <form.Field
                name="customerName"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Name is required" : undefined,
                }}
              >
                {(field) => (
                  <>
                    <label style={labelStyle}>Name</label>
                    <input
                      style={inputStyle}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Your name"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div style={{ color: "#d32f2f", fontSize: "0.8rem" }}>
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </>
                )}
              </form.Field>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <form.Field
                name="address"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Address is required" : undefined,
                }}
              >
                {(field) => (
                  <>
                    <label style={labelStyle}>Address</label>
                    <input
                      style={inputStyle}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Delivery address"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div style={{ color: "#d32f2f", fontSize: "0.8rem" }}>
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </>
                )}
              </form.Field>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Phone is required" : undefined,
                }}
              >
                {(field) => (
                  <>
                    <label style={labelStyle}>Phone</label>
                    <input
                      style={inputStyle}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Your phone number"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div style={{ color: "#d32f2f", fontSize: "0.8rem" }}>
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </>
                )}
              </form.Field>
            </div>
            <div
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              style={{
                width: "100%",
                padding: "1rem",
                background: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {mutation.isPending ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
