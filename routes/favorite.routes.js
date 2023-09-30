import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import favoriteController from '../controllers/favorite.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router();

router.use(
  authController.protect,
  authController.restrictTo(eUserRole.CUSTOMER),
);

router.patch(
  '/toggle-favorite',
  favoriteController.setCustomerProductId,
  favoriteController.toggleFavorite,
);

router.get('/is-favorite', favoriteController.isFavorite);

export default router;
