import { Router } from 'express';
import deliveryController from '../controllers/delivery.controller.js';
import authController from '../controllers/auth.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router();

router.use(authController.protect);

router.route(
  '/asign-to-me',
  authController.restrictTo(eUserRole.EMPLOYEE),
  deliveryController.setDeliveryUser,
  deliveryController.createOne,
);

router
  .route('/')
  .get(
    authController.restrictTo(eUserRole.ADMIN),
    deliveryController.getAllDeliveries,
  )
  .post(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.EMPLOYEE),
    deliveryController.createDelivery,
  );

router
  .route('/:id')
  .get(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.EMPLOYEE),
    deliveryController.getDelivery,
  )
  .patch(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.EMPLOYEE),
    deliveryController.updateDelivery,
  )
  .delete(
    authController.restrictTo(eUserRole.ADMIN),
    deliveryController.deleteDelivery,
  );

export default router;
