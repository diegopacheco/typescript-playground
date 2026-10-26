import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { Api } from "../data/api.ts";
import type { Auth } from "../logic/auth.ts";

export type RouterContext = { queryClient: QueryClient; api: Api; auth: Auth };

const TABS = [
  { to: "/search", label: "1. Search Params" },
  { to: "/loaders", label: "2. Loaders" },
  { to: "/query", label: "3. Query" },
  { to: "/table", label: "4. Table" },
  { to: "/form", label: "5. Form" },
  { to: "/preload", label: "6. Preload" },
  { to: "/blocker", label: "7. Blocker" },
  { to: "/errors", label: "8. Errors" },
  { to: "/deferred", label: "9. Deferred" },
  { to: "/vault", label: "10. Guards" },
] as const;

function PendingBar() {
  const pending = useRouterState({ select: (state) => state.status === "pending" });
  return <div className={pending ? "pending-bar active" : "pending-bar"} />;
}

function RootLayout() {
  return (
    <div className="shell">
      <PendingBar />
      <header className="header">
        <img src="/logo.svg" alt="TanStack 1.x Fun logo" width={40} height={40} />
        <div>
          <h1>TanStack 1.x Fun</h1>
          <p>Router 1.x and Form 1.x, with Query and Table, in 10 tabs</p>
        </div>
      </header>
      <nav className="tabs">
        {TABS.map((tab) => (
          <Link key={tab.to} to={tab.to} className="tab" activeProps={{ className: "tab active" }}>
            {tab.label}
          </Link>
        ))}
      </nav>
      <main className="panel">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <section>
      <h2>Page not found</h2>
      <Link to="/search">Back to the catalog</Link>
    </section>
  );
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
});
