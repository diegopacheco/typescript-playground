import { WorkspaceContext } from "../client/workspace-context";
import { FocusNote } from "../client/FocusNote";
import { getRequestContext } from "./context";
import { getProjects } from "./data";
import { ProjectList } from "./ProjectList";
import "../styles.css";

export async function App() {
  const context = getRequestContext();
  const projects = await getProjects();
  const { workspace, requestId } = context;
  const progress = Math.round(
    projects.reduce((sum, project) => sum + project.progress, 0) /
      projects.length,
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8f7f3" />
        <link rel="icon" href="/logo.svg" />
        <title>{`${workspace.name} — Workspace`}</title>
      </head>
      <body>
        <WorkspaceContext value={context}>
          <div className="app-shell">
            <aside className="sidebar">
              <a className="brand" href="/" aria-label="Form and Field home">
                <img src="/logo.svg" alt="" />
                <span>
                  form<span className="brand-amp">&</span>field
                </span>
              </a>
              <span className="sidebar-caption">A SPACE FOR WHAT MATTERS</span>
              <div className="workspace-label">YOUR WORKSPACE</div>
              <form className="workspace-switch" method="get">
                <label htmlFor="workspace">Choose workspace</label>
                <select
                  id="workspace"
                  name="workspace"
                  defaultValue={workspace.id}
                >
                  <option value="studio">Form & Field</option>
                  <option value="garden">Common Ground</option>
                </select>
                <button type="submit" aria-label="Switch workspace">
                  ↗
                </button>
              </form>
              <nav aria-label="Main navigation">
                <a className="nav-active" href="#overview">
                  <span aria-hidden="true">◫</span>Overview
                  <span className="nav-dot" />
                </a>
                <a href="#projects-title">
                  <span aria-hidden="true">▤</span>Projects
                  <span className="nav-count">{projects.length}</span>
                </a>
                <a href="#focus-title">
                  <span aria-hidden="true">◷</span>Focus space
                </a>
                <a href="#under-the-hood">
                  <span aria-hidden="true">⌘</span>Under the hood
                </a>
              </nav>
              <div className="sidebar-bottom">
                <div className="sidebar-note">
                  <span className="tiny-spark" aria-hidden="true">
                    ✳
                  </span>
                  <p>
                    Less noise.
                    <br />
                    More meaningful work.
                  </p>
                </div>
                <div className="profile">
                  <span className="avatar">{workspace.initials}</span>
                  <div>
                    <strong>{workspace.owner}</strong>
                    <span>Personal workspace</span>
                  </div>
                </div>
              </div>
            </aside>
            <main id="overview">
              <header className="topbar">
                <span>
                  Workspace <span className="breadcrumb">/</span>{" "}
                  <strong>Overview</strong>
                </span>
                <span className="live">
                  <i />
                  Rendered on the server
                </span>
              </header>
              <div className="main-content">
                <section className="intro">
                  <div>
                    <span className="eyebrow">
                      YOUR WORK, WITH A LITTLE MORE CLARITY
                    </span>
                    <h1>{workspace.focus}</h1>
                    <p>
                      A calm corner for your projects, progress, and what comes
                      next.
                    </p>
                  </div>
                  <div className="intro-flower" aria-hidden="true">
                    ✳
                  </div>
                </section>
                <section className="metrics" aria-label="Workspace summary">
                  <div>
                    <span>Active projects</span>
                    <strong>
                      {projects.length.toString().padStart(2, "0")}
                      <small>thoughtfully in motion</small>
                    </strong>
                  </div>
                  <div>
                    <span>Average progress</span>
                    <strong>
                      {progress}
                      <em>%</em>
                      <small>one step at a time</small>
                    </strong>
                  </div>
                  <div>
                    <span>Workspace rhythm</span>
                    <strong className="rhythm">
                      Steady<span aria-hidden="true">↗</span>
                      <small>keep a good thing going</small>
                    </strong>
                  </div>
                </section>
                <div className="work-grid">
                  <ProjectList />
                  <FocusNote />
                </div>
                <section className="under-hood" id="under-the-hood">
                  <div>
                    <span className="eyebrow">
                      SMALL APP. REAL SERVER COMPONENTS.
                    </span>
                    <h2>Good context travels.</h2>
                    <p>
                      The server picks the workspace. React carries its context
                      to the interactive focus space.
                    </p>
                  </div>
                  <div className="runtime-flow">
                    <span>Request</span>
                    <b>→</b>
                    <span>Server Components</span>
                    <b>→</b>
                    <span>Client Context</span>
                  </div>
                  <details>
                    <summary>Inspect server request</summary>
                    <dl>
                      <dt>Workspace</dt>
                      <dd data-testid="server-workspace">{workspace.name}</dd>
                      <dt>Request</dt>
                      <dd data-testid="server-request">{requestId}</dd>
                    </dl>
                    <p>
                      AsyncLocalStorage keeps server reads request-scoped. The
                      server renders WorkspaceContext directly; the client reads
                      it with useContext.
                    </p>
                  </details>
                </section>
                <footer>
                  <span>Built with intention.</span>
                  <span>
                    React 19.3 <b>·</b> Vite <b>·</b> Bun <b>·</b> TypeScript 7
                  </span>
                </footer>
              </div>
            </main>
          </div>
        </WorkspaceContext>
      </body>
    </html>
  );
}
