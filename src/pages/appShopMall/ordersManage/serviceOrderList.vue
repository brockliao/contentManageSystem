
<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="serviceTradeOrderQueryContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.trialType" size="small" placeholder="订单类型" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="买单" value="false"></el-option>
              <el-option label="赠单" value="true"></el-option>
            </el-select>
            <!-- <el-select v-model="searchForm.level" size="small" placeholder="服务商等级" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="卡莫运营" value="1"></el-option>
              <el-option label="城市" value="2"></el-option>
              <el-option label="普通" value="3"></el-option>
            </el-select> -->
            <el-select v-model="searchForm.orderStatus" size="small" placeholder="交易状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="待付款" value="1"></el-option>
              <el-option label="交易成功" value="2"></el-option>
              <el-option label="交易关闭" value="3"></el-option>
              <el-option label="退款成功" value="4"></el-option>
              <el-option label="退款失败" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.orderNo" size="small" placeholder="订单号"></el-input>
            <el-input v-model="searchForm.serviciProvideId" size="small" placeholder="服务商id"></el-input>
            <el-input v-model="searchForm.serviceProvideName" size="small" placeholder="服务商名称"></el-input>
            <el-input v-model="searchForm.salesManName" size="small" placeholder="业务员姓名"></el-input>
            <el-input v-model="searchForm.salesMobile" size="small" placeholder="业务员手机"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchClick()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="regestClick()">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportClick()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>订单列表
      </div>
      <el-table :data="tabelOptions.items" border style="width: 100%" max-height="tabelOptions.height">
        <el-table-column fixed prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="trialType" label="订单类型" width="100"></el-table-column>
        <el-table-column prop="amount" label="交易金额" width="100"></el-table-column>
        <el-table-column prop="actualAmount" label="实付金额" width="100"></el-table-column>
        <el-table-column prop="merchantId_name" label="商户ID/名称"></el-table-column>
        <el-table-column prop="serviciProvideId_name" label="服务商ID/名称"></el-table-column>
        <el-table-column prop="salesManName_mobile" label="业务员姓名/手机号"></el-table-column>
        <el-table-column prop="_time" label="提交时间" width="160"></el-table-column>
        <el-table-column prop="orderStatus" label="交易状态" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="descritionJump(scope.row)" type="text" size="small" class="textButton">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tabelOptions.currentPage" :page-size="tabelOptions.pageSize" layout="total, prev, pager, next, jumper" :total="tabelOptions.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
const OrderType = 1;

import { GetAllServiciTransaction, GetAllOrderToExcel } from "./../../../Apis";
import { downFile, dateFrom } from "../../../utils";
import BreadCrumb from "../../../components/BreadCrumb";

export default {
  data: function() {
    return {
      searchForm: {
        orderNo: "",
        serviciProvideId: "",
        serviceProvideName: "",
        salesManName: "",
        salesMobile: "",
        orderStatus: "",
        level: "",
        trialType: "",
        beginTime: (() => {
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return dateFrom(new Date(start), "yyyy-MM-dd");
        })(),
        endTime: dateFrom(new Date(), "yyyy-MM-dd")
      },
      tabelOptions: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        height: 250,
        items: []
      },
      breadList: [{ label: "应用商城" }, { label: "服务交易订单查询" }]
    };
  },
  computed: {
    State: function() {}
  },
  methods: {
    async getServiceData(data = { SkipCount: 0 }) {
      let params = {
        ...this.searchForm,
        Sorting: "",
        MaxResultCount: this.tabelOptions.pageSize,
        OrderType: OrderType
      };
      let page = this.tabelOptions.currentPage;
      params.SkipCount =
        (this.tabelOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] && params[key] !== 0) {
          params[key] = null;
        }
        if (params[key] == "-1") delete params[key];
      }

      let res = await GetAllServiciTransaction(params);
      this.tabelOptions.currentPage = page;
      if (!res.result) return;
      this.tabelOptions.totalCount = res.result.totalCount;
      this.tabelOptions.items = res.result.items.map(item => {
        item.merchantId_name = item.merChantId + " / " + item.merChantName;
        item.serviciProvideId_name =
          item.serviciProvideId + " / " + item.serviceProvideName;
        item.salesManName_mobile = item.salesManName + " / " + item.salesMobile;
        item._time = dateFrom(item.creationTime, "yyyy-MM-dd HH:mm:ss");
        return item;
      });
    },

    searchClick() {
      this.tabelOptions.currentPage = 1;
      this.getServiceData();
    },
    regestClick() {
      // 重置搜索条件
      this.tabelOptions.currentPage = 1;
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.searchForm.beginTime = (() => {
        let start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return dateFrom(new Date(start), "yyyy-MM-dd");
      })();
      this.searchForm.endTime = dateFrom(new Date(), "yyyy-MM-dd");
      this.tabelOptions.currentPage = 1;
      this.getServiceData();
    },
    async exportClick() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetAllOrderToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tabelOptions.currentPage = page;
      // 页码默认从0开始
      this.getServiceData();
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tabelOptions.currentPage
      });
      this.$router.push({
        path: "/appShopMall/ServiceOrderDesc",
        query: {
          id: rowData.id,
          currentPage: this.tabelOptions.currentPage
        }
      });
    },
    refreshCallback() {
      this.tabelOptions.items = [];
      this.getServiceData();
    },
    init() {
      let listOptions = this.$store.state.listOptions;
      if (listOptions && listOptions.currentPage) {
        for (let key in listOptions) {
          this[key] = listOptions[key];
        }
        this.tabelOptions.currentPage = listOptions.currentPage;
      }
      this.getServiceData();
    }
  },
  created() {
    this.init();
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
.serviceTradeOrderQueryContainer {
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
