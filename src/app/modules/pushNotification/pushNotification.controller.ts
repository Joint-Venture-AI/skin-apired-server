import { PushNotificationService } from './pushNotification.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const sendNotification = catchAsync(async (req, res) => {
  const result = await PushNotificationService.sendNotifications(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Notification sent successfully',
    data: result,
  });
});

export const PushNotificationController = {
  sendNotification,
};
