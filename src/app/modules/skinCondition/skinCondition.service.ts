import { ISkinCondition } from './skinCondition.interface';
import { SkinCondition } from './skinCondition.model';

const createSkinCondition = async (data: ISkinCondition) => {
  const skinCondition = await SkinCondition.create(data);
  return skinCondition;
};

export const SkinConditionService = {
  createSkinCondition,
};
