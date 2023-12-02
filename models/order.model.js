import { Schema, model } from 'mongoose';
import ePaymentMethod from '../utilities/enums/e.payment-method.js';
import eOrderStatus from '../utilities/enums/e.order-status.js';

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must be done by a user'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        product: {
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
    total: Number,
    payment: {
      type: String,
      enum: {
        values: [...Object.values(ePaymentMethod)],
        message: `Payment is either ${ePaymentMethod.MOBILE_MONEY}, ${ePaymentMethod.PAYPAL} or ${ePaymentMethod.CASH}`,
      },
      default: ePaymentMethod.MOBILE_MONEY,
    },
    code: {
      type: String,
      required: [true, 'Order code is required'],
    },
    paid: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: [...Object.values(eOrderStatus)],
      default: eOrderStatus.PENDING,
      required: true,
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
