import { Types } from 'mongoose';

export type IPersonalisation = {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  image: string;
  type: string;
  skinLevel: string;
};
