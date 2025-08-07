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
    data.image = image;
  }

  const result = await ProductService.createProduct(data);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product created successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    data.image = image;
  }

  const result = await ProductService.updateProduct(req.params.id, data);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product created successfully',
    data: result,
  });
});

const getDetails = catchAsync(async (req, res) => {
  const result = await ProductService.getDetails(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product retrived successfully',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProduct(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product retrived successfully',
    data: result,
  });
});

const getRecommendedProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getRecommendedProducts(
    req.params.id,
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product recommended retrived successfully',
    data: result,
  });
});

const getRelevantProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getRelevantProducts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product relevant retrived successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  updateProduct,
  getDetails,
  getAllProduct,
  getRecommendedProducts,
  getRelevantProducts,
};
