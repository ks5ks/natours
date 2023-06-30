const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');

const Booking = require(`../models/bookingModel`);

const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  console.log(`Tour ID: ${req.params.tourId}`);
  console.log(`User :${req.user.id}`);
  console.log(`Price :${tour.price}`);

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
  });

  // create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

// get all bookings
exports.getAllBookings = factory.getAll(Booking);

// get specific Booking
exports.getBooking = factory.getOne(Booking);

// create a Booking
exports.createBooking = factory.createOne(Booking);

// updates a Booking
exports.updateBooking = factory.updateOne(Booking);

// delete a Booking
exports.deleteBooking = factory.deleteOne(Booking);