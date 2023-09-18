import { Schema } from 'mongoose';
import validator from 'validator';

/**
 * @breif User or store phone schema
 */
const phoneSchema = new Schema({
  phone: {
    type: String,
    required: [true, 'Please provide your active phone number'],
    validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
  },
});

export default phoneSchema;
