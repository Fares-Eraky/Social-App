import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '../../middleware/validation.middleware';
import { signupSchema, loginSchema, confirmEmailSchema } from './user.validation';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.post('/signup', validate(signupSchema), userController.signup);
router.post('/confirm-email', validate(confirmEmailSchema), userController.confirmEmail);
router.post('/login', validate(loginSchema), userController.login);
router.post('/logout', authenticate, userController.logout);
router.get('/profile', authenticate, userController.getProfile);

export default router;
