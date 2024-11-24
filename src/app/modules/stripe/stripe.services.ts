import Stripe from 'stripe'; // Import Stripe using ES module syntax
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../error/appError';
import Client from '../client/client.model';
import Booking from '../booking/booking.model';
import {
  ENUM_PAYMENT_PURPOSE,
  ENUM_PAYMENT_STATUS,
} from '../../utilities/enum';

const stripe = new Stripe(config.stripe.stripe_secret_key as string);
const createConnectedAccountAndOnboardingLink = async (
  salonEmail: string,
  profileId: string,
) => {
  const isClientConnected = await Client.findOne({
    isStripeConnected: true,
    email: salonEmail,
    _id: profileId,
  });

  if (isClientConnected) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Stripe is already connected');
  }
  // Step 1: Create a connected account
  const account = await stripe.accounts.create({
    type: 'express', // or 'express' based on your need
    email: salonEmail,
    country: 'DE', // Example country
    capabilities: {
      card_payments: { requested: true }, // Enable card payments (includes Apple Pay / Google Pay)
      transfers: { requested: true }, // Enable transfers to the account
    },
  });

  console.log('Connected Account Created:', account.id);

  const updatedClientProfile = await Client.findByIdAndUpdate(
    profileId,
    { stripAccountId: account.id },
    { new: true, runValidators: true },
  );

  if (!updatedClientProfile) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Server temporarily unavailable',
    );
  }

  // Step 2: Create the onboarding link
  const onboardingLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://yourapp.com/reauth', // URL to re-authenticate if the process fails
    return_url: 'https://yourapp.com/success', // URL to go after successful setup
    type: 'account_onboarding',
  });
  return onboardingLink.url;
};

const updateClientStripeConnectionStatus = async (accountId: string) => {
  // Validate the input parameters
  if (!accountId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Stripe account ID is required.',
    );
  }

  try {
    const updatedClient = await Client.findOneAndUpdate(
      { stripAccountId: accountId },
      { isStripeConnected: true },
      { new: true, runValidators: true },
    );

    if (!updatedClient) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `No client found with Stripe account ID: ${accountId}`,
      );
    }

    return {
      success: true,
      statusCode: httpStatus.OK,
      message: `Client  successfully connected to Stripe.`,
      data: updatedClient,
    };
  } catch (err) {
    return {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while updating the client status.',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};

const handlePaymentSuccess = async (paymentIntent: Stripe.PaymentIntent) => {
  if (paymentIntent.metadata.purpose === ENUM_PAYMENT_PURPOSE.ADMIN_FEE) {
    await Client.findByIdAndUpdate(paymentIntent.metadata.shopId,{payOnShopChargeDueAmount:{$inc:-paymentIntent.amount / 100}})
  } else {
    const bookingId = paymentIntent.metadata.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    console.log('Payment Intent succeeded:', paymentIntent.id);

    booking.paymentStatus = ENUM_PAYMENT_STATUS.SUCCESS;
    await booking.save();
  }
};

const stripeServices = {
  createConnectedAccountAndOnboardingLink,
  updateClientStripeConnectionStatus,
  handlePaymentSuccess,
};

export default stripeServices;
