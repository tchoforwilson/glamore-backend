import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

import phoneSchema from '../schemas/phone.schema.js';
import addressSchema from '../schemas/address.schema.js';
import piontSchema from '../schemas/point.schema.js';
import eUserRole from '../utilities/enums/e.user-role.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    emailValidated: {
      type: Boolean,
      default: false,
    },
    emailCode: Number,
    emailCodeExpiresAt: Date,
    numberOfResendEmailCode: Number,
    newEmail: {
      type: Boolean,
      default: true,
    },
    creadedBy: {
      type: Schema.Types.ObjectId, // For employees and users
      ref: 'User',
    },
    phone: {
      type: phoneSchema,
    },
    phoneValidated: {
      type: Boolean,
      default: false,
    },
    phoneCode: Number,
    smsCodeExpiresAt: Date,
    numberOfResendSMSeCode: Number,
    newPhone: {
      type: Boolean,
      default: true,
    },
    twoFactorsAuth: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [...Object.values(eUserRole)],
      default: eUserRole.CUSTOMER,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    address: {
      type: addressSchema,
    },
    location: piontSchema,
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
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

// Virtual populate
userSchema.virtual('store', {
  ref: 'Store',
  foreignField: 'user',
  localField: '_id',
  justOne: true,
});

/**
 * @breif Middleware to encrypt user password before save
 */
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

/**
 * @breif Middleware to save user password changed date
 */
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // * Donot remove ant time during test because it causes it to failed
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
  ) {
    this.passwordChangedAt = Date.now();
    -1000; // This is done because token might be created before password changed
  } else {
    this.passwordChangedAt = Date.now();
  }
  next();
});

/**
 * @breif Middleware not select inactive users
 */
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/**
 * @breif function to verify if provided user password is correct with stored encypted password
 * @param {String} candidatePassword -> User provided password
 * @param {String} userPassword -> Stored user password
 * @return {Boolean}
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * @breif Method to check if user changed password after login
 * @param {String} JWTTimestamp -> JWT time
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = model('User', userSchema);

export default User;
