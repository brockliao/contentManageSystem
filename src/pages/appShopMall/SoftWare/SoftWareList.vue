<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-8" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="softWareListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="支付方式：">
            <el-select v-model="searchForm.buyType" size="small" placeholder="服务获取方式">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="购买" value="2">
              </el-option>
              <el-option label="赠送" value="1">
              </el-option>
            </el-select>
            <el-select v-model="searchForm.softWareServiceId" size="small" placeholder="服务类型">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option v-for="(item, index) in soltList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="searchForm.usedStatus" size="small" placeholder="服务状态">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="待激活" value="1">
              </el-option>
              <el-option label="使用中" value="0">
              </el-option>
              <el-option label="已过期" value="2">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" placeholder="开始日期">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.shopId" size="small" placeholder="门店ID" style="width:100px;"></el-input>
            <el-input v-model="searchForm.shopName" size="small" placeholder="门店名称" style="width:100px;"></el-input>
            <el-input v-model="searchForm.merChantId" size="small" placeholder="商户ID" style="width:100px;"></el-input>
            <el-input v-model="searchForm.merChantName" size="small" placeholder="商户名称" style="width:100px;"></el-input>
            <el-input v-model="searchForm.ServiciProvideId" size="small" placeholder="服务商ID" style="width:100px;"></el-input>
            <el-input v-model="searchForm.ServiceProvideName" size="small" placeholder="服务商名称" style="width:120px;"></el-input>
            <el-input v-model="searchForm.salesManName" size="small" placeholder="业务员" style="width:100px;"></el-input>
            <el-input v-model="searchForm.salesMobile" size="small" placeholder="业务员手机号" style="width:120px;"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>服务列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column label="服务ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.softWareId || ''} / ${ scope.row.softWareName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="trialType" label="获取方式" width="80"></el-table-column>
        <el-table-column label="门店ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.shopId || ''} / ${ scope.row.shopName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merChantId || ''} / ${ scope.row.merChantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="服务商ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.serviciProvideId || ''} / ${ scope.row.serviceProvideName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="业务员/手机号">
          <template slot-scope="scope">
            {{`${scope.row.salesManName || ''} / ${ scope.row.salesMobile || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="80"></el-table-column>
        <el-table-column prop="_expirationTime" label="到期时间" width="150"></el-table-column>
        <el-table-column prop="orderNo" label="关联订单号" width="160px"></el-table-column>
        <el-table-column prop="status" label="使用状态" width="80"></el-table-column>
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
 * name:支付结算  线下交易查询
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import { dateFrom, downFile } from "./../../../utils";
import {
  GetAllSoftWareList,
  GetAllSoftWareListToExcel,
  GetSoftWareService
} from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "服务列表" }],
      searchForm: {
        buyType: "",
        softWareServiceId: "",
        usedStatus: "",
        beginTime: (() => {
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return new Date(start);
        })(),
        endTime: (() => {
          let start = new Date();
          start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
          return new Date(start);
        })(),
        shopId: "",
        shopName: "",
        merChantId: "",
        merChantName: "",
        serviciProvideId: "",
        serviciProvideName: "",
        salesManName: "",
        salesMobile: ""
      },
      statusList: [""],
      payTypeList: [""],
      dealTypeList: [""],
      soltList: [],
      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0
      }
    };
  },
  async created() {
    this.getSoftList();
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
    dealTypeChange(val) {
      this.searchForm.dealType = val;
      this.dealTypeList = [val];
    },
    payTypeChange(val) {
      this.searchForm.payType = val;
      this.payTypeList = [val];
    },
    searchData(isInit) {
      if (isInit) {
        // 重置
        this.searchForm = {
          buyType: "",
          softType: "",
          usedStatus: "",
          beginTime: (() => {
            let start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return new Date(start);
          })(),
          endTime: (() => {
            let start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            return new Date(start);
          })(),
          shopId: "",
          shopName: "",
          merChantId: "",
          merChantName: "",
          ServiceProvideId: "",
          softWareServiceId: "",
          ServiceProvideName: "",
          salesManName: "",
          salesMobile: ""
        };
        this.statusList = [""];
        this.payTypeList = [""];
        this.dealTypeList = [""];
      }
      this.tableOptions.currentPage = 1;
      this.initLists();
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      if (params.beginTime)
        params.beginTime = dateFrom(params.beginTime, "yyyy-MM-dd");
      if (params.endTime)
        params.endTime = dateFrom(params.endTime, "yyyy-MM-dd");
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetAllSoftWareListToExcel(params);
      if (res && res.success) {
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
    async getSoftList() {
      let res = await GetSoftWareService();
      this.soltList = [];
      if (res.success) {
        for (let key in res.result) {
          this.soltList.push({
            label: res.result[key],
            value: key
          });
        }
      }
    },
    setListUnit(lists) {
      lists.forEach(item => {
        item._expirationTime = dateFrom(item.expirationTime, "yyyy-MM-dd");
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
      if (params.beginTime)
        params.beginTime = dateFrom(params.beginTime, "yyyy-MM-dd");
      if (params.endTime)
        params.endTime = dateFrom(params.endTime, "yyyy-MM-dd");
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }

      let res = await GetAllSoftWareList(params);
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
    text-align: center;
    color: #000;
    background-color: #f3f3f3f3;
    border-right: 1px solid #d5d5d5;
    border-left: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
  }
  .el-table td,
  .el-table th.is-leaf {
    text-align: center;
  }
}

.softWareListContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
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

