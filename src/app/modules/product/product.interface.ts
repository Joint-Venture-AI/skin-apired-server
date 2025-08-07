import { Types } from 'mongoose';

export type IProduct = {
  productName: string;
  ingredients: string;
  image: string[];
  howToUse: string[];
  skinCondition: Types.ObjectId;
};

export type UpdateProductPayload = Partial<IProduct> & {
  imagesToDelete?: string[];
};
