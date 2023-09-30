import { Schema, model } from 'mongoose';

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Store required'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Customer must be following a store'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

/**
 * @breif Each document should be unique
 */
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

const Favorite = model('Favorite', favoriteSchema);

export default favoriteSchema;
