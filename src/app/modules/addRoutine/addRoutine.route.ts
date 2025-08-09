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

export const AddRoutineRoutes = router;
