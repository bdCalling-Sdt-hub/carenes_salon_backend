import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import metaServices from './meta.services';


const getDashboardMetaData = catchAsync(async(req,res)=>{
  const result = await metaServices.getDashboardMetaData();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: result,
  });
})


const getAreaChartDataForIncome = catchAsync(async (req, res) => {
  const result = await metaServices.getAreaChartDataForIncomeFromDB(
    Number(req?.query?.year),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Income chart data retrieved successfully',
    data: result,
  });
});
const getAreaChartDataForSales = catchAsync(async (req, res) => {
  const result = await metaServices.getAreaChartDataForSalesFromDB(
    req?.user?.profileId,
    Number(req?.query?.year),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sales chart data retrieved successfully',
    data: result,
  });
});

const metaController = {
  getDashboardMetaData,
  getAreaChartDataForIncome,
  getAreaChartDataForSales,
};

export default metaController;
