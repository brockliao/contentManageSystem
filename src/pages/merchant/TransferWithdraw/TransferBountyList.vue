<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="TransferBountyListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.status" size="small" placeholder="转账状态" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="待转账" value="0">
              </el-option>
              <el-option label="已转账" value="1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转账时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.sn" size="small" placeholder="提现单号"></el-input>
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>财务转账列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="sn" label="提现单号"></el-table-column>
        <el-table-column label="商户id / 名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="timeSpan" label="提现时间区间"></el-table-column> -->
        <el-table-column prop="_totalAmount" label='应结奖励金金额' width="120"></el-table-column>
        <el-table-column prop="_refundServiceFee" label='退还商城服务费' width="120"></el-table-column>
        <el-table-column prop="_consumptionDeductibleAmount" label="消费抵扣金额" width="120"></el-table-column>
        <el-table-column prop="_commission" label="手续费" width="120"></el-table-column>
        <el-table-column prop="_actualAmount" label="转账金额" width="120"></el-table-column>
        <el-table-column prop="_createTime" label="转账时间" width="150"></el-table-column>
        <el-table-column prop="statusDisplay" label="转账状态" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="descritionJump(scope.row)" :disabled="scope.row.status!==0" type="text" size="small"
              class="textButton">转账</el-button>
            <el-button @click="descritionJump(scope.row)" type="text" size="small" class="textButton">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount"
          layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import { downFile, dateFrom, setStorage } from "./../../../utils";
import {
  GetWithdrawUntransList,
  GetWithdrawUntransListToExcel
} from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "财务转账" }],
      searchForm: {
        status: "",
        beginTime: "",
        endTime: "",
        merchantId: "",
        merchantName: "",
        sn: ""
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
      await this.initTimes();
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
        await this.initTimes();
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
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetWithdrawUntransListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initLists();
    },
    descritionJump(rowData) {
      setStorage("TransferBountyList", JSON.stringify(rowData));
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage,
        rowData: rowData
      });
      this.$router.push({
        path: "/TransferWithdraw/TransferBountyDesc",
        query: {
          id: rowData.id,
          currentPage: this.tableOptions.currentPage,
          status: rowData.status,
          key: "TransferBountyList"
        }
      });
    },
    initTimes() {
      // let now = new Date(); //当前日期
      // let nowDay = now.getDate(); //当前日
      // let nowMonth = now.getMonth(); //当前月
      // let nowYear = now.getYear(); //当前年
      // nowYear += nowYear < 2000 ? 1900 : 0; //
      // // 获取上月时间
      // now.setDate(1); //变成这个月一号

      // let lastYear = now.getYear();
      // lastYear += lastYear < 2000 ? 1900 : 0; //

      // now.setMonth(now.getMonth() - 1);
      // now.setMonth(now.getMonth());
      // let lastMonth = now.getMonth();
      // // 上个月一号
      // let beginTime = new Date(lastYear, lastMonth, 1);
      // this.searchForm.beginTime = dateFrom(beginTime, "yyyy-MM-dd");
      // // 获取上个月天数
      // let monthStartDate = new Date(nowYear, lastMonth, 1);
      // let monthEndDate = new Date(nowYear, lastMonth + 1, 1);
      // let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      // // 上个月结束日期
      // this.searchForm.endTime = dateFrom(now.setDate(days), "yyyy-MM-dd");
      this.searchForm.endTime = dateFrom(new Date(), "yyyy-MM-dd");
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.searchForm.beginTime = dateFrom(new Date(start), "yyyy-MM-dd");
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
      let res = await GetWithdrawUntransList(params);
      this.tableOptions.currentPage = page;
      if (res.success) {
        _this.tableOptions.totalCount = res.result.totalCount;
        let lists = [...res.result.items];
        lists.map(item => {
          item["_totalAmount"] = "￥" + item.totalAmount;
          item["_actualAmount"] = "￥" + item.actualAmount;
          item["_consumptionDeductibleAmount"] =
            "￥" + item.consumptionDeductibleAmount;
          item["_commission"] = "￥" + item.commission;
          item["_createTime"] = dateFrom(
            item.createTime,
            "yyyy-MM-dd HH:mm:ss"
          );
          item._refundServiceFee = "￥" + item.refundServiceFee;
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
    border: 1px solid #d5d5d5;
    // border-right: 1px solid #d5d5d5;
    // border-left: 1px solid #d5d5d5;
    // border-bottom: 1px solid #d5d5d5;
    // border-top: 0;
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
.TransferBountyListContainer {
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
