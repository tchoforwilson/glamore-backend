import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import cartController from '../controllers/cart.controller.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.route('/count', cartController.countCarts);

router
  .route('/')
  .post(cartController.setCartCustomer, cartController.createCart)
  .get(
    authController.restrictTo(eUserRole.ADMIN, eUserRole.EMPLOYEE),
    cartController.getAllCarts,
  );

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;
