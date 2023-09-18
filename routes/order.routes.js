import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import orderController from '../controllers/order.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.route(
  '/my-orders',
  authController.restrictTo(eUserRole.CUSTOMER),
  orderController.setOrderUserId,
  orderController.getOne
);

router
  .route('/')
  .post(orderController.setOrderUserId, orderController.createOrder)
  .get(
    authController.restrictTo(
      eUserRole.ADMIN,
      eUserRole.EMPLOYEE,
      eUserRole.GROCER
    ),
    orderController.getAllOrders
  );

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(
    authController.restrictTo(
      eUserRole.ADMIN,
      eUserRole.CUSTOMER,
      eUserRole.GROCER
    ),
    orderController.updateOrder
  )
  .delete(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.CUSTOMER),
    orderController.deleteOrder
  );

export default router;
