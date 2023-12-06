import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import storeController from '../controllers/store.controller.js';

import productRouter from './product.routes.js';
import followRouter from './follow.routes.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

// POST /store/234fad4/products
// GET /store/234fad4/products
router.use('/:storeId/products', productRouter);
router.use('/:storeId/follows', followRouter);
router.route('/search', storeController.searchStore);
router.route('/count', storeController.countStores);

router.route(
  '/my-store',
  authController.protect,
  authController.restrictTo(eUserRole.GROCER),
  storeController.setStoreId,
  storeController.getStore,
);

// @breif route for updating store logo

// @breif route for updating store background image
/**
 * @openapi
 * '/api/stores/logo':
 *  patch:
 *     tags:
 *     - Store Controller
 *     summary: Update store logo
 *     requestBody:
 *      required: true
 *      content:
 *       application/form-data:
 *        schema:
 *           type: file
 *           required:
 *            - logo
 *           properties:
 *             logo:
 *               type: file
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *
 *      400:
 *        description: Not found
 *      500:
 *        description: Server Error
 */
router.patch(
  '/logo',
  authController.protect,
  authController.restrictTo(eUserRole.STORE),
  storeController.uploadLogo,
  storeController.resizeLogo,
  storeController.updateStore,
);

// @breif route for updating store background image
/**
 * @openapi
 * '/api/stores/background-image':
 *  patch:
 *     tags:
 *     - Store Controller
 *     summary: Update store background image
 *     requestBody:
 *      required: true
 *      content:
 *       application/form-data:
 *        schema:
 *           type: file
 *           required:
 *            - backgroundImage
 *           properties:
 *             backgroundImage:
 *               type: file
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *      400:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                status: string
 *                error:
 *                  type: object
 *                  properties:
 *                    statusCode:
 *                      type: integer
 *                      default: 400
 *                    status: string
 *                    isOperational: boolean
 *                message: string
 *                stack: string
 *      500:
 *        description: Server Error
 */
router.patch(
  '/background-image',
  authController.protect,
  authController.restrictTo(eUserRole.STORE),
  storeController.uploadBackgroundImage,
  storeController.resizeBackgroundImage,
  storeController.updateStore,
);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN),
    storeController.uploadLogo,
    storeController.resizeLogo,
    storeController.createStore,
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
    storeController.updateStore,
  )
  .delete(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN, eUserRole.GROCER),
    storeController.deleteStore,
  );

export default router;
