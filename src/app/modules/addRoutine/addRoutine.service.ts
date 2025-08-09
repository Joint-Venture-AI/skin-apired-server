import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAddRoutine } from './addRoutine.interface';
import { AddRoutine } from './addRoutine.model';
import { Product } from '../product/product.model';

const addRoutine = async (payload: IAddRoutine) => {
  const isExistProduct = await Product.findOne({
    _id: payload.product,
  });

  if (!isExistProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found');
  }

  const isExistRoute = await AddRoutine.findOne({
    startDate: payload.startDate,
    endDate: payload.endDate,
  });
  if (isExistRoute) {
    throw new Error(
      `Routine already exist for this date ${isExistRoute.startDate} and ${isExistRoute.endDate} `
    );
  }

  const newAddRoutine = await AddRoutine.create(payload);
  return newAddRoutine;
};

export const AddRoutineService = {
  addRoutine,
};
