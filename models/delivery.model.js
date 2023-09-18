import { Schema, model } from 'mongoose';
import addressSchema from '../schemas/address.schema.js';
import pointSchema from '../schemas/point.schema.js';
import eDeliveryStatus from '../utilities/enums/e.delivery-status.js';

const deliverySchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A delivery must be made by an employee'],
    },
    address: addressSchema,
    departure: {
      type: Date,
      default: Date.now,
    },
    arrival: Date,
    currentLocation: pointSchema,
    status: {
      type: String,
      enum: [...Object.values(eDeliveryStatus)],
      default: eDeliveryStatus.PENDING,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Delivery must have an order'],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

deliverySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employee',
    select: 'name photo',
  });
  next();
});

const Delivery = model('Delivery', deliverySchema);

export default Delivery;
