const express = require('express');
const router = express.Router();
const { isAuthenticateUser } = require('../middleware/authentiacte-route');
const { processPayment, sendStripeApi } = require('../controllers/paymentController');

router.route('/payment/process').post(isAuthenticateUser, processPayment);
router.route('/stripeapi').get(isAuthenticateUser, sendStripeApi);

module.exports = router;