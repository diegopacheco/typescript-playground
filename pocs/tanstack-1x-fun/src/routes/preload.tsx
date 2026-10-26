import { createRoute, Link, Outlet } from "@tanstack/react-router";
import { SEED_BOOKS } from "../data/books.ts";
import { rootRoute } from "./root.tsx";

const SLOW_MS = 1500;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const preloadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preload",
  component: PreloadTab,
});

export const preloadBookRoute = createRoute({
  getParentRoute: () => preloadRoute,
  path: "$bookId",
  params: {
    parse: (raw) => ({ bookId: Number(raw.bookId) }),
    stringify: (params) => ({ bookId: String(params.bookId) }),
  },
  loader: async ({ params, preload }) => {
    const started = performance.now();
    await wait(SLOW_MS);
    const book = SEED_BOOKS.find((b) => b.id === params.bookId);
    return { title: book?.title ?? "Unknown", preloaded: preload, tookMs: Math.round(performance.now() - started) };
  },
  pendingComponent: () => <p className="muted">Slow loader running ({SLOW_MS}ms)...</p>,
  component: PreloadedBook,
});

function PreloadTab() {
  const books = SEED_BOOKS.slice(0, 4);
  return (
    <section>
      <h2>Preload on Intent</h2>
      <p className="hint">
        Every book loader takes {SLOW_MS}ms. Links in the left column use <code>preload="intent"</code>, so
        the loader starts when you hover. By the time you click, the data is ready. Links in the right column
        only load on click.
      </p>
      <div className="split">
        <div>
          <h3>preload="intent"</h3>
          <ul className="list">
            {books.map((book) => (
              <li key={book.id}>
                <Link to="/preload/$bookId" params={{ bookId: book.id }} preload="intent" preloadDelay={0} activeProps={{ className: "active-link" }}>
                  {book.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>preload=false</h3>
          <ul className="list">
            {books.map((book) => (
              <li key={book.id}>
                <Link to="/preload/$bookId" params={{ bookId: book.id }} preload={false} activeProps={{ className: "active-link" }}>
                  {book.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <Outlet />
      </div>
    </section>
  );
}

function PreloadedBook() {
  const { title, preloaded, tookMs } = preloadBookRoute.useLoaderData();
  return (
    <p>
      <strong>{title}</strong>: the loader took {tookMs}ms and {preloaded ? "ran on hover (preloaded)" : "ran on click"}.
    </p>
  );
}
