import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import customerServices from './customer.services';

const getAllCustomer = catchAsync(async (req, res) => {
  const result = await customerServices.getAllCustomer(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Costumer register successfully',
    data: result,
  });
});

const customerController = {
  getAllCustomer,
};

export default customerController;
