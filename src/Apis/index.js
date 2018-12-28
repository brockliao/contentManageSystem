import "babel-polyfill";
import promise from 'es6-promise';
promise.polyfill();
import config from '../utils/config';
import router from '../router'; //引入路由对象
import axios from 'axios';
import {
  getStorage,
  setStorage,
  clearStorage
} from '../utils'
import {
  Loading,
  MessageBox,
  Message
} from 'element-ui';


const baseUrl = config.baseUrl;
// const baseUrl = process.env.API_BASE_URL;

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 登陆接口 /api/TokenAuth/Authenticate
export const Authenticate = (params) => fetch(`${baseUrl}/api/TokenAuth/Authenticate`, params, 'post');

// 商户管理 
// 获取商户列表数据/Shops/GetAllMerChant
export const GetAllMerChant = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetAllMerChant`, params);
// 获取商户详情
export const GetMerChantInfo = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetMerChantInfo`, params);
// 冻结1 /取消冻结2
export const SetShopFrozen = (params) => fetch(`${baseUrl}/api/services/app/Shops/SetShopFrozen`, params, 'post');
// 隐藏1/取消隐藏2/api/services/app/Shops/ShopCancle
export const SetShopHide = (params) => fetch(`${baseUrl}/api/services/app/Shops/SetShopHide`, params, 'post')
// 注销门店/api/services/app/Shops/ShopCancle
export const ShopCancle = (params) => fetch(`${baseUrl}/api/services/app/Shops/ShopCancle`, params, 'post')
// 修改商户信息api/services/app/Shops/ModifyMerChantsInfo
export const ModifyMerChantsInfo = (params) => fetch(`${baseUrl}/api/services/app/Shops/ModifyMerChantsInfo`, params, 'post');
// 修改业务员绑定 /api/services/app/Shops/ModifyMerChantServiciProvide
export const ModifyMerChantServiciProvide = (params) => fetch(`${baseUrl}/api/services/app/Shops/ModifyMerChantServiciProvide`, params, 'post');
// 商户导出 /api/services/app/Shops/GetAllMerChantToExcel
export const GetAllMerChantToExcel = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetAllMerChantToExcel`, params);
// 获取服务商名称 /api/services/app/Shops/GetServiciProvideName
export const GetServiciProvideName = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetServiciProvideName`, params);
// 获取业务员名称 /api/services/app/Shops/GetSaleManName
export const GetSaleManName = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetSaleManName`, params);
// 修改商户奖励金设置 /api/services/app/Shops/ModifyMerChantsRewardConfig
export const ModifyMerChantsRewardConfig = (params) => fetch(`${baseUrl}/api/services/app/Shops/ModifyMerChantsRewardConfig`, params, 'post');


// 门店审核
// 获取门店审核列表 api/services/app/Shops/GetAuditList
export const GetAuditList = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetAuditList`, params);
// 获取门店审核详情 /api/services/app/Shops/GetShopAuditDetail
export const GetShopAuditDetail = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetShopAuditDetail`, params);
// 门店审核操作api/services/app/Shops/AuditShop
export const AuditShop = (params) => fetch(`${baseUrl}/api/services/app/Shops/AuditShop`, params, 'post');
// 门店导出 /api/services/app/Shops/GetAuditListToExcel
export const GetAuditListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetAuditListToExcel`, params);

