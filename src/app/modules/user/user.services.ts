/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { ICustomer } from '../customer/customer.interface';
import Customer from '../customer/customer.model';
import { USER_ROLE } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { IRider } from '../rider/rider.interface';
import Rider from '../rider/rider.model';
import { IVendor } from '../vendor/vendor.interface';
import Vendor from '../vendor/vendor.model';

const registerCustomer = async (password: string, customerData: ICustomer) => {
  const user = await User.isUserExists(customerData?.email);
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user already exists');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userData: Partial<TUser> = {
      email: customerData?.email,
      password: password,
      role: USER_ROLE.customer,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.create([userData], { session });

    const customer = await Customer.create([customerData], { session });

    await session.commitTransaction();
    session.endSession();

    return customer[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// register rider
const registerRider = async (password: string, riderData: IRider) => {
  const rider = await User.isUserExists(riderData?.email);
  if (rider) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user already exists');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userData: Partial<TUser> = {
      email: riderData?.email,
      password: password,
      role: USER_ROLE.rider,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.create([userData], { session });

    const rider = await Rider.create([riderData], { session });

    await session.commitTransaction();
    session.endSession();

    return rider[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// register vendor
const registerVendor = async (password: string, vendorData: IVendor) => {
  const rider = await User.isUserExists(vendorData?.email);
  if (rider) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user already exists');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userData: Partial<TUser> = {
      email: vendorData?.email,
      password: password,
      role: USER_ROLE.vendor,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.create([userData], { session });

    const vendor = await Vendor.create([vendorData], { session });

    await session.commitTransaction();
    session.endSession();

    return vendor[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const userServices = {
  registerCustomer,
  registerRider,
  registerVendor,
};

export default userServices;
