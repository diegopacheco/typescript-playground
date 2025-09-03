import { Router } from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { 
  CreateUserSchema, 
  UpdateUserSchema, 
  UserParamsSchema 
} from '../types/user.js';

const router = Router();

router.post('/', validateBody(CreateUserSchema), createUser);

router.get('/', getUsers);

router.get('/:id', validateParams(UserParamsSchema), getUserById);

router.put('/:id', 
  validateParams(UserParamsSchema), 
  validateBody(UpdateUserSchema), 
  updateUser
);

router.delete('/:id', validateParams(UserParamsSchema), deleteUser);

export default router;