// /api/services/app/Shops/GetShopTrialList 门店试用管理
export const GetShopTrialList = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetShopTrialList`, params);
// AddOrUpdateShopTrial 开通门店试用
export const AddOrUpdateShopTrial = (params) => fetch(`${baseUrl}/api/services/app/Shops/AddOrUpdateShopTrial`, params, 'post');
// /api/services/app/Shops/GetShopTrialInfo 获取门店试用设置
export const GetShopTrialInfo = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetShopTrialInfo`, params);
// /api/services/app/Shops/GetShopTrialListToExcel
export const GetShopTrialListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetShopTrialListToExcel`, params);
//  门店试用记录 /api/services/app/Shops/GetShopTrialRecording
export const GetShopTrialRecording = (params) => fetch(`${baseUrl}/api/services/app/Shops/GetShopTrialRecording`, params);

// 未结算奖励金列表 /api/services/app/Reward/GetRewardUnreportedList
export const GetRewardUnreportedList = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardUnreportedList`, params);
// 未结算导出 /api/services/app/Reward/GetRewardUnreportedListToExcel
export const GetRewardUnreportedListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardUnreportedListToExcel`, params);
// 线下充值明细 /api/services/app/Reward/GetRewardDetail
export const GetRewardDetail = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardDetail`, params);
// /api/services/app/Reward/GetRewardDetailToExcel
export const GetRewardDetailToExcel = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardDetailToExcel`, params);
// 获取奖励金初审列表 /api/services/app/Reward/GetRewardRecordedList
export const GetRewardRecordedList = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardRecordedList`, params);
// 奖励金初审导出  /api/services/app/Reward/GetRewardRecordedListToExcel
export const GetRewardRecordedListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardRecordedListToExcel`, params);
//  奖励金结算初审 /api/services/app/Reward/AuditReward
export const AuditReward = (params) => fetch(`${baseUrl}/api/services/app/Reward/AuditReward`, params, 'post');
//是否可提现设置 /api/services/app/Reward/SetDealIsReward
export const SetDealIsReward = (params) => fetch(`${baseUrl}/api/services/app/Reward/SetDealIsReward`, params, 'post');
//  获取奖励金提现审核列表 /api/services/app/Reward/GetWithdrawCheckList
export const GetWithdrawCheckList = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetWithdrawCheckList`, params);
//  获取奖励金提现审核列表导出 /api/services/app/Reward/GetWithdrawCheckListToExcel
export const GetWithdrawCheckListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetWithdrawCheckListToExcel`, params);
// 获取奖励金提现/财务转账 详情 /api/services/app/Reward/GetWithdrawCheckDetails
export const GetWithdrawCheckDetails = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetWithdrawCheckDetails`, params);
// 奖励金提现审核 /api/services/app/Reward/AuditWithdraw
export const AuditWithdraw = (params) => fetch(`${baseUrl}/api/services/app/Reward/AuditWithdraw`, params, 'post');
//获取财务转账列表 /api/services/app/Reward/GetWithdrawUntransList
export const GetWithdrawUntransList = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetWithdrawUntransList`, params);
//  奖励金财务转账导出 /api/services/app/Reward/GetWithdrawUntransListToExcel
export const GetWithdrawUntransListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetWithdrawUntransListToExcel`, params);
// 奖励金转账审核 /api/services/app/Reward/AuditTransWithdraw
export const AuditTransWithdraw = (params) => fetch(`${baseUrl}/api/services/app/Reward/AuditTransWithdraw`, params, 'post');
//奖励金统计 /api/services/app/Reward/GetRewardStatList
export const GetRewardStatList = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardStatList`, params);
//奖励金统计导出 /api/services/app/Reward/GetRewardStatListToExcel
export const GetRewardStatListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Reward/GetRewardStatListToExcel`, params);





// 支付结算 
// 支付平台管理 获取数据列表 /api/services/app/Merchants/GetAllPayInfoList
export const GetAllPayInfoList = (params) => fetch(`${baseUrl}/api/services/app/Merchants/GetAllPayInfoList`, params);
// 支付平台详情 /api/services/app/Merchants/GetMerchantPayInfoDetail 
export const GetMerchantPayInfoDetail = (params) => fetch(`${baseUrl}/api/services/app/Merchants/GetMerchantPayInfoDetail`, params);
// 审核重置商户资料 AuditMerchantPayInfo post
export const AuditMerchantPayInfo = (params) => fetch(`${baseUrl}/api/services/app/Merchants/AuditMerchantPayInfo`, params, 'post');
// 服务平台激活ActivePay post
export const ActivePay = (params) => fetch(`${baseUrl}/api/services/app/Merchants/ActivePay`, params, 'post');
// 信息补录EnteringRecord post
export const EnteringRecord = (params) => fetch(`${baseUrl}/api/services/app/Merchants/EnteringRecord`, params, 'post');
// 支付平台结算查询 
export const platformSettedSearchGetAll = (params) => fetch(`${baseUrl}/api/services/app/OnlineDeals/GetAll`, params);
// 结算资料列表/api/services/app/Merchants/GetAllSettleList
export const GetAllSettleList = (params) => fetch(`${baseUrl}/api/services/app/Merchants/GetAllSettleList`, params);
// 结算资料详情/api/services/app/Merchants/GetSettleDetail
export const GetSettleDetail = (params) => fetch(`${baseUrl}/api/services/app/Merchants/GetSettleDetail`, params);
// 结算资料导出 /api/services/app/Merchants/GetAllSettleListToExcel
export const GetAllSettleListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Merchants/GetAllSettleListToExcel`, params);
// 支付平台导出/api/services/app/Merchants/GetAllPayInfoListToExcel
export const GetAllPayInfoListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Merchants/GetAllPayInfoListToExcel`, params);
// 线下交易订单查询  /api/services/app/OnlineDeals/GetAllDealList
export const GetAllDealList = (params) => fetch(`${baseUrl}/api/services/app/OnlineDeals/GetAllDealList`, params);
// 线下交易订单导出 /api/services/app/OnlineDeals/GetAllDealListToExcle
export const GetAllDealListToExcle = (params) => fetch(`${baseUrl}/api/services/app/OnlineDeals/GetAllDealListToExcle`, params);
// 获取退款信息 /api/services/app/OnlineDeals/GetDealCancel
export const GetDealCancel = (params) => fetch(`${baseUrl}/api/services/app/OnlineDeals/GetDealCancel`, params);






