<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" plain size="medium" class="iconfont activeButton" @click="backCallback">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="dRODescritionContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前订单状态：
        <span v-if="allData.orderStatus == 1">待付款</span>
        <span v-else-if="allData.orderStatus == 2">交易成功</span>
        <span v-else-if="allData.orderStatus == 3">交易关闭</span>
        <span v-else-if="allData.orderStatus == 4">退款成功</span>
        <span v-else-if="allData.orderStatus == 5">退款失败</span>
        <span v-else></span>
        <!-- <LogDialog></LogDialog> -->
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table border :data="basicData" min-height="100">
        <el-table-column prop="orderNo" label="订单号"> </el-table-column>
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
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>发票信息
      </div>
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
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>设备交易明细
      </div>
      <el-table border :data="equipmentRentalData" min-height="100">
        <el-table-column prop="equipmentName" label="商品名称"> </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <ImagePreview :imageUrl='scope.row.equipmentUrl'></ImagePreview>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="数量"> </el-table-column>
        <el-table-column label="商品原价">
          <template slot-scope="scope">{{'¥'+scope.row.deposit}}</template>
        </el-table-column>
      </el-table>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>费用支付信息
      </div>
      <el-table border :data="carshPayData">
        <el-table-column prop="payNo" label="支付平台单号"></el-table-column>
        <el-table-column label="商品原价合计">
          <template slot-scope="scope">{{'¥ '+scope.row.totalPrice}}</template>
        </el-table-column>
        <el-table-column label="商品优惠金额/活动价后合计">
          <template slot-scope="scope">
            {{'¥ '+scope.row.totalDiscount}} / {{'¥ '+scope.row.totalPriceAfterActivity}}
          </template>
        </el-table-column>
        <el-table-column label="商品实付金额">
          <template slot-scope="scope">{{'¥ '+scope.row.actualAmount}}</template>
        </el-table-column>
        <!-- <el-table-column label="押金总额">
          <template slot-scope="scope">{{'¥'+scope.row.depositAmount}}</template>
        </el-table-column> -->
      </el-table>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>收货人信息
      </div>
      <el-table border :data="DeliveryInfoData" style="margin-bottom: 20px;">
        <el-table-column prop="consignee" label="收货人" width="200"></el-table-column>
        <el-table-column prop="consigneeMobile" label="手机号" width="200"></el-table-column>
        <el-table-column prop="consigneeAddress" label="收货地址"></el-table-column>
      </el-table>
    </div>
  </div>

</template>
<script>
import { GetEquipmentRentalDetail } from "./../../../Apis";
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
        equipmentRental: [
          {
            orderId: 0,
            deviceType: "",
            total: 0,
            deposit: 0,
            isDeleted: true,
            deleterUserId: 0,
            deletionTime: "",
            lastModificationTime: "",
            lastModifierUserId: 0,
            creationTime: "",
            creatorUserId: 0,
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
          depositAmount: 0,
          isDeleted: true,
          deleterUserId: 0,
          deletionTime: "",
          lastModificationTime: "",
          lastModifierUserId: 0,
          creationTime: "",
          creatorUserId: 0,
          id: 0
        },
        invoiceInfo: {
          orderId: 0,
          name: "",
          type: 0,
          mobile: "",
          email: "",
          taxNumber: "",
          info: "",
          id: 0
        },
        deliveryInfo: {
          orderId: 0,
          deceiver: "",
          deceiverMobile: "",
          address: "",
          isDeleted: true,
          deleterUserId: 0,
          deletionTime: "",
          lastModificationTime: "",
          lastModifierUserId: 0,
          creationTime: "",
          creatorUserId: 0,
          id: 0
        },
        id: 0
      },
      breadList: [
        { label: "应用商城" },
        { label: "设备交易订单查询" },
        { label: "详情" }
      ]
    };
  },
  computed: {
    basicData() {
      return [this.allData];
    },
    invoiceData() {
      if (!this.allData.invoiceInfo) return [];
      return [this.allData.invoiceInfo];
    },
    isOrderTransaction() {
      if (!this.allData.invoiceInfo) return;
      return this.allData.invoiceInfo.type == 1 ? true : false;
    },
    equipmentRentalData() {
      return this.allData.equipmentRental;
    },
    carshPayData() {
      if (!this.allData.orderPayInfo) return [];
      return [this.allData.orderPayInfo];
    },
    DeliveryInfoData() {
      if (!this.allData.consigneeInfo) return [];
      return [this.allData.consigneeInfo];
    }
  },
  methods: {
    async getAllData() {
      let params = {
        Id: this.Id
      };
      let res = await GetEquipmentRentalDetail(params);
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
        path: "/appShopMall/DeviceRentOrderList",
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
}
@btnColor: #31c7a0;
.dRODescritionContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  //   border: 1px solid #d7d7d7;
  font-size: 16px;
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
    padding: 10px 0;
    border: 1px solid #f3f3f3;
    i {
      color: #999;
      margin: 0 10px;
      font-size: 21px;
    }
    color: #333;
    font-size: 17px;
  }
  .el-table th {
    color: #000;
    background-color: #f9fafc;
    font-size: 14px;
  }
}
</style>

