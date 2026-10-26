import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GENRES, type Genre } from "../data/books.ts";
import type { NewBook } from "../data/api.ts";
import { booksQuery } from "../data/queries.ts";
import { validateIsbn, validateTags, validateTitle, validateYear } from "../logic/validators.ts";
import { rootRoute } from "./root.tsx";

export const formRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/form",
  component: FormTab,
});

const DEFAULT_BOOK: NewBook = { title: "", author: "", genre: "scifi", year: 2024, isbn: "", tags: [""] };

function Errors({ errors }: { errors: readonly unknown[] }) {
  const messages = errors.filter((error): error is string => typeof error === "string");
  return messages.length > 0 ? <span className="error">{messages.join(", ")}</span> : null;
}

function FormTab() {
  const { api } = formRoute.useRouteContext();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState("");

  const form = useForm({
    defaultValues: DEFAULT_BOOK,
    validators: { onChange: ({ value }) => ({ fields: { tags: validateTags(value.tags) } }) },
    onSubmit: async ({ value, formApi }) => {
      const book = await api.addBook(value);
      await queryClient.invalidateQueries({ queryKey: booksQuery(api).queryKey });
      setSaved(`Saved "${book.title}" with id ${book.id}`);
      formApi.reset();
    },
  });

  return (
    <section>
      <h2>Type-safe Forms with Sync, Async and Array Fields</h2>
      <p className="hint">
        Every field name and value is typed from <code>defaultValues</code>. The ISBN field checks its
        checksum right away, then asks the server whether it is taken, with a 500ms debounce. Tags is an
        array field. Try 9780441013593, which is already in the catalog.
      </p>
      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="title" validators={{ onChange: ({ value }) => validateTitle(value) }}>
          {(field) => (
            <label>
              Title
              <input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
              <Errors errors={field.state.meta.errors} />
            </label>
          )}
        </form.Field>
        <form.Field name="author" validators={{ onChange: ({ value }) => (value.trim() === "" ? "Author is required" : undefined) }}>
          {(field) => (
            <label>
              Author
              <input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
              <Errors errors={field.state.meta.errors} />
            </label>
          )}
        </form.Field>
        <form.Field name="genre">
          {(field) => (
            <label>
              Genre
              <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value as Genre)}>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </label>
          )}
        </form.Field>
        <form.Field name="year" validators={{ onChange: ({ value }) => validateYear(value, new Date().getFullYear()) }}>
          {(field) => (
            <label>
              Year
              <input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.valueAsNumber)} />
              <Errors errors={field.state.meta.errors} />
            </label>
          )}
        </form.Field>
        <form.Field
          name="isbn"
          asyncDebounceMs={500}
          validators={{
            onChange: ({ value }) => validateIsbn(value),
            onChangeAsync: async ({ value }) => ((await api.isIsbnTaken(value.replace(/-/g, ""))) ? "ISBN already in the catalog" : undefined),
          }}
        >
          {(field) => (
            <label>
              ISBN
              <input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
              {field.state.meta.isValidating ? <span className="muted">Checking server...</span> : <Errors errors={field.state.meta.errors} />}
            </label>
          )}
        </form.Field>
        <form.Field name="tags" mode="array">
          {(field) => (
            <fieldset>
              <legend>Tags</legend>
              {field.state.value.map((_, index) => (
                <form.Field key={index} name={`tags[${index}]`}>
                  {(tag) => (
                    <div className="row">
                      <input aria-label={`Tag ${index + 1}`} value={tag.state.value} onChange={(e) => tag.handleChange(e.target.value)} />
                      <button type="button" onClick={() => field.removeValue(index)}>Remove</button>
                    </div>
                  )}
                </form.Field>
              ))}
              <button type="button" onClick={() => field.pushValue("")}>Add tag</button>
              <Errors errors={field.state.meta.errors} />
            </fieldset>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <button type="submit" className="primary" disabled={!canSubmit}>
              {isSubmitting ? "Saving..." : "Save book"}
            </button>
          )}
        </form.Subscribe>
      </form>
      <p className="status" role="status">{saved}</p>
    </section>
  );
}
