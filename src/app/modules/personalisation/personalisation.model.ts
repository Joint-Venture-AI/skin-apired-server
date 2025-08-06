import { model, Schema, Types } from 'mongoose';
import { IPersonalisation } from './personalisation.interface';

const personalisationSchema = new Schema<IPersonalisation>(
  {
    dateOfBirth: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    image: { type: String, required: false },
    skinLevel: { type: String, required: false },
    type: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Personalisation = model<IPersonalisation>(
  'Personalisation',
  personalisationSchema
);
