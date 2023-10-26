const catchasyncError = require('../middleware/catchasyncError');
const stripe = require('stripe')('sk_test_51O4i7ISBBGvsegU1xkYJkbvA9dlPJqf9gLn3MTDcFPcEtla6NjsW3GtKyASXnfhb0tlciSRmcnExi59ZFzF0hC3T00CFujB1Hl');

exports.processPayment = catchasyncError(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: "accept_payment" },
        shipping: req.body.shipping
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
});

exports.sendStripeApi = catchasyncError(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    });
});
