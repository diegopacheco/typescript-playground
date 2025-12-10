import { useQuery } from "@tanstack/react-query";
import { fetchPizzas } from "../api";
import type { Pizza } from "../types";

export function Menu() {
  const { data: pizzas, isLoading, error } = useQuery({
    queryKey: ["pizzas"],
    queryFn: fetchPizzas,
  });

  if (isLoading) return <div>Loading menu...</div>;
  if (error) return <div>Error loading menu</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Our Menu</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {pizzas?.map((pizza: Pizza) => (
          <div
            key={pizza.id}
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>{pizza.name}</h3>
            <p style={{ color: "#666", marginBottom: "0.5rem" }}>
              {pizza.description}
            </p>
            <p style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "1.2rem" }}>
              ${pizza.price.toFixed(2)}
            </p>
            <div style={{ marginTop: "0.5rem" }}>
              {pizza.toppings.map((t) => (
                <span
                  key={t}
                  style={{
                    display: "inline-block",
                    background: "#f0f0f0",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    marginRight: "0.25rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
