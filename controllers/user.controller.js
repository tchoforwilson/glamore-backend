import sharp from 'sharp';
import User from '../models/user.model.js';

import factory from './handler.factory.js';
import AppError from '../utilities/appError.js';
import catchAsync from '../utilities/catchAsync.js';
import upload from '../utilities/upload.js';
import eUserRole from '../utilities/enums/e.user-role.js';
import StatusCode from '../utilities/enums/e.status-code.js';

/**
 * @breif Filter out unwanted fields in an object
 * @param {Object} obj -> Provided object
 * @param  {...any} allowedFields -> Fields allowed to be updated
 * @returns {Object}
 */
export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 * @breif Upload a single user photo
 */
const uploadUserPhoto = upload.single('photo');

/**
 * @breif Resize user photo to size 500x500 and convert format to jpeg
 * then store photo in folder public/images/users
 */
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`);

  next();
});

/**
 * @breif Get user id
 * @param {Request} req  Request
 * @param {Response} res Response
 * @param {Function} next  Function
 */
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const registerUser = catchAsync(async (req, res, next) => {
  // 1. Check if user already exists
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return next(
      new AppError(
        "User already exist's with this email",
        StatusCode.BAD_REQUEST
      )
    );
  }

  // 2. Get Required fields
  const filteredBody = filterObj(req.body, 'name', 'email', 'role');

  // 3. Make sure role is EMPLOYEE || GROCER
  if (
    filteredBody.role !== eUserRole.EMPLOYEE &&
    filteredBody.role !== eUserRole.GROCER
  ) {
    return next(
      new AppError('Invalid role specified!', StatusCode.BAD_REQUEST)
    );
  }

  // 4. Create automatic fields
  filteredBody.createdBy = req.user.id; // Set employer
  filteredBody.password = Math.random().toString(36).slice(-8); // Generate a random password
  filteredBody.passwordConfirm = filteredBody.password;

  // 5. Create new user as employee
  const newUser = await User.create(filteredBody);

  // TODO: Send email to new user with password
  console.log(filteredBody.password);

  // 6. Remove password from output
  newUser.password = undefined;

  // 5. Send response
  res.status(StatusCode.CREATED).json({
    status: 'success',
    data: newUser,
  });
});

/**
 * @breif Controller for updating user profile
 */
const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        StatusCode.BAD_REQUEST
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'address', 'location');
  if (req.file) filteredBody.photo = req.file.filename; // add photo file

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

/**
 * @breif Controller for deleting user profile, by setting active status to false.
 */
const deleteMe = catchAsync(async (req, res, next) => {
  // 1. Find user and update active to false
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  // 2. Send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

const getUser = factory.getOne(User, {
  path: 'store',
  select: '+_id name telephone',
});
const getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

export default {
  uploadUserPhoto,
  resizeUserPhoto,
  getMe,
  registerUser,
  updateMe,
  deleteMe,
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
