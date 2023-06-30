// 'use strict';
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// multer configurations and upload
// const multerStorage = multer.diskStorage({ // store image to disk
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// image sizing for preview
// exports.resizePreviewPhoto = async (req, res) => {
//   if (!req.file) return;

//   req.file.filename = `tmp-${req.user.id}}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);
//   return req.file.filename;
// };

// image sizing to save to user
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// function to filter fields allowed for getting user data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// get me
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// update logged in user
exports.updateMe = catchAsync(async (req, res, next) => {
  // create an error if password update attempted
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Password update not allowed, please use /updateMyPassword',
        400
      )
    );
  }

  // filter out fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
  // update the user
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    date: {
      user: updatedUser,
    },
  });
});

// delete me
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
    passwordChangedAt: Date.now(),
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//  get All Users
exports.getAllUsers = factory.getAll(User);

//  create a user
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined, please use /signup instead',
  });
};

//  get a single user
exports.getUser = factory.getOne(User);

//  update a user (DO NOT UPDATE PASSWORD!)
exports.updateUser = factory.updateOne(User);

//  delete a user
exports.deleteUser = factory.deleteOne(User);
