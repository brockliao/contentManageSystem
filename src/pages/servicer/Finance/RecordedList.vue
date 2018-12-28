<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="recordedListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="初审状态：">
            <el-checkbox-group v-model="statusList">
              <el-checkbox label='' @change="statusChange('')"> 不限</el-checkbox>
              <el-checkbox label='0' @change="statusChange('0')">待初审</el-checkbox>
              <el-checkbox label='1' @change="statusChange('1')">已初审</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="初审月份：">
            <el-date-picker v-model="searchForm.time" type="month" placeholder="选择年月" size="small" format="yyyy-MM" value-format="yyyy-MM">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.serviceProviderId" size="small" placeholder="服务商ID"></el-input>
            <el-input v-model="searchForm.serviceProviderName" size="small" placeholder="服务商名称"></el-input>
            <el-input v-model="searchForm.serviceProviderArea" size="small" placeholder="负责区域"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>佣金初审列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="orderNo" label="初审单号"></el-table-column>
        <el-table-column prop="timeSpan" label="时间区间" width="100"></el-table-column>
        <el-table-column label="服务商ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.id || ''} / ${ scope.row.name || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="负责区域">
          <template slot-scope="scope">
            <div v-for="(area,index) in scope.row.serviceArea" :key="index">
              {{area}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="softWareCommission" label="软件服务分润" width="150"></el-table-column>
        <el-table-column prop="onlinePaymentCommission" label="线下支付充值分润" width="150"></el-table-column>
        <el-table-column prop="mallTransactionCommission" label="卡莫商城交易分润" width="150"></el-table-column>
        <el-table-column prop="smsCommission" label="短信推广分润" width="150"></el-table-column>
        <el-table-column prop="amountCommission" label="结算佣金" width="150"></el-table-column>
        <el-table-column prop="firstTrialStatusDispaly" label="初审状态" width="100"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
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
/**
 * name:服务商 佣金初审 列表
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import { dateFrom, downFile } from "./../../../utils";
import { GetRecordedList, GetRecordedListToExcel } from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "佣金结算管理" }, { label: "佣金初审" }],
      searchForm: {
        status: "",
        time: "", //dateFrom(new Date(), "yyyy-MM")
        orderNo: "",
        serviceProviderId: "",
        serviceProviderName: "",
        serviceProviderArea: ""
      },
      statusList: [""],
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
    } else {
      this.searchForm.time = this.setTime();
    }
    this.initLists();
  },
  methods: {
    refreshCallback() {
      this.initLists();
    },
    statusChange(val) {
      this.searchForm.status = val;
      this.statusList = [val];
    },
    searchData(isInit) {
      if (isInit) {
        // 重置
        this.searchForm = {
          status: "",
          time: this.setTime(),
          orderSn: "",
          serviceProviderId: "",
          serviceProviderName: "",
          serviceProviderArea: ""
        };
        this.statusList = [""];
      }
      this.initLists();
    },
    async exportData() {
      let _this = this;
      let params = {
        ..._this.searchForm
      };
      let year = "";
      let month = "";
      if (_this.searchForm.time) {
        year = _this.searchForm.time.split("-")[0]
          ? _this.searchForm.time.split("-")[0]
          : "";
        month = _this.searchForm.time.split("-")[1]
          ? _this.searchForm.time.split("-")[1]
          : "";
      }
      params.year = year;
      params.month = month;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetRecordedListToExcel(params);
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
        path: "/Finance/RecordedDesc",
        query: {
          id: rowData.id,
          year: rowData.year,
          month: rowData.month,
          level: rowData.level,
          orderNo: rowData.orderNo
        }
      });
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initLists();
    },
    setTime() {
      var date = new Date(); //根据现在的日期计算上一个月的月份
      if (date.getDate() > 27)
        date.setDate(date.getDate() - (date.getDate() - 26));
      date.setMonth(date.getMonth() - 1);
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if (month < 10) month = "0" + month;
      var befMonth = year + "-" + month;
      return befMonth;
    },
    setListUnit(lists) {
      lists.forEach(item => {
        for (let key in item) {
          if (
            key == "softWareCommission" ||
            key == "onlinePaymentCommission" ||
            key == "mallTransactionCommission" ||
            key == "smsCommission" ||
            key == "amountCommission"
          ) {
            item[key] = "￥" + item[key];
          }
        }
        if (item.serviceAreaDispaly) {
          item.serviceArea = item.serviceAreaDispaly.split("/");
        } else {
          item.serviceArea;
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
      let year = "";
      let month = "";
      if (_this.searchForm.time) {
        year = _this.searchForm.time.split("-")[0]
          ? _this.searchForm.time.split("-")[0]
          : "";
        month = _this.searchForm.time.split("-")[1]
          ? _this.searchForm.time.split("-")[1]
          : "";
      }
      params.year = year;
      params.month = month;
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      let page = _this.tableOptions.currentPage;
      // 空字段不发送
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      delete params.time;
      let res = await GetRecordedList(params);
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
.recordedListContainer {
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

