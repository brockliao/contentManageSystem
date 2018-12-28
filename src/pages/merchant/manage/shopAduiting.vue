
<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="shopExamContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.industryVersion" size="small" placeholder="行业版本" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="会员收银" value="1">
              </el-option>
              <el-option label="餐饮收银" value="2">
              </el-option>
            </el-select>
            <el-select v-model="searchForm.serviceProviderType" size="small" placeholder="服务商等级" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="卡莫运营商" value="1">
              </el-option>
              <el-option label="城市运营商" value="2">
              </el-option>
              <el-option label="普通运营商" value="3">
              </el-option>
            </el-select>
            <el-select v-model="searchForm.state" size="small" placeholder="审核状态" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="待审核" value="0">
              </el-option>
              <el-option label="审核通过" value="1">
              </el-option>
              <el-option label="审核驳回" value="2">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入驻时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.Id" size="small" placeholder="门店id"></el-input>
            <el-input v-model="searchForm.ShopName" size="small" placeholder="门店名称"></el-input>
            <el-input v-model="searchForm.SaleManName" size="small" placeholder="业务员"></el-input>
            <el-input v-model="searchForm.SaleManMobile" size="small" placeholder="业务员手机"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchClick()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="regestClick()">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportClick()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>门店审核列表
      </div>
      <el-table :data="tabelOptions.items" border max-height="tabelOptions.height">
        <el-table-column fixed prop="id_shopName" label="门店ID/名称" min-width="200"></el-table-column>
        <el-table-column prop="merchantId_merchantName" label="商户ID/名称" min-width="200"></el-table-column>
        <el-table-column prop="type" label="门店类型" width="100"></el-table-column>
        <el-table-column prop="industryVersion" label="行业版本" width="100"></el-table-column>
        <el-table-column prop="saler_phone" label="业务员姓名/手机号" min-width="200"></el-table-column>
        <el-table-column prop="auditUser" label="审核人" width="100"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="160"></el-table-column>
        <el-table-column prop="auditStatus" label="审核状态"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="descritionJump(scope.row)" type="text" size="small" class="textButton">审核详情</el-button>
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
import {
  GetAuditList,
  GetShopAuditDetail,
  AuditShop,
  GetAuditListToExcel
} from "./../../../Apis";
import BreadCrumb from "./../../../components/BreadCrumb.vue";
import { downFile, dateFrom } from "../../../utils";

export default {
  data: function() {
    return {
      breadList: [{ label: "商户" }, { label: "门店审核" }],
      searchForm: {
        Id: "",
        ShopName: "",
        SaleManName: "",
        SaleManMobile: "",
        industryVersion: "",
        serviceProviderType: "",
        state: "",
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
        height: 250,
        items: []
      }
    };
  },
  computed: {
    State: function() {}
  },
  methods: {
    async getShopData() {
      let params = {
        ...this.searchForm,
        MaxResultCount: this.tabelOptions.pageSize,
        Filter: "" //搜索字段
      };
      // 页码默认从0开始
      params.SkipCount =
        (this.tabelOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] && params[key] !== 0) {
          params[key] = null;
        }
        if (params[key] == "-1") delete params[key];
      }
      let page = this.tabelOptions.currentPage;
      let res = await GetAuditList(params);
      if (!res.result) return;
      this.tabelOptions.currentPage = page;
      this.tabelOptions.totalCount = res.result.totalCount;
      let lists = res.result.items;
      this.tabelOptions.items = lists.map(item => {
        let shop = item.shopAudit;
        shop.id_shopName = shop.id + "/" + shop.shopName;
        shop.saler_phone =
          (shop.salesManName || "") + "/" + (shop.salesMobile || "");
        shop.merchantId_merchantName =
          shop.merchantId + "/" + shop.merchantName;
        return shop;
      });
    },
    hancleCheckedChange(value, key) {
      this[key] = [value];
      this.tabelOptions.currentPage = 1;
      this.getShopData();
    },
    searchClick() {
      this.tabelOptions.currentPage = 1;
      this.getShopData();
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
      this.getShopData();
    },
    async exportClick() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetAuditListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tabelOptions.currentPage = page;
      this.getShopData();
    },
    descritionJump({ id }) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tabelOptions.currentPage
      }); //缓存列表页的中条件选项
      this.$router.push({
        path: `/merchant/ShopAduitingDesc`,
        query: {
          id,
          type: 1,
          currentPage: this.tabelOptions.currentPage
        }
      });
    },
    refreshCallback() {
      this.tabelOptions.items = [];
      this.getShopData();
    },
    init() {
      let listOptions = this.$store.state.listOptions;
      if (listOptions && listOptions.currentPage) {
        for (let key in listOptions) {
          this[key] = listOptions[key];
        }
        this.tabelOptions.currentPage = listOptions.currentPage;
      }
      this.getShopData();
    }
  },
  components: {
    BreadCrumb
  },
  created() {
    this.init();
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
.shopExamContainer {
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
