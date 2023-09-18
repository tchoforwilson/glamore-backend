import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import cartController from '../controllers/cart.controller.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(cartController.setCartCustomer, cartController.createCart)
  .get(
    authController.restrictTo('admin', 'employee'),
    cartController.getAllCarts
  );

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;
