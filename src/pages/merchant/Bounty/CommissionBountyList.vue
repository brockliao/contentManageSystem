<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="CommissionBountyListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="时间区间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="选择结束时间">
            </el-date-picker>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>奖励金统计列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="timeSpan" label="时间区间"></el-table-column>
        <el-table-column prop="_totalAmount" label="充值/消费产生奖励金"></el-table-column>
        <el-table-column prop="_invalidDealAmount" label='无效交易奖励金金额'></el-table-column>
        <el-table-column prop="_consumptionDeductibleAmount" label="奖励金消费抵扣金额"></el-table-column>
        <el-table-column prop="_commissionAmount" label="手续费"></el-table-column>
        <el-table-column prop="_settlementAmount" label="结算奖励金金额"></el-table-column>
        <el-table-column prop="_withdrawAmount" label="申请提现奖励金"></el-table-column>
        <el-table-column prop="_unTransAmount" label="待转账奖励金"></el-table-column>
        <el-table-column prop="_transAmount" label="已转账奖励金"></el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount" layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import { downFile, dateFrom } from "./../../../utils";
import { GetRewardStatList, GetRewardStatListToExcel } from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "商户奖励金结算" }, { label: "奖励金统计" }],
      searchForm: {
        beginTime: "",
        endTime: ""
      },
      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0
      }
    };
  },
  async created() {
    await this.initTimes();
    this.initLists();
  },
  methods: {
    refreshCallback() {
      this.initLists();
    },
    async searchData(isInit) {
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
        await this.initTimes();
      }
      this.tableOptions.currentPage = 1;
      this.initLists();
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetRewardStatListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initLists();
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/Bounty/TransferBountyDesc",
        query: {
          id: rowData.id,
          currentPage: this.tableOptions.currentPage
        }
      });
    },
    initTimes() {
      let date = new Date();
      let year = date.getFullYear();
      let start = date.getMonth();
      if (start < 10) start = "0" + start;
      let end = date.getMonth() + 1;
      if (end < 10) end = "0" + end;
      this.searchForm.beginTime = year + "-" + start;
      this.searchForm.endTime = year + "-" + end;
    },
    async initLists() {
      let _this = this;
      let params = {
        ..._this.searchForm,
        MaxResultCount: _this.tableOptions.MaxResultCount
      };
      let page = this.tableOptions.currentPage;
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetRewardStatList(params);
      this.tableOptions.currentPage = page;

      if (res.success) {
        _this.tableOptions.totalCount = res.result.totalCount;
        let lists = [...res.result.items];
        lists.map(item => {
          item["_totalAmount"] = "￥" + item.totalAmount;
          item["_invalidDealAmount"] = "￥" + item.invalidDealAmount;
          item["_settlementAmount"] =
            (item.settlementStatus ? "应结 " : "预计 ") +
            "￥" +
            item.settlementAmount;
          item["_commissionAmount"] = "￥" + item.commissionAmount;
          item["_consumptionDeductibleAmount"] =
            "￥" + item.consumptionDeductibleAmount;
          item["_unTransAmount"] = "￥" + item.unTransAmount;
          item["_transAmount"] = "￥" + item.transAmount;
          item["_withdrawAmount"] = "￥" + item.withdrawAmount;
        });
        _this.tableOptions.lists = lists;
      }
    }
  },
  components: {
    BreadCrumb
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
    border-top: 0;
  }
  .el-button.is-disabled {
    color: #c0c4cc;
  }
}
.searchContent {
  background: #f3f3f3;
  border: 1px solid #d7d7d7;
  padding: 10px 0;
  margin-bottom: 10px;
  .el-form-item {
    margin: 0 0 0 0;
  }
  .el-form-item__content {
    text-align: left;
  }
  .el-input {
    width: 200px;
    max-width: 200px;
  }
  .el-button.is-plain:focus,
  .el-button.is-plain:hover {
    background-color: #2fc7a0;
    color: #fff;
  }
  .el-button.is-plain {
    border-color: #2fc7a0;
    color: #2fc7a0;
  }
}
.CommissionBountyListContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
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
}
</style>
