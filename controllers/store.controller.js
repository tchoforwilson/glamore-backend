import sharp from 'sharp';

import Store from '../models/store.model.js';
import factory from './handler.factory.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

/// @breif Set store user
const setStoreUser = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/// @breif Get my store
const setStoreId = (req, res, next) => {
  // Allow nested route
  if (!req.params.id) req.params.id = req.user.store.id;
  next();
};

/// @breif middleware for uploading shop logo
const uploadLogo = upload.single('logo');

const resizeLogo = catchAsync(async (req, res, next) => {
  // 1. Check if file is present
  if (!req.file) return next();

  const id = req.params.id || req.user.id;

  // 2. Change file name
  req.file.filename = `logo-${id}-${Date.now()}.png`;
  req.body.logo = req.file.filename;

  // 3. Upload and resize logo
  await sharp(req.file.buffer)
    .toFormat('png')
    .png({ quality: 90 })
    .toFile(`public/images/logos/${req.file.filename}`);

  next();
});

export default {
  setStoreUser,
  setStoreId,
  uploadLogo,
  resizeLogo,
  createStore: factory.createOne(Store),
  getAllStores: factory.getAll(Store),
  getStore: factory.getOne(Store, { path: 'Product', select: '-__v' }),
  updateStore: factory.updateOne(Store),
  deleteStore: factory.deleteOne(Store),
  searchStore: factory.search(Store),
  countStores: factory.count(Store),
};
