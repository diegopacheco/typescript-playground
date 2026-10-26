export type Auth = {
  user: () => string | null;
  isAuthenticated: () => boolean;
  login: (name: string) => void;
  logout: () => void;
};

export function createAuth(): Auth {
  let current: string | null = null;
  return {
    user: () => current,
    isAuthenticated: () => current !== null,
    login: (name) => {
      const trimmed = name.trim();
      if (trimmed === "") throw new Error("Name is required");
      current = trimmed;
    },
    logout: () => {
      current = null;
    },
  };
}

export const auth = createAuth();

export function safeRedirect(value: unknown): string {
  if (typeof value !== "string") return "/vault";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/vault";
  return value;
}
