import { Types } from 'mongoose';

export type IPushNotification = {
  title: string;
  body: string;
  tokens: string[];
  userId: Types.ObjectId;
  status: 'sent' | 'failed' | 'pending';
  data?: Record<string, string>;
};
