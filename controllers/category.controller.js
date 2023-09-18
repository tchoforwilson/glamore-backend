import sharp from 'sharp';

import Category from '../models/category.model.js';
import factory from './handler.factory.js';
import catchAsync from './../utilities/catchAsync.js';
import upload from './../utilities/upload.js';

const uploadIcon = upload.single('icon');

/**
 * @breif Format uploaded icon
 */
const formatUploadIcon = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const id = req.params.id || req.user.id;
  req.file.filename = `icon-${id}-${Date.now()}.png`; // set file name

  req.body.icon = req.file.filename; // set body icon

  await sharp(req.file.buffer)
    .toFormat('png')
    .jpeg({ quality: 90 })
    .toFile(`public/images/icons/${req.file.filename}`);

  next();
});

/**
 * @breif Category handler
 */
export default {
  uploadIcon,
  formatUploadIcon,
  createCategory: factory.createOne(Category),
  getCategory: factory.getOne(Category, { path: 'Product', select: '-__v' }),
  getAllCategories: factory.getAll(Category),
  updateCategory: factory.updateOne(Category),
  deleteCategory: factory.deleteOne(Category),
};
