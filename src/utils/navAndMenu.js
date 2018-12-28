//label 显示文本 id 标识 isHide 是否显示 
export const NAVS = [{
    "label": "首页",
    "id": 1,
    "key": "index",
    "isHide": true
  },
  {
    "label": "商户",
    "id": 2,
    "key": "merchant"
  },
  {
    "label": "会员",
    "id": 3,
    "key": "vip",
    "isHide": true
  },
  {
    "label": "卡莫商城",
    "id": 5,
    "key": "kamoShopMall",
    // "isHide": true
  },
  {
    "label": "支付结算",
    "id": 9,
    "key": "paySetted",
    // "isHide": true
  },
  {
    "label": "营销推广",
    "id": 4,
    "key": "market",
    "isHide": true
  },
  {
    "label": "应用商城",
    "id": 6,
    "key": "appShopMall",
    // "isHide": true
  },
  {
    "label": "服务商",
    "id": 10,
    "key": "servers"
  },
  {
    "label": "外卖",
    "id": 7,
    "key": "kamoTakeOut",
    "isHide": true
  },
  {
    "label": "拉花",
    "id": 8,
    "isShow": false,
    "key": "coffeeFlower",
    "isHide": true
  },
  {
    "label": "广告",
    "id": 11,
    "key": "adviertisement",
    "isHide": true
  },
  {
    "label": "设计平台",
    "id": 12,
    "key": "designPlatform",
    "isHide": true
  },
  {
    "label": "系统管理",
    "id": 13,
    "key": "systemManage",
    "isHide": true
  }
]

