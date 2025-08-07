import { model, Schema } from 'mongoose';
import { ISkinCondition } from './skinCondition.interface';

const skinConditionSchema = new Schema<ISkinCondition>(
  {
    image: {
      type: String,
      required: true,
    },
    skinType: {
      type: String,
      required: true,
    },
    symptmos: {
      type: String,
      required: true,
    },
    treatment: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SkinCondition = model<ISkinCondition>(
  'SkinCondition',
  skinConditionSchema
);
