const mutations = {
  // 'test_mu': function (state, obj) {
  //   // console.log(state, obj)
  // },
  // 'firstNavChange': function (state, firstNav) {
  //   state.firstNavKey = firstNav.navKey;
  // },
  // 'merchantIdChange': function (state, id) {
  //   state.merchantId = id;
  // },
  // 'shopAuditChange': function (state, shopAudit) { //门店审核的id  用于门店审核详情查询数据
  //   state.shopAudit = shopAudit;
  // },
  // 'platFormMerchantIdChange': function (state, platFormMerchantId) { //支付结算 支付平台管理  详情页签 使用 商户id
  //   state.platFormMerchantId = platFormMerchantId;
  // },
  // 'serviceProviderIdAndTypeChange': function (state, typeAndId) { //服务商管理  新增 编辑  详情 共用对象
  //   state.serviceProviderIdAndType = typeAndId;
  // },
  // "breadcrumbRouteChange": function (state, route) { //面包屑 存放路由信息  headerVue  asideVue 有触发
  //   state.breadcrumbRoute = route;
  // },
  // 'serviceTradeOrderChange':function(state, serviceTradeOrder){ //服务交易订单详情使用 id
  //   state.serviceTradeOrder = serviceTradeOrder;
  // },
  // "deviceRentalOrderChange":function(state,deviceRentalOrder) { //设备出租订单详情使用 id
  //   state.deviceRentalOrder = deviceRentalOrder;
  // }
  "setListOptions": function (state, options) {
    // options 不限于 页码 状态 时间 id 名称 手机号
    state.listOptions = options;
  }

}

export default mutations;
