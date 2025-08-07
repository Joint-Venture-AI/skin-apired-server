import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    ingredients: { type: String, required: true },
    image: { type: [String], required: true },
    howToUse: { type: [String], required: true },
    skinCondition: {
      type: Schema.Types.ObjectId,
      ref: 'SkinCondition',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>('Product', productSchema);
