import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { PhotoProgessValidation } from './photoProgess.validation';
import { PhotoProgessController } from './photoProgess.controller';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = PhotoProgessValidation.parse(JSON.parse(req.body.data));
    }
    return PhotoProgessController.createPhotoProgress(req, res, next);
  }
);

router.get(
  '/get-timeline',
  auth(USER_ROLES.USER),
  PhotoProgessController.getPhotoProgressTimeLine
);

export const PhotoProgessRoutes = router;
