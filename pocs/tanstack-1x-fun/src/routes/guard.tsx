import { createRoute, redirect, useRouter, type SearchSchemaInput } from "@tanstack/react-router";
import { useState } from "react";
import { safeRedirect } from "../logic/auth.ts";
import { rootRoute } from "./root.tsx";

export const vaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vault",
  beforeLoad: ({ context, location }) => {
    const user = context.auth.user();
    if (user === null) throw redirect({ to: "/login", search: { redirect: location.href } });
    return { user };
  },
  component: VaultTab,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (raw: { redirect?: string } & SearchSchemaInput): { redirect: string } => ({
    redirect: safeRedirect(raw.redirect),
  }),
  component: LoginPage,
});

function VaultTab() {
  const { user, auth } = vaultRoute.useRouteContext();
  const router = useRouter();
  return (
    <section>
      <h2>Route Guards with beforeLoad and Typed Context</h2>
      <p className="hint">
        <code>beforeLoad</code> runs before the loader. It reads <code>auth</code> from the router context and
        redirects to the login page when nobody is signed in. Whatever it returns is merged into the typed
        route context.
      </p>
      <div className="card">
        <p>Welcome to the vault, <strong>{user}</strong>.</p>
        <button
          onClick={() => {
            auth.logout();
            void router.invalidate();
          }}
        >
          Log out
        </button>
      </div>
    </section>
  );
}

function LoginPage() {
  const { redirect: target } = loginRoute.useSearch();
  const { auth } = loginRoute.useRouteContext();
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <section>
      <h2>Login Required</h2>
      <p className="hint">
        You were redirected here from <code>{target}</code>. After logging in, you go back there.
      </p>
      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() === "") return;
          auth.login(name);
          router.history.push(target);
        }}
      >
        <label>
          Your name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button type="submit" className="primary" disabled={name.trim() === ""}>Log in</button>
      </form>
    </section>
  );
}
