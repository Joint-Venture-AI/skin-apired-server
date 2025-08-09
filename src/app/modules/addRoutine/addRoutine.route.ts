import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AddRoutineController } from './addRoutine.controller';

const router = express.Router();

router.post('/add', auth(USER_ROLES.USER), AddRoutineController.addRoute);

export const AddRoutineRoutes = router;
