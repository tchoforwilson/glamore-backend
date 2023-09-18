import sharp from 'sharp';

import Product from '../models/product.model.js';
import factory from './handler.factory.js';
import upload from '../utilities/upload.js';
import catchAsync from '../utilities/catchAsync.js';

/**
 * @breif Set Product shop id
 * @param {Request} req -> Request Object
 * @param {Response} res -> Response Object
 * @param {Function} next -> Next function
 */
const setProductStoreId = (req, res, next) => {
  // Allow for nested routes
  if (!req.body.store) req.body.store = req.user.store.id || req.params.storeId;
  next();
};

/**
 * @breif Middleware to upload a Product imageCover and images
 */
const uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

/**
 * @breif Resize Product images to size 800x800 and convert format to jpeg
 * then save roduct image in folder public/images/products
 */
const resizeProductImages = catchAsync(async (req, res, next) => {
  // 1. Check if file exists
  if (!req.files) return next();

  // 2. Upload Cover image
  if (req.files.imageCover) {
    const id = req.params.id || req.user.store.id; // unqiue id for product image
    req.body.imageCover = `product-${id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(800, 800)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/products/${req.body.imageCover}`);
  }

  // 2. Images
  if (req.files.images && req.files.images.length > 0) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(800, 800)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

export default {
  setProductStoreId,
  uploadProductImages,
  resizeProductImages,
  createProduct: factory.createOne(Product),
  updateProduct: factory.updateOne(Product),
  getProduct: factory.getOne(Product, { path: 'store', select: '-__v' }),
  getAllProducts: factory.getAll(Product),
  deleteProduct: factory.deleteOne(Product),
};