/*
      菜单模型
        {
          navId：匹配导航id 按照导航过滤菜单
          label：文本
          id：唯一标识
          isHide:控制菜单显隐 隐藏 赋值true
          children:子集  不存在赋值 []
          isOpen：控制存在子集的菜单显隐,
          path:路由路径  子集为[]时必须赋值 ，子集存在 置空
        }
      二级菜单模型 
       {
         label:文本
         isHide：显隐控制 隐藏 true
         id：唯一标识 必填
         path:路由路径 必填
       }
*/
export const MENUS = [
  // 首页 1
  {
    navId: 1,
    label: "首页",
    id: 11,
    isOpen: true,
    children: [{
        label: "系统首页",
        id: 111,
        path: "/index/IndexPage"
      },
      {
        label: "账户管理",
        id: 112,
        path: "/index/AccountManage"
      },
      {
        label: "登录日志",
        id: 113,
        path: "/index/LoginLog"
      }
    ]
  },
  // 商户 2
  {
    navId: 2,
    label: "商户管理",
    id: 21,
    isOpen: true,
    children: [{
        label: "商户管理",
        id: 211,
        path: "/"
      },
      {
        label: "门店审核",
        id: 212,
        path: "/merchant/ShopAduiting"
      },
      {
        label: "赠送服务管理",
        id: 215,
        // isHide: true,
        path: "/merchant/ShopTrial"
      },
      {
        label: "开票资质管理",
        id: 213,
        isHide: true,
        path: "/merchant/BillAptitudeManage"
      },
      {
        label: "门店预警",
        id: 214,
        path: '/merchant/ShopWarn',
        isHide: true
      }
    ]
  },
  {
    navId: 2,
    label: "商户奖励金结算",
    id: 22,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "未出账查询",
        path: '/Bounty/UnBountyList',
        id: 221
      },
      {
        label: "奖励金初审",
        path: '/Bounty/BountyedList',
        id: 222
      },
      {
        label: "已提现查询",
        isHide: true,
        id: 225
      },
      {
        label: "奖励金统计",
        path: '/Bounty/CommissionBountyList',
        id: 226
      }
    ]
  },
  {
    navId: 2,
    label: "提现审核与转账",
    id: 24,
    isOpen: true,
    children: [{
        label: "提现审核",
        path: "/TransferWithdraw/CashBountyList",
        id: 241
      },
      {
        label: "财务转账",
        path: '/TransferWithdraw/TransferBountyList',
        id: 242
      }
    ]
  },
  {
    navId: 2,
    label: "商户统计",
    id: 23,
    isHide: true,
    isOpen: true,
    children: [{
        label: "商户统计",
        id: 231
      },
      {
        label: "交易统计",
        id: 232
      }
    ]
  },
  // 会员 3
  {
    navId: 3,
    label: "会员管理",
    id: 31,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "会员列表",
        id: 311
      },
      {
        label: "购买力筛选",
        id: 312
      },
      {
        label: "会员等级设置",
        id: 313
      },
      {
        label: "标签管理",
        id: 314
      },
      {
        label: "会员统计",
        id: 315
      }
    ]
  },
  {
    navId: 3,
    label: "积分管理",
    id: 32,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "积分设置",
        id: 321
      },
      {
        label: "积分统计",
        id: 322
      }
    ]
  },
  // 营销 4
  // 卡莫商城 5
  {
    navId: 5,
    label: "商品管理",
    id: 51,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "商品列表",
        id: 511,
        path: '/ProductManage/ProductList',
      },
      {
        label: "商品统计",
        id: 512,
        path: '/ProductManage/ProductSummary',
      }
    ]
  },
  {
    navId: 5,
    label: "活动管理",
    id: 52,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "活动列表",
        path: '/MallActivity/MallActivityList',
        id: 521
      },
      {
        label: "活动统计",
        path: '/MallActivity/MallActivitySummary',
        id: 522
      }
    ]
  },
  {
    navId: 5,
    label: "服务费管理",
    id: 53,
    isHide: true,
    isOpen: true,
    children: [{
        label: "预付服务费管理",
        id: 531
      },
      {
        label: "后结服务费管理",
        id: 532
      },
      {
        label: "服务费统计",
        id: 533,
        isHide: true,
      }
    ]
  },
  {
    navId: 5,
    label: "订单管理",
    id: 54,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "订单查询",
        id: 541,
        path: '/OrderManage/OrderList',
      },
      {
        label: "订单统计",
        id: 542,
        path: '/OrderManage/OrderSummary',
      }
    ]
  },
  {
    navId: 5,
    label: "分账服务费",
    id: 55,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "分账授权管理",
        id: 551,
        path: '/SplitBillServiceCharge/SplitBillPowerList',
      },
      {
        label: "分账记录查询",
        id: 552,
        path: '/SplitBillServiceCharge/SplitBillLogList',
      },
      {
        label: "分账服务费统计",
        id: 553,
        path: '/SplitBillServiceCharge/SplitBillSummary',
      }
    ]
  },
  // 应用商城 6
  {
    navId: 6,
    label: "解决方案",
    id: 61,
    isHide: true,
    isOpen: true,
    children: [{
        label: "解决方案",
        id: 611
      },
      {
        label: "数据统计",
        id: 612,
        // isHide: true,
      }
    ]
  },
  {
    navId: 6,
    label: "订单管理",
    id: 62,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "服务交易订单查询",
        id: 621,
        path: '/appShopMall/ServiceOrderList'
      },
      {
        label: "设备交易订单查询",
        id: 622,
        path: '/appShopMall/DeviceRentOrderList'
      },
      {
        label: "配件交易订单查询",
        id: 623,
        isHide: true,
      },
      {
        label: "设备退租订单查询",
        id: 624,
        isHide: true,
      },
      {
        label: "设备更换订单查询",
        id: 625,
        isHide: true,
      },
      {
        label: "服务交易统计",
        id: 626,
        isHide: true,
      }
    ]
  },
  {
    navId: 6,
    label: "服务管理",
    id: 63,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "服务列表",
        path: '/appShopMall/SoftWareList',
        id: 631
      },
      {
        label: "数据统计",
        isHide: true,
        id: 632
      }
    ]
  },
  {
    navId: 6,
    label: "设备管理",
    id: 64,
    isHide: true,
    isOpen: true,
    children: [{
        label: "租出设备查询",
        id: 641
      },
      {
        label: "退租设备查询",
        id: 642
      },
      {
        label: "数据统计",
        id: 643
      }
    ]
  },
  // 卡莫外卖 7
  // 咖啡拉花 8
  // 支付结算 9
  {
    navId: 9,
    label: "支付平台管理",
    id: 91,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "财务对账查询",
        isHide: true,
        id: 911
      },
      {
        // isHide: true,
        label: "结算资料管理",
        id: 912,
        path: '/paySettedment/SettedList'
      },
      {
        label: "支付平台管理",
        id: 913,
        path: '/paySettedment/PayManageList'
      }
    ]
  },
  {
    navId: 9,
    label: "线下交易查询",
    id: 92,
    // isHide: true,
    path: '/paySettedment/DealList',
    isOpen: true,
    children: []
  },
  // 服务商 10
  {
    navId: 10,
    label: "服务商管理",
    id: 101,
    // isHide: true,
    path: '/servicer/ServiceList',
    isOpen: true,
    children: []
  },
  {
    navId: 10,
    label: "佣金结算管理",
    id: 102,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "未出账查询",
        id: 1021,
        // isHide: true,
        path: '/Finance/UnrecordedList'
      },
      {
        label: "佣金初审",
        // isHide: true,
        id: 1022,
        path: "/Finance/RecordedList"
      },
      {
        label: "财务转账",
        // isHide: true,
        id: 1023,
        path: '/Finance/TransferRecordedList'
      },
      {
        label: "已结算查询",
        // isHide: true,
        path: '/Finance/SettledRecordedList',
        id: 1024
      },
      {
        label: "佣金结算统计",
        // isHide: true,
        path: '/Finance/SettledCommissionList',
        id: 1025
      }
    ]
  },
  {
    navId: 10,
    label: "租金查询",
    id: 103,
    isHide: true,
    isOpen: true,
    children: []
  },
  // 广告 11
  {
    navId: 11,
    label: "网页管理",
    id: 111,
    // isHide: true,
    isOpen: true,
    children: [{
      label: "网页列表",
      id: 1111
    }]
  },
  {
    navId: 11,
    label: "信息管理",
    id: 112,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "信息列表",
        id: 1121
      },
      {
        label: "短信计费管理",
        id: 1122
      },
      {
        label: "push信息",
        id: 1123
      }
    ]
  },
  {
    navId: 11,
    label: "广告管理",
    id: 1103,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "广告管理",
        id: 11031
      },
      {
        label: "数据统计",
        id: 11032
      }
    ]
  },
  // 设计平台 12
  {
    navId: 12,
    label: "设计师管理",
    id: 1201,
    // isHide: true,
    isOpen: true,
    children: [{
      label: "设计师列表",
      id: 12011
    }]
  },
  {
    navId: 12,
    label: "图库管理",
    id: 1202,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "免费图库管理",
        id: 12021
      },
      {
        label: "商户图库管理",
        id: 12022
      },
      {
        label: "设计师作品管理",
        id: 12023
      }
    ]
  },
  {
    navId: 12,
    label: "设计师版权费结算",
    id: 1203,
    // isHide: true,
    isOpen: true,
    children: [{
        label: "未出账查询",
        id: 12031
      },
      {
        label: "版权计费初审",
        id: 12032
      },
      {
        label: "提现审核",
        id: 12033
      },
      {
        label: "财务转账",
        id: 12034
      },
      {
        label: "已提现查询",
        id: 12035
      },
      {
        label: "版权费提现统计",
        id: 12036
      }
    ]
  },
  // 系统管理 13
  {
    navId: 13,
    label: "角色管理",
    id: 131,
    path: "",
    isOpen: true,
    children: []
  },
  {
    navId: 13,
    label: "用户管理",
    id: 132,
    path: "",
    isOpen: true,
    children: []
  },
  {
    navId: 13,
    label: "系统通知",
    id: 133,
    path: "",
    // isHide: true,
    isOpen: true,
    children: []
  }
]
