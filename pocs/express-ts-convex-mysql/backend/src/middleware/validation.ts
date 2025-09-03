import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ApiResponse } from '../types/user.js';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => 
          `${err.path.join('.')}: ${err.message}`
        );
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: errorMessages.join(', ')
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => 
          `${err.path.join('.')}: ${err.message}`
        );
        res.status(400).json({
          success: false,
          error: 'Invalid parameters',
          message: errorMessages.join(', ')
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};