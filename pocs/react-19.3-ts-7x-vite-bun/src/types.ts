export type WorkspaceId = "studio" | "garden";

export type Workspace = {
  id: WorkspaceId;
  name: string;
  owner: string;
  initials: string;
  focus: string;
};

export type RequestContext = {
  requestId: string;
  workspace: Workspace;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "In progress" | "In review" | "Planning";
  progress: number;
  due: string;
  color: string;
};
