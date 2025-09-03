import { ConvexHttpClient } from "convex/browser";

// Use local Convex development server by default
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3210";

export const convex = new ConvexHttpClient(CONVEX_URL);