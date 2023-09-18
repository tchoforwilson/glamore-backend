import Cart from '../models/cart.model.js';
import factory from './handler.factory.js';

/**
 * @breif Set cart customer from current login data
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function
 */
const setCartCustomer = (req, res, next) => {
  // Allow nested routes
  if (!req.body.customer) req.body.customer = req.user.id;
  next();
};

/**
 * @breif Cart controllers for all CRUD operations
 */
export default {
  /**
   * @breif Middlerware to set cart customer
   */
  setCartCustomer,
  /**
   * @breif Create a new cart
   */
  createCart: factory.createOne(Cart),
  /**
   * @breif Get all carts
   */
  getAllCarts: factory.getAll(Cart),
  /**
   * @brif Get a single cart
   */
  getCart: factory.getOne(Cart),
  /**
   * @breif Update an existing cart
   */
  updateCart: factory.updateOne(Cart),
  /**
   * @breif Delete an existing cart
   */
  deleteCart: factory.deleteOne(Cart),
};
