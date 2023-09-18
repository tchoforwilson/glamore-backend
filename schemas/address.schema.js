import { Schema } from 'mongoose';
/**
 * @breif Address schema for user or store address
 */
const addressSchema = new Schema({
  line_1: {
    type: String,
    required: [true, 'Address line required!'],
  },
  line_2: String,
  city: {
    type: String,
    required: [true, 'City required!'],
  },
  region: {
    type: String,
    enum: {
      values: [
        'North West',
        'South West',
        'Littoral',
        'Center',
        'East',
        'Far North',
        'South',
        'Adamawa',
        'North',
        'West',
      ],
      message: 'Please choose the region you live in',
    },
  },
  zipcode: String,
});

export default addressSchema;
