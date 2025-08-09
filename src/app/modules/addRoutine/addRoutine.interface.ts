import { Types } from 'mongoose';

export type IAddRoutine = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  category: string;
  startDate: Date;
  endDate: Date;
  order: number;
  timeOfDay: string[];
  additionalIntroduction?: string;
};
