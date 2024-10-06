/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import Vendor from '../vendor/vendor.model';
import { IProduct } from './product.interface';
import Product from './product.model';

const createProductIntoDB = async (userId: string, payload: IProduct) => {
  const shop = await Vendor.findOne({ user: userId }).select('_id');
  const result = await Product.create({ ...payload, shop: shop?._id });
  return result;
};

const getAllProduct = async (query: Record<string, any>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  //!TODO: need to use id and shop id both for update product
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteProductFromDB = async (id: string, profileId: string) => {
  //!TODO: need to use id and shop id both for update product
  const product = await Product.findOneAndDelete({ _id: id, shop: profileId });
  return product;
};

const changeProductStatus = async (
  id: string,
  profileId: string,
  status: string,
) => {
  const result = await Product.findOneAndUpdate(
    { _id: id, shop: profileId },
    { status: status },
    { new: true, runValidators: true },
  );
  return result;
};

const getMyProducts = async (shopId: string) => {
  const result = await Product.find({ shop: shopId });

  return result;
};

const productServices = {
  createProductIntoDB,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProductFromDB,
  changeProductStatus,
  getMyProducts,
};

export default productServices;
