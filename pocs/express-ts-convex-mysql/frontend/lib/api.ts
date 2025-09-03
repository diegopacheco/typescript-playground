import axios from 'axios';
import { User, CreateUserInput, UpdateUserInput, ApiResponse } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch users');
    }
    return response.data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch user');
    }
    return response.data.data;
  },

  createUser: async (userData: CreateUserInput): Promise<{ id: string }> => {
    const response = await api.post<ApiResponse<{ id: string }>>('/users', userData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create user');
    }
    return response.data.data;
  },

  updateUser: async (id: string, userData: UpdateUserInput): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update user');
    }
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<{ deleted: boolean; user: User }> => {
    const response = await api.delete<ApiResponse<{ deleted: boolean; user: User }>>(`/users/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to delete user');
    }
    return response.data.data;
  },
};