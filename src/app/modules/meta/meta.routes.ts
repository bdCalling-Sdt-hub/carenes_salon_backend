import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import metaController from './meta.controller';

const router = express.Router();
router.get("/get-meta-data",auth(USER_ROLE.admin,USER_ROLE.superAdmin),metaController.getDashboardMetaData);
router.get(
  '/get-income-chart-data',
  auth(USER_ROLE.superAdmin),
  metaController.getAreaChartDataForIncome,
);
router.get(
  '/get-sales-chart-data',
  auth(USER_ROLE.admin),
  metaController.getAreaChartDataForSales,
);

export const metaRoutes = router;
