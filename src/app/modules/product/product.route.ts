import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ProductValidation.createProductSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return ProductController.createProduct(req, res, next);
  }
);

export const ProductRoutes = router;
