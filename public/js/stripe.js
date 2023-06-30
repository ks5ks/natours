/* eslint-disable */
// import axios from 'axios';
// const Stripe = require('stripe');

import { showAlert } from './alert.js';

const stripe = Stripe(
  'pk_test_51NNL2kItYyFXWZSLNVa7kYP7q7QJTED8ZuhwBrVexkemYewQeFGbTSZtFVVfHAi4y2F0t981LWI8qKsM8m638Qkq00KAdLOfBf'
);

export const bookTour = async (tourId) => {
  try {
    // get session from server
    console.log(`Tour id: ${tourId}`);
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    console.log(session);
    // use stripe object to create checkout form + charge credit card
    const checkoutPageUrl = session.data.session.url;
    window.location.assign(checkoutPageUrl);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
