import { sendNotifications } from './../../../helpers/notificationHelper';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAddRoutine } from './addRoutine.interface';
import { AddRoutine } from './addRoutine.model';
import { Product } from '../product/product.model';
import { startOfMonth } from 'date-fns';
import mongoose from 'mongoose';
import { sendPushNotification } from '../../../shared/firebase';
import { User } from '../user/user.model';
import { IPushNotification } from '../pushNotification/pushNotification.interface';
import { PushNotificationService } from '../pushNotification/pushNotification.service';
import moment from 'moment';
import { PushNotification } from '../pushNotification/pushNotification.model';
import { logger } from '../../../shared/logger';

const addRoutine = async (payload: IAddRoutine) => {
  const isExistProduct = await Product.findOne({
    _id: payload.product,
  });

  if (!isExistProduct) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found');
  }

  const isExistRoute = await AddRoutine.findOne({
    startDate: payload.startDate,
    endDate: payload.endDate,
    user: payload.user,
  });
  if (isExistRoute) {
    throw new Error(
      `Routine already exist for this date ${isExistRoute.startDate} and ${isExistRoute.endDate} `
    );
  }

  const newAddRoutine = await AddRoutine.create(payload);
  return newAddRoutine;
};

const getRoutineInHome = async (
  user: string,
  query: Record<string, unknown>
) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const filter = {
    user,
    status: { $ne: 'completed' },
  };

  const result = await AddRoutine.find(filter)
    .select('category product')
    .populate({
      path: 'product',
      select: 'productName -_id',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await AddRoutine.countDocuments(filter);
  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

const getAllRoutine = async (user: string, query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    // @ts-ignore
    const searchDate = new Date(searchTerm);

    if (!isNaN(searchDate.getTime())) {
      // Date search
      anyConditions.push({
        $or: [{ startDate: searchDate }, { endDate: searchDate }],
      });
    } else {
      // String search fallback
      anyConditions.push({
        $or: [{ someStringField: { $regex: searchTerm, $options: 'i' } }],
      });
    }
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  anyConditions.push({ user });
  anyConditions.push({ status: { $ne: 'completed' } });

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await AddRoutine.find(whereConditions)
    .populate({
      path: 'product',
      //   select: 'productName -_id',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await AddRoutine.countDocuments(whereConditions);
  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

const chanageStatus = async (id: string) => {
  const result = await AddRoutine.findOneAndUpdate(
    { _id: id },
    { status: 'completed' },
    { new: true }
  );
  return result;
};

const getRoutineDataChart = async (user: string) => {
  const result = await AddRoutine.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(user) },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          status: '$status',
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  // Transform data for chart.js or similar
  const chartData: Record<string, any> = {};
  result.forEach(item => {
    const monthYear = `${item._id.month}-${item._id.year}`;
    if (!chartData[monthYear]) {
      chartData[monthYear] = {};
    }
    chartData[monthYear][item._id.status] = item.count;
  });

  return chartData;
};

// const sendMsgWithTimeWise = async () => {
//   try {
//     const nowUTC = moment.utc();

//     // Find routines whose startDate is in the past and still pending
//     const routines = await AddRoutine.find({
//       status: 'pending',
//       startDate: { $lte: nowUTC.toDate() },
//     }).select('startDate user');

//     if (!routines.length) {
//       return;
//     }

//     for (const routine of routines) {
//       // Get the user FCM token
//       const user = await User.findOne({
//         _id: routine.user,
//         fcmToken: { $exists: true, $ne: null },
//       }).select('fcmToken');

//       if (!user) {
//         logger.error(`No valid FCM token for user ${routine.user}`);
//         continue;
//       }

//       const token: any = user.fcmToken;

//       console.log(token);

//       // Send push notification directly
//       const notification = await sendPushNotification([token], {
//         title: 'Routine Notification',
//         body: 'Your routine starts now!',
//       });

//       // Log it into PushNotification collection
//       const res = await PushNotification.create({
//         title: 'Routine Notification',
//         body: 'Your routine starts now!',
//         tokens: [token],
//         userId: routine.user,
//         status: notification.error ? 'failed' : 'sent',
//       });

//       return notification;
//     }
//   } catch (error) {
//     console.error('Error in sendRoutineNotifications:', error);
//   }
// };

const sendMsgWithTimeWise = async () => {
  try {
    const nowUTC = moment.utc();

    // Find routines whose startDate is in the past and still pending
    const routines = await AddRoutine.find({
      status: 'pending',
      startDate: { $lte: nowUTC.toDate() },
    }).select('startDate user');

    if (!routines.length) {
      return { message: 'No pending routines to notify.' };
    }

    // Extract unique user IDs from routines
    const userIds = [
      ...new Set(routines.map(routine => routine.user.toString())),
    ];

    // Fetch all users with valid fcmTokens at once
    const users = await User.find({
      _id: { $in: userIds },
      fcmToken: { $exists: true, $ne: null },
    }).select('fcmToken');

    // Map userId -> fcmToken for quick lookup
    const userMap = new Map(users.map(u => [u._id.toString(), u.fcmToken]));

    const results = [];

    for (const routine of routines) {
      const token = userMap.get(routine.user.toString());

      if (!token) {
        logger.error(`No valid FCM token for user ${routine.user}`);
        continue;
      }

      // Send push notification directly
      const notification = await sendPushNotification([token], {
        title: 'Routine Notification',
        body: 'Your routine starts now!',
      });

      // Log it into PushNotification collection
      await PushNotification.create({
        title: 'Routine Notification',
        body: 'Your routine starts now!',
        tokens: [token],
        userId: routine.user,
        status: notification.error ? 'failed' : 'sent',
      });

      await sendNotifications({
        text: 'Routine Notification',
        body: 'Your routine starts now!',
        receiver: routine.user,
      });

      results.push({
        userId: routine.user,
        notificationStatus: notification.error ? 'failed' : 'sent',
      });
    }

    return { message: 'Notifications processed', details: results };
  } catch (error) {
    console.error('Error in sendMsgWithTimeWise:', error);
    throw error;
  }
};

export const AddRoutineService = {
  addRoutine,
  getRoutineInHome,
  getAllRoutine,
  chanageStatus,
  getRoutineDataChart,
  sendMsgWithTimeWise,
};
