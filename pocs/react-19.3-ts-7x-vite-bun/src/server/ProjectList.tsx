import { getProjects } from "./data";
import { getRequestContext } from "./context";

export async function ProjectList() {
  const projects = await getProjects();
  const { requestId, workspace } = getRequestContext();

  return (
    <section
      className="projects"
      aria-labelledby="projects-title"
      data-request-id={requestId}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE WORK IN MOTION</span>
          <h2 id="projects-title">
            Current projects{" "}
            <span>{projects.length.toString().padStart(2, "0")}</span>
          </h2>
        </div>
        <span className="small-label">{workspace.name}</span>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project" key={project.id}>
            <div className={`project-art ${project.color}`} aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
            <div className="project-copy">
              <span className="eyebrow">
                {project.category}{" "}
                <span className="project-number">/ {project.id}</span>
              </span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className={`status status-${project.color}`}>
                  {project.status}
                </span>
                <span>Due {project.due}</span>
              </div>
            </div>
            <div className="project-progress">
              <span>
                {project.progress}
                <small>%</small>
              </span>
              <progress
                value={project.progress}
                max="100"
                aria-label={`${project.name} progress`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
