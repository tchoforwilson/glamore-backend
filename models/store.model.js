import { Schema, model } from 'mongoose';
import User from './user.model.js';
import addressSchema from '../schemas/address.schema.js';
import pointSchema from '../schemas/point.schema.js';
import phoneSchema from '../schemas/phone.schema.js';
import AppError from '../utilities/appError.js';
import UserRole from '../utilities/enums/e.user-role.js';

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide store name'],
    },
    address: addressSchema,
    logo: String,
    location: pointSchema,
    phone: phoneSchema,
    user: {
      type: Schema.ObjectId,
      required: [true, 'Store must belong to a grocer!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

storeSchema.pre('save', async function (next) {
  // 1. Find user
  const user = await User.findById(this.user);

  // 2. Make sure user is a grocer
  if (user.role !== UserRole.GROCER)
    return next(new AppError('Store user must be a grocer!', 400));

  next();
});

// Virtual populate
storeSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'store',
  localField: '_id',
});

/**
 * @breif Populate store with user when find
 */
storeSchema.pre(/^find/, function (next) {
  // Populate with user
  this.populate({
    path: 'user',
    select: '-__v',
  });
  next();
});

const Store = model('Store', storeSchema);

export default Store;
