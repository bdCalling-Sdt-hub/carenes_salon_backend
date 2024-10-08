import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import shopBookmarkServices from './shop.bookmark.services';

const createBookmark = catchAsync(async (req, res) => {
  const result = await shopBookmarkServices.createBookmarkIntoDB(
    req?.body?.shopId,
    req?.user?.profileId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bookmark created successfully',
    data: result,
  });
});
// get my bookmark
const getMyBookmark = catchAsync(async (req, res) => {
  const result = await shopBookmarkServices.getMyBookmarkFromDB(
    req?.user?.profileId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bookmark retrieved successfully',
    data: result,
  });
});
// delete bookmark
const deleteBookmark = catchAsync(async (req, res) => {
  const result = await shopBookmarkServices.deleteBookmarkFromDB(
    req?.params?.id,
    req?.user?.profileId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bookmark deleted successfully',
    data: result,
  });
});

const shopBookmarkController = {
  createBookmark,
  getMyBookmark,
  deleteBookmark,
};

export default shopBookmarkController;
