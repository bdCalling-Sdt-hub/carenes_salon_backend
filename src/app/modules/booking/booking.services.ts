/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import AppError from '../../error/appError';
import calculateTotalServiceTime from '../../helper/calculateTotalServiceTime';
import BlockHour from '../blockHour/blockHour.model';
import Discount from '../discount/discount.model';
import Service from '../service/service.model';
import Booking from './booking.model';
import {
  ENUM_BOOKING_PAYMENT,
  ENUM_PAYMENT_STATUS,
} from '../../utilities/enum';
import Client from '../client/client.model';
import QueryBuilder from '../../builder/QueryBuilder';
import Stripe from 'stripe';
import config from '../../config';
const stripe = new Stripe(config.stripe.stripe_secret_key as string);
// const createBooking = async (customerId: string, payload: any) => {
//   const { serviceIds, date, startTime, shopId } = payload;

//   // Fetch current date for discount comparison
//   const now = new Date();

//   // Fetch services with their applicable prices
//   const servicesWithPrices = await Promise.all(
//     serviceIds.map(async (serviceId: string) => {
//       const service = await Service.findById(serviceId).select('price');
//       if (!service) throw new Error(`Service with ID ${serviceId} not found`);

//       // Check for an active discount
//       const discount = await Discount.findOne({
//         shop: shopId,
//         discountStartDate: { $lte: now },
//         discountEndDate: { $gte: now },
//         $or: [{ services: 'all-services' }, { services: service._id }],
//       });

//       // Calculate discount price if discount applies; otherwise, use original price
//       const price = discount
//         ? service.price - (service.price * discount.discountPercentage) / 100
//         : service.price;

//       return { serviceId: service._id, price };
//     })
//   );

//   // Calculate the total time for selected services
//   const totalDuration = await calculateTotalServiceTime(serviceIds);

//   // Create the start date in local time
//   const [startHours, startMinutes] = startTime.split(':').map(Number);
//   const startDate = new Date(date);
//   startDate.setHours(startHours, startMinutes, 0);

//   // Create the end date based on total duration
//   const endDate = new Date(startDate);
//   endDate.setMinutes(startDate.getMinutes() + totalDuration);

//   // Check for conflicting bookings
//   const existingBookings = await Booking.find({
//     staffId: payload.staffId,
//     $or: [
//       { startTime: { $lt: endDate }, endTime: { $gt: startDate } }, // Overlapping existing booking
//     ],
//   });

//   if (existingBookings.length > 0) {
//     throw new AppError(httpStatus.CONFLICT,'The selected time slot is conflict with other booking. Please choose a different time.');
//   }

//   // Fetch blocked hours for the staff and shop
//   const blockHours = await BlockHour.find({
//     entityId: payload.staffId,
//     entityType: 'Staff',
//     day: new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
//   });

//   const businessBlockHour = await BlockHour.find({
//     entityId: shopId,
//     entityType: 'Shop',
//     day: new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
//   });

//   // Check if the selected time is within a blocked hour
//   const isBlocked = blockHours.some(
//     (bh) => startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) >= bh.startTime &&
//             startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) < bh.endTime
//   );

//   const isBusinessBlocked = businessBlockHour.some(
//     (bh) => startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) >= bh.startTime &&
//             startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) < bh.endTime
//   );

//   if (isBlocked || isBusinessBlocked) {
//     throw new Error('The selected time slot is blocked. Please choose a different time.');
//   }

//   const result = await Booking.create({
//     ...payload,
//     startTime: startDate,
//     endTime: endDate,
//     customerId,
//     services: servicesWithPrices,
//   });

//   return result;
// };
// const createBooking = async (customerId: string, payload: any) => {
//   const { serviceIds, date, startTime, shopId } = payload;

//   // Fetch current date for discount comparison
//   const now = new Date();

//   // Fetch services with their applicable prices
//   const servicesWithPrices = await Promise.all(
//     serviceIds.map(async (serviceId: string) => {
//       const service = await Service.findById(serviceId).select('price');
//       if (!service) throw new Error(`Service with ID ${serviceId} not found`);

//       // Check for an active discount
//       const discount = await Discount.findOne({
//         shop: shopId,
//         discountStartDate: { $lte: now },
//         discountEndDate: { $gte: now },
//         $or: [{ services: 'all-services' }, { services: service._id }],
//       });

//       // Calculate discount price if discount applies; otherwise, use original price
//       const price = discount
//         ? service.price - (service.price * discount.discountPercentage) / 100
//         : service.price;

//       return { serviceId: service._id, price };
//     })
//   );

//   // Calculate the total price of the selected services
//   const totalPrice = servicesWithPrices.reduce((total, service) => total + service.price, 0);

//   // Calculate the total time for selected services
//   const totalDuration = await calculateTotalServiceTime(serviceIds);

//   // Create the start date in local time
//   const [startHours, startMinutes] = startTime.split(':').map(Number);
//   const startDate = new Date(date);
//   startDate.setHours(startHours, startMinutes, 0);

//   // Create the end date based on total duration
//   const endDate = new Date(startDate);
//   endDate.setMinutes(startDate.getMinutes() + totalDuration);

