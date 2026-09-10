import "server-only";
import type { Project } from "../types";
import { getRequestContext } from "./context";

const projects: Record<string, Project[]> = {
  studio: [
    {
      id: "01",
      name: "A quieter internet",
      description: "A considered home for thoughtful writing.",
      category: "EDITORIAL",
      status: "In progress",
      progress: 72,
      due: "Sep 24",
      color: "peach",
    },
    {
      id: "02",
      name: "Objects of everyday",
      description: "Finding beauty in the things we reach for.",
      category: "COMMERCE",
      status: "In review",
      progress: 94,
      due: "Sep 18",
      color: "sage",
    },
    {
      id: "03",
      name: "Somewhere outside",
      description: "A field guide to a little more fresh air.",
      category: "EXPERIENCE",
      status: "Planning",
      progress: 28,
      due: "Oct 02",
      color: "lilac",
    },
  ],
  garden: [
    {
      id: "04",
      name: "The kitchen garden",
      description: "Seasonal planting, one small patch at a time.",
      category: "GROWING",
      status: "In progress",
      progress: 56,
      due: "Sep 28",
      color: "sage",
    },
    {
      id: "05",
      name: "Gather around",
      description: "A shared table for the whole neighborhood.",
      category: "COMMUNITY",
      status: "Planning",
      progress: 18,
      due: "Oct 12",
      color: "peach",
    },
  ],
};

export async function getProjects() {
  const { workspace } = getRequestContext();
  return projects[workspace.id]!;
}
