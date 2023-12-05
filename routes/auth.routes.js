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
router.post('/signup', authController.signup);

router.patch(
  '/update-my-Password',
  authController.protect,
  authController.updatePassword,
);

export default router;
