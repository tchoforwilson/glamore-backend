import Favorite from '../models/favorite.model.js';
import catchAsync from '../utilities/catchAsync.js';

/**
 * @breif Set Customer product id if it doesn't exist
 * in the request body.
 */
const setCustomerProductId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * @breif Add or remove item from favorites list.
 */
const toggleFavorite = catchAsync(async (req, res, next) => {
  // 1. Get Favorite
  const favorite = await Favorite.find({
    user: req.body.user,
    product: req.body.product,
  });

  // 2. Check if Favorite exists
  if (favorite) {
    // a. It doesn't exist? create one
    await Favorite.create({ user: req.body.user, product: req.body.product });
  } else {
    // a. It exist? delete
    await Favorite.delete({ user: req.body.user, product: req.body.product });
  }

  // 3. Send resposne
  res.status(200).json({
    status: 'success',
    message: `${favorite ? 'Added to favorites' : 'Removed from favorites'}`,
    data: !!favorite,
  });
});

/**
 * @breif Check if product is user favorite
 */
const isFavorite = catchAsync(async (req, res, next) => {
  // 1. Gest Favorite
  const favorite = await Favorite.find({
    user: req.body.user,
    product: req.body.product,
  });

  // 2. Send response
  res.status(200).json({
    status: 'success',
    data: !!favorite,
  });
});

export default {
  setCustomerProductId,
  toggleFavorite,
  isFavorite,
};
