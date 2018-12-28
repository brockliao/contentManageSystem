<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="UnrecordedListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.ServiceProviderId" size="small" placeholder="服务商ID"></el-input>
            <el-input v-model="searchForm.ServiceProviderName" size="small" placeholder="服务商名称"></el-input>
            <el-input v-model="searchForm.ServiceProviderArea" size="small" placeholder="负责区域"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>未出账佣租金查询列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
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
        <el-table-column prop="amountCommission" label="预计结算佣金" width="150"></el-table-column>
        <el-table-column prop="test1" label="出账状态" width="100">
          <template slot-scope="scope">未出账</template>
        </el-table-column>
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
 * name:服务商 已结算 列表
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import { dateFrom, downFile } from "./../../../utils";
import { GetUnrecordedList, GetUnrecordedListToExcel } from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [{ label: "佣金结算管理" }, { label: "未出账查询" }],
      searchForm: {
        ServiceProviderId: "",
        ServiceProviderName: "",
        ServiceProviderArea: ""
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
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetUnrecordedListToExcel(params);
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
        path: "/Finance/UnrecordedDesc",
        query: {
          id: rowData.id,
          currentPage: this.tableOptions.currentPage
        }
      });
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initLists();
    },
    setListUnit(lists) {
      lists.forEach(item => {
        item.softWareCommission = "￥" + item.softWareCommission;
        item.onlinePaymentCommission = "￥" + item.onlinePaymentCommission;
        item.mallTransactionCommission = "￥" + item.mallTransactionCommission;
        item.smsCommission = "￥" + item.smsCommission;
        item.amountCommission = "￥" + item.amountCommission;

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
      let page = this.tableOptions.currentPage;
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetUnrecordedList(params);
      this.tableOptions.currentPage = page;
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
.UnrecordedListContainer {
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

