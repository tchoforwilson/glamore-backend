import { Schema, model } from 'mongoose';

const followSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Store required'],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
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
followSchema.index({ user: 1, store: 1 }, { unique: true });

const Follow = model('Follow', followSchema);

export default followSchema;
