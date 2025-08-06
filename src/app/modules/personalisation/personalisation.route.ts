import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { PersonalisationController } from './personalisation.controller';
import { personalisationValidation } from './personalisation.validation';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = personalisationValidation.parse(JSON.parse(req.body.data));
    }
    return PersonalisationController.createPersonalisation(req, res, next);
  }
);

export const PersonalisationRoutes = router;
