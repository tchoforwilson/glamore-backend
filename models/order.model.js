import { Schema, model } from 'mongoose';
import ePaymentMethod from '../utilities/enums/e.payment-method.js';

const orderSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product required to be ordered'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity of products cannot be null'],
        },
        price: Number,
      },
    ],
    totalAmount: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must be done by a user'],
    },
    payment: {
      type: String,
      enum: {
        values: [...Object.values(ePaymentMethod)],
        message: `Payment is either ${ePaymentMethod.MOBILE_MONEY}, ${ePaymentMethod.PAYPAL} or ${ePaymentMethod.CASH}`,
      },
      default: ePaymentMethod.MOBILE_MONEY,
    },
    paid: {
      type: Boolean,
      default: true,
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

orderSchema.pre(/^find/, function (next) {
  // Populate order with user
  this.populate({
    path: 'user',
    select: 'name photo phone email address',
  });
  next();
});

const Order = model('Order', orderSchema);

export default Order;
