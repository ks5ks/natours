const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

// define the routes
const router = express.Router({ mergeParams: true });

// only logged in users can access booking
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
