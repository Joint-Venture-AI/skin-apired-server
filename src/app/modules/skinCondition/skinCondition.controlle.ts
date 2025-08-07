import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import getFilePath, { getFilePathMultiple } from '../../../shared/getFilePath';
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
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Skin Condition created successfully',
    data: result,
  });
});

const updateSkinCondition = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  const result = await SkinConditionService.updateSkinCondition(
    req.params.id,
    value
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Skin Condition updated successfully',
    data: result,
  });
});

export const SkinConditionController = {
  createSkinCondition,
  updateSkinCondition,
};