// 服务商 
// 服务商列表获取
export const GetAllServiceProvider = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/GetAllServiceProvider`, params);
// 新增或更新服务商 api/services/app/ServiceProvider/CreateOrEditServiceProvider
export const CreateOrEditServiceProvider = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/CreateOrEditServiceProvider`, params, 'post');
// 获取服务商编辑信息
export const GetServiceProviderForEdit = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/GetServiceProviderForEdit`, params);
// 获取服务商详情
export const GetServiceProviderDetail = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/GetServiceProviderDetail`, params);
// 获取城市服务商/api/services/app/ServiceProvider/GetParentServiceProvider
export const GetParentServiceProvider = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/GetParentServiceProvider`, params);
// 获取城市服务商区域 /api/services/app/ServiceProvider/GetParentServiceArea
export const GetParentServiceArea = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/GetParentServiceArea`, params);
// 服务商导出 /api/services/app/ServiceProvider/GetServiceProvidersToExcel
export const GetServiceProvidersToExcel = (params) => fetch(`${baseUrl}/api/services/app/ServiceProvider/GetServiceProvidersToExcel`, params);
// /api/services/app/Finance/GetUnrecordedList 获取未出账佣金列表
export const GetUnrecordedList = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetUnrecordedList`, params);
// /api/services/app/Finance/GetUnrecordeDetails 未出账佣金详情
export const GetUnrecordeDetails = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetUnrecordeDetails`, params);
// /api/services/app/Finance/GetCommissionListByType 获取佣金分润明细
export const GetCommissionListByType = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetCommissionListByType`, params);
// 佣金初审列表
export const GetRecordedList = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetRecordedList`, params);
// 佣金初审详情/api/services/app/Finance/GetRecordeDetails
export const GetRecordeDetails = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetRecordeDetails`, params);
// 设置结算/api/services/app/Finance/SetSettlementStatus
export const SetSettlementStatus = (params) => fetch(`${baseUrl}/api/services/app/Finance/SetSettlementStatus`, params, 'post');
// 佣金初审 /api/services/app/Finance/FirstTrialCommission
export const FirstTrialCommission = (params) => fetch(`${baseUrl}/api/services/app/Finance/FirstTrialCommission`, params, 'post');
// 财务转账 列表
export const GetTransferRecordedList = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetTransferRecordedList`, params);
// 财务转账 详情
export const GetTransferRecordeDetails = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetTransferRecordeDetails`, params);
// 更改转账
export const AddTransfer = (params) => fetch(`${baseUrl}/api/services/app/Finance/AddTransfer`, params, 'post');
// 已结算列表  /api/services/app/Finance/GetSettledRecordedList
export const GetSettledRecordedList = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetSettledRecordedList`, params);
// 已结算详情 
export const GetSettledRecordeDetails = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetSettledRecordeDetails`, params);
// 佣金结算统计 
export const GetSettledCommissionList = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetSettledCommissionList`, params);
// 未出账导出 /api/services/app/Finance/GetUnrecordedListToExcel
export const GetUnrecordedListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetUnrecordedListToExcel`, params);
// 佣金初审导出 /api/services/app/Finance/GetRecordedListToExcel
export const GetRecordedListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetRecordedListToExcel`, params);
// 财务转账导出 /api/services/app/Finance/GetTransferRecordedListToExcel
export const GetTransferRecordedListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetTransferRecordedListToExcel`, params);
// 已结算导出 /api/services/app/Finance/GetSettledRecordedListToExcel
export const GetSettledRecordedListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetSettledRecordedListToExcel`, params);
// 佣金结算导出 /api/services/app/Finance/GetSettledCommissionListToExcel
export const GetSettledCommissionListToExcel = (params) => fetch(`${baseUrl}/api/services/app/Finance/GetSettledCommissionListToExcel`, params);



