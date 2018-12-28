<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="SettedContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.source" size="small" placeholder="商户来源" class="searchContentInput">
              <el-option label="不限" value="-2"></el-option>
              <el-option label="卡莫" value="0"></el-option>
              <el-option label="映美电票打印" value="1"></el-option>
              <el-option label="卡莫服务商" value="2"></el-option>
            </el-select>
            <el-select v-model="searchForm.status" size="small" placeholder="处理状态" class="searchContentInput">
              <el-option label="不限" value="-2"></el-option>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核驳回" value="2"></el-option>
              <el-option label="重置中" value="7"></el-option>
              <el-option label="待补录" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker v-model="searchForm.startDate" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endDate" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchClick()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="regestClick()">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportClick()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>商户列表
      </div>
      <el-table :data="tabelOptions.items" border style="width: 100%" max-height="tabelOptions.height">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            <div>{{scope.row.id ? `${scope.row.id} / ` : scope.row.id}}{{scope.row.merchantName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sourceDisplay" label="商户来源" width="100px"></el-table-column>
        <el-table-column label="联系人/手机号">
          <template slot-scope="scope">
            <div>{{scope.row.contact ? `${scope.row.contact} / ` : scope.row.contact}}{{scope.row.contactMobile}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="常用邮箱"></el-table-column>
        <el-table-column prop="statusDisplay" label="资料处理状态" width="100px"></el-table-column>
        <el-table-column prop="remark" label="备注" width="150px"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150px">
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
import { GetAllSettleList, GetAllSettleListToExcel } from "./../../Apis";
import BreadCrumb from "../../components/BreadCrumb";
import { dateFrom, downFile } from "../../utils";
export default {
  data: function() {
    return {
      StartDate: (() => {
        let start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return dateFrom(start, "yyyy-MM-dd");
      })(),
      EndDate: (() => {
        return dateFrom(new Date(), "yyyy-MM-dd");
      })(),
      searchForm: {
        merchantId: "",
        merchantName: "",
        startDate: (() => {
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return dateFrom(start, "yyyy-MM-dd");
        })(),
        endDate: (() => {
          return dateFrom(new Date(), "yyyy-MM-dd");
        })()
      },
      tabelOptions: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        height: 100,
        items: []
      },
      breadList: [{ label: "支付结算" }, { label: "结算资料管理" }]
    };
  },
  methods: {
    handleCheckedChange(value, key) {
      this[key] = [value];
      this.tabelOptions.currentPage = 1;
      this.getPlatFormList();
    },
    searchClick() {
      this.tabelOptions.currentPage = 1;
      this.getPlatFormList();
    },
    async getPlatFormList() {
      this.tabelOptions.items = [];
      let params = {
        ...this.searchForm,
        MaxResultCount: this.tabelOptions.pageSize
      };
      params.SkipCount =
        (this.tabelOptions.currentPage - 1) * params.MaxResultCount;
      let page = this.tabelOptions.currentPage;
      //   // 空字段不发送
      for (let key in params) {
        if (!params[key] && params[key] !== 0) delete params[key];
        if (params[key] == "-2") delete params[key];
      }
      let res = await GetAllSettleList(params);
      this.tabelOptions.currentPage = page;
      if (res && res.success) {
        this.tabelOptions.totalCount = res.result.totalCount;
        this.tabelOptions.items = res.result.items.map(item => {
          return item.merchant;
        });
      }
    },
    regestClick() {
      // 重置搜索条件
      this.tabelOptions.currentPage = 1;
      for (let ley in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.searchForm.startDate = (() => {
        let start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return new Date(start);
      })();
      this.searchForm.endDate = new Date();
      this.getPlatFormList();
    },
    async exportClick() {
      let params = {
        ...this.searchForm,
        MaxResultCount: this.tabelOptions.pageSize
      };
      let res = await GetAllSettleListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(SkipCount) {
      // 页码默认从0开始
      this.getPlatFormList();
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tabelOptions.currentPage
      }); //缓存列表页的中条件选项
      this.$router.push({
        path: "/paySettedment/SettedDesc",
        query: {
          id: rowData.id,
          currentPage: this.tabelOptions.currentPage,
          source: rowData.source
        }
      });
    },
    refreshCallback() {
      this.tabelOptions.items = [];
      this.getPlatFormList();
    }
  },
  created() {
    //   完成表格数据初始化数据加载
    let listOptions = this.$store.state.listOptions;
    if (listOptions && listOptions.currentPage) {
      for (let key in listOptions) {
        this[key] = listOptions[key];
      }
      this.tabelOptions.currentPage = listOptions.currentPage;
    }
    this.getPlatFormList();
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
.SettedContainer {
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
