import { Schema, model } from 'mongoose';
import eProductStatus from './../utilities/enums/e.product-status.js';
import eSupportedCurrency from './../utilities/enums/e.currency.js';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us the product name'],
      trim: true,
      maxlength: [
        40,
        'A product name must have less or equal then 40 characters',
      ],
      minlength: [
        5,
        'A product name must have more or equal then 10 characters',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the product'],
    },
    brand: String,
    measurement: {
      value: Number,
      unit: String,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    priceDiscount: Number,
    percentageDiscount: {
      type: Number,
      set: function (value) {
        return Math.round(value);
      },
    },
    currency: {
      type: String,
      enum: {
        values: [...Object.values(eSupportedCurrency)],
        message: 'Please choose a valid currency',
      },
      default: eSupportedCurrency.XAF,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide the quantity of the product'],
    },
    imageCover: {
      type: String,
      required: [true, 'Product must have an image cover'],
    },
    images: [String],
    status: {
      type: String,
      enum: [...Object.values(eProductStatus)],
      default: eProductStatus.AVAILABLE,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a particular category'],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Product must belong to a store'],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

/**
 * @brief This middleware runs for update, to check for
 * priceDiscount less than price
 */
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const price = update.price;
  const priceDiscount = update.priceDiscount;

  if (priceDiscount && price && priceDiscount >= price) {
    return next(
      new AppError('Discount price must be less than regular price', 400)
    );
  }

  if (priceDiscount) {
    update.$set = update.$set || {};
    update.$set.percentageDiscount =
      100 - (update.priceDiscount * 100) / update.price;
  }

  next();
});

/**
 * @brief This middleware runs for save and create, to check for
 * priceDiscount less than price
 */
productSchema.pre('save', function (next) {
  if (this.priceDiscount && this.priceDiscount >= this.price) {
    return next(
      new AppError('Discount price must be less than regular price', 400)
    );
  }

  if (this.priceDiscount) {
    this.percentageDiscount =
      Math.round(((this.price - this.priceDiscount) / this.price) * 10000) /
      100;
  } else {
    this.percentageDiscount = 0;
  }

  next();
});

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

/**
 * @breif Populate category for all *find* command
 */
productSchema.pre(/^find/, function (next) {
  // Populate with category
  this.populate({
    path: 'category',
    select: 'name _id',
  });
  next();
});

const Product = model('Product', productSchema);

export default Product;
