import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import followController from '../controllers/follow.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.patch(
  '/toggle-follow',
  followController.setUserStoreIds,
  followController.toggleFollow,
);

router.get('/is-following', followController.isFollowing);

router.route('/').get(followController.getAllFollows);

export default router;