//   // Check for conflicting bookings
//   const existingBookings = await Booking.find({
//     staffId: payload.staffId,
//     $or: [
//       { startTime: { $lt: endDate }, endTime: { $gt: startDate } }, // Overlapping existing booking
//     ],
//   });

//   if (existingBookings.length > 0) {
//     throw new AppError(
//       httpStatus.CONFLICT,
//       'The selected time slot is conflict with other booking. Please choose a different time.'
//     );
//   }

//   // Fetch blocked hours for the staff and shop
//   const blockHours = await BlockHour.find({
//     entityId: payload.staffId,
//     entityType: 'Staff',
//     day: new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
//   });

//   const businessBlockHour = await BlockHour.find({
//     entityId: shopId,
//     entityType: 'Shop',
//     day: new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
//   });

//   // Check if the selected time is within a blocked hour
//   const isBlocked = blockHours.some(
//     (bh) =>
//       startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) >= bh.startTime &&
//       startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) < bh.endTime
//   );

//   const isBusinessBlocked = businessBlockHour.some(
//     (bh) =>
//       startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) >= bh.startTime &&
//       startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) < bh.endTime
//   );

//   if (isBlocked || isBusinessBlocked) {
//     throw new Error('The selected time slot is blocked. Please choose a different time.');
//   }

//   // Create the booking with total price and service details
//   const result = await Booking.create({
//     ...payload,
//     startTime: startDate,
//     endTime: endDate,
//     customerId,
//     services: servicesWithPrices,
//     totalPrice, // Store the total price in the booking
//   });

//   return result;
// };
const createPayOnShopBooking = async (customerId: string, payload: any) => {
  const { serviceIds, date, startTime, shopId } = payload;
  const shop = await Client.findById(shopId);
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Shop not found');
  }
  // Fetch current date for discount comparison
  const now = new Date();

  // Fetch services with their applicable prices
  const servicesWithPrices = await Promise.all(
    serviceIds.map(async (serviceId: string) => {
      const service = await Service.findById(serviceId).select('price');
      if (!service) throw new Error(`Service with ID ${serviceId} not found`);

      // Check for an active discount
      const discount = await Discount.findOne({
        shop: shopId,
        discountStartDate: { $lte: now },
        discountEndDate: { $gte: now },
        $or: [{ services: 'all-services' }, { services: service._id }],
      });

      // Calculate discount price if discount applies; otherwise, use original price
      const price = discount
        ? service.price - (service.price * discount.discountPercentage) / 100
        : service.price;

      return { serviceId: service._id, price };
    }),
  );

  // Calculate the total price of the selected services
  const totalPrice = servicesWithPrices.reduce(
    (total, service) => total + service.price,
    0,
  );

  // Calculate the total time for selected services
  const totalDuration = await calculateTotalServiceTime(serviceIds);

  // Create the start date in local time
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startDate = new Date(date);
  startDate.setHours(startHours, startMinutes, 0);

  // Create the end date based on total duration
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + totalDuration);

  // Check for conflicting bookings
  const existingBookings = await Booking.find({
    staffId: payload.staffId,
    $or: [
      { startTime: { $lt: endDate }, endTime: { $gt: startDate } }, // Overlapping existing booking
    ],
  });

  if (existingBookings.length > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      'The selected time slot is conflict with other booking. Please choose a different time.',
    );
  }

  // Fetch blocked hours for the staff and shop
  const blockHours = await BlockHour.find({
    entityId: payload.staffId,
    entityType: 'Staff',
    day: new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    }),
  });

  const businessBlockHour = await BlockHour.find({
    entityId: shopId,
    entityType: 'Shop',
    day: new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    }),
  });

  // Check if the selected time is within a blocked hour
  const isBlocked = blockHours.some(
    (bh) =>
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) >= bh.startTime &&
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) < bh.endTime,
  );

  const isBusinessBlocked = businessBlockHour.some(
    (bh) =>
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) >= bh.startTime &&
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) < bh.endTime,
  );

  if (isBlocked || isBusinessBlocked) {
    throw new Error(
      'The selected time slot is blocked. Please choose a different time.',
    );
  }

  // Create the booking with total price and service details
  const result = await Booking.create({
    ...payload,
    shopCategoryId: shop.shopCategoryId,
    startTime: startDate,
    endTime: endDate,
    customerId,
    services: servicesWithPrices,
    paymentStatus: ENUM_PAYMENT_STATUS.PAY_ON_SHOP,
    totalPrice, // Store the total price in the booking
  });

  await Client.findByIdAndUpdate(
    shopId,
    { $inc: { payOnShopChargeDueAmount: 0.1 } },
    { new: true, runValidators: true },
  );

  return result;
};

