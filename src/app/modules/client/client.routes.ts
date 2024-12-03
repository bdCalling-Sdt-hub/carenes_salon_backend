import { NextFunction, Request, Response, Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';

import { uploadFile } from '../../helper/fileUploader';
import { USER_ROLE } from '../user/user.constant';
import ClientValidations from './client.validation';
import ClientController from './client.controller';
import simpleAuth from '../../middlewares/simpleAuth';
import authWithoutActive from '../../middlewares/authWithoutActive';

const router = Router();

router.patch(
  '/update',
  authWithoutActive(USER_ROLE.client),
  uploadFile(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  // validateRequest(ClientValidations.updateClientProfileValidationSchema),
  ClientController.updateClientProfile,
);

router.post(
  '/add-shop-details',
  authWithoutActive(USER_ROLE.client),
  uploadFile(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ClientValidations.addShopDetailsValidationSchema),
  ClientController.addShopDetails,
);

router.post(
  '/add-bank-details',
  authWithoutActive(USER_ROLE.client),
  validateRequest(ClientValidations.addBankDetailsValidationSchema),
  ClientController.addBankDetails,
);

router.patch(
  '/update-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  ClientController.updateClientStatus,
);

router.get(
  '/get-all-client',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  ClientController.getAllClient,
);
router.get(
  '/get-nearby-shop',
  simpleAuth,
  validateRequest(ClientValidations.getNearbyShopValidationSchema),
  ClientController.getNearbyShop,
);
router.get(
  '/get-shop-details/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  ClientController.getShopDetails,
);
router.get('/single-shop/:id', ClientController.getSingleShop);
router.get(
  '/pay-on-shop-data',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ClientController.getPayOnShopData,
);
router.post(
  '/pay-admin-fee',
  auth(USER_ROLE.client),
  ClientController.payAdminFee,
);
router.post(
  '/notify-all-shops',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ClientController.notifyAllShopsForAdminFee,
);
router.post(
  '/notify-single-shop/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ClientController.notifySingleShopsForAdminFee,
);
export const clientRoutes = router;
