import factory from './handler.factory.js';
import Delivery from '../models/delivery.model.js';

/// @breif Set deliverer
const setDeliveryUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.params.id) req.params.id = req.user.id;
  next();
};

/**
 * @brief Controllers for managing deliveries
 */

export default {
  setDeliveryUser,
  createDelivery: factory.createOne(Delivery),
  getAllDeliveries: factory.getAll(Delivery),
  updateDelivery: factory.updateOne(Delivery),
  getDelivery: factory.getOne(Delivery, { path: 'Order' }),
  deleteDelivery: factory.deleteOne(Delivery),
};
