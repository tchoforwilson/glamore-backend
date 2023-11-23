import Follow from '../models/follow.model.js';
import factory from './handler.factory.js';
import catchAsync from '../utilities/catchAsync.js';

/**
 * @breif Set Customer store id if it doesn't exist
 * in the request body.
 */
const setUserStoreIds = (req, res, next) => {
  if (!req.body.store) req.body.store = req.params.storeId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/**
 * @breif Toggle user following store either to FOLLOW or UNFOLLOW.
 */
const toggleFollow = catchAsync(async (req, res, next) => {
  // 1. Get follow
  const follow = await Follow.findOne({
    user: req.body.user,
    store: req.body.store,
  });

  // 2. Check if follow exists
  if (follow) {
    // a. It doesn't exist? create one
    await Follow.create({ user: req.body.user, store: req.body.store });
  } else {
    // a. It exist? delete
    await Follow.deleteOne({ user: req.body.user, store: req.body.store });
  }

  // 3. Send resposne
  res.status(200).json({
    status: 'success',
    message: `${follow ? 'Following store' : 'Unfollowed store'}`,
    data: !!follow,
  });
});

/**
 * @breif Check if user is following a store
 */
const isFollowing = catchAsync(async (req, res, next) => {
  // 1. Gest follow
  const follow = await Follow.findOne({
    user: req.body.user,
    store: req.body.store,
  });

  // 2. Send response
  res.status(200).json({
    status: 'success',
    data: !!follow,
  });
});

export default {
  setUserStoreIds,
  toggleFollow,
  isFollowing,
  getAllFollows: factory.getAll(Follow),
};
