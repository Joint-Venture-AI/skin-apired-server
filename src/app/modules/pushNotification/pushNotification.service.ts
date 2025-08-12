import { StatusCodes } from 'http-status-codes';
import { IPushNotification } from './pushNotification.interface';
import ApiError from '../../../errors/ApiError';
import { PushNotification } from './pushNotification.model';
import { sendPushNotification } from '../../../shared/firebase';
import { User } from '../user/user.model';

// const sendNotifications = async (payload: IPushNotification) => {
//   const { title, body, userId } = payload;

//   try {
//     // Validate request data
//     if (!title || !body || !userId) {
//       throw new ApiError(
//         StatusCodes.BAD_REQUEST,
//         `Missing required fields: ${title} ${body} ${userId} `
//       );
//     }

//     // Find the user by ID and ensure they have an FCM token
//     const user = await User.findOne({
//       _id: userId,
//       fcmToken: { $exists: true, $ne: null },
//     }).select('fcmToken');

//     if (!user) {
//       throw new ApiError(
//         StatusCodes.NOT_FOUND,
//         'No user with a valid FCM token found.'
//       );
//     }

//     const token: any = user.fcmToken;

//     // Send push notification
//     const notification = await sendPushNotification([token], {
//       title,
//       body,
//     });

//     // Save log into PushNotification collection
//     await PushNotification.create({
//       title,
//       body,
//       tokens: [token],
//       userId,
//       status: notification.error ? 'failed' : 'sent',
//     });

//     return notification;
//   } catch (error) {
//     console.error('Error sending push notification:', error);
//     throw error;
//   }
// };

const sendNotifications = async (payload: IPushNotification) => {
  const { title, body } = payload;

  try {
    // ✅ Validate request data
    if (!title || !body) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Missing required fields: ${title} ${body}`
      );
    }

    // ✅ Fetch users with valid FCM tokens
    const usersWithTokens = await User.find({
      fcmToken: { $exists: true, $ne: null },
    });

    if (!usersWithTokens.length) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'No users with valid FCM tokens found.'
      );
    }

    let results: any[] = [];

    // ✅ Loop through each user and send individually
    for (const user of usersWithTokens) {
      const token: any = user.fcmToken;

      // Send push notification to this user
      const notification = await sendPushNotification([token], { title, body });

      // Save to DB individually
      const savedNotification = await PushNotification.create({
        title,
        body,
        tokens: [token],
        userId: user._id, // only one user ID
        status: notification.error ? 'failed' : 'sent',
      });

      results.push({
        userId: user._id,
        token,
        status: savedNotification.status,
      });
    }

    return results;
  } catch (error) {
    console.error('Error sending push notifications:', error);
    throw error;
  }
};

export const PushNotificationService = {
  sendNotifications,
};
