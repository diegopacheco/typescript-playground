import { Await, createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.tsx";

export const deferredRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deferred",
  loader: async ({ context }) => {
    const reviews = context.api.reviews(2500);
    const stats = await context.api.stats();
    return { stats, reviews };
  },
  staleTime: 0,
  gcTime: 0,
  component: DeferredTab,
});

function DeferredTab() {
  const { stats, reviews } = deferredRoute.useLoaderData();
  return (
    <section>
      <h2>Deferred Data with Await</h2>
      <p className="hint">
        The loader waits for the fast stats call, and returns the slow reviews promise without waiting for it.
        The page renders right away, and <code>&lt;Await&gt;</code> shows the reviews when they arrive.
      </p>
      <div className="stats">
        <div className="card"><strong>{stats.total}</strong> books</div>
        <div className="card"><strong>{stats.favorites}</strong> favorites</div>
        <div className="card"><strong>{stats.averageRating}</strong> avg rating</div>
      </div>
      <h3>Reviews</h3>
      <Await promise={reviews} fallback={<p className="muted">Reviews are on the way (2.5s)...</p>}>
        {(items) => (
          <ul className="list">
            {items.map((review) => (
              <li key={review.id}>
                {"★".repeat(review.stars)} {review.text}
              </li>
            ))}
          </ul>
        )}
      </Await>
    </section>
  );
}
