import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
import cartRouter from './cart.routes.js';
import favoriteRouter from './favorite.routes.js';
import followRouter from './follow.routes.js';
import reviewRouter from './review.routes.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router();

// Protected routes
router.use(authController.protect);

router.use(
  '/:userId/carts',
  authController.restrictTo(eUserRole.CUSTOMER),
  cartRouter,
);

router.use('/:userId/reviews', reviewRouter);

router.route(
  '/search',
  authController.restrictTo(eUserRole.ADMIN),
  userController.searchUser,
);
router.route(
  '/count',
  authController.restrictTo(eUserRole.ADMIN),
  userController.countUsers,
);

router.post(
  '/register',
  authController.restrictTo(eUserRole.ADMIN),
  userController.registerUser,
);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/update-me',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.get('/my-shops', userController.setUserIdParam, followRouter);
router.get('/my-favorites', userController.setUserIdParam, favoriteRouter);
router.patch('/delete-me', userController.deleteMe);

// Restrict all route after this to admin
router.use(authController.restrictTo(eUserRole.ADMIN));

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
