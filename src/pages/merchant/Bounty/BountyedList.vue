<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="UnBountyListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.status" size="small" placeholder="初审状态" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="待初审" value="2">
              </el-option>
              <el-option label="已初审" value="0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="初审月份：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="month" format="yyyy-MM" placeholder="选择初审月份">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="month" format="yyyy-MM" placeholder="选择初审月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.sn" size="small" placeholder="初审单号"></el-input>
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>初审列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="sn" label="初审单号"></el-table-column>
        <el-table-column label="商户id / 名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="timeSpan" label="初审时间区间"></el-table-column>
        <el-table-column prop="_amount" label='充值/消费产生奖励金'></el-table-column>
        <el-table-column prop="_deductAmount" label="无效交易奖励"></el-table-column>
        <el-table-column prop="_settlementAmount" label="本月结算奖励金"></el-table-column>
        <el-table-column prop='statusDisplay' label="初审状态">
        </el-table-column>
        <el-table-column prop="_auditTime" label="初审时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="descritionJump(scope.row)" :disabled="!scope.row.status" type="text" size="small" class="textButton">初审</el-button>
            <el-button @click="descritionJump(scope.row)" type="text" size="small" class="textButton">详情</el-button>
          </template>
        </el-table-column>
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
import { downFile, dateFrom, setStorage } from "./../../../utils";
import {
  GetRewardRecordedList,
  GetRewardRecordedListToExcel
} from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "商户奖励金结算" }, { label: "奖励金初审" }],
      searchForm: {
        sn: "",
        merchantId: "",
        merchantName: "",
        beginTime: "",
        endTime: "",
        status: ""
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
    let listOptions = this.$store.state.listOptions;
    if (listOptions && listOptions.currentPage) {
      for (let key in this.searchForm) {
        this.searchForm[key] = listOptions.searchForm[key];
      }
      this.tableOptions.currentPage = listOptions.currentPage;
    } else {
      await this.initTime();
    }
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
        await this.initTime();
      }
      if (!/^[1-9]\d*$/.test(this.searchForm.sn) && this.searchForm.sn) {
        return this.$message({
          type: "error",
          message: "请输入正确的初审单号"
        });
      }
      if (
        !/^[1-9]\d*$/.test(this.searchForm.merchantId) &&
        this.searchForm.merchantId
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的商户id"
        });
      }
      this.tableOptions.currentPage = 1;
      this.initLists();
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      params.beginTime = await this.setMonthDay();
      params.endTime = await this.setMonthDay(true);
      let res = await GetRewardRecordedListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initLists();
    },
    descritionJump(rowData) {
      setStorage("BountyedListRow", JSON.stringify(rowData));
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/Bounty/BountyedDesc",
        query: {
          merchantId: rowData.merchantId,
          currentPage: this.tableOptions.currentPage,
          key: "BountyedListRow"
        }
      });
    },
    initTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      if (month < 10) month = "0" + month;
      this.searchForm.beginTime = year + "-" + month;
      this.searchForm.endTime = year + "-" + month;
    },
    setMonthDay(isEnd) {
      // 处理时间 开始时间，1号， 结束月底
      if (isEnd) {
        if (!this.searchForm.endTime) return "";
        let date = new Date(this.searchForm.endTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let monthStartDate = new Date(year, month - 1, 1);
        let monthEndDate = new Date(year, month, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        if (month < 10) month = "0" + month;
        if (days < 10) days = "0" + days;
        return year + "-" + month + "-" + days;
      } else {
        if (!this.searchForm.beginTime) return "";
        let date = new Date(this.searchForm.beginTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) month = "0" + month;
        return year + "-" + month + "-01";
      }
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
      params.beginTime = await _this.setMonthDay();
      params.endTime = await _this.setMonthDay(true);
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetRewardRecordedList(params);
      this.tableOptions.currentPage = page;
      if (res.success) {
        _this.tableOptions.totalCount = res.result.totalCount;
        let lists = res.result.items;
        lists.forEach(item => {
          item["_amount"] = "￥" + item.amount;
          item["_deductAmount"] = "￥" + item.deductAmount;
          item["_settlementAmount"] = "￥" + item.settlementAmount;
          item["_auditTime"] = dateFrom(item.auditTime);
          item["_manualDeductAmount"] = "￥ " + item.manualDeductAmount;
          item["_notAllowAmount"] = "￥ " + item.notAllowAmount;
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
  }
  .searchContentInput {
    .el-input {
      width: 200px !important;
    }
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
.UnBountyListContainer {
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
