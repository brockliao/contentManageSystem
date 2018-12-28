<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" size="medium" class="iconfont activeButton" @click="backCallback">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="sTODescritionContainer">

      <div class="al merchandiseActivedColor positionRe " style="background:#f3f3f3">
        <i class="el-icon-tan"></i>
        <div class="auditStatusBox">
          <div>
            <span class="font16">当前订单状态：
              <span v-if="allData.orderStatus == 1">待付款</span>
              <span v-else-if="allData.orderStatus == 2">交易成功</span>
              <span v-else-if="allData.orderStatus == 3">交易关闭</span>
              <span v-else-if="allData.orderStatus == 4">退款成功</span>
              <span v-else-if="allData.orderStatus == 5">退款失败</span>
              <span v-else></span>
            </span>
            <!-- <el-button @click="auditLogClick()" type="text" size="small">记录</el-button> -->
          </div>
        </div>
      </div>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>基本信息</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="basicData" min-height="100">
              <el-table-column prop="orderNo" label="订单号"> </el-table-column>
              <el-table-column prop="solution" label="解决方案"> </el-table-column>
              <el-table-column label="商户ID/名称">
                <template slot-scope="scope">
                  <span>{{scope.row.merChantId}}</span>
                  <span> / </span>
                  <span>{{scope.row.merChantName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="areaName" label="门店所属区域"> </el-table-column>
              <el-table-column label="服务商ID/名称">
                <template slot-scope="scope">
                  <span>{{scope.row.serviciProvideId}}</span>
                  <span> / </span>
                  <span>{{scope.row.serviceProvideName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="业务员姓名/手机号">
                <template slot-scope="scope">
                  <span>{{scope.row.salesManName}}</span>
                  <span> / </span>
                  <span>{{scope.row.salesMobile}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>发票信息</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="invoiceData" min-height="100">
              <el-table-column prop="name" label="收票人姓名"></el-table-column>
              <el-table-column prop="type" label="发票类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.type===1">对公</span>
                  <span v-else-if="scope.row.type===2">个人</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column prop="mobile" label="收票人手机号"></el-table-column>
              <el-table-column prop="email" label="收票人邮箱"></el-table-column>
              <el-table-column v-if="isOrderTransaction" prop="info" label="发票抬头"></el-table-column>
              <el-table-column v-if="isOrderTransaction" prop="taxNumber" label="纳税识别号"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>软件服务交易明细</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="businessData" min-height="100">
              <el-table-column label="商品ID/名称">
                <template slot-scope="scope">
                  <span>{{scope.row.productId}}</span>
                  <span> / </span>
                  <span>{{scope.row.productName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品图片">
                <template slot-scope="scope" class="cardImgBox">
                  <ImagePreview :imageUrl="scope.row.productUrl"></ImagePreview>
                </template>
              </el-table-column>
              <el-table-column prop="buycycle" label="买入周期"> </el-table-column>
              <el-table-column prop="originalPrice" label="商品原价">
                <template slot-scope="scope">{{'¥'+scope.row.originalPrice}}</template>
              </el-table-column>
              <el-table-column prop="activityPrice" label="活动价格">
                <template slot-scope="scope">{{'¥'+scope.row.activityPrice}}</template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>费用支付信息</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="carshPayData">
              <el-table-column prop="payNo" label="支付平台单号" min-width="250"></el-table-column>
              <el-table-column prop="totalPrice" label="软件服务原价合计" min-width="150">
                <template slot-scope="scope">{{'¥'+scope.row.totalPrice}}</template>
              </el-table-column>
              <el-table-column prop="totalDiscount" label="优惠合计" min-width="150">
                <template slot-scope="scope">{{'¥'+scope.row.totalDiscount}}</template>
              </el-table-column>
              <el-table-column prop="totalPriceAfterActivity" label="活动价后合计" min-width="150">
                <template slot-scope="scope">{{'¥'+scope.row.totalPriceAfterActivity}}</template>
              </el-table-column>
              <el-table-column prop="bonusDeduction" label="奖励金余额抵扣" min-width="150">
                <template slot-scope="scope">{{'¥'+scope.row.bonusDeduction}}</template>
              </el-table-column>
              <el-table-column prop="upgradeDeduction" label="系统升级余额抵扣" min-width="150">
                <template slot-scope="scope">{{'¥'+scope.row.upgradeDeduction}}</template>
              </el-table-column>
              <el-table-column prop="actualAmount" label="实付金额" min-width="150">
                <template slot-scope="scope">{{'¥'+scope.row.actualAmount}}</template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <!-- 记录弹窗 -->
      <el-dialog title="订单处理记录" :visible.sync="auditLogVisiable" width="450px">
        <div style="height: 300px;margin:10px 0;">
          <el-steps :active="0" direction="vertical">
            <el-step v-for="(step, index) in auditLog" :key="index+'_step'" :title="step.remark+'     '+step.time+'   '+step.userName" :class="{ 'stepDian': step.state}"></el-step>
          </el-steps>
        </div>
      </el-dialog>
    </div>
  </div>

</template>
<script>
import { GetServiciTransactionDetail } from "./../../../Apis";
import { MessageBox, Message } from "element-ui";
import BreadCrumb from "../../../components/BreadCrumb";
import ImagePreview from "../../../components/ImagePreview";
export default {
  data: function() {
    return {
      Id: 0,
      currentPage: 1,

      auditLogVisiable: false,
      auditLog: [],
      allData: {
        orderNo: "",
        solution: "",
        merChantId: 0,
        merChantName: "",
        areaName: "",
        serviciProvideId: 0,
        serviceProvideName: "",
        salesManName: "",
        salesMobile: "",
        amount: 0,
        orderStatus: 1,
        invoiceInfo: {
          orderId: 0,
          name: "",
          type: 0,
          mobile: "",
          email: "",
          id: 0
        },
        orderTransaction: [
          {
            orderId: 0,
            productId: 0,
            productName: "",
            productUrl: "",
            buycycle: 0,
            originalPrice: 0,
            activityPrice: 0,
            id: 0
          }
        ],
        orderPayInfo: {
          orderId: 0,
          payNo: "",
          totalPrice: 0,
          totalDiscount: 0,
          totalPriceAfterActivity: 0,
          bonusDeduction: 0,
          upgradeDeduction: 0,
          actualAmount: 0,
          id: 0
        },
        id: 0
      },
      breadList: [
        { label: "应用商城" },
        { label: "服务交易订单查询" },
        { label: "详情" }
      ]
    };
  },
  computed: {
    basicData() {
      return [this.allData];
    },
    invoiceData() {
      if (this.allData.invoiceInfo) {
        return [this.allData.invoiceInfo];
      } else {
        return [];
      }
    },
    isOrderTransaction() {
      if (!this.allData.invoiceInfo) return;
      return this.allData.invoiceInfo.type == 1 ? true : false;
    },
    businessData() {
      return this.allData.orderTransaction;
    },
    carshPayData() {
      return [this.allData.orderPayInfo];
    }
  },
  methods: {
    async getAllData() {
      let params = {
        Id: this.Id
      };
      let res = await GetServiciTransactionDetail(params);
      if (res.success) {
        this.allData = res.result;
      }
    },
    auditLogClick() {
      this.auditLogVisiable = true;
      // 显示记录
    },

    refreshCallback() {
      this.getAllData();
    },
    backCallback() {
      this.$router.push({
        path: "/appShopMall/ServiceOrderList",
        query: {
          currentPage: this.currentPage
        }
      });
    }
  },
  created() {
    this.Id = this.$route.query.id || 0;
    this.currentPage = this.$route.query.currentPage || 1;

    this.getAllData();
  },
  components: {
    BreadCrumb,
    ImagePreview
  }
};
</script>
<style lang="less">
.content {
  height: 100%;
  .breadButtons {
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
  .textButton {
    color: #2fc7a0;
  }
  .togglePageRow {
    background: #f3f3f3;
    padding: 5px 0;
  }
  .el-table th {
    color: #000;
    background-color: #f3f3f3f3;
    border-right: 1px solid #d5d5d5;
    border-left: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
  }
  .el-button.is-disabled {
    color: #c0c4cc;
  }
}
@btnColor: #31c7a0;
.sTODescritionContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .merchandiseActivedColor {
    height: 60px;
    line-height: 60px;
    margin: 10px;
  }
  section {
    margin: 10px;
  }

  .auditStatusBox {
    display: flex;
    flex-direction: column;
    > div {
      height: 60px;
      line-height: 60px;
      padding-left: 20px;
    }
  }
  .titleStyle {
    background-color: #f3f3f3;
    height: 35px;
    line-height: 35px;
    padding-left: 35px;
    position: relative;
    // margin-bottom: 10px;
    i {
      color: #a9a7a7;
    }
    span {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .positionRe {
    padding-left: 15px;
  }
  section {
    margin-bottom: 20px;
  }
  .auditBtn {
    position: absolute;
    right: 20px;
    top: 10px;
    background: #fff;
    font-size: 15px;
  }
  .auditCancel {
    background: #fff;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border: 1px solid #e4e4e4;
  }
  .el-table td {
    padding: 20px 0;
    // line-height: 50px;
  }
  .el-table th {
    background-color: #f9fafc;
    text-align: center;
    color: #000;
    // font-size: 16px;
  }
  .el-table__row {
    line-height: 50px;
  }
  img {
    height: 100%;
    width: 100%;
  }
  .cardImgBox {
    img {
      width: 40%;
      height: 100%;
    }
  }
  .auditShopForm {
    .dialogRemark {
      font-size: 16px;
      color: #333;
      margin: 0;
      text-align: left;
      font-weight: 600;
      height: 25px;
      line-height: 25px;
    }
    .auditStateSum {
      position: absolute;
      right: 10px;
      bottom: 0;
    }
  }
  .stepDian {
    // background: #e34;
    .el-step__icon.is-text {
      background: #31c8a1;
      // box-shadow: 0px 0px 12px #d4cdcd;
    }
  }
  .el-button--text {
    color: #31c8a1;
  }

  .el-step__icon-inner {
    // width: 100%;
    // height: 100%;
    border-radius: 50%;
  }
  .el-step__icon.is-text {
    background: #cccccc;
    box-shadow: 0px 0px 12px #d4cdcd;
  }
  .el-step__head.is-process,
  .el-step__head.is-wait {
    color: transparent;
    border-color: #fff;
    // box-shadow:2px 2px 3px #e34;
    // broder-color:grey;
  }
  .el-step__title is-process,
  .el-step__title.is-wait {
    color: #333;
    border-color: #fff;
  }
  .rightButton {
    border: 1px solid @btnColor;
    color: @btnColor;
  }
}
</style>

