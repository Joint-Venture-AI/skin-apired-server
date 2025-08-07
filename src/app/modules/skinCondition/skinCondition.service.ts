import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISkinCondition } from './skinCondition.interface';
import { SkinCondition } from './skinCondition.model';
import unlinkFile from '../../../shared/unlinkFile';

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

export const SkinConditionService = {
  createSkinCondition,
  updateSkinCondition,
};
