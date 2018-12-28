<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="merchandisSearch">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="入驻时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.Id" size="small" placeholder="商户id"></el-input>
            <el-input v-model="searchForm.ShopName" size="small" placeholder="商户名称"></el-input>
            <el-input v-model="searchForm.SaleManName" size="small" placeholder="业务员名称"></el-input>
            <el-input v-model="searchForm.SaleManMobile" size="small" placeholder="业务员手机"></el-input>
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
        <el-table-column prop="id" label="商户ID / 名称" fixed>
          <template slot-scope="scope">
            {{scope.row.id}}/{{scope.row.merchantName}}
          </template>
        </el-table-column>
        <el-table-column prop="serviceProviderName" label="商户所属">
        </el-table-column>
        <el-table-column prop="type" label="商户类型" width="150">
        </el-table-column>
        <el-table-column prop="shopNum" label="门店数量" width="150">
        </el-table-column>
        <el-table-column prop="saleManName" label="业务员 / 手机号">
          <template slot-scope="scope">
            {{scope.row.saleManName}}/{{scope.row.saleManMobile}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
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
import { GetAllMerChant, GetAllMerChantToExcel } from "./../../../Apis";
import BreadCrumb from "./../../../components/BreadCrumb.vue";
import { downFile, dateFrom } from "../../../utils";
export default {
  data: function() {
    return {
      searchForm: {
        Id: "",
        ShopName: "",
        SaleManName: "",
        SaleManMobile: "",
        beginTime: (() => {
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return new Date(start);
        })(),
        endTime: new Date()
      },
      tabelOptions: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        height: 100,
        items: []
      },
      breadList: [{ label: "商户" }, { label: "商户管理" }]
    };
  },
  methods: {
    handleCheckedChange(value) {
      this.industryCheckList = [value];
    },
    searchClick() {
      this.tabelOptions.currentPage = 1;
      this.getMerchantData();
    },
    async getMerchantData() {
      let params = {
        MaxResultCount: this.tabelOptions.pageSize,
        Filter: "", //搜索字段
        ...this.searchForm,
        Sorting: "" //排序字段
      };
      params.SkipCount =
        (this.tabelOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let page = this.tabelOptions.currentPage;
      let res = await GetAllMerChant(params);
      if (!res.result) return;
      this.tabelOptions.totalCount = res.result.totalCount;
      this.tabelOptions.currentPage = page;
      this.tabelOptions.items = res.result.items;
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
        return new Date(start);
      })();
      this.searchForm.endTime = new Date();
      this.getMerchantData();
    },
    async exportClick() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetAllMerChantToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(SkipCount) {
      this.tabelOptions.currentPage = SkipCount;
      // 页码默认从0开始
      if (SkipCount >= 1) SkipCount -= 1;
      let params = { SkipCount };
      this.getMerchantData(params);
    },
    descritionJump({ id }) {
      if (!id) {
        return this.$message({
          message: "当前行数据错误",
          type: "error"
        });
      }
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tabelOptions.currentPage
      }); //缓存列表页的中条件选项
      this.$router.push({
        name: "ManageDesc",
        params: {
          id: id,
          currentPage: this.tabelOptions.currentPage //传递当前页码
        }
      });
    },
    refreshCallback() {
      this.tabelOptions.items = [];
      this.getMerchantData();
    },
    init() {
      // vuex 缓存筛选参数
      let listOptions = this.$store.state.listOptions;
      if (listOptions && listOptions.currentPage) {
        for (let key in listOptions) {
          this[key] = listOptions[key];
        }
        this.tabelOptions.currentPage = listOptions.currentPage;
      }
      this.getMerchantData();
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
    border: 1px solid #d5d5d5;
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
.merchandisSearch {
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
