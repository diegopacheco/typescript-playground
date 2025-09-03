import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    age: v.number(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),
});

export type User = {
  _id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  _creationTime: number;
};