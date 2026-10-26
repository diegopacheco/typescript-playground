import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { booksQuery } from "../data/queries.ts";
import { rootRoute } from "./root.tsx";

export const tableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/table",
  loader: ({ context }) => context.queryClient.ensureQueryData(booksQuery(context.api)),
  component: lazyRouteComponent(() => import("./table-view.tsx"), "TableView"),
});
