import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { Book } from "../data/books.ts";
import { booksQuery } from "../data/queries.ts";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const helper = createColumnHelper<typeof features, Book>();

const columns = helper.columns([
  helper.accessor("title", { header: "Title" }),
  helper.accessor("author", { header: "Author" }),
  helper.accessor("genre", { header: "Genre" }),
  helper.accessor("year", { header: "Year" }),
  helper.accessor("rating", { header: "Rating", cell: (info) => info.getValue().toFixed(1) }),
]);

const routeApi = getRouteApi("/table");

const SORT_LABEL = { asc: " (up)", desc: " (down)" } as const;

export function TableView() {
  const { api } = routeApi.useRouteContext();
  const { data } = useSuspenseQuery(booksQuery(api));
  const table = useTable({
    features,
    columns,
    data,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });
  const { pagination, globalFilter } = table.state;

  return (
    <section>
      <h2>Headless Table v9, Code-Split with lazyRouteComponent</h2>
      <p className="hint">
        This component is loaded on demand in its own chunk. Table v9 uses tree-shakable features for
        sorting, global filtering and pagination. Click a header to sort.
      </p>
      <input
        aria-label="Filter table"
        placeholder="Filter any column"
        value={typeof globalFilter === "string" ? globalFilter : ""}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
      />
      <table className="grid">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    <table.FlexRender header={header} />
                    {sorted ? SORT_LABEL[sorted] : ""}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pager">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
        <span>
          Page {pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
      </div>
    </section>
  );
}
