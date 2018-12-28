<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="cancelTransactionSearch">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.lever" size="small" placeholder="服务商等级" class="searchContentInput">
              <el-option label="不限" value="-1"> </el-option>
              <el-option label="卡莫运营商" value="1"></el-option>
              <el-option label="城市运营商" value="2"></el-option>
              <el-option label="普通运营商" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.id" size="small" placeholder="服务商id"></el-input>
            <el-input v-model="searchForm.name" size="small" placeholder="服务商名称"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchClick()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="regestClick()">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportClick()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>服务商列表
        <el-button class="addServieProBtn" type="success" @click="addOrEdit()" size="mini">新增服务商</el-button>
      </div>
      <el-table :data="tabelOptions.items" border style="width: 100%" max-height="tabelOptions.height">
        <el-table-column fixed prop="id_name" label="服务商ID/名称"></el-table-column>
        <el-table-column prop="Lever" label="服务商等级" width="150"></el-table-column>
        <el-table-column prop="headName_headMobile" label="负责人/手机号"></el-table-column>
        <el-table-column prop="legalName_legalMobile" label="法人/手机号"></el-table-column>
        <el-table-column prop="ttt" label="微信支付平台" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="addOrEdit(scope.row)" type="text" class="textButton" size="small">编辑</el-button>
            <el-button @click="descritionJump(scope.row)" type="text" class="textButton" size="small">详情</el-button>
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
const Levers = [
  { label: "", text: "不限" },
  { label: 1, text: "卡莫运营商" },
  { label: 2, text: "城市运营商" },
  { label: 3, text: "普通运营商" }
];
import {
  GetAllServiceProvider,
  GetServiceProvidersToExcel
} from "../../../Apis";
import { downFile } from "../../../utils";
import BreadCrumb from "../../../components/BreadCrumb";
export default {
  data: function() {
    return {
      searchForm: {
        id: "",
        name: "",
        lever: ""
      },
      tabelOptions: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        height: 100,
        items: []
      },
      breadList: [{ label: "服务商" }, { label: "服务商管理" }]
    };
  },
  methods: {
    async getServiceProviderData() {
      this.tabelOptions.items = [];
      this.tabelOptions.totalCount = 0;
      let params = {
        MaxResultCount: this.tabelOptions.pageSize,
        ...this.searchForm,
        Sorting: "" //排序字段
      };
      params.SkipCount =
        (this.tabelOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let page = this.tabelOptions.currentPage;
      let res = await GetAllServiceProvider(params);
      if (!res.result) return;
      this.tabelOptions.currentPage = page;
      this.tabelOptions.totalCount = res.result.totalCount;
      this.tabelOptions.items = res.result.items.map(item => {
        item.Lever = Levers[item.level] ? Levers[item.level] : "";
        item.id_name = item.id + " / " + item.name;
        item.headName_headMobile = item.headName + " / " + item.headMobile;
        item.legalName_legalMobile = item.legalName + " / " + item.legalMobile;
        return item;
      });
    },

    searchClick() {
      this.tabelOptions.currentPage = 1;
      this.getServiceProviderData();
    },
    regestClick() {
      // 重置搜索条件
      this.tabelOptions.currentPage = 1;
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.getServiceProviderData();
    },
    async exportClick() {
      // console.log("导出列表");
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetServiceProvidersToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },

    handleCurrentChange(page) {
      // 页码默认从0开始
      this.tabelOptions.currentPage = page;
      this.getServiceProviderData();
    },
    addOrEdit(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tabelOptions.currentPage
      });
      this.$router.push({
        path: "/servicer/ServiceAddEdit",
        query: {
          type: rowData && rowData.level ? rowData.level : "",
          level: rowData && rowData.level ? rowData.level : "",
          id: rowData && rowData.id ? rowData.id : 0,
          currentPage: this.tabelOptions.currentPage
        }
      });
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tabelOptions.currentPage
      });
      this.$router.push({
        path: "/servicer/ServiceDesc",
        query: {
          type: rowData.level,
          id: rowData.id,
          currentPage: this.tabelOptions.currentPage
        }
      });
    },
    refreshCallback() {
      this.tabelOptions.items = [];
      this.getServiceProviderData();
    },
    init() {
      let listOptions = this.$store.state.listOptions;
      if (listOptions && listOptions.currentPage) {
        for (let key in listOptions) {
          this[key] = listOptions[key];
        }
        this.tabelOptions.currentPage = listOptions.currentPage;
      }
      this.getServiceProviderData();
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
.cancelTransactionSearch {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .partTitle {
    text-align: left;
    background: #f3f3f3;
    height: 45px;
    line-height: 45px;
    border: 1px solid #d7d7d7;
    position: relative;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    font-size: 16px;
  }
  .addServieProBtn {
    position: absolute;
    right: 20px;
    top: 8px;
    font-size: 14px;
  }
}
</style>
