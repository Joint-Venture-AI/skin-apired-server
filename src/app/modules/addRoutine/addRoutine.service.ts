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

  const filter = {
    user,
    status: { $ne: 'completed' },
  };

  const result = await AddRoutine.find(filter)
    .select('category product')
    .populate({
      path: 'product',
      select: 'productName -_id',
    })
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

const getAllRoutine = async (user: string, query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    // @ts-ignore
    const searchDate = new Date(searchTerm);

    if (!isNaN(searchDate.getTime())) {
      // Date search
      anyConditions.push({
        $or: [{ startDate: searchDate }, { endDate: searchDate }],
      });
    } else {
      // String search fallback
      anyConditions.push({
        $or: [{ someStringField: { $regex: searchTerm, $options: 'i' } }],
      });
    }
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  anyConditions.push({ user });
  anyConditions.push({ status: { $ne: 'completed' } });

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await AddRoutine.find(whereConditions)
    .populate({
      path: 'product',
      //   select: 'productName -_id',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await AddRoutine.countDocuments(whereConditions);
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

const chanageStatus = async (id: string) => {
  const result = await AddRoutine.findOneAndUpdate(
    { _id: id },
    { status: 'completed' },
    { new: true }
  );
  return result;
};

export const AddRoutineService = {
  addRoutine,
  getRoutineInHome,
  getAllRoutine,
  chanageStatus,
};
