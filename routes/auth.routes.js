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
 *        description: User login successful
 *      400:
 *        description: Email or password no provided or Incorrect password
 *      500:
 *        description: Server Error
 */
router.post('/login', authController.login);
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - phone
 *         - password
 *         - passwordConfirm
 *       properties:
 *         firstname:
 *           type: string
 *           description: User firstname
 *         lastname:
 *           type: string
 *           description: User lastname
 *         email:
 *           type: string
 *           description: User email
 *         phone:
 *           type: string
 *           description: User phone number
 *         password:
 *           type: string
 *           description: User password
 *         passwordConfirm: User password confirmation
 *       example:
 *         firstname: mary
 *         lastname: james
 *         email: maryjames@example.io
 *         phone: 654007889
 *         password: pass1234
 *         passwordConfirm: pass1234
 */
router.post('/signup', authController.signup);

router.patch(
  '/update-my-Password',
  authController.protect,
  authController.updatePassword,
);

export default router;
