import { createRoute, Link, notFound, useRouter, type ErrorComponentProps, type SearchSchemaInput } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { rootRoute } from "./root.tsx";

const MODES = ["ok", "boom", "missing"] as const;

type Mode = (typeof MODES)[number];

const parseMode = (value: unknown): Mode => (MODES.includes(value as Mode) ? (value as Mode) : "ok");

export const errorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/errors",
  validateSearch: (raw: { mode?: Mode } & SearchSchemaInput): { mode: Mode } => ({ mode: parseMode(raw.mode) }),
  loaderDeps: ({ search }) => ({ mode: search.mode }),
  loader: ({ deps }) => {
    if (deps.mode === "boom") throw new Error("The loader exploded on purpose");
    if (deps.mode === "missing") throw notFound();
    return { message: "The loader succeeded" };
  },
  errorComponent: ErrorPanel,
  notFoundComponent: () => (
    <ErrorsLayout>
      <p className="error">notFound() was thrown, so the route rendered its notFoundComponent.</p>
    </ErrorsLayout>
  ),
  component: ErrorsTab,
});

function ErrorsLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <h2>Error Boundaries, notFound and loaderDeps</h2>
      <p className="hint">
        The loader reads <code>mode</code> from the search params via <code>loaderDeps</code>. A thrown Error
        renders the route <code>errorComponent</code>. A thrown <code>notFound()</code> renders its
        <code> notFoundComponent</code>. The rest of the app keeps working.
      </p>
      <div className="chips">
        {MODES.map((mode) => (
          <Link key={mode} to="/errors" search={{ mode }} className="chip" activeOptions={{ includeSearch: true }} activeProps={{ className: "chip active" }}>
            mode={mode}
          </Link>
        ))}
      </div>
      <div className="card">{children}</div>
    </section>
  );
}

function ErrorsTab() {
  const { message } = errorsRoute.useLoaderData();
  return (
    <ErrorsLayout>
      <p>{message}</p>
    </ErrorsLayout>
  );
}

function ErrorPanel({ error }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <ErrorsLayout>
      <p className="error">Caught: {error instanceof Error ? error.message : String(error)}</p>
      <button onClick={() => void router.invalidate()}>Retry loader</button>
    </ErrorsLayout>
  );
}
