import { model, Schema } from 'mongoose';
import { IProgress } from './photoProgess.interface';

const photoProgessSchema = new Schema<IProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['left', 'right', 'front'],
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PhotoProgess = model<IProgress>(
  'PhotoProgess',
  photoProgessSchema
);
