import factory from './handler.factory.js';
import Order from '../models/order.model.js';

/// @breif Set user order id
const setOrderUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.params.id) req.params.id = req.user.id;
  next();
};

export default {
  setOrderUserId,
  createOrder: factory.createOne(Order),
  getAllOrders: factory.getAll(Order),
  getOrder: factory.getOne(Order, { path: 'products.item' }),
  updateOrder: factory.updateOne(Order),
  deleteOrder: factory.deleteOne(Order),
};
