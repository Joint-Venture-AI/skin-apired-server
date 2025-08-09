import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PhotoProgessService } from './photoProgess.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createPhotoProgress = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  const result = await PhotoProgessService.createPhotoProgress(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Photo progress created successfully',
    data: result,
  });
});

export const PhotoProgessController = {
  createPhotoProgress,
};
