// 'use strict';

// const mongoose = require('mongoose');

const Review = require('../models/reviewModel');

const factory = require('./handlerFactory');

// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

// get all reviews
exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// get specific review
exports.getReview = factory.getOne(Review);

// create a review
exports.createReview = factory.createOne(Review);

// updates a review
exports.updateReview = factory.updateOne(Review);

// delete a review
exports.deleteReview = factory.deleteOne(Review);
// exports.deleteReview = catchAsync(async (req, res, next) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return next(new AppError('Invalid Id', 404));
//   const review = await Review.findByIdAndDelete(req.params.id);
//   if (!review) return next(new AppError('No review deleted', 404));

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: `Deleted review : ${review}`,
//     },
//   });
// });
