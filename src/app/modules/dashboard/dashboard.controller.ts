import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getDashboardStatistics = catchAsync(async (req, res) => {
  const result = await DashboardService.getDashboardStatistics();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getDashboardStatistics,
};
