import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
import UserRole from '../utilities/enums/e.user-role.js';

const router = Router();

// Protected routes
router.use(authController.protect);

router.post(
  '/register',
  authController.restrictTo(UserRole.ADMIN),
  userController.registerUser,
);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.patch('/deleteMe', userController.deleteMe);

// Restrict all route after this to admin
router.use(authController.restrictTo(UserRole.ADMIN));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
