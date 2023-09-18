import Review from './../models/review.model.js';
import factory from './handler.factory.js';

const setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export default {
  setProductUserIds,
  getAllReviews: factory.getAll(Review),
  getReview: factory.getOne(Review),
  createReview: factory.createOne(Review),
  updateReview: factory.updateOne(Review),
  deleteReview: factory.deleteOne(Review),
};
