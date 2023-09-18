import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import storeController from '../controllers/store.controller.js';

import productRouter from './product.routes.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

// POST /store/234fad4/products
// GET /store/234fad4/products
router.use('/:storeId/products', productRouter);

router.route(
  '/my-store',
  authController.protect,
  authController.restrictTo(eUserRole.GROCER),
  storeController.setStoreId,
  storeController.getStore
);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN),
    storeController.uploadLogo,
    storeController.resizeLogo,
    storeController.createStore
  )
  .get(storeController.getAllStores);

router
  .route('/:id')
  .get(storeController.getStore)
  .patch(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN, eUserRole.GROCER),
    storeController.uploadLogo,
    storeController.resizeLogo,
    storeController.updateStore
  )
  .delete(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN, eUserRole.GROCER),
    storeController.deleteStore
  );

export default router;
