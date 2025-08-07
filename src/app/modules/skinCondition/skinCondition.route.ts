import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { SkinConditionValidation } from './skinCondition.validation';
import { SkinConditionController } from './skinCondition.controlle';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = SkinConditionValidation.createSkinConditionZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return SkinConditionController.createSkinCondition(req, res, next);
  }
);

router.patch(
  '/update/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = SkinConditionValidation.updateSkinConditionZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return SkinConditionController.updateSkinCondition(req, res, next);
  }
);

router.get(
  '/details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  SkinConditionController.getDetailsSkinCondition
);

router.get(
  '/get-all',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  SkinConditionController.getAllSkinCondition
);

export const SkinConditionRoutes = router;
