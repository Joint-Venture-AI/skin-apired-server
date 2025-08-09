import { Types } from 'mongoose';

export type IProgress = {
  user: Types.ObjectId;
  image: string;
  type: string;
  date: string;
};
