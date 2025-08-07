import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createProduct = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    data.image = image[0];
  }

  const result = await ProductService.createProduct(data);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product created successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
};
