<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="dealListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.payType" size="small" placeholder="支付方式" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="支付宝" value="1"></el-option>
              <el-option label="微信" value="2"></el-option>
              <el-option label="银联POS" value="4"></el-option>
              <el-option label="现金" value="5"></el-option>
              <el-option label="余额" value="0"></el-option>
            </el-select>
            <el-select v-model="searchForm.dealType" size="small" placeholder="交易类型" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="线下支付" value="1"></el-option>
              <el-option label="线下充值" value="2"></el-option>
            </el-select>
            <el-select v-model="searchForm.statusCode" size="small" placeholder="交易状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="支付成功" value="1"></el-option>
              <el-option label="转入退款" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" placeholder="开始日期">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.merChantId" size="small" placeholder="商户ID"></el-input>
            <el-input v-model="searchForm.merChantName" size="small" placeholder="商户名称"></el-input>
            <el-input v-model="searchForm.dealSn" size="small" placeholder="卡莫单号"></el-input>
            <el-input v-model="searchForm.payNo" size="small" placeholder="支付平台单号"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>线下交易订单列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="serialNo" label="卡莫单号" width="160"></el-table-column>
        <el-table-column prop="dealTypeDisplay" label="交易类型" width="80"></el-table-column>
        <el-table-column prop="total" label="交易金额" width="80"></el-table-column>
        <el-table-column label="优惠" width="150">
          <template slot-scope="scope">
            <div v-for="(discountInfo, index) in scope.row.discountList" :key='index'>
              {{discountInfo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="discountAmount" label="优惠金额" width="80"></el-table-column>
        <el-table-column prop="actualAmount" label="实付金额" width="80"></el-table-column>
        <el-table-column prop="payInfo" label="支付方式|支付单号|支付金额|结算费率"></el-table-column>
        <el-table-column label="商户ID/名称" width="160">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="消费者ID" width="80"></el-table-column>
        <el-table-column prop="_createTime" label="交易时间" width="150"></el-table-column>
        <el-table-column label="交易状态" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.statusDisplay}}</span>
            <el-popover placement="bottom-end" width="250" trigger="click" v-model="scope.row.popVisible" v-if="scope.row.statusCode === 0" @after-leave="hidePop(scope.row)">
              <div class="popRow">
                <i class="iconfont icon-close popRowClose" @click="popClick(scope.row)"></i>
                <div>退款时间：{{scope.row._createTime}}</div>
                <div>退款金额：{{scope.row._balance}}</div>
              </div>
              <el-button slot="reference" @click="popClick(scope.row)" type="text" size="small" class="textButton">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount" layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
      <div v-if="popVisible" class="modalContent"></div>
    </div>
  </div>
</template>
<script>
/**
 * name:支付结算  线下交易查询
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../components/BreadCrumb";
import { dateFrom, downFile } from "./../../utils";
import {
  GetAllDealList,
  GetAllDealListToExcle,
  GetDealCancel
} from "./../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "线下交易查询" }],
      searchForm: {
        merChantId: "",
        merChantName: "",
        dealSn: "",
        payNo: "",
        dealType: "",
        payType: "",
        beginTime: new Date(),
        endTime: new Date(),
        statusCode: ""
      },

      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 15,
        totalCount: 0
      },
      popVisible: false
    };
  },
  async created() {
    this.initLists();
  },
  methods: {
    refreshCallback() {
      this.initLists();
    },
    searchData(isInit) {
      if (isInit) {
        // 重置
        this.searchForm = {
          merChantId: "",
          merChantName: "",
          dealSn: "",
          payNo: "",
          dealType: "",
          payType: "",
          statusCode: "",
          beginTime: new Date(),
          endTime: new Date()
        };
      }
      this.tableOptions.currentPage = 1;
      this.initLists();
    },
    async exportData() {
      //   alert("导出");
      let _this = this;
      let params = {
        ..._this.searchForm,
        MaxResultCount: _this.tableOptions.MaxResultCount
      };
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      let page = _this.tableOptions.currentPage;
      params.beginTime = dateFrom(params.beginTime, "yyyy-MM-dd");
      params.endTime = dateFrom(params.endTime, "yyyy-MM-dd");
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetAllDealListToExcle(params);
      if (res.success) {
        downFile(res.result);
      }
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
            key == "total" ||
            key == "discountAmount" ||
            key == "actualAmount"
          ) {
            item[key] = "￥" + item[key];
          }
        }
        item.discountList = item.discountInfo
          ? item.discountInfo.split(",")
          : [];
        item._createTime = dateFrom(item.createTime, "yyyy-MM-dd HH:mm:ss");
      });
      this.tableOptions.lists = lists;
    },
    async initLists() {
      let _this = this;
      let params = {
        ..._this.searchForm,
        MaxResultCount: _this.tableOptions.MaxResultCount
      };
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      let page = _this.tableOptions.currentPage;
      params.beginTime = dateFrom(params.beginTime, "yyyy-MM-dd");
      params.endTime = dateFrom(params.endTime, "yyyy-MM-dd");
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetAllDealList(params);
      _this.tableOptions.currentPage = page;
      if (res.success) {
        _this.tableOptions.totalCount = res.result.totalCount;
        _this.setListUnit(res.result.items);
      }
    },
    async popClick(rowData) {
      rowData.popVisible = !rowData.popVisible;
      this.popVisible = rowData.popVisible;
      let res = await GetDealCancel({ id: rowData.id });
      if (!res.success) return;
      let { createTime, balance } = res.result;
      rowData._createTime = dateFrom(createTime, "yyyy-MM-dd HH:mm:ss");
      rowData._balance = "￥" + balance;
    },
    hidePop(rowData) {
      this.popVisible = rowData.popVisible;
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
.dealListContainer {
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
.modalContent {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 88;
}
.popRow {
  position: relative;
  > div {
    height: 35px;
    line-height: 35px;
  }
  .popRowClose {
    position: absolute;
    right: -12px;
    top: -12px;
    font-size: 18px;
    color: #e34;
    cursor: pointer;
    :hover {
      border: 1px solid #e34;
    }
  }
}
</style>