// 应用商城
// 服务交易订单列表  / 设备出租订单查询列表 /api/services/app/Order/GetAllServiciTransaction
export const GetAllServiciTransaction = (params) => fetch(`${baseUrl}/api/services/app/Order/GetAllServiciTransaction`, params);
// 服务交易详情 api/services/app/Order/GetServiciTransactionDetail
export const GetServiciTransactionDetail = (params) => fetch(`${baseUrl}/api/services/app/Order/GetServiciTransactionDetail`, params);
// 设备出租详情 /api/services/app/Order/GetEquipmentRentalDetail
export const GetEquipmentRentalDetail = (params) => fetch(`${baseUrl}/api/services/app/Order/GetEquipmentRentalDetail`, params);
// 订单导出/api/services/app/Order/GetAllOrderToExcel
export const GetAllOrderToExcel = (params) => fetch(`${baseUrl}/api/services/app/Order/GetAllOrderToExcel`, params);
// 服务管理列表 /api/services/app/SoftWare/GetAllSoftWareList
export const GetAllSoftWareList = (params) => fetch(`${baseUrl}/api/services/app/SoftWare/GetAllSoftWareList`, params);
// 获取软件服务 /api/services/app/SoftWare/GetSoftWareService
export const GetSoftWareService = (params) => fetch(`${baseUrl}/api/services/app/SoftWare/GetSoftWareService`, params);
// 服务列表导出  /api/services/app/SoftWare/GetAllSoftWareListToExcel
export const GetAllSoftWareListToExcel = (params) => fetch(`${baseUrl}/api/services/app/SoftWare/GetAllSoftWareListToExcel`, params);

// 卡莫商城
// 获取商品列表 /api/services/app/Product/GetAllProducts
export const GetAllProducts = (params) => fetch(`${baseUrl}/api/services/app/Product/GetAllProducts`, params);
// 获取商品详情 /api/services/app/Product/GetProductDetail
export const GetProductDetail = (params) => fetch(`${baseUrl}/api/services/app/Product/GetProductDetail`, params);
// 审核/强制下架商品 /api/services/app/Product/AuditOrShelvesProduct
export const AuditOrShelvesProduct = (params) => fetch(`${baseUrl}/api/services/app/Product/AuditOrShelvesProduct`, params, 'post');
// 商品统计 /api/services/app/Product/GetProductStatistical
export const GetProductStatistical = (params) => fetch(`${baseUrl}/api/services/app/Product/GetProductStatistical`, params);
// 商品导出 api/services/app/Product/GetAllProductsToExcel
export const GetAllProductsToExcel = (params) => fetch(`${baseUrl}/api/services/app/Product/GetAllProductsToExcel`, params);
// 获取订单列表 /api/services/app/ProductOrder/GetProductOrderList
export const GetProductOrderList = (params) => fetch(`${baseUrl}/api/services/app/ProductOrder/GetProductOrderList`, params);
// 订单导出 /api/services/app/ProductOrder/GetProductOrderToExcel
export const GetProductOrderToExcel = (params) => fetch(`${baseUrl}/api/services/app/ProductOrder/GetProductOrderToExcel`, params);
// 订单详情 /api/services/app/ProductOrder/GetProductOrderDetail
export const GetProductOrderDetail = (params) => fetch(`${baseUrl}/api/services/app/ProductOrder/GetProductOrderDetail`, params);
// 订单统计 /api/services/app/ProductOrder/GetProductStatistical
export const GetOrderStatistical = (params) => fetch(`${baseUrl}/api/services/app/ProductOrder/GetProductStatistical`, params);
// 商品订单统计导出 /api/services/app/ProductOrder/GetProductStatisticalToExcel
export const GetProductStatisticalToExcel = (params) => fetch(`${baseUrl}/api/services/app/ProductOrder/GetProductStatisticalToExcel`, params);
// 获取活动列表 /api/services/app/ProductActivity/GetAllActivity
export const GetAllActivity = (params) => fetch(`${baseUrl}/api/services/app/ProductActivity/GetAllActivity`, params);
// 活动列表导出 /api/services/app/ProductActivity/GetAllProductsToExcel
export const GetAllProductsToExcelActivity = (params) => fetch(`${baseUrl}/api/services/app/ProductActivity/GetAllProductsToExcel`, params);
// 获取活动详情 /api/services/app/ProductActivity/GetActivityDetail
export const GetActivityDetail = (params) => fetch(`${baseUrl}/api/services/app/ProductActivity/GetActivityDetail`, params);
// 中止活动 /api/services/app/ProductActivity/ActivityAbort
export const ActivityAbort = (params) => fetch(`${baseUrl}/api/services/app/ProductActivity/ActivityAbort`, params, 'post');
// 活动统计 /api/services/app/ProductActivity/GetProductActivityStatistical
export const GetProductActivityStatistical = (params) => fetch(`${baseUrl}/api/services/app/ProductActivity/GetProductActivityStatistical`, params);
//分账授权管理 /api/services/app/ProfitSharing/GetProfitSharingAuth
export const GetProfitSharingAuth = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingAuth`, params);
// 更改微信分账授权状态/api/services/app/ProfitSharing/ChangeProfitSharingAuthStatus
export const ChangeProfitSharingAuthStatus = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/ChangeProfitSharingAuthStatus`, params, 'post');
//查询分账记录 /api/services/app/ProfitSharing/GetProfitSharingList
export const GetProfitSharingList = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingList`, params);
//分账  /api/services/app/ProfitSharing/ProfitSharing
export const ProfitSharing = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/ProfitSharing`, params, 'post');
// 分账服务费统计(头部) /api/services/app/ProfitSharing/GetProfitSharingServiceFee
export const GetProfitSharingServiceFee = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingServiceFee`, params);
//分账服务费统计 /api/services/app/ProfitSharing/GetProfitSharingStatistical
export const GetProfitSharingStatistical = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingStatistical`, params);
//分账授权管理导出 /api/services/app/ProfitSharing/GetProfitSharingAuthToExcel
export const GetProfitSharingAuthToExcel = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingAuthToExcel`, params);
//查询分账导出 /api/services/app/ProfitSharing/GetProfitSharingListToExcel
export const GetProfitSharingListToExcel = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingListToExcel`, params);
//分账服务费统计导出  /api/services/app/ProfitSharing/GetProfitSharingStatisticalToExcel
export const GetProfitSharingStatisticalToExcel = (params) => fetch(`${baseUrl}/api/services/app/ProfitSharing/GetProfitSharingStatisticalToExcel`, params);





