import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import shopBookmarkController from './product.bookmark.controller';

const router = express.Router();

router.post(
  '/create-shop-bookmark',
  auth(USER_ROLE.customer),
  shopBookmarkController.createBookmark,
);
router.get(
  '/my-bookmark-shops',
  auth(USER_ROLE.customer),
  shopBookmarkController.getMyBookmark,
);
router.delete(
  '/delete-bookmark-shop/:id',
  auth(USER_ROLE.customer),
  shopBookmarkController.deleteBookmark,
);

export const shopBookmarkRoutes = router;
