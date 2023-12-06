import { Router } from 'express';

import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';
import reviewRouter from './review.routes.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * '/api/products/${productId}/reviews':
 *  get:
 *     tags:
 *     - Product Controller
 *     summary: Get all product reviews
 *     parameters:
 *      in: query
 *      name: page
 *      schema:
 *       type: integer
 *       description: Current page number
 *
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *            type: array
 *            properties:
 *
 *      400:
 *        description: Not found
 *      500:
 *        description: Server Error
 */
router.use('/:productId/reviews', reviewRouter);

/**
 * @openapi
 * '/api/products/search':
 *  get:
 *     tags:
 *     - Product Controller
 *     summary: Search a product by its name
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: string
 *            required:
 *              - name
 *            properties:
 *              firstname:
 *                type: string
 *                default: John
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *            type: array
 *            properties:
 *
 *      400:
 *        description: Not found
 *      500:
 *        description: Server Error
 */
router.get('/search', productController.searchProduct);
/**
 * @openapi
 * '/api/products/count':
 *  get:
 *     tags:
 *     - Product Controller
 *     summary: Get number of products
 *     parameters:
 *      in: query
 *      name: page
 *      schema:
 *       type: integer
 *       description: Current page number
 *
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *           schema:
 *            type: integer
 *
 *      400:
 *        description: Not found
 *      500:
 *        description: Server Error
 */
router.get('/count', productController.countProducts);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo(eUserRole.STORE),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.setProductStoreId,
    productController.createProduct,
  )
  .get(productController.getAllProducts);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN, eUserRole.STORE),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct,
  )
  /** POST Methods */
  /**
   * @openapi
   * '/api/products/${productId}/reviews':
   *  get:
   *     tags:
   *     - Product Controller
   *     summary: Get all product reviews
   *     parameters:
   *      in: query
   *      name: page
   *      schema:
   *       type: integer
   *       description: Current page number
   *
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *           schema:
   *            type: array
   *            properties:
   *
   *      400:
   *        description: Not found
   *      500:
   *        description: Server Error
   */
  .delete(
    authController.protect,
    authController.restrictTo(eUserRole.ADMIN, eUserRole.STORE),
    productController.deleteProduct,
  );

export default router;