// 上传文件图片
export const UploadFile = (params) => fetch(`${baseUrl}/api/services/app/Fundamental/UploadFile`, params, 'post');
// 请求蓝家
let loading;
let requestingCount = 0;

const handleRequestLoading = () => {
  if (!requestingCount) startLoading()
  requestingCount++
}
const handleResponseLoading = () => {
  requestingCount--
  if (!requestingCount) stopLoading()
}

function startLoading() {
  loading = Loading.service({
    // lock: true,
    // text: '加载中……',
    background: 'rgba(0, 0, 0, 0.1)'
  })
}

function stopLoading() {
  loading.close();
}

axios.interceptors.request.use(
  config => {
    handleRequestLoading();
    let AUTH_TOKEN = getStorage('AUTH_TOKEN');
    if (!AUTH_TOKEN) { //不存在
      // 返回登页签
    }
    config.headers.Authorization = AUTH_TOKEN;

    // 处理IE get请求缓存问题
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = -1;

    if (config.method === 'post') {
      //config.data.access_token =  userinfo && userinfo.access_token 
      //config.data = qs.stringify(config.data);
    }
    if (config.method === 'get') {
      //config.params.access_token =  userinfo && userinfo.access_token 
    }
    return config;
  },
  err => {
    handleResponseLoading()
    debugger;
    return Promise.reject(err);
  });

// 添加响应拦截器
axios.interceptors.response.use(
  function (res) {
    handleResponseLoading()

    // token失效 重新登录
    if (res.unAuthorizedRequest && !res.success) {
      Message({
        type: 'error',
        message: '登录失效,重新登录'
      })
      clearStorage();
      router.push({
        path: "/Login",
        querry: {} //从哪个页面跳转
      })
      return
    };

    if (res && res.status === 200 || res.success) {
      return res.data;
    } else {
      // 登录时间太长 重新登录
      return Message({
        type: 'error',
        message: res.msg || "请求错误"
      })
    }
  },
  function (error) {
    handleResponseLoading();
    let {
      response
    } = error;

    let errMessage = `${response.data.error.message}  ${response.data.error.details || ""}`;
    Message({
      message: errMessage || '请求错误或超时！',
      type: 'error'
    })
    if (response.status === 401 || response.data.unAuthorizedRequest) {
      clearStorage();
      router.push({
        path: "/Login",
        querry: {} //从哪个页面跳转
      })
      return
    }

    return Promise.reject(error.response);
  }
);

function fetch(url, params = {}, method = 'get') {
  return axios({
    url,
    method,
    data: method == 'get' ? {} : params,
    params: method == 'post' ? {} : params,
  })
}
