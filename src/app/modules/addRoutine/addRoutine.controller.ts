import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AddRoutineService } from './addRoutine.service';

const addRoute = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  const result = await AddRoutineService.addRoutine(value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Routine added successfully',
    data: result,
  });
});

export const AddRoutineController = {
  addRoute,
};
