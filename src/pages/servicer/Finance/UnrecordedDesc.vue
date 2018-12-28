<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" plain size="medium" class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" plain size="medium" class="iconfont activeButton" @click="closeCallback">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="UnrecordedDescContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前佣金处理状态: {{status}}
      </div>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="serviceProviderInfoData" border style="width: 100%">
        <el-table-column label="服务商ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.id || ''} / ${scope.row.name}`}}
          </template>
        </el-table-column>
        <el-table-column prop="headMobile" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="timeSpn" label="时间区间" width="150"></el-table-column>
        <el-table-column prop="softWareCommission" label="软件服务费预计分润" width="200"></el-table-column>
        <el-table-column prop="onlinePaymentCommission" label="线下支付充值预计分润" width="200"></el-table-column>
        <el-table-column prop="mallTransactionCommission" label="卡莫商城交易预计分润" width="200"></el-table-column>
        <el-table-column prop="smsCommission" label="短信推广预计分润" width="200"></el-table-column>
        <el-table-column prop="amountCommission" label="预计应结算佣金总额" width="200"></el-table-column>
      </el-table>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>佣金分润明细
      </div>
      <div class="toggleTypeRow">
        <div>
          <el-button plain size="medium" :class="{'activeButton':activeType==0}" @click="toggleTable(0)">软件服务</el-button>
          <el-button plain size="medium" :class="{'activeButton':activeType==2}" @click="toggleTable(2)">线下支付充值</el-button>
          <el-button plain size="medium" :class="{'activeButton':activeType==1}" @click="toggleTable(1)">卡莫商城交易</el-button>
          <el-button plain size="medium" :class="{'activeButton':activeType==3}" @click="toggleTable(3)">短信推广</el-button>
        </div>
        <div>
          <span v-show="activeType!==2">关联订单：{{commissionList.orderCount || 0}}笔</span>
        </div>
      </div>
      <el-table :data="commissionList.lists" border style="width: 100%" v-if="activeType==0">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联交易单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="预计可得佣金"></el-table-column>
      </el-table>
      <el-table :data="commissionList.lists" border key="onLineTable" style="width: 100%" v-if="activeType==2">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="有效交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="预计可得佣金"></el-table-column>
      </el-table>
      <el-table :data="commissionList.lists" border key="kamoMallTable" style="width: 100%" v-if="activeType==1">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联结算单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="结算金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="预计可得佣金"></el-table-column>
      </el-table>
      <el-table :data="commissionList.lists" border key="kamoMsgTable" style="width: 100%" v-if="activeType==3">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联结算单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="预计可得佣金"></el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="commissionList.currentPage" :page-size="commissionList.MaxResultCount" layout="total, prev, pager, next, jumper" :total="commissionList.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { GetUnrecordeDetails, GetCommissionListByType } from "../../../Apis";
import { downFile } from "../../../utils";
import BreadCrumb from "../../../components/BreadCrumb";
export default {
  data() {
    return {
      breadList: [
        { label: "佣金结算管理" },
        { label: "未出账查询" },
        { label: "详情" }
      ],
      id: 0,
      status: "未出账",
      serviceProviderInfoData: [],
      activeType: 0,
      commissionList: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0,
        orderCount: 0
      }
    };
  },
  methods: {
    refreshCallback() {
      this.activeType = 0;
      this.initDetails();
    },
    closeCallback() {
      this.$router.back(-1);
    },
    setCommissionLists({ totalCount, items, orderCount }) {
      items.forEach(item => {
        for (let key in item) {
          if (key == "amount" || key == "commissionAmount") {
            item[key] = "￥" + item[key];
          }
          if (key == "commissionRate") {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
        }
        if (item.orderSn) {
          let orderList = item.orderSn.split(",");
          item.orderList = orderList;
        } else {
          item.orderList = [];
        }
      });
      this.commissionList.totalCount = totalCount;
      this.commissionList.orderCount = orderCount;
      this.commissionList.lists = items;
    },
    async initDetails() {
      if (!this.id) return;
      let res = await GetUnrecordeDetails({ id: this.id });
      if (res.success) {
        let { serviceProviderInfo, softWareCommissionList } = res.result;
        for (let key in serviceProviderInfo) {
          if (
            key == "softWareCommission" ||
            key == "onlinePaymentCommission" ||
            key == "mallTransactionCommission" ||
            key == "smsCommission" ||
            key == "amountCommission"
          ) {
            serviceProviderInfo[key] = "￥" + serviceProviderInfo[key];
          }
        }
        this.serviceProviderInfoData = [serviceProviderInfo];
        this.commissionList.year = serviceProviderInfo.year;
        this.commissionList.month = serviceProviderInfo.month;
        this.toggleTable(0);
      } else {
        this.serviceProviderInfoData = [];
        this.commissionList.lists = [];
      }
    },
    async toggleTable(type) {
      this.activeType = type;
      if (type == 3) {
        this.setCommissionLists({
          totalCount: 0,
          items: []
        });
        return;
      }
      this.commissionList.lists = [];
      let res = await GetCommissionListByType({
        serviceProviderId: this.id,
        commissionType: this.activeType,
        year: this.commissionList.year,
        month: this.commissionList.month,
        SkipCount:
          (this.commissionList.currentPage - 1) *
          this.commissionList.MaxResultCount,
        MaxResultCount: this.commissionList.MaxResultCount
      });
      if (res.success) {
        this.setCommissionLists(res.result);
      } else {
        this.setCommissionLists([]);
      }
    },
    async handleCurrentChange(page) {
      this.commissionList.currentPage = page;
      this.commissionList.lists = [];
      let res = await GetCommissionListByType({
        serviceProviderId: this.id,
        commissionType: this.activeType,
        year: this.commissionList.year,
        month: this.commissionList.month,
        SkipCount:
          (this.commissionList.currentPage - 1) *
          this.commissionList.MaxResultCount,
        MaxResultCount: this.commissionList.MaxResultCount
      });
      if (res.success) {
        this.setCommissionLists(res.result);
      } else {
        this.setCommissionLists([]);
      }
    }
  },
  components: {
    BreadCrumb
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.initDetails();
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
.UnrecordedDescContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
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
}
</style>

