import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {
    customer: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Customer required for product to be added to cart'],
    },
    products: [
      {
        product: {
          type: Schema.ObjectId,
          ref: 'Product',
          required: [true, 'Product required to be added to cart'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity of products cannot be empty'],
        },
        price: Number,
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

/**
 * @breif Populate cart with user (customer)
 */
cartSchema.pre(/^find/, function (next) {
  // Populate with user (customer)
  this.populate({
    path: 'User',
    select: '_id name email photo',
  });
  next();
});

const Cart = model('Cart', cartSchema);

export default Cart;
