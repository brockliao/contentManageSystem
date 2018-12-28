/**  
 *  注意 在 meta 必须声明 navId menuId  
 *  且 id值 必须 pages/index.vue 中对应的一致
 * 
 */

import Vue from 'vue'
import Router from 'vue-router'

import {
  setStorage,
  getStorage
} from './../utils'

const Login = () =>
  import('@/pages/Login')
const PasswordChange = () =>
  import('@/pages/PasswordChange')
const Index = () =>
  import('@/pages/Index')

// 首页
const IndexPage = () =>
  import('@/pages/index/indexPage')
const AccountManage = () =>
  import('@/pages/index/accountManage')
const LoginLog = () =>
  import('@/pages/index/loginLog')

const NoFind = () =>
  import('@/pages/404')


// 商户
const ManageList = () =>
  import('@/pages/merchant/manage/manageList')
const ManageDesc = () =>
  import('@/pages/merchant/manage/manageDesc')
const ShopAduiting = () =>
  import('@/pages/merchant/manage/shopAduiting')
const ShopAduitingDesc = () =>
  import('@/pages/merchant/manage/shopAduitingDesc')
const BillAptitudeManage = () =>
  import('@/pages/merchant/manage/billAptitudeManage')
const BillAptitudeDesc = () =>
  import('@/pages/merchant/manage/billAptitudeDesc')
const ShopWarn = () =>
  import('@/pages/merchant/manage/ShopWarn')
const ShopTrial = () =>
  import('@/pages/merchant/manage/shopTrial')
const UnBountyList = () =>
  import('@/pages/merchant/Bounty/UnBountyList')
const UnBountyDesc = () =>
  import('@/pages/merchant/Bounty/UnBountyDesc')
const BountyedList = () =>
  import('@/pages/merchant/Bounty/BountyedList')
const BountyedDesc = () =>
  import('@/pages/merchant/Bounty/BountyedDesc')

const CommissionBountyList = () =>
  import('@/pages/merchant/Bounty/CommissionBountyList')

const CashBountyList = () =>
  import('@/pages/merchant/TransferWithdraw/CashBountyList')
const CashBountyDesc = () =>
  import('@/pages/merchant/TransferWithdraw/CashBountyDesc')
const TransferBountyList = () =>
  import('@/pages/merchant/TransferWithdraw/TransferBountyList')
const TransferBountyDesc = () =>
  import('@/pages/merchant/TransferWithdraw/TransferBountyDesc')

// 支付结算
const PayManageList = () =>
  import('@/pages/paySettedment/payManageList')
const PayManageDesc = () =>
  import('@/pages/paySettedment/payManageDesc')
const SettedList = () =>
  import('@/pages/paySettedment/settedList')
const SettedDesc = () =>
  import('@/pages/paySettedment/settedDesc')
const DealList = () =>
  import('@/pages/paySettedment/DealList')


// 应用商城
const ServiceOrderList = () =>
  import('@/pages/appShopMall/ordersManage/serviceOrderList')

const ServiceOrderDesc = () =>
  import('@/pages/appShopMall/ordersManage/serviceOrderDesc')

const DeviceRentOrderList = () =>
  import('@/pages/appShopMall/ordersManage/deviceRentOrderList')

const DeviceRentOrderDesc = () =>
  import('@/pages/appShopMall/ordersManage/deviceRentOrderDesc')


const SoftWareList = () =>
  import('@/pages/appShopMall/SoftWare/SoftWareList')


// 服务商 
const ServiceList = () =>
  import('@/pages/servicer/serviceManage/serviceList')
const ServiceDesc = () =>
  import('@/pages/servicer/serviceManage/serviceDesc')
const ServiceAddEdit = () =>
  import('@/pages/servicer/serviceManage/serviceAddEdit')

const UnrecordedList = () =>
  import('@/pages/servicer/Finance/UnrecordedList')
const UnrecordedDesc = () =>
  import('@/pages/servicer/Finance/UnrecordedDesc')
const RecordedList = () =>
  import('@/pages/servicer/Finance/RecordedList')
const RecordedDesc = () =>
  import('@/pages/servicer/Finance/RecordedDesc')
