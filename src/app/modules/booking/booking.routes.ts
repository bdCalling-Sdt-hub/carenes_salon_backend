import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import BookingController from './booking.controller';
import { changeCancelRequestStatusValidationsSchema } from './booking.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-booking',
  auth(USER_ROLE.customer),
  BookingController.createBooking,
);
router.get(
  '/get-customer-bookings',
  auth(USER_ROLE.customer),
  BookingController.getCustomerBookings,
);
router.patch("/change-cancel-booking-request-status",auth(USER_ROLE.client,USER_ROLE.customer),validateRequest(changeCancelRequestStatusValidationsSchema),BookingController.changeCancelBookingRequestStatus)

router.post("/create-cancel-booking-request", auth(USER_ROLE.customer,USER_ROLE.client),BookingController.createCancelBookingRequest);
export const bookingRoutes = router;
