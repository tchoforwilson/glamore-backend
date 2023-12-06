import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();
/** POST Methods */
/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Login an already existing user with email and password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: user@mail.com
 *              password:
 *                type: string
 *                default: pass1234
 *     responses:
 *      200:
 *        description: Success
 *        example:
 *          value:
 *             token: string
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             status: string
 *             error:
 *              type: object
 *              properties:
 *               statusCode:
 *                 type: integer
 *                 default: 400
 *               status: string
 *               isOperational: boolean
 *             message: string
 *             stack: string
 *      500:
 *        description: Server Error
 */
router.post('/login', authController.login);
/** POST Methods */
/**
 * @openapi
 * '/api/auth/signup':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: sign up a new user (customer) by default
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstname
 *              - lastname
 *              - email
 *              - phone
 *              - password
 *              - passwordConfirm
 *            properties:
 *              firstname:
 *                type: string
 *                default: John
 *              lastname:
 *                type: string
 *                default: smith
 *              email:
 *                type: string
 *                default: user@mail.com
 *              phone:
 *                type: string
 *                default: 677564433
 *              password:
 *                type: string
 *                default: pass1234
 *              passwordConfirm:
 *                type: string
 *                default: pass1234
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *
 *      400:
 *        description: Email or password no provided or Incorrect password
 *      500:
 *        description: Server Error
 */
router.post('/signup', authController.signup);

router.patch(
  '/update-my-Password',
  authController.protect,
  authController.updatePassword,
);

export default router;
