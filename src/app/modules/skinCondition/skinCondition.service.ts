import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISkinCondition } from './skinCondition.interface';
import { SkinCondition } from './skinCondition.model';
import unlinkFile from '../../../shared/unlinkFile';
import { SortOrder } from 'mongoose';

const createSkinCondition = async (data: ISkinCondition) => {
  const skinCondition = await SkinCondition.create(data);
  return skinCondition;
};

const updateSkinCondition = async (
  id: string,
  data: Partial<ISkinCondition>
) => {
  const isExists = await SkinCondition.findById(id);
  if (!isExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Skin Condition not found');
  }

  if (isExists.image && data.image) {
    unlinkFile(isExists.image);
  }

  const updatedSkinCondition = await SkinCondition.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedSkinCondition;
};

const getDetailsSkinCondition = async (id: string) => {
  const isExist = await SkinCondition.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Skin Condition not found');
  }

  const result = await SkinCondition.findById(id);
  return result;
};

const getAllSkinCondition = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ skinType: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await SkinCondition.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await SkinCondition.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const SkinConditionService = {
  createSkinCondition,
  updateSkinCondition,
  getDetailsSkinCondition,
  getAllSkinCondition,
};
