import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AddRoutineController } from './addRoutine.controller';

const router = express.Router();

router.post('/add', auth(USER_ROLES.USER), AddRoutineController.addRoute);

router.get(
  '/get-for-home',
  auth(USER_ROLES.USER),
  AddRoutineController.getRoutineInHome
);

router.get(
  '/get-all',
  auth(USER_ROLES.USER),
  AddRoutineController.getAllRoutine
);

router.patch(
  '/change-status/:id',
  auth(USER_ROLES.USER),
  AddRoutineController.chanageStatus
);

router.get(
  '/get-data-chart',
  auth(USER_ROLES.USER),
  AddRoutineController.getRoutineDataChart
);

export const AddRoutineRoutes = router;
