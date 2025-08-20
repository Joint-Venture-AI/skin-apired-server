import { Types } from 'mongoose';

export type IAddRoutine = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  category: string;
  startDate: Date;
  endDate: Date;
  morningOrder: number;
  morningTimeOfDay: string[];
  eveningOrder: number;
  eveningTimeOfDay: string[];
  additionalIntroduction?: string;
  status: string;
  msgStatus?: string;
};
