"use client";

import { useState } from "react";
import { useWorkspace } from "./workspace-context";

export function FocusNote() {
  const { workspace, requestId } = useWorkspace();
  const [focused, setFocused] = useState(false);

  return (
    <section className="focus-card" aria-labelledby="focus-title">
      <span className="eyebrow">A LITTLE INTENTION</span>
      <h2 id="focus-title">
        One thing
        <br />
        {" "}at a time.
      </h2>
      <p>
        A little space to focus.
        <br />A little more room to create.
      </p>
      <button
        className="primary-button"
        onClick={() => setFocused(!focused)}
        aria-pressed={focused}
      >
        {focused ? "Finish focus session" : "Start a focus session"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="focus-status" role="status">
        {focused
          ? `${workspace.owner.split(" ")[0]}, your focus session is on.`
          : `Ready when you are, ${workspace.owner.split(" ")[0]}.`}
      </p>
      <details className="context-details">
        <summary>Inspect client context</summary>
        <dl>
          <dt>Workspace</dt>
          <dd data-testid="client-workspace">{workspace.name}</dd>
          <dt>Request</dt>
          <dd data-testid="client-request">{requestId}</dd>
        </dl>
      </details>
    </section>
  );
}
