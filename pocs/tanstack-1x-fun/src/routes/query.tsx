import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Book } from "../data/books.ts";
import { booksQuery } from "../data/queries.ts";
import { rootRoute } from "./root.tsx";

export const queryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/query",
  loader: ({ context }) => context.queryClient.ensureQueryData(booksQuery(context.api)),
  component: QueryTab,
});

function QueryTab() {
  const { api } = queryRoute.useRouteContext();
  const query = booksQuery(api);
  const { data: books } = useSuspenseQuery(query);
  const queryClient = useQueryClient();
  const [failNext, setFailNext] = useState(false);
  const [message, setMessage] = useState("");

  const toggle = useMutation({
    mutationFn: (id: number) => {
      api.setFailNextWrite(failNext);
      return api.toggleFavorite(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: query.queryKey });
      const previous = queryClient.getQueryData(query.queryKey);
      queryClient.setQueryData<Book[]>(query.queryKey, (old) =>
        old?.map((book) => (book.id === id ? { ...book, favorite: !book.favorite } : book)),
      );
      setMessage("Optimistic update applied, waiting for the server...");
      return { previous };
    },
    onError: (error, _id, context) => {
      queryClient.setQueryData(query.queryKey, context?.previous);
      setMessage(`Rolled back: ${error.message}`);
    },
    onSuccess: (book) => setMessage(`Saved: ${book.title} favorite = ${book.favorite}`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: query.queryKey }),
  });

  return (
    <section>
      <h2>Router Loader + Query Cache + Optimistic Mutations</h2>
      <p className="hint">
        The loader calls <code>ensureQueryData</code>, so the page renders with data already cached.
        Toggling a star updates the UI right away. When the server fails, the change is rolled back.
      </p>
      <label className="check">
        <input type="checkbox" checked={failNext} onChange={(event) => setFailNext(event.target.checked)} />
        Make the next server write fail
      </label>
      <p className="status" role="status">{message}</p>
      <ul className="list">
        {books.map((book) => (
          <li key={book.id}>
            <button className="star" aria-label={`Toggle favorite ${book.title}`} onClick={() => toggle.mutate(book.id)}>
              {book.favorite ? "★" : "☆"}
            </button>
            {book.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
