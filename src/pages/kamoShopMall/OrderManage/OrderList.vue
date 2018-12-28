<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="OrderListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
        <el-popover placement="left-start" title="" width="410" trigger="click" v-model="explainVisible">
          <template>
            <div class="explainTitle"><span>订单状态说明</span><span class="iconfont icon-close" @click="explainVisible=false"></span></div>
            <div>订单状态分为：待支付 交易关闭 进行中 交易成功4种</div>
            <div class="explainText">① 待支付：提交订单半小时内未支付的订单</div>
            <div class="explainText">② 进行中：已经支付，订单中有商品尚处于拼团中、待发货或待收货状态的订单</div>
            <div class="explainText">③ 交易关闭：提交订单超半小时未支付或整单退款成功的订单</div>
            <div class="explainText">④ 交易成功：订单已完成或部分退款成功的订单</div>
          </template>
          <el-button slot="reference" type="text" size="medium" class="explainBtn">订单状态说明</el-button>
        </el-popover>
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.payType" size="small" placeholder="支付平台" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="微信" value="2"> </el-option>
              <!-- <el-option label="平安" value="3"></el-option> -->
            </el-select>
            <el-select v-model="searchForm.status" size="small" placeholder="订单状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="待支付" value="1"> </el-option>
              <el-option label="交易关闭" value="2"></el-option>
              <el-option label="进行中" value="3"> </el-option>
              <el-option label="交易成功" value="4"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="初始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.orderSn" size="small" placeholder="订单号"></el-input>
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30"></el-input>
            <el-input v-model="searchForm.userName" size="small" placeholder="会员名称" maxlength="30"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>订单列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="orderSn" label="订单号"></el-table-column>
        <el-table-column prop="number" label="商品数量" width="80"></el-table-column>
        <el-table-column prop="_orderAmount" label="商品总额" width="80"></el-table-column>
        <el-table-column prop="couponDiscountMoney" label="优惠合计" width="80"></el-table-column>
        <el-table-column prop="_deliverFee" label="运费" width="80"></el-table-column>
        <el-table-column prop="_payAmount" label="订单总额" width="80"></el-table-column>
        <el-table-column prop="payTypeDisplay" label="支付平台" width="80"></el-table-column>
        <!-- <el-table-column prop="test7" label="商城服务费"></el-table-column> -->
        <el-table-column prop="userName" label="会员名称"></el-table-column>
        <el-table-column label="商户id / 名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="_createTime" label="提交时间"></el-table-column>
        <el-table-column prop="statusDisplay" label="订单状态"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
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
import ImagePreview from "./../../../components/ImagePreview";

import { GetProductOrderList, GetProductOrderToExcel } from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "订单查询" }],
      searchForm: {
        payType: "",
        status: "",
        orderSn: "",
        merchantId: "",
        merchantName: "",
        userName: "",
        beginTime: dateFrom(new Date(), "yyyy-MM-dd"),
        endTime: dateFrom(new Date(), "yyyy-MM-dd")
      },
      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0
      },
      explainVisible: false
    };
  },
  created() {
    let listOptions = this.$store.state.listOptions;
    if (listOptions && listOptions.currentPage) {
      for (let key in this.searchForm) {
        this.searchForm[key] = listOptions.searchForm[key];
      }
      this.tableOptions.currentPage = listOptions.currentPage;
    }
    this.getProductOrders();
  },
  methods: {
    resfreshClick() {
      this.getProductOrders();
    },
    searchData(isInit) {
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
        this.searchForm.beginTime = dateFrom(new Date(), "yyyy-MM-dd");
        this.searchForm.endTime = dateFrom(new Date(), "yyyy-MM-dd");
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
      this.getProductOrders();
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetProductOrderToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getProductOrders();
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/OrderManage/OrderDetail",
        query: { id: rowData.id, statusDisplay: rowData.statusDisplay }
      });
    },
    async getProductOrders() {
      let params = {
        MaxResultCount: this.tableOptions.MaxResultCount,
        Filter: "", //搜索字段
        ...this.searchForm,
        Sorting: "" //排序字段
      };
      params.SkipCount =
        (this.tableOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let page = this.tableOptions.currentPage;
      this.tableOptions.lists = [];
      this.tableOptions.totalCount = 0;
      let res = await GetProductOrderList(params);
      if (!res.success) return;
      let { items, totalCount } = res.result;
      this.tableOptions.totalCount = totalCount;
      this.tableOptions.currentPage = page;
      let lists = items.map(item => {
        item["_createTime"] = dateFrom(item.createTime, "yyyy-MM-dd HH:mm:ss");
        item["_deliverFee"] = "￥" + item.deliverFee;
        item["_orderAmount"] = "￥" + item.orderAmount;
        item["_payAmount"] = "￥" + item.payAmount;
        return item;
      });
      this.tableOptions.lists = lists;
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style lang="less">
.OrderListContainer {
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
    position: relative;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    font-size: 16px;

    .explainBtn {
      position: absolute;
      right: 20px;
    }
  }
}
.explainTitle {
  position: relative;
  padding-bottom: 10px;
  :first-child {
    font-weight: bold;
    font-size: 18px;
    color: #000;
  }
  .icon-close {
    position: absolute;
    right: 10px;
    color: #ccc;
    cursor: pointer;
  }
}
.explainText {
  text-indent: 20px;
  line-height: 30px;
}
</style>


