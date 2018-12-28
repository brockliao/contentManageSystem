<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
          <el-button icon="icon-close" size="medium" plain class="iconfont activeButton" @click="$router.back(-1)">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="OrderDetailContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前订单状态: {{statusDisplay}}
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="orderDetail" border style="width: 100%">
        <el-table-column prop="orderSn" label="订单号"></el-table-column>
        <el-table-column prop="number" label="商品数量" width="100"></el-table-column>
        <el-table-column prop="payTypeDisplay" label="支付平台" width="100"></el-table-column>
        <el-table-column prop="_orderAmount" label="商品总额" width="100"></el-table-column>
        <el-table-column prop="_couponDiscountMoney" label="优惠合计" width="100"></el-table-column>
        <el-table-column prop="_deliverFee" label="运费" width="100"></el-table-column>
        <el-table-column prop="_payAmount" label="订单总额" width="100"></el-table-column>
        <el-table-column prop="_mallServiceFee" label="服务费" v-if="!productOrderInfo.serviceFeeReturn" width="100"></el-table-column>
        <el-table-column label="服务费|退还服务费" v-else width="130">
          <template slot-scope="scope">
            {{`${scope.row._mallServiceFee || '--'} | ${ scope.row._serviceFeeReturn || '--'}`}}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="会员名称"></el-table-column>
        <el-table-column label="商户id/名称">
          <template slot-scope="scope">
            {{scope.row.merchantId}}/{{scope.row.merchantName}}
          </template>
        </el-table-column>
      </el-table>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>交易明细
      </div>
      <el-table :data="businessList" border style="width: 100%">
        <el-table-column label="商品id/名称">
          <template slot-scope="scope">
            {{`${scope.row.productId || ''} / ${ scope.row.productName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类目" width="120"></el-table-column>
        <el-table-column label="商户id/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" width="100"></el-table-column>
        <el-table-column prop="_oldPrice" label="原价" width="100"></el-table-column>
        <el-table-column prop="_price" label="现价" width="100"></el-table-column>
        <el-table-column prop="_couponDiscountMoney" label="优惠金额" width="120"></el-table-column>
        <el-table-column prop="_payAmount" label="实付金额" width="100"></el-table-column>
        <!-- <el-table-column prop="bus9" label="分账给商户"></el-table-column> -->
        <el-table-column label="服务费|退还服务费">
          <template slot-scope="scope">
            {{`${scope.row._serviceFee || ''} | ${ scope.row._serviceFeeReturn || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="_empCommission" label="员工提成" width="100"></el-table-column>
        <el-table-column prop="_userCommission" label="会员奖励" width="100"></el-table-column>
        <el-table-column prop="productStatus" label="商品状态" width="100"></el-table-column>
        <!-- <el-table-column prop="bus14" label="分账状态"></el-table-column> -->
      </el-table>
      <!-- <div class="districtShopRow">
        <div class="">店铺优惠：满500减50</div>
        <div class="">商品总额：￥nnn.nn 运费：￥nn.nn 单品优惠：￥nn.nn 店铺优惠：￥nnn.nn 订单总额：￥nnn.nn</div>
      </div> -->
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>支付信息
      </div>
      <el-table :data="orderDetail" border style="width: 100%">
        <el-table-column prop="pay1" label="支付平台/单号">
          <template slot-scope="scope">
            {{`${scope.row.payTypeDisplay || ''}/${ scope.row.outTradeNo || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="_payRate" label="支付费率"></el-table-column>
        <el-table-column prop="_payTime" label="支付时间"></el-table-column>
        <el-table-column prop="_payAmount" label="实付总额"></el-table-column>
        <el-table-column label="分账给商户">
          <template slot-scope="scope">
            <div>{{productOrderInfo._receiveAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="_mallServiceFee" label="商城服务费"></el-table-column>
        <el-table-column prop="_empCommission" label="员工提成"></el-table-column>
        <el-table-column prop="_userCommission" label="会员奖励"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import ImagePreview from "./../../../components/ImagePreview";

import { GetProductOrderDetail } from "./../../../Apis";
import { dateFrom, getStorage, setStorage } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "订单详情" }],
      productOrderInfo: {},
      orderDetail: [],
      businessList: [],
      statusDisplay: "" //从列表页传入
    };
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.statusDisplay = this.$route.query.statusDisplay || "";
    this.getProcudtOrder();
  },
  methods: {
    resfreshClick() {
      this.productOrderInfo = {};
      this.orderDetail = [];
      this.businessList = [];
      this.getProcudtOrder();
    },
    async getProcudtOrder() {
      let res = await GetProductOrderDetail({ id: this.id });
      if (!res.success) return;
      let { productOrderInfo, transactionDetails } = res.result;
      this.productOrderInfo = {
        ...productOrderInfo,
        _orderAmount: "￥" + productOrderInfo.orderAmount,
        _couponDiscountMoney: "￥" + productOrderInfo.couponDiscountMoney,
        _payAmount: "￥" + productOrderInfo.payAmount,
        _deliverFee: "￥" + productOrderInfo.deliverFee,
        _mallServiceFee: productOrderInfo.mallServiceFee
          ? "￥" + productOrderInfo.mallServiceFee
          : "--",
        _serviceFeeReturn: productOrderInfo.serviceFeeReturn
          ? "￥" + productOrderInfo.serviceFeeReturn
          : "--",
        _userCommission: "￥" + productOrderInfo.userCommission,
        _empCommission: "￥" + productOrderInfo.empCommission,
        _payTime: dateFrom(productOrderInfo.payTime, "yyyy-MM-dd HH:mm:ss"),
        _payRate: productOrderInfo.payRate + "‰",
        _receiveAmount: "￥" + productOrderInfo.receiveAmount
      };
      this.orderDetail = [this.productOrderInfo];

      transactionDetails = transactionDetails || [];
      this.businessList = transactionDetails.map(detail => {
        detail["_oldPrice"] = "￥" + detail.oldPrice;
        detail["_price"] = "￥" + detail.price;
        detail["_couponDiscountMoney"] = "￥" + detail.couponDiscountMoney;
        detail["_payAmount"] = "￥" + detail.payAmount;
        detail["merchantId"] = this.productOrderInfo.merchantId;
        detail["merchantName"] = this.productOrderInfo.merchantName;
        detail["_serviceFee"] = detail.serviceFee
          ? "￥" + detail.serviceFee
          : "--";
        detail["_serviceFeeReturn"] = detail.serviceFeeReturn
          ? "￥" + detail.serviceFeeReturn
          : "--";
        detail["_userCommission"] = "￥" + detail.userCommission;
        detail["_empCommission"] = "￥" + detail.empCommission;
        return detail;
      });
    }
  },
  components: {
    BreadCrumb,
    ImagePreview
  }
};
</script>
<style lang="less">
.OrderDetailContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .el-table th {
    text-align: center;
    color: #000;
    border: 1px solid #d5d5d5;
  }
  .statusRow {
    text-align: left;
    background: #f3f3f3;
    height: 60px;
    line-height: 60px;
    i {
      margin: 0 10px;
      font-size: 20px;
    }
    font-size: 16px;
    position: relative;
    .recordButton {
      position: absolute;
      right: 20px;
      top: 10px;
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
  }
  .dataBaseRow {
    text-align: left;
    height: 35px;
    line-height: 35px;
    margin: 10px 0;
    i {
      color: #999;
      margin: 0 10px;
      font-size: 21px;
    }
    color: #333;
    font-size: 17px;
  }
  .toggleTypeRow {
    background: #f3f3f3;
    text-align: left;
    padding-left: 30px;
    > div {
      padding: 10px 0;
    }
    .activeButton {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
    .el-button.is-plain:focus,
    .el-button.is-plain:hover {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
  }
  .el-table td,
  .el-table th.is-leaf {
    background: #f9fafc;
  }
  .partTitle {
    text-align: left;
    background: #f3f3f3;
    height: 35px;
    line-height: 35px;
    border: 1px solid #d7d7d7;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    font-size: 16px;
  }
  .districtShopRow {
    background: #f2f2f2;
    color: #666;
    padding: 10px;
    > div {
      text-align: left;
      height: 25px;
      line-height: 25px;
    }
  }
}
</style>
