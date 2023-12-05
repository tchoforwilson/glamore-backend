import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/user.model.js';
import catchAsync from '../utilities/catchAsync.js';
import AppError from '../utilities/appError.js';
import config from '../configurations/config.js';
import eStatusCode from '../utilities/enums/e.status-code.js';

/**
 * @breif Generate user jwt sign token
 * @param {Object} -> User object
 */
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * @breif Create and send as response jwt token
 * @param {Object} user response object
 * @param {Number} eStatusCode Response status code
 * @param {String} message Response message
 * @param {req} Request
 * @param {res} Response
 */
const createSendToken = (user, eStatusCode, message, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + config.jwt.cookieExpires * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from user output
  user.password = undefined;

  res.status(eStatusCode).json({
    status: 'success',
    token,
    message,
    data: {
      user,
    },
  });
};

/**
 * @breif Controller to signup a new user
 */
const signup = catchAsync(async (req, res, next) => {
  // 1. Pick required values
  const { firstname, lastname, email, password, passwordConfirm } = req.body;

  // 2. Check if user is already registered
  const user = await User.findOne({ email });

  if (user) {
    return next(new AppError('User already exists!', eStatusCode.BAD_REQUEST));
  }

  // 3. Create new user
  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
  });

  // 4. Send response
  createSendToken(
    newUser,
    eStatusCode.CREATED,
    'You have signup successfully',
    req,
    res,
  );
});

/**
 * @breif Controller to login an already registered user
 */
const login = catchAsync(async (req, res, next) => {
  // 1. Get email and password
  const { email, password } = req.body;

  // 2. Check if email and password exists
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email and password',
        eStatusCode.BAD_REQUEST,
      ),
    );
  }

  // 3. Find user with email
  let user = await User.findOne({ email }).select('+password');

  // 4. Check if user exists && password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Incorrect email or password', eStatusCode.BAD_REQUEST),
    );
  }

  // 5. If everything ok, send token to client
  createSendToken(user, eStatusCode.SUCCESS, 'Successfully login', req, res);
});

const protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        eStatusCode.FORBIDDEN,
      ),
    );
  }

  // 2. Token verification
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

  // 3. Check if user still exist's
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "User belonging to this token no longer exist's",
        eStatusCode.FORBIDDEN,
      ),
    );
  }

  // 5. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'You recently changed password! please login again.',
        eStatusCode.FORBIDDEN,
      ),
    );
  }

  // 7. GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

/**
 * @breif Middleware to restrict route access only to user of
 * a particular role
 * @param  {...any} roles -> User roles
 * @returns {Function}
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['ADMIN','GROCER','EMPLOYEE' 'CUSTOMER']. role='CUSTOMER'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          eStatusCode.UN_AUTHORIZED,
        ),
      );
    }

    next();
  };
};

/**
 * @breif Controller for updating user password
 */
const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError('Your current password is wrong.', eStatusCode.FORBIDDEN),
    );
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(
    user,
    eStatusCode.SUCCESS,
    'Password successfully updated',
    req,
    res,
  );
});

export default {
  signup,
  login,
  protect,
  restrictTo,
  updatePassword,
};
