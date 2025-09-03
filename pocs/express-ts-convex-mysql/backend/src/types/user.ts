import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().min(1, 'Age must be at least 1').max(150, 'Age must be less than 150'),
  isActive: z.boolean().default(true),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  id: z.string().optional(),
});

export const UserParamsSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;

export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  _creationTime: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}