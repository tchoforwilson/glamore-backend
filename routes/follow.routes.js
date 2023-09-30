import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import followController from '../controllers/follow.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router();

router.use(
  authController.protect,
  authController.restrictTo(eUserRole.CUSTOMER),
);

router.patch(
  '/toggle-follow',
  followController.setCustomerStoreId,
  followController.toggleFollow,
);

router.get('/is-following', followController.isFollowing);

export default router;
