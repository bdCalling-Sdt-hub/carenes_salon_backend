import { NextFunction, Request, Response, Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';

import customerValidations from '../customer/customer.validation';
import auth from '../../middlewares/auth';

import customerController from './customer.controller';
import { USER_ROLE } from '../user/user.constant';
import { uploadFile } from '../../helper/fileUploader';

const router = Router();

router.patch(
  '/update',
  auth(USER_ROLE.customer),
  uploadFile(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(customerValidations.updateCustomerProfileValidationSchema),
  customerController.updateCustomerProfile,
);
router.get("/get-all",customerController.getAllCustomer);


export const customerRoutes = router;
