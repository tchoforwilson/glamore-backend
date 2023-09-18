import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name!'],
      lowercase: true,
      unique: true,
    },
    description: String,
    symbol: {
      type: String,
      required: [true, 'A category must have a symbol'],
      unique: true,
      maxlength: [3, 'A category symbol must have a maximum of 3 characters'],
      minlength: [3, 'A category symbol must have a minimum of 3 characters'],
    },
    icon: {
      type: String,
      required: [true, 'A category must have an icon'],
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

// Virtual populate
categorySchema.virtual('products', {
  ref: 'Product',
  foreignField: 'category',
  localField: '_id',
});

const Category = model('Category', categorySchema);

export default Category;
