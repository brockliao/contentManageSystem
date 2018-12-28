<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshClick()">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="kaMoOrderSummaryContainer">
      <el-row type="flex" justify="start" class="refRow">
        <el-col :span="4" style="padding-left:15px;">订单统计
          <el-popover placement="left-start" title="" width="410" trigger="click" v-model="explainVisible">
            <template>
              <div class="explainTitle"><span>订单统计说明</span><span class="iconfont icon-close" @click="explainVisible=false"></span></div>
              <div>在统计时间区间内，各项统计指标计算方法如下：</div>
              <div class="explainText">① 下单量/浏览量=下单转化率；</div>
              <div class="explainText">② 付款量/下单量=付款转化率；</div>
              <div class="explainText">③ 付款量/浏览量=成交转化率。</div>
            </template>
            <el-button slot="reference" type="text" size="medium" class="explainBtn">统计说明</el-button>
          </el-popover>
        </el-col>
        <el-col :span="20">
          <el-form ref="searchForm" :inline="true" :model="searchForm" class="refForm">
            <el-form-item>
              <el-select v-model="searchForm.payType" size="small" placeholder="支付平台" style="width:120px;">
                <el-option label="不限" value="-1"></el-option>
                <el-option label="微信" value="2"> </el-option>
                <!-- <el-option label="平安" value="3"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30" style="width:100px;"></el-input>
              <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="dateType">
                <div @click="dateTypeToggle(1)" :class="{'dateTypeBtn':true, 'dateTypeBtnActive':searchForm.type=='1'}">
                  按天展示
                </div>
                <div @click="dateTypeToggle(2)" :class="{'dateTypeBtn':true,'dateTypeBtnActive':searchForm.type=='2'}">
                  按月展示
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="searchForm.type=='1'">
              <el-date-picker style="width:150px" v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd"
                format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
              <el-date-picker style="width:150px" v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd"
                format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="searchForm.type=='2'">
              <el-date-picker style="width:150px" v-model="searchForm.beginTime" size="small" type="month" value-format="yyyy-MM"
                format="yyyy-MM" placeholder="选择月份">
              </el-date-picker>
              <el-date-picker style="width:150px" v-model="searchForm.endTime" size="small" type="month" value-format="yyyy-MM"
                format="yyyy-MM" placeholder="选择月份">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="insideContent">
        <el-row style="border: 1px solid #ccc;">
          <el-col :span="12">
            <div id="chartContent" style="margin-bottom:15px;"></div>
          </el-col>
          <el-col :span="12">
            <transition name="fade">
              <div class="funnelDataCol" v-if="funnelDataVisible">
                <div>
                  <el-tag color="#ff7978" style="color:#fff;">浏览量：{{browseTotal}}</el-tag>
                  <el-tag color="#66beb6" style="color:#fff;">下单量：{{placeOrderTotal}}</el-tag>
                  <el-tag color="#fdc074" style="color:#fff;"> 付款量：{{payCashTotal}}</el-tag>
                </div>
                <div>
                  <el-tag type="success">下单转化率：{{placeOrderRate}}</el-tag>
                </div>
                <div>
                  <el-tag type="success">付款转化率：{{payCashRate}}</el-tag>
                </div>
                <div>
                  <el-tag type="success">成交转化率：{{completeRate}}</el-tag>
                </div>
              </div>
            </transition>

          </el-col>
        </el-row>

        <div class="partTitle">
          <i class="iconfont icon-menu"></i>订单统计报表
          <el-button size="medium" plain @click="exportData()">导出</el-button>
        </div>
        <el-table :data="tableOptions.lists" border style="width: 100%">
          <el-table-column prop="timeSpan" label="时间区间"></el-table-column>
          <el-table-column label="待支付笔数 | 金额">
            <template slot-scope="scope">
              {{`${scope.row.pendingCount || '0'} | ￥${ scope.row.pendingAmount || '0'}`}}
            </template>
          </el-table-column>
          <el-table-column label="进行中笔数 | 金额">
            <template slot-scope="scope">
              {{`${scope.row.processingCount || '0'} | ￥${ scope.row.processingAmount || '0'}`}}
            </template>
          </el-table-column>
          <el-table-column label="交易成功笔数 | 金额">
            <template slot-scope="scope">
              {{`${scope.row.successfulCount || '0'} | ￥${ scope.row.successfulAmount || '0'}`}}
            </template>
          </el-table-column>
          <el-table-column label="交易关闭笔数 | 金额">
            <template slot-scope="scope">
              {{`${scope.row.closeCount || '0'} | ￥${ scope.row.closeAmount || '0'}`}}
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

  </div>