const TransferRecordedList = () =>
  import('@/pages/servicer/Finance/TransferRecordedList')
const TransferRecordedDesc = () =>
  import('@/pages/servicer/Finance/TransferRecordedDesc')
const SettledRecordedList = () =>
  import('@/pages/servicer/Finance/SettledRecordedList')
const SettledRecordedDesc = () =>
  import('@/pages/servicer/Finance/SettledRecordedDesc')
const SettledCommissionList = () =>
  import('@/pages/servicer/Finance/SettledCommissionList')

// 卡莫商城 kamoShopMall
const ProductList = () =>
  import('@/pages/kamoShopMall/ProductManage/ProductList')
const ProductDetail = () =>
  import('@/pages/kamoShopMall/ProductManage/ProductDetail')
const ProductSummary = () =>
  import('@/pages/kamoShopMall/ProductManage/ProductSummary')
const KaMoOrderList = () =>
  import('@/pages/kamoShopMall/OrderManage/OrderList')
const KaMoOrderDetail = () =>
  import('@/pages/kamoShopMall/OrderManage/OrderDetail')
const KaMoOrderSummary = () =>
  import('@/pages/kamoShopMall/OrderManage/OrderSummary')
const MallActivityList = () =>
  import('@/pages/kamoShopMall/MallActivity/MallActivityList')
const MallActivityDetail = () =>
  import('@/pages/kamoShopMall/MallActivity/MallActivityDetail')
const MallActivitySummary = () =>
  import('@/pages/kamoShopMall/MallActivity/MallActivitySummary')
const SplitBillPowerList = () =>
  import('@/pages/kamoShopMall/SplitBillServiceCharge/SplitBillPowerList')
const SplitBillLogList = () =>
  import('@/pages/kamoShopMall/SplitBillServiceCharge/SplitBillLogList')
const SplitBillSummary = () =>
  import('@/pages/kamoShopMall/SplitBillServiceCharge/SplitBillSummary')

// 笔记联系模块
const NoteIndex = () => import('@/pages/NoteTest/NoteIndex')

const ElementUiEditTableValidate = () => import('@/pages/NoteTest/ElementUiEditTableValidate')



Vue.use(Router);