const createOnlineBooking = async (customerId: string, payload: any) => {
  const { serviceIds, date, startTime, shopId } = payload;
  const shop = await Client.findById(shopId);
  console.log(shop);
  if (!shop) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Shop not found');
  }
  // Fetch current date for discount comparison
  const now = new Date();

  // Fetch services with their applicable prices
  const servicesWithPrices = await Promise.all(
    serviceIds.map(async (serviceId: string) => {
      const service = await Service.findById(serviceId).select('price');
      if (!service) throw new Error(`Service with ID ${serviceId} not found`);

      // Check for an active discount
      const discount = await Discount.findOne({
        shop: shopId,
        discountStartDate: { $lte: now },
        discountEndDate: { $gte: now },
        $or: [{ services: 'all-services' }, { services: service._id }],
      });

      // Calculate discount price if discount applies; otherwise, use original price
      const price = discount
        ? service.price - (service.price * discount.discountPercentage) / 100
        : service.price;

      return { serviceId: service._id, price };
    }),
  );

  // Calculate the total price of the selected services
  const totalPrice = servicesWithPrices.reduce(
    (total, service) => total + service.price,
    0,
  );

  // Calculate the total time for selected services
  const totalDuration = await calculateTotalServiceTime(serviceIds);

  // Create the start date in local time
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const startDate = new Date(date);
  startDate.setHours(startHours, startMinutes, 0);

  // Create the end date based on total duration
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + totalDuration);

  // Check for conflicting bookings
  const existingBookings = await Booking.find({
    staffId: payload.staffId,
    $or: [
      { startTime: { $lt: endDate }, endTime: { $gt: startDate } }, // Overlapping existing booking
    ],
  });
  //!TODO: need to check operation
  if (existingBookings.length < 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      'The selected time slot is conflict with other booking. Please choose a different time.3333',
    );
  }

  // Fetch blocked hours for the staff and shop
  const blockHours = await BlockHour.find({
    entityId: payload.staffId,
    entityType: 'Staff',
    day: new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    }),
  });

  const businessBlockHour = await BlockHour.find({
    entityId: shopId,
    entityType: 'Shop',
    day: new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    }),
  });

  // Check if the selected time is within a blocked hour
  const isBlocked = blockHours.some(
    (bh) =>
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) >= bh.startTime &&
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) < bh.endTime,
  );

  const isBusinessBlocked = businessBlockHour.some(
    (bh) =>
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) >= bh.startTime &&
      startDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }) < bh.endTime,
  );

  if (isBlocked || isBusinessBlocked) {
    throw new Error(
      'The selected time slot is blocked. Please choose a different time.',
    );
  }

  // Create the booking with total price and service details
  const result = await Booking.create({
    ...payload,
    shopCategoryId: shop.shopCategoryId,
    startTime: startDate,
    endTime: endDate,
    customerId,
    services: servicesWithPrices,
    paymentStatus: ENUM_PAYMENT_STATUS.PENDING,
    totalPrice, // Store the total price in the booking
  });

  // Step 2: Calculate the admin fee (5%)
  //   const amount = totalPrice;
  //   const adminFee = Math.round(totalPrice * 0.05); // 5% of the amount
  //   const connectedAccountAmount = totalPrice - adminFee; // 95% for the connected account
  //   if (adminFee >= amount) {
  //     throw new Error("Admin fee cannot be greater than or equal to the total amount.");
  // }

  // Step 3: Create a Payment Intent with destination (connected account) and application fee (admin)
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount, // Total amount (in cents)
  //   currency: 'eur', // EUR currency
  //   application_fee_amount: adminFee, // Admin's 5% fee
  //   // payment_method_types: ['card', 'google_pay', 'apple_pay'], // Supported payment methods
  //   payment_method_types: ['card'], // Supported payment methods
  //   transfer_data: {
  //     destination: shop.stripeAccountId, // The connected account to receive the payment
  //   },
  //   // confirm: true, // Automatically confirm the payment
  //   metadata: {
  //     shopId: payload.shopId, // Pass the profile id in metadata for reference
  //     bookingId: result._id.toString(),
  //   },
  // });







  //=============================

  console.log('client accoutid', shop.stripAccountId);
  const amount = totalPrice;
  const amountInCents = totalPrice * 100;
  const adminFee = Math.round(totalPrice * 0.05); // 5% of the amount
  const connectedAccountAmount = totalPrice - adminFee; // 95% for the connected account
  if (adminFee >= amount) {
    throw new Error(
      'Admin fee cannot be greater than or equal to the total amount.',
    );
  }
  // Create the payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: amountInCents * 0.2,
    transfer_data: {
      destination: shop.stripAccountId as string,
    },
    on_behalf_of: shop.stripAccountId as string,
  });


  // -------------------------------------

  console.log('Payment Intent created:', paymentIntent.id);
  return paymentIntent.client_secret;
};

const createBooking = async (customerId: string, payload: any) => {
  let result;
  if (payload.bookingPaymentType === ENUM_BOOKING_PAYMENT.PAY_ON_SHOP) {
    result = await createPayOnShopBooking(customerId, payload);
  } else {
    result = await createOnlineBooking(customerId, payload);
  }

  return result;
};

const getCustomerBookings = async (
  customerId: string,
  query: Record<string, unknown>,
) => {
  const bookingQuery = new QueryBuilder(Booking.find(), query)
    .search(['customerId'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await bookingQuery.countTotal();
  const result = await bookingQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const BookingService = {
  createBooking,
  getCustomerBookings,
};

export default BookingService;
