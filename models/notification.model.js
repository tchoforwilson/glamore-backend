import { Schema, model } from 'mongoose';
import eConcerns from '../utilities/enums/e.concerns';

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A notification must have a title'],
    },
    body: {
      type: String,
      required: [true, 'A notification must have a body'],
    },
    concerns: {
      type: String,
      enum: [...eConcerns],
      default: eConcerns.ALL_USERS,
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

const Notification = model('Notification', notificationSchema);

export default Notification;