let Routers = new Router({
  routes: [{
      path: '/',
      name: '',
      meta: {
        title: "Index",
        navId: 2,
        menuId: 211
      },
      component: Index,
      children: [{
          path: '/index/IndexPage',
          name: 'IndexPage',
          meta: {
            title: '系统首页',
            navId: 1,
            menuId: 111
          },
          component: IndexPage
        }, {
          path: '/index/AccountManage',
          name: 'AccountManage',
          meta: {
            title: '账户管理',
            navId: 1,
            menuId: 112
          },
          component: AccountManage
        }, {
          path: '/index/LoginLog',
          name: 'LoginLog',
          meta: {
            title: '登录日志',
            navId: 1,
            menuId: 113
          },
          component: LoginLog
        },
        {
          path: '/',
          name: 'ManageList',
          meta: {
            title: '商户管理',
            navId: 2,
            menuId: 211
          },
          component: ManageList
        },
        {
          path: '/merchant/ManageDesc/:id',
          name: 'ManageDesc',
          meta: {
            title: "商户详情",
            navId: 2,
            menuId: 211
          },
          component: ManageDesc
        },
        {
          path: '/merchant/ShopAduiting',
          name: 'ShopAduiting',
          meta: {
            title: "门店审核",
            navId: 2,
            menuId: 212
          },
          component: ShopAduiting
        }, {
          path: '/merchant/ShopAduitingDesc',
          name: 'ShopAduitingDesc',
          meta: {
            title: "门店审核详情",
            navId: 2,
            menuId: 212
          },
          query: {
            id: 0,
            type: 0
          },
          component: ShopAduitingDesc
        }, {
          path: '/merchant/ShopTrial',
          name: 'ShopTrial',
          meta: {
            title: "门店试用管理",
            navId: 2,
            menuId: 215
          },
          query: {},
          component: ShopTrial
        }, {
          path: '/merchant/BillAptitudeManage',
          name: 'BillAptitudeManage',
          meta: {
            title: "开票资质管理",
            navId: 2,
            menuId: 213
          },
          query: {
            id: 0,
            type: 0
          },
          component: BillAptitudeManage
        }, {
          path: '/merchant/BillAptitudeDesc',
          name: 'BillAptitudeDesc',
          meta: {
            title: "开票资质管理详情",
            navId: 2,
            menuId: 213
          },
          query: {
            id: 0,
            type: 0
          },
          component: BillAptitudeDesc
        }, {
          path: '/merchant/ShopWarn',
          name: 'ShopWarn',
          meta: {
            title: "门店预警",
            navId: 2,
            menuId: 214
          },
          query: {
            id: 0,
            type: 0
          },
          component: ShopWarn
        }, {
          path: '/Bounty/UnBountyList',
          name: 'UnBountyList',
          meta: {
            title: "奖励金未出账查询",
            navId: 2,
            menuId: 221
          },
          query: {},
          component: UnBountyList
        }, {
          path: '/Bounty/UnBountyDesc',
          name: 'UnBountyList',
          meta: {
            title: "奖励金未出账查询详情",
            navId: 2,
            menuId: 221
          },
          query: {},
          component: UnBountyDesc
        }, {
          path: '/Bounty/BountyedList',
          name: 'BountyedList',
          meta: {
            title: "奖励金初审",
            navId: 2,
            menuId: 222
          },
          query: {},
          component: BountyedList
        }, {
          path: '/Bounty/BountyedDesc',
          name: 'BountyedDesc',
          meta: {
            title: "奖励金初审详情",
            navId: 2,
            menuId: 222
          },
          query: {},
          component: BountyedDesc
        }, {
          path: '/TransferWithdraw/CashBountyList',
          name: 'CashBountyList',
          meta: {
            title: "提现审核",
            navId: 2,
            menuId: 241
          },
          query: {},
          component: CashBountyList
        }, {
          path: '/TransferWithdraw/CashBountyDesc',
          name: 'CashBountyDesc',
          meta: {
            title: "提现审核详情",
            navId: 2,
            menuId: 241
          },
          query: {},
          component: CashBountyDesc
        }, {
          path: '/TransferWithdraw/TransferBountyList',
          name: 'TransferBountyList',
          meta: {
            title: "财务转账",
            navId: 2,
            menuId: 242
          },
          query: {},
          component: TransferBountyList
        }, {
          path: '/TransferWithdraw/TransferBountyDesc',
          name: 'TransferBountyDesc',
          meta: {
            title: "财务转账详情",
            navId: 2,
            menuId: 242
          },
          query: {},
          component: TransferBountyDesc
        }, {
          path: '/Bounty/CommissionBountyList',
          name: 'CommissionBountyList',
          meta: {
            title: "奖励金统计",
            navId: 2,
            menuId: 226
          },
          query: {},
          component: CommissionBountyList
        }, {
          path: '/ProductManage/ProductList',
          name: 'ProductList',
          meta: {
            title: "商品列表",
            navId: 5,
            menuId: 511
          },
          query: {},
          component: ProductList
        }, {
          path: '/ProductManage/ProductDetail',
          name: 'ProductDetail',
          meta: {
            title: "商品详情",
            navId: 5,
            menuId: 511
          },
          query: {},
          component: ProductDetail
        }, {
          path: '/ProductManage/ProductSummary',
          name: 'ProductSummary',
          meta: {
            title: "商品统计",
            navId: 5,
            menuId: 512
          },
          query: {},
          component: ProductSummary
        }, {
          path: '/OrderManage/OrderList',
          name: 'KaMoOrderList',
          meta: {
            title: "订单查询",
            navId: 5,
            menuId: 541
          },
          query: {},
          component: KaMoOrderList
        }, {
          path: '/OrderManage/OrderDetail',
          name: 'KaMoOrderDetail',
          meta: {
            title: "订单详情",
            navId: 5,
            menuId: 541
          },
          query: {},
          component: KaMoOrderDetail
        }, {
          path: '/OrderManage/OrderSummary',
          name: 'KaMoOrderSummary',
          meta: {
            title: "订单统计",
            navId: 5,
            menuId: 542
          },
          query: {},
          component: KaMoOrderSummary
        }, {
          path: '/MallActivity/MallActivityList',
          name: 'MallActivityList',
          meta: {
            title: "活动列表",
            navId: 5,
            menuId: 521
          },
          query: {},
          component: MallActivityList
        }, {
          path: '/MallActivity/MallActivityDetail',
          name: 'MallActivityDetail',
          meta: {
            title: "活动详情",
            navId: 5,
            menuId: 521
          },
          query: {},
          component: MallActivityDetail
        }, {
          path: '/MallActivity/MallActivitySummary',
          name: 'MallActivitySummary',
          meta: {
            title: "活动统计",
            navId: 5,
            menuId: 522
          },
          query: {},
          component: MallActivitySummary
        }, {
          path: '/SplitBillServiceCharge/SplitBillPowerList',
          name: 'SplitBillPowerList',
          meta: {
            title: "分账授权管理",
            navId: 5,
            menuId: 551
          },
          query: {},
          component: SplitBillPowerList
        }, {
          path: '/SplitBillServiceCharge/SplitBillLogList',
          name: 'SplitBillLogList',
          meta: {
            title: "分账记录查询",
            navId: 5,
            menuId: 552
          },
          query: {},
          component: SplitBillLogList
        }, {
          path: '/SplitBillServiceCharge/OrderDetail',
          name: 'KaMoOrderDetail',
          meta: {
            title: "分账记录订单详情",
            navId: 5,
            menuId: 552
          },
          query: {},
          component: KaMoOrderDetail
        }, {
          path: '/SplitBillServiceCharge/SplitBillSummary',
          name: 'SplitBillSummary',
          meta: {
            title: "分账服务费统计",
            navId: 5,
            menuId: 553
          },
          query: {},
          component: SplitBillSummary
        }, {
          // ServiceList
          path: '/servicer/ServiceList',
          name: 'ServiceList',
          meta: {
            title: "服务商",
            navId: 10,
            menuId: 101
          },
          query: {
            currentPage: 1
          },
          component: ServiceList
        },
        {
          path: '/servicer/ServiceDesc',
          name: 'ServiceDesc',
          meta: {
            title: "服务商详情",
            navId: 10,
            menuId: 101
          },
          query: {

          },
          component: ServiceDesc
        },
        {
          path: '/servicer/ServiceAddEdit',
          name: 'ServiceAddEdit',
          meta: {
            title: "服务商新增编辑",
            navId: 10,
            menuId: 101
          },
          query: {},
          component: ServiceAddEdit
        },
        {
          path: '/Finance/UnrecordedList',
          name: 'UnrecordedList',
          meta: {
            title: "未出账查询",
            navId: 10,
            menuId: 1021
          },
          query: {},
          component: UnrecordedList
        },
        {
          path: '/Finance/UnrecordedDesc',
          name: 'UnrecordedDesc',
          meta: {
            title: "未出账查询",
            navId: 10,
            menuId: 1021
          },
          query: {},
          component: UnrecordedDesc
        },
        {
          path: '/Finance/RecordedList',
          name: 'RecordedList',
          meta: {
            title: "佣金初审",
            navId: 10,
            menuId: 1022
          },
          query: {},
          component: RecordedList
        },
        {
          path: '/Finance/RecordedDesc',
          name: 'RecordedDesc',
          meta: {
            title: "佣金初审详情",
            navId: 10,
            menuId: 1022
          },
          query: {},
          component: RecordedDesc
        },
        {
          path: '/Finance/TransferRecordedList',
          name: 'TransferRecordedList',
          meta: {
            title: "财务转账",
            navId: 10,
            menuId: 1023
          },
          query: {},
          component: TransferRecordedList
        },
        {
          path: '/Finance/TransferRecordedDesc',
          name: 'TransferRecordedDesc',
          meta: {
            title: "财务转账详情",
            navId: 10,
            menuId: 1023
          },
          query: {},
          component: TransferRecordedDesc
        },
        {
          path: '/Finance/SettledRecordedList',
          name: 'SettledRecordedList',
          meta: {
            title: "已结算查询",
            navId: 10,
            menuId: 1024
          },
          query: {},
          component: SettledRecordedList
        },
        {
          path: '/Finance/SettledRecordedDesc',
          name: 'SettledRecordedDesc',
          meta: {
            title: "已结算详情",
            navId: 10,
            menuId: 1024
          },
          query: {},
          component: SettledRecordedDesc
        }, {
          path: '/Finance/SettledCommissionList',
          name: 'SettledCommissionList',
          meta: {
            title: "佣金结算统计",
            navId: 10,
            menuId: 1025
          },
          query: {},
          component: SettledCommissionList
        },
        {
          path: '/paySettedment/SettedList',
          name: 'PayManageList',
          meta: {
            title: "结算资料管理",
            navId: 9,
            menuId: 912
          },
          query: {
            currentPage: 1
          },
          component: SettedList
        },
        {
          path: '/paySettedment/SettedDesc',
          name: 'PayManageDesc',
          meta: {
            title: "结算资料管理详情",
            navId: 9,
            menuId: 912
          },
          query: {},
          component: SettedDesc
        },
        {
          path: '/paySettedment/PayManageList',
          name: 'PayManageList',
          meta: {
            title: "支付平台管理",
            navId: 9,
            menuId: 913
          },
          query: {
            currentPage: 1
          },
          component: PayManageList
        },
        {
          path: '/paySettedment/PayManageDesc',
          name: 'PayManageDesc',
          meta: {
            title: "支付平台管理详情",
            navId: 9,
            menuId: 913
          },
          query: {},
          component: PayManageDesc
        }, {
          path: '/paySettedment/DealList',
          name: 'DealList',
          meta: {
            title: "线下交易查询",
            navId: 9,
            menuId: 92
          },
          query: {},
          component: DealList
        },
        {
          path: '/appShopMall/ServiceOrderList',
          name: 'ServiceOrderList',
          meta: {
            title: "服务交易订单",
            navId: 6,
            menuId: 621
          },
          query: {
            currentPage: 1
          },
          component: ServiceOrderList
        },
        {
          path: '/appShopMall/ServiceOrderDesc',
          name: 'ServiceOrderDesc',
          meta: {
            title: "服务交易订单详情",
            navId: 6,
            menuId: 621
          },
          query: {},
          component: ServiceOrderDesc
        },
        {
          path: '/appShopMall/DeviceRentOrderList',
          name: 'DeviceRentOrderList',
          meta: {
            title: "设备出租订单",
            navId: 6,
            menuId: 622
          },
          query: {
            currentPage: 1
          },
          component: DeviceRentOrderList
        },
        {
          path: '/appShopMall/DeviceRentOrderDesc',
          name: 'DeviceRentOrderDesc',
          meta: {
            title: "设备交易订单详情",
            navId: 6,
            menuId: 622
          },
          query: {},
          component: DeviceRentOrderDesc
        },
        {
          path: '/appShopMall/SoftWareList',
          name: 'SoftWareList',
          meta: {
            title: "服务管理列表",
            navId: 6,
            menuId: 631
          },
          query: {},
          component: SoftWareList
        }
      ]
    },
    {
      path: '/NoteTest',
      name: 'NoteTest',
      meta: {
        title: '笔记练习主页',
      },
      component: NoteIndex,
      children: [{
        path: "/",
        name: "ElementUiEditTableValidate",
        meta: {
          title: "elementui可编辑表格验证",
          noRequireAuth: true
        },
        component: ElementUiEditTableValidate
      }]
    },
    {
      path: '/Login',
      name: 'Login',
      meta: {
        title: "登陆",
        noRequireAuth: true
      },
      component: Login
    },
    {
      path: '/PasswordChange',
      name: 'PasswordChange',
      meta: {
        title: "密码修改",
        noRequireAuth: true
      },
      component: PasswordChange
    },
  ]
});

var routeList = [];

Routers.beforeEach((to, from, next) => {

  // 处理菜单高亮
  let {
    navId,
    menuId
  } = to.meta;
  setStorage('navId', navId);
  setStorage('menuId', menuId);
  if (!to.meta.noRequireAuth) { // 判断该路由是否需要登录权限 默认需要false 不需要 true
    if (getStorage('AUTH_TOKEN')) { // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/Login',
      })
    }
  } else {
    next();
  }
})


export default Routers;
