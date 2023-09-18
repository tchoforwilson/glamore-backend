import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.patch(
  '/update-my-Password',
  authController.protect,
  authController.updatePassword,
);

export default router;
