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

const getRoutineInHome = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await AddRoutineService.getRoutineInHome(user, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Routine retrieved successfully',
    data: result,
  });
});

const getAllRoutine = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await AddRoutineService.getAllRoutine(user, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Routine retrieved successfully',
    data: result,
  });
});

const chanageStatus = catchAsync(async (req, res) => {
  const result = await AddRoutineService.chanageStatus(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Routine status changed successfully',
    data: result,
  });
});

export const AddRoutineController = {
  addRoute,
  getRoutineInHome,
  getAllRoutine,
  chanageStatus,
};
