import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import productValidations from './product.validation';
import productController from './product.controller';
import { uploadFile } from '../../helper/fileUploader';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  uploadFile(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(productValidations.createProductValidationSchema),
  productController.createProduct,
);

router.get(
  '/all-products',
  auth(
    USER_ROLE.customer,
    USER_ROLE.client,
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
  ),
  productController.getAllProduct,
);
router.get(
  '/shop-products',
  auth(USER_ROLE.customer),
  productController.getSpecificShopProducts,
);
router.get(
  '/single-product/:id',
  auth(
    USER_ROLE.customer,
    USER_ROLE.client,
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
  ),
  productController.getSingleProduct,
);
router.patch(
  '/update-product/:id',
  auth(USER_ROLE.admin),
  uploadFile(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(productValidations.updateProductValidationSchema),
  productController.updateProduct,
);
router.delete(
  '/delete-product/:id',
  auth(USER_ROLE.admin),
  productController.deleteProduct,
);
router.patch(
  '/change-product-status/:id',
  auth(USER_ROLE.admin),
  productController.changeProductStatus,
);
router.get(
  '/my-products',
  auth(USER_ROLE.admin),
  productController.getMyProducts,
);
export const productRoutes = router;
