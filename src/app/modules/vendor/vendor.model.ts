import { model, Schema } from 'mongoose';
import { IVendor } from './vendor.interface';
import { ENUM_SHOP_TYPE } from '../../utilities/enum';

const vendorSchema = new Schema<IVendor>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    storeName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    storeLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    email: { type: String, required: true, unique: true },
    storeImage: { type: String, required: true },
    storeLicence: { type: String, required: true },
    shopType: {
      type: String,
      enum: Object.values(ENUM_SHOP_TYPE),
      required: true,
    },
    bankAccountName: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    paymentMethodPreference: { type: String, required: true },
    status: {
      type: String,
      enum: ['activate', 'deactivate'],
      default: 'deactivate',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Vendor = model<IVendor>('Vendor', vendorSchema);

export default Vendor;
