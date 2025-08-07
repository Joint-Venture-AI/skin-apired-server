import catchAsync from '../../../shared/catchAsync';
import getFilePath from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { SkinConditionService } from './skinCondition.service';

const createSkinCondition = catchAsync(async (req, res) => {
  let image = getFilePath(req.files, 'images');

  const data = {
    ...req.body,
    image: image ? image : undefined,
  };

  const result = await SkinConditionService.createSkinCondition(data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Skin Condition created successfully',
    data: result,
  });
});

export const SkinConditionController = {
  createSkinCondition,
};
