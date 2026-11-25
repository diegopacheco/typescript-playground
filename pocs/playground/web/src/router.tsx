import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "./app/AppShell.tsx";
import { PlaygroundProvider } from "./app/playground.tsx";
import { docsQuery, samplesQuery } from "./features/content/hooks.ts";
import { PanelsProvider } from "./panels/PanelsProvider.tsx";
import { DocsPage, LAST_DOC_KEY } from "./routes/DocsPage.tsx";
import { PlaygroundPage } from "./routes/PlaygroundPage.tsx";
import { LAST_SAMPLE_KEY, SamplesPage } from "./routes/SamplesPage.tsx";

type RouterContext = { readonly queryClient: QueryClient };

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <PanelsProvider>
      <PlaygroundProvider>
        <AppShell />
      </PlaygroundProvider>
    </PanelsProvider>
  ),
  errorComponent: ({ error }) => <pre className="stderr page-error">{error instanceof Error ? error.message : String(error)}</pre>,
});

const playgroundRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: PlaygroundPage });

function pick(ids: readonly string[], saved: string | null): string {
  const id = saved && ids.includes(saved) ? saved : ids[0];
  if (!id) throw new Error("no content available");
  return id;
}

const docsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/docs", component: Outlet });

const docsIndexRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: "/",
  beforeLoad: async ({ context }) => {
    const docs = await context.queryClient.ensureQueryData(docsQuery);
    throw redirect({ to: "/docs/$docId", params: { docId: pick(docs.map((d) => d.id), localStorage.getItem(LAST_DOC_KEY)) } });
  },
});

const docRoute = createRoute({
  getParentRoute: () => docsRoute,
  path: "$docId",
  component: function DocRoute() {
    const { docId } = docRoute.useParams();
    return <DocsPage docId={docId} />;
  },
});

const samplesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/samples", component: Outlet });

const samplesIndexRoute = createRoute({
  getParentRoute: () => samplesRoute,
  path: "/",
  beforeLoad: async ({ context }) => {
    const samples = await context.queryClient.ensureQueryData(samplesQuery);
    throw redirect({ to: "/samples/$sampleId", params: { sampleId: pick(samples.map((s) => s.id), localStorage.getItem(LAST_SAMPLE_KEY)) } });
  },
});

const sampleRoute = createRoute({
  getParentRoute: () => samplesRoute,
  path: "$sampleId",
  component: function SampleRoute() {
    const { sampleId } = sampleRoute.useParams();
    return <SamplesPage sampleId={sampleId} />;
  },
});

const routeTree = rootRoute.addChildren([playgroundRoute, docsRoute.addChildren([docsIndexRoute, docRoute]), samplesRoute.addChildren([samplesIndexRoute, sampleRoute])]);

export const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });

export const router = createRouter({ routeTree, context: { queryClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
