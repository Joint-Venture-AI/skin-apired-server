import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { SkinCondition } from '../skinCondition/skinCondition.model';
import { IProduct, UpdateProductPayload } from './product.interface';
import { Product } from './product.model';
import unlinkFile from '../../../shared/unlinkFile';

const createProduct = async (data: IProduct) => {
  const isExistSkinCondition = await SkinCondition.findById(data.skinCondition);
  if (!isExistSkinCondition) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Skin Condition not found');
  }

  const product = await Product.create(data);
  return product;
};

const updateProduct = async (id: string, payload: UpdateProductPayload) => {
  const isExistProducts = await Product.findById(id);

  if (!isExistProducts) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
  }

  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image);
    }

    isExistProducts.image = isExistProducts.image.filter(
      (img: string) => !payload.imagesToDelete!.includes(img)
    );
  }

  const updatedImages = payload.image
    ? [...isExistProducts.image, ...payload.image]
    : isExistProducts.image;

  const updateData = {
    ...payload,
    image: updatedImages,
  };

  const result = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getDetails = async (id: string) => {
  const isExist = await Product.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const result = await Product.findById(id).populate('skinCondition');
  return result;
};

const getAllProduct = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ productName: { $regex: searchTerm, $options: 'i' } }],
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

  const result = await Product.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Product.countDocuments(whereConditions);

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

const getRecommendedProducts = async (
  id: string,
  query: Record<string, unknown>
) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  anyConditions.push({ skinCondition: id });

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

  const result = await Product.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Product.countDocuments({ skinCondition: id });

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

const getRelevantProducts = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ ingredients: searchTerm }],
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

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Product.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Product.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

export const ProductService = {
  createProduct,
  updateProduct,
  getDetails,
  getAllProduct,
  getRecommendedProducts,
  getRelevantProducts,
};
