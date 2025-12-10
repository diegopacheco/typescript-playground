import {
  createRootRoute,
  createRoute,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { Menu } from "./pages/Menu";
import { OrderForm } from "./pages/OrderForm";
import { Orders } from "./pages/Orders";

const rootRoute = createRootRoute({
  component: () => (
    <div style={{ minHeight: "100vh" }}>
      <nav
        style={{
          background: "#d32f2f",
          padding: "1rem 2rem",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "white", fontSize: "1.5rem" }}>Pizza Delivery</h1>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Menu
        </Link>
        <Link to="/order" style={{ color: "white", textDecoration: "none" }}>
          Order
        </Link>
        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
          My Orders
        </Link>
      </nav>
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Menu,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order",
  component: OrderForm,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: Orders,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  orderRoute,
  ordersRoute,
]);
