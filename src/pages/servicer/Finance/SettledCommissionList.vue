<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="settledCommissionListContainer ">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="时间区间：">
            <el-date-picker v-model="searchForm.times" size="small" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="选择开始日期">
            </el-date-picker>
            <!-- <el-date-picker v-model="searchForm.endTime" size="small" type="month" format="yyyy-MM" placeholder="选择结束日期">
            </el-date-picker> -->
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>佣金结算统计列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="timeSpan" label="时间区间"></el-table-column>
        <el-table-column prop="_amountCommission" label="产生佣金金额"></el-table-column>
        <el-table-column prop="_transferAmount" label="结算转账金额"></el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount" layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * name:服务商 佣金结算统计 列表
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import { dateFrom, downFile } from "./../../../utils";
import {
  GetSettledCommissionList,
  GetSettledCommissionListToExcel
} from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "佣金结算管理" }, { label: "佣金结算统计" }],
      searchForm: {
        // beginTime: (() => {
        //   let start = new Date();
        //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        //   return new Date(start);
        // })(),
        // endTime: new Date(),
        times: dateFrom(new Date(), "yyyy-MM")
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
      for (let key in listOptions) {
        this[key] = listOptions[key];
      }
      this.tableOptions.currentPage = listOptions.currentPage;
    }
    this.initLists();
  },
  methods: {
    refreshCallback() {
      this.tableOptions.lists = [];
      this.initLists();
    },
    searchData(isInit) {
      if (isInit) {
        // 重置
        this.searchForm = {
          beginTime: (() => {
            let start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return new Date(start);
          })(),
          endTime: new Date(),
          ServiceProviderId: "",
          ServiceProviderName: "",
          ServiceProviderArea: ""
        };
      }
      this.tableOptions.currentPage = 1;
      this.initLists();
    },
    async exportData() {
      //   GetSettledCommissionListToExcel
      let params = {
        ...this.searchForm
      };
      // if (params.endTime) params.endTime = dateFrom(params.endTime, "yyyy-MM");
      // if (params.beginTime)
      //   params.beginTime = dateFrom(params.beginTime, "yyyy-MM");

      let year = "";
      let month = "";
      if (this.searchForm.times) {
        year = this.searchForm.times.split("-")[0]
          ? this.searchForm.times.split("-")[0]
          : "";
        month = this.searchForm.times.split("-")[1]
          ? this.searchForm.times.split("-")[1]
          : "";
      }
      params.Year = year;
      params.Month = month;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }

      let res = await GetSettledCommissionListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/Finance/SettledRecordedDesc",
        query: {
          id: rowData.id,
          year: rowData.year,
          month: rowData.month
        }
      });
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initLists();
    },
    setListUnit(lists) {
      lists.forEach(item => {
        for (let key in item) {
          item._transferAmount = "￥" + item.transferAmount;
          item._amountCommission = "￥" + item.amountCommission;
        }
      });
      this.tableOptions.lists = lists;
    },
    async initLists() {
      let _this = this;
      let params = {
        ..._this.searchForm,
        MaxResultCount: _this.tableOptions.MaxResultCount
      };
      // if (params.endTime) params.endTime = dateFrom(params.endTime, "yyyy-MM");
      // if (params.beginTime)
      //   params.beginTime = dateFrom(params.beginTime, "yyyy-MM");
      let year = "";
      let month = "";

      if (_this.searchForm.times) {
        year = _this.searchForm.times.split("-")[0]
          ? _this.searchForm.times.split("-")[0]
          : "";
        month = _this.searchForm.times.split("-")[1]
          ? _this.searchForm.times.split("-")[1]
          : "";
      }
      params.Year = year;
      params.Month = month;
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      let page = _this.tableOptions.currentPage;
      // 空字段不发送
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      delete params.times;
      let res = await GetSettledCommissionList(params);
      _this.tableOptions.currentPage = page;
      if (res.success) {
        _this.tableOptions.totalCount = res.result.totalCount;
        _this.setListUnit(res.result.items);
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
    width: 150px;
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
.settledCommissionListContainer {
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

