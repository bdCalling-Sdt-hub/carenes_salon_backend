/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import Notification from './notification.model';
import getAdminNotificationCount from '../../helper/getAdminNotification';
import getUserNotificationCount from '../../helper/getUnseenNotification';
import { getIO } from '../../socket/socketManager';

const getAllNotificationFromDB = async (
  query: Record<string, any>,
  user: JwtPayload,
) => {
  if (user?.role === USER_ROLE.superAdmin || user.role === USER_ROLE.admin) {
    const notificationQuery = new QueryBuilder(
      Notification.find({ receiver: USER_ROLE.admin }),
      query,
    )
      .search(['name'])
      .filter()
      .sort()
      .paginate()
      .fields();
    const result = await notificationQuery.modelQuery;
    const meta = await notificationQuery.countTotal();
    const unseenNotificationCount = await Notification.countDocuments({
      receiver: USER_ROLE.admin,
      seen: false,
    });
    return { meta, result, unseenNotificationCount };
  } else {
    const notificationQuery = new QueryBuilder(
      Notification.find({ receiver: user?.profileId }),
      query,
    )
      .search(['name'])
      .filter()
      .sort()
      .paginate()
      .fields();
    const result = await notificationQuery.modelQuery;
    const meta = await notificationQuery.countTotal();
    return { meta, result };
  }
};

const seeNotification = async (user: JwtPayload) => {
  const io = getIO();
  let result;
  if (user?.role === USER_ROLE.admin || user.role === USER_ROLE.superAdmin) {
    result = await Notification.updateMany(
      { receiver: 'admin' },
      { seen: true },
      { runValidators: true, new: true },
    );
    const adminUnseenNotificationCount = await getAdminNotificationCount();
    //@ts-ignore
    // TODO : send notification
    io.emit('admin-notification', adminUnseenNotificationCount);
  }
  if (user?.role !== USER_ROLE.customer || user.role == USER_ROLE.client) {
    result = await Notification.updateMany(
      { receiver: user?.profileId },
      { seen: true },
      { runValidators: true, new: true },
    );
  }
  const updatedNotificationCount = await getUserNotificationCount(user?.userId);
  //@ts-ignore
  // TODO: send notification
  io.to(user?.userId).emit('notifications', updatedNotificationCount);
  return result;
};

const notificationService = {
  getAllNotificationFromDB,
  seeNotification,
};

export default notificationService;
