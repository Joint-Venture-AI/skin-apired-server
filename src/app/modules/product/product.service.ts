import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { SkinCondition } from '../skinCondition/skinCondition.model';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProduct = async (data: IProduct) => {
  const isExistSkinCondition = await SkinCondition.findById(data.skinCondition);
  if (!isExistSkinCondition) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Skin Condition not found');
  }

  const product = await Product.create(data);
  return product;
};

export const ProductService = {
  createProduct,
};
