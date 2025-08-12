import { StatusCodes } from 'http-status-codes';
import { IPushNotification } from './pushNotification.interface';
import ApiError from '../../../errors/ApiError';
import { PushNotification } from './pushNotification.model';
import { sendPushNotification } from '../../../shared/firebase';
import { User } from '../user/user.model';

const sendNotifications = async (payload: IPushNotification) => {
  const { title, body, userId } = payload;

  try {
    // Validate request data
    if (!title || !body || !userId) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Missing required fields: ${title} ${body} ${userId} `
      );
    }

    // Find the user by ID and ensure they have an FCM token
    const user = await User.findOne({
      _id: userId,
      fcmToken: { $exists: true, $ne: null },
    }).select('fcmToken');

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'No user with a valid FCM token found.'
      );
    }

    const token: any = user.fcmToken;

    // Send push notification
    const notification = await sendPushNotification([token], {
      title,
      body,
    });

    // Save log into PushNotification collection
    await PushNotification.create({
      title,
      body,
      tokens: [token],
      userId,
      status: notification.error ? 'failed' : 'sent',
    });

    return notification;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

// const sendNotifications = async (payload: IPushNotification) => {
//   const { title, body, data, userId } = payload;

//   try {
//     // Validate request data
//     if (!title || !body || !userId) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         `Missing required fields: ${title} ${body} ${userId} ${data}`
//       );
//     }

//     // Fetch users with valid fcmToken
//     const usersWithTokens = await User.find({
//       fcmToken: { $exists: true, $ne: null },
//     });

//     if (!usersWithTokens.length) {
//       throw new ApiError(
//         StatusCodes.NOT_FOUND,
//         'No users with valid FCM tokens found.'
//       );
//     }

//     // Extract tokens
//     const tokens: any = usersWithTokens?.map((user: any) => user.fcmToken);

//     // Send push notification
//     const notification = await sendPushNotification(tokens, {
//       title,
//       body,
//       data,
//     });

//     console.log(notification);

//     // Log results into PushNotification collection
//     const result = await PushNotification.create({
//       title,
//       body,
//       tokens,
//       data,
//       userId,
//       status: notification.error ? 'failed' : 'sent',
//     });

//     return notification;
//   } catch (error) {
//     // Error handling
//     console.error('Error sending push notification:', error);
//     throw error;
//   }
// };

export const PushNotificationService = {
  sendNotifications,
};
