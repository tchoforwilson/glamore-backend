import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import favoriteController from '../controllers/favorite.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.patch(
  '/toggle-favorite',
  favoriteController.setUserProductIds,
  favoriteController.toggleFavorite,
);

router.get('/is-favorite', favoriteController.isFavorite);

router.route('/').get(favoriteController.getAllFavorites);

export default router;
