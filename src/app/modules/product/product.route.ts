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

router.patch(
  '/update/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler,
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return ProductController.updateProduct(req, res, next);
    }

    if (data) {
      const parsedData = ProductValidation.updateProductSchema.parse(
        JSON.parse(data)
      );

      req.body = { ...parsedData, imagesToDelete };
    }

    return ProductController.updateProduct(req, res, next);
  }
);

router.get(
  '/details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ProductController.getDetails
);

router.get(
  '/get-all',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ProductController.getAllProduct
);

router.get(
  '/get-recommended/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ProductController.getRecommendedProducts
);

export const ProductRoutes = router;
