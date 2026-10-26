import { QueryClient } from "@tanstack/react-query";
import { createRoute, createRouter, redirect } from "@tanstack/react-router";
import { api } from "./data/api.ts";
import { auth } from "./logic/auth.ts";
import { blockerRoute } from "./routes/blocker.tsx";
import { deferredRoute } from "./routes/deferred.tsx";
import { errorsRoute } from "./routes/errors.tsx";
import { formRoute } from "./routes/form.tsx";
import { loginRoute, vaultRoute } from "./routes/guard.tsx";
import { loaderBookRoute, loadersRoute } from "./routes/loaders.tsx";
import { preloadBookRoute, preloadRoute } from "./routes/preload.tsx";
import { queryRoute } from "./routes/query.tsx";
import { rootRoute } from "./routes/root.tsx";
import { searchRoute } from "./routes/search.tsx";
import { tableRoute } from "./routes/table.tsx";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/search" });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  loadersRoute.addChildren([loaderBookRoute]),
  queryRoute,
  tableRoute,
  formRoute,
  preloadRoute.addChildren([preloadBookRoute]),
  blockerRoute,
  errorsRoute,
  deferredRoute,
  vaultRoute,
  loginRoute,
]);

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: { queryClient, api, auth },
  defaultPendingMs: 150,
  defaultPendingMinMs: 300,
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
