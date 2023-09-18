import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import reviewController from '../controllers/review.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo(eUserRole.CUSTOMER),
    reviewController.setProductUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.CUSTOMER),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.CUSTOMER),
    reviewController.deleteReview
  );

export default router;
