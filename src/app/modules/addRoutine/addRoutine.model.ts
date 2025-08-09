import { model, Schema } from 'mongoose';
import { IAddRoutine } from './addRoutine.interface';

const routeSchema = new Schema<IAddRoutine>(
  {
    category: { type: String, required: true },
    endDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    order: { type: Number, required: true },
    timeOfDay: [{ type: String, required: true }],
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    additionalIntroduction: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const AddRoutine = model<IAddRoutine>('AddRoutine', routeSchema);
