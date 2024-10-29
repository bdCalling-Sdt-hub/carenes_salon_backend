import { model, Schema, models } from 'mongoose';
import { IClient } from './client.interface';
import { ILocation } from '../customer/customer.interface';

const locationSchema = new Schema<ILocation>({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const clientSchema = new Schema<IClient>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  shopCategoryId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"ShopCategory"
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender:{
    type:String,
    required:true
  },
  dateOfBirth:{
    type:Date,
    required:true
  },
  shopName:{
    type:String,
    required:true
  },
  shopCategory: { type: String, required: true },
  shopGenderCategory: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  shopImages: {
    type: [String],
  },

  location: {
    type: locationSchema,
    required: true,
    index: '2dsphere',
  },
  profile_image: { type: String, default: '' },
  bankName: { type: String, required: true },
  bankAccountName: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  branchCode: { type: String, required: true },
  bankCity: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  totalRatingCount: {
    type: Number,
    default: 0,
  },
  isDeleted: { type: Boolean, default: false },
});

const Client = models.Client || model('Client', clientSchema);

export default Client;