</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import {
  GetOrderStatistical,
  GetProductStatisticalToExcel
} from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "订单统计" }],
      searchForm: {
        type: 1,
        beginTime: dateFrom(new Date(), "yyyy-MM-dd"),
        endTime: dateFrom(new Date(), "yyyy-MM-dd"),
        payType: "",
        merchantId: "",
        merchantName: ""
      },
      tableOptions: {
        totalCount: 0,
        currentPage: 1,
        MaxResultCount: 10,
        lists: []
      },
      browseTotal: 0,
      placeOrderTotal: 0,
      payCashTotal: 0,
      explainVisible: false,
      funnelDataVisible: false
    };
  },
  created() {
    this.getOrderSummary();
  },
  computed: {
    placeOrderRate() {
      if (!this.browseTotal) return "0%";
      let rate = (this.placeOrderTotal / this.browseTotal) * 100;
      return (Math.round(rate * 100) / 100).toFixed(2) + "%";
    },
    payCashRate() {
      if (!this.placeOrderTotal) return "0%";
      let rate = (this.payCashTotal / this.placeOrderTotal) * 100;
      return (Math.round(rate * 100) / 100).toFixed(2) + "%";
    },
    completeRate() {
      if (!this.browseTotal) return "0%";
      let rate = (this.payCashTotal / this.browseTotal) * 100;
      return (Math.round(rate * 100) / 100).toFixed(2) + "%";
    }
  },
  methods: {
    refreshClick() {
      this.getOrderSummary();
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getOrderSummary();
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      if (params.type == "2") {
        params.beginTime = params.beginTime + "-01";
        let end = new Date(params.endTime);
        let Year = end.getYear(); //当前年
        Year += Year < 2000 ? 1900 : 0; //
        let lastMonth = end.getMonth();
        let monthStartDate = new Date(Year, lastMonth, 1);
        let monthEndDate = new Date(Year, lastMonth + 1, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        params.endTime = dateFrom(end.setDate(days), "yyyy-MM-dd");
      }
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetProductStatisticalToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    searchData() {
      this.getOrderSummary();
    },
    dateTypeToggle(type) {
      this.searchForm.type = type;
      if (type == "1") {
        this.searchForm.beginTime = dateFrom(new Date(), "yyyy-MM-dd");
        this.searchForm.endTime = dateFrom(new Date(), "yyyy-MM-dd");
      } else {
        this.searchForm.beginTime = dateFrom(new Date(), "yyyy-MM");
        this.searchForm.endTime = dateFrom(new Date(), "yyyy-MM");
      }
      this.getOrderSummary();
    },
    drawFunnel() {
      let _this = this;
      let myChart = _this.$echarts.init(
        document.getElementById("chartContent")
      );
      myChart.setOption({
        tooltip: {
          show: false,
          formatter: function(params) {
            let { name, value } = params;
            let { total } = params.data;
            let toolTitle = `
            <div style='text-align:left;padding-left:10px;'> ${name} : ${total}</div>
           `;
            return toolTitle;
          }
        },
        color: ["#ff7978", "#66beb6", "#fdc074"],
        series: [
          {
            name: "订单统计",
            type: "funnel",
            left: "15%",
            top: 15,
            bottom: 15,
            width: "60%",
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 1,
            label: {
              normal: {
                show: true,
                position: "inside"
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            labelLine: {
              normal: {
                length: 10,
                lineStyle: {
                  width: 1,
                  type: "solid"
                }
              }
            },

            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 1
              }
            },
            data: [
              { total: _this.browseTotal, name: "浏览", value: 100 },
              { total: _this.placeOrderTotal, name: "下单", value: 60 },
              { total: _this.payCashTotal, name: "付款", value: 30 }
            ]
          }
        ]
      });
      myChart.on("mouseover", function(params) {
        _this.funnelDataVisible = true;
      });
      myChart.on("mouseout", function(params) {
        _this.funnelDataVisible = false;
      });
    },
    async getOrderSummary() {
      let params = {
        MaxResultCount: this.tableOptions.MaxResultCount,
        Filter: "", //搜索字段
        ...this.searchForm,
        Sorting: "" //排序字段
      };

      if (params.type == "2") {
        params.beginTime = params.beginTime + "-01";
        let end = new Date(params.endTime);
        let Year = end.getYear(); //当前年
        Year += Year < 2000 ? 1900 : 0; //
        let lastMonth = end.getMonth();
        let monthStartDate = new Date(Year, lastMonth, 1);
        let monthEndDate = new Date(Year, lastMonth + 1, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        params.endTime = dateFrom(end.setDate(days), "yyyy-MM-dd");
      }
      params.SkipCount =
        (this.tableOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let page = this.tableOptions.currentPage;
      this.tableOptions.lists = [];
      this.tableOptions.totalCount = 0;
      let res = await GetOrderStatistical(params);
      if (!res.success) return;
      this.tableOptions.currentPage = page;
      let { totalCount, items } = res.result;
      this.tableOptions.totalCount = totalCount;
      this.tableOptions.lists = items;
      this.browseTotal = 0;
      this.placeOrderTotal = 0;
      this.payCashTotal = 0;
      items.forEach(item => {
        this.browseTotal = this.browseTotal + item.browseCount;

        this.placeOrderTotal =
          item.pendingCount +
          item.processingCount +
          item.successfulCount +
          item.closeCount +
          this.placeOrderTotal;
        this.payCashTotal = this.payCashTotal + item.successfulCount;
      });
      this.$nextTick(() => {
        this.drawFunnel();
      });
    }
  },
  components: {
    BreadCrumb
    // ImagePreview
  }
};
</script>
<style lang="less">
.kaMoOrderSummaryContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  .partTitle {
    text-align: left;
    background: #f3f3f3;
    height: 45px;
    line-height: 45px;
    border: 1px solid #d7d7d7;
    font-size: 16px;
    position: relative;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    .el-button {
      position: absolute;
      right: 20px;
      top: 5px;
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
  }
  .refRow {
    text-align: left;
    background: #f3f3f3;
    border: 1px solid #d7d7d7;
    padding: 5px 0;
    font-size: 16px;
    .refForm {
      text-align: right;
      padding-right: 15px;
      .el-form-item {
        margin: 0 5px;
      }
    }
    .activeButton {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
    .el-button.is-plain:focus,
    .el-button.is-plain:hover {
      background-color: #2fc7a0;
      color: #fff;
    }
    .el-col {
      line-height: 35px;
    }
  }
  #chartContent {
    height: 300px;
  }
  @media screen and (max-width: 1220px) {
    .refRow {
      font-size: 14px;
    }
  }
  .insideContent {
    height: calc(100% - 70px);
    overflow: auto;
  }
  .contentCol {
    height: 43px;
    .imgContent {
      img {
        height: 100% !important;
        padding: 0 !important;
      }
    }
  }
  .dateType {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    > div {
      margin-top: 5px;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      padding: 0 10px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
    }
    .dateTypeBtnActive {
      background-color: #2fc7a0;
      color: #fff;
    }
  }
  .funnelDataCol {
    > div {
      text-align: left;
      padding-left: 20px;
      margin: 10px 0;
      .el-tag {
        min-width: 130px;
        font-size: 18px;
        margin: 0 10px;
        height: 35px;
        line-height: 35px;
      }
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


