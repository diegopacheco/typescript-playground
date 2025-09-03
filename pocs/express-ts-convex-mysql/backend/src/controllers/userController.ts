import { Request, Response } from 'express';
import { 
  CreateUserInput, 
  UpdateUserInput, 
  UserParams, 
  User,
  ApiResponse 
} from '../types/user.js';
import { UserService } from '../services/userService.js';

export const createUser = async (
  req: Request<{}, ApiResponse<{ id: string }>, CreateUserInput>, 
  res: Response<ApiResponse<{ id: string }>>
): Promise<void> => {
  try {
    const result = await UserService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    });
  }
};

export const getUsers = async (
  req: Request, 
  res: Response<ApiResponse<User[]>>
): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    });
  }
};

export const getUserById = async (
  req: Request<UserParams>, 
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const user = await UserService.getUserById(req.params.id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user'
    });
  }
};

export const updateUser = async (
  req: Request<UserParams, ApiResponse<User>, UpdateUserInput>, 
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    });
  }
};

export const deleteUser = async (
  req: Request<UserParams>, 
  res: Response<ApiResponse<{ deleted: boolean; user: User }>>
): Promise<void> => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    
    if (!result) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    });
  }
};