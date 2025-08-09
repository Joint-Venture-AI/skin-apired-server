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
    user: payload.user,
  });
  if (isExistRoute) {
    throw new Error(
      `Routine already exist for this date ${isExistRoute.startDate} and ${isExistRoute.endDate} `
    );
  }

  const newAddRoutine = await AddRoutine.create(payload);
  return newAddRoutine;
};

const getRoutineInHome = async (
  user: string,
  query: Record<string, unknown>
) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const filter = { user };

  const result = await AddRoutine.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await AddRoutine.countDocuments(filter);
  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const AddRoutineService = {
  addRoutine,
  getRoutineInHome,
};
