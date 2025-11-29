const Stripe = require('stripe');
const config = require('../config');
const stripe = new Stripe(config.stripeKey, { apiVersion: '2024-08-01' });

const createCheckoutSession = async ({ priceId, successUrl, cancelUrl, customerEmail }) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail
  });
  return session;
};

module.exports = { createCheckoutSession };
