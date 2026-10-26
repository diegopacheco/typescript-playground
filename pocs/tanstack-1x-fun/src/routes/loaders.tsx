import { createRoute, Link, notFound, Outlet } from "@tanstack/react-router";
import { rootRoute } from "./root.tsx";

export const loadersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loaders",
  loader: async ({ context }) => ({ books: await context.api.listBooks(), loadedAt: new Date().toLocaleTimeString() }),
  staleTime: 10_000,
  pendingComponent: () => <p className="muted">Loading the shelf...</p>,
  component: LoadersTab,
});

export const loaderBookRoute = createRoute({
  getParentRoute: () => loadersRoute,
  path: "$bookId",
  params: {
    parse: (raw) => ({ bookId: Number(raw.bookId) }),
    stringify: (params) => ({ bookId: String(params.bookId) }),
  },
  loader: async ({ context, params }) => {
    const book = await context.api.getBook(params.bookId);
    if (!book) throw notFound();
    return { book, loadedAt: new Date().toLocaleTimeString() };
  },
  staleTime: 10_000,
  pendingComponent: () => <p className="muted">Fetching book...</p>,
  notFoundComponent: () => <p className="error">No book with that id.</p>,
  component: BookDetail,
});

function LoadersTab() {
  const { books, loadedAt } = loadersRoute.useLoaderData();
  return (
    <section>
      <h2>Loaders, Typed Path Params and Nested Routes</h2>
      <p className="hint">
        Each route loads its data before it renders. <code>$bookId</code> is parsed to a number. With a 10s
        <code> staleTime</code>, revisiting a book reuses the cached data, so the timestamp stays the same.
      </p>
      <p className="muted">Shelf loaded at {loadedAt}</p>
      <div className="split">
        <ul className="list">
          {books.map((book) => (
            <li key={book.id}>
              <Link to="/loaders/$bookId" params={{ bookId: book.id }} activeProps={{ className: "active-link" }}>
                {book.title}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/loaders/$bookId" params={{ bookId: 999 }}>Missing book 999</Link>
          </li>
        </ul>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

function BookDetail() {
  const { book, loadedAt } = loaderBookRoute.useLoaderData();
  return (
    <div>
      <h3>{book.title}</h3>
      <p>{book.author}, {book.year}</p>
      <p>Tags: {book.tags.join(", ")}</p>
      <p className="muted">Loaded at {loadedAt}</p>
    </div>
  );
}
