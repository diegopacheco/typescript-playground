import { createRoute, useBlocker } from "@tanstack/react-router";
import { useState } from "react";
import { rootRoute } from "./root.tsx";

export const blockerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blocker",
  component: BlockerTab,
});

function BlockerTab() {
  const [draft, setDraft] = useState("");
  const dirty = draft.trim() !== "";
  const blocker = useBlocker({ shouldBlockFn: () => dirty, enableBeforeUnload: () => dirty, withResolver: true });

  return (
    <section>
      <h2>Navigation Blocking</h2>
      <p className="hint">
        Type something, then click another tab. <code>useBlocker</code> stops the navigation and shows a
        custom confirm panel. Reloading the page also asks first.
      </p>
      <textarea aria-label="Draft review" placeholder="Write a review..." rows={5} value={draft} onChange={(event) => setDraft(event.target.value)} />
      <p className="muted">{dirty ? "Unsaved changes, so navigation is blocked" : "Nothing to lose, so navigation is free"}</p>
      {blocker.status === "blocked" && (
        <div className="confirm" role="alertdialog">
          <p>
            Leave for <code>{blocker.next.pathname}</code> and lose your draft?
          </p>
          <button className="primary" onClick={blocker.proceed}>Leave</button>
          <button onClick={blocker.reset}>Stay</button>
        </div>
      )}
    </section>
  );
}
