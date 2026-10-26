import { createRoute, Link, stripSearchParams, useLocation, type SearchSchemaInput } from "@tanstack/react-router";
import { GENRES, SEED_BOOKS } from "../data/books.ts";
import { DEFAULT_CATALOG_SEARCH, parseCatalogSearch, searchBooks, SORT_KEYS, type CatalogSearch } from "../logic/catalog-search.ts";
import { rootRoute } from "./root.tsx";

export const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  validateSearch: (raw: Partial<CatalogSearch> & SearchSchemaInput) => parseCatalogSearch(raw),
  search: { middlewares: [stripSearchParams(DEFAULT_CATALOG_SEARCH)] },
  component: SearchTab,
});

function SearchTab() {
  const search = searchRoute.useSearch();
  const navigate = searchRoute.useNavigate();
  const location = useLocation();
  const books = searchBooks(SEED_BOOKS, search);

  return (
    <section>
      <h2>Type-safe Search Params as State</h2>
      <p className="hint">
        The URL is the state. <code>validateSearch</code> parses it into a typed object, and
        <code> stripSearchParams</code> drops default values. Try the back button.
      </p>
      <div className="url">{location.href}</div>
      <input
        aria-label="Search books"
        placeholder="Search title or author"
        value={search.q}
        onChange={(event) => navigate({ search: (prev) => ({ ...prev, q: event.target.value }), replace: true })}
      />
      <div className="chips">
        {(["all", ...GENRES] as const).map((genre) => (
          <Link key={genre} from={searchRoute.fullPath} search={(prev) => ({ ...prev, genre })} className="chip" activeOptions={{ includeSearch: true }} activeProps={{ className: "chip active" }}>
            {genre}
          </Link>
        ))}
      </div>
      <div className="chips">
        {SORT_KEYS.map((sort) => (
          <Link key={sort} from={searchRoute.fullPath} search={(prev) => ({ ...prev, sort, dir: prev.sort === sort && prev.dir === "asc" ? "desc" : "asc" })} className={search.sort === sort ? "chip active" : "chip"}>
            sort by {sort} {search.sort === sort ? (search.dir === "asc" ? "up" : "down") : ""}
          </Link>
        ))}
      </div>
      <ul className="list">
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} <span className="muted">{book.genre} / {book.year} / {book.rating}</span>
          </li>
        ))}
      </ul>
      {books.length === 0 && <p className="muted">No books match.</p>}
    </section>
  );
}
