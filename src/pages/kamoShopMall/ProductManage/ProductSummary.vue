<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="getReport()">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="productSummaryContainer">
      <el-row type="flex" justify="start" class="refRow">
        <el-col :span="5" style="padding-left:15px;">商品销量/营收/人气排行
          <el-popover placement="left-start" title="" width="410" trigger="click" v-model="explainVisible">
            <template>
              <div class="explainTitle"><span>商品统计指数说明</span><span class="iconfont icon-close" @click="explainVisible=false"></span></div>
              <div class="explainText">① 销量排行，统计时间区间内商品销量由多至少的排行</div>
              <div class="explainText">② 营收排行，统计时间区间内商品营收，即用户实付累计金额由多至少的排行</div>
              <div class="explainText">③ 人气排行，统计商品的人气由高至低的排行。</div>
              <div class="explainText"> 商品人气值计算：被购买1次，+5；被查看1次，+1；被 收藏1次，+1；被分享1次，+1。相关数值累计相加，即为某商品的人气值</div>
            </template>
            <el-button slot="reference" type="text" size="medium" class="explainBtn">统计说明</el-button>
          </el-popover>
        </el-col>
        <el-col :span="19">
          <el-form ref="searchForm" :inline="true" :model="searchForm" class="refForm">
            <el-form-item>
              <el-select v-model="searchForm.type" size="small" placeholder="商品类目" style="width:120px;">
                <el-option label="不限" value="-1"></el-option>
                <el-option label="普通商品" value="1"> </el-option>
                <el-option label="兑换券" value="0"></el-option>
                <el-option label="年次卡" value="3"> </el-option>
                <el-option label="虚拟卡券" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.id" size="small" placeholder="商品id" maxlength="30" style="width:100px;"></el-input>
              <el-input v-model="searchForm.name" size="small" placeholder="商品名称" maxlength="30" style="width:100px;"></el-input>
              <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30" style="width:100px;"></el-input>
              <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="insideContent">
        <div id="chartContent" style="margin-bottom:15px;"></div>
        <div class="partTitle">
          <i class="iconfont icon-menu"></i>商品销量/营收/人气报表
        </div>
        <el-table :data="tableOptions.lists" border style="width: 100%">
          <el-table-column label="商品id/名称">
            <template slot-scope="scope">
              {{`${scope.row.id || ''}/${ scope.row.name || ''}`}}
            </template>
          </el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <div class="contentCol">
                <ImagePreview :imageUrl="scope.row.img"></ImagePreview>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="typeDisplay" label="商品类目" width="120"></el-table-column>
          <el-table-column prop="salesVolum" label="销量" width="120"></el-table-column>
          <el-table-column prop="_payAmount" label='实收金额' width="120"></el-table-column>
          <el-table-column prop="hot" label="人气值" width="120"></el-table-column>
          <el-table-column prop="saleTime" label="销售时间" width="180"></el-table-column>
          <el-table-column label="商户id/名称">
            <template slot-scope="scope">
              {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
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
import ImagePreview from "./../../../components/ImagePreview";
import { GetProductStatistical } from "./../../../Apis";
import { dateFrom, getStorage, setStorage } from "./../../../utils";

export default {
  data() {
    return {
      breadList: [{ label: "商品统计" }],
      searchForm: {
        type: "",
        id: "",
        name: "",
        merchantId: "",
        merchantName: ""
      },
      chartTitle: "商\n品\n销\n量\n︵\n件\n︶\n",
      tableOptions: {
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0,
        lists: []
      },
      productNames: [],
      salesVolums: [],
      payAmounts: [],
      hots: [],
      checkedKey: "salesVolum",
      explainVisible: false
    };
  },
  watch: {
    chartTitle: function(newName, oldName) {
      // this.drawCharts();
      this.sortByChart();
    }
  },
  created() {
    this.getReport();
  },
  mounted() {
    // 动态设置背景图的高度为浏览器可视区域宽高度clientWidth clientHeight
    const _this = this;
    // 首先在Virtual DOM渲染数据时，设置下背景图的宽高度clientWidth clientHeight．
    // _this.clientWidth = `${document.documentElement.clientWidth}px`;
    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．

    window.onresize = function temp() {
      // _this.clientWidth = `${document.documentElement.clientWidth}px`;
      _this.drawCharts();
    };
  },
  methods: {
    searchData() {
      this.tableOptions.currentPage = 1;
      this.getReport();
    },
    drawCharts() {
      let _this = this;
      let myChart = _this.$echarts.init(
        document.getElementById("chartContent")
      );
      myChart.setOption({
        title: {
          text: _this.chartTitle,
          top: "30%",
          left: "2%"
        },
        tooltip: {
          formatter: function(params) {
            let { seriesName, name, value } = params;
            let { saleTime } = params.data;
            let toolTitle = `<div style='text-align:left;padding-left:10px;'>${saleTime}</div>
            <div style='text-align:left;padding-left:10px;'>商品名称:  ${name}</div>
            <div style='text-align:left;padding-left:10px;'>${
              seriesName == "销量"
                ? "销售数量:"
                : seriesName == "营收"
                ? "营收金额: ￥"
                : seriesName == "人气"
                ? "人气值"
                : ""
            }  ${value}</div>
            `;
            return toolTitle;
          }
        },
        grid: {
          //直角坐标系内绘图网格
          // show: true, //是否显示直角坐标系网格。[ default: false ]
          bottom: "25%" //
        },
        legend: {
          type: "scroll",
          top: 10,
          right: 20,
          selectedMode: "single"
        },
        xAxis: {
          data: [..._this.productNames],
          axisLabel: {
            interval: 0,
            // rotate: 35,
            top: 10,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 8; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [..._this.salesVolums],
            rawdate: [],
            itemStyle: {
              color: "#3385ff"
            },
            barMinHeight: 10
          },
          {
            name: "营收",
            type: "bar",
            data: [..._this.payAmounts],
            rawdate: [],
            itemStyle: {
              color: "#2fc7a0"
            },
            barMinHeight: 10
          },
          {
            name: "人气",
            type: "bar",
            data: [..._this.hots],
            rawdate: [],
            itemStyle: {
              color: "#e34"
            },
            barMinHeight: 10
          }
        ]
      });
      myChart.on("legendselectchanged", function(param) {
        if (param.name == "销量") {
          _this.chartTitle = "商\n品\n销\n量\n︵\n件\n︶\n";
          _this.checkedKey = "salesVolum";
        }
        if (param.name == "营收") {
          _this.chartTitle = "商\n品\n营\n收\n︵\n元\n︶\n";
          _this.checkedKey = "payAmount";
        }
        if (param.name == "人气") {
          _this.chartTitle = "商\n品\n人\n气\n︵\n人\n︶\n";
          _this.checkedKey = "hot";
        }
      });
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getReport();
    },
    sortByChart() {
      this.productNames = [];
      this.salesVolums = [];
      this.payAmounts = [];
      this.hots = [];
      let lists = [...this.tableOptions.lists];
      this.tableOptions.lists = [];
      lists = this.$underscore.sortBy(lists, this.checkedKey);
      lists = lists.reverse();
      this.tableOptions.lists = lists.map(item => {
        item["_payAmount"] = "￥" + item.payAmount;
        this.productNames.push(item.name);
        // // 排序
        this.salesVolums.push({
          id: item.id,
          value: item.salesVolum,
          saleTime: item.saleTime
        });
        this.payAmounts.push({
          id: item.id,
          value: item.payAmount,
          saleTime: item.saleTime
        });
        this.hots.push({
          id: item.id,
          value: item.hot,
          saleTime: item.saleTime
        });
        return item;
      });
      this.drawCharts();
    },
    async getReport() {
      let params = {
        ...this.searchForm,
        MaxResultCount: this.tableOptions.MaxResultCount
      };
      params.SkipCount =
        (this.tableOptions.currentPage - 1) * params.MaxResultCount;
      let page = this.tableOptions.currentPage;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      this.tableOptions.lists = [];
      this.productNames = [];
      this.salesVolums = [];
      this.payAmounts = [];
      this.hots = [];
      this.tableOptions.totalCount = 0;
      let res = await GetProductStatistical(params);
      if (res.success) {
        this.tableOptions.currentPage = page;
        this.tableOptions.totalCount = res.result.totalCount;
        let lists = res.result.items;
        lists = this.$underscore.sortBy(lists, this.checkedKey);
        lists = lists.reverse();
        this.tableOptions.lists = lists.map(item => {
          item["_payAmount"] = "￥" + item.payAmount;
          this.productNames.push(item.name);
          // // 排序
          this.salesVolums.push({
            id: item.id,
            value: item.salesVolum,
            saleTime: item.saleTime
          });
          this.payAmounts.push({
            id: item.id,
            value: item.payAmount,
            saleTime: item.saleTime
          });
          this.hots.push({
            id: item.id,
            value: item.hot,
            saleTime: item.saleTime
          });
          return item;
        });
        this.$nextTick(() => {
          this.drawCharts();
        });
      }
    }
  },
  components: {
    BreadCrumb,
    ImagePreview
  }
};
</script>
<style lang="less">
.productSummaryContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  .partTitle {
    text-align: left;
    background: #f3f3f3;
    height: 35px;
    line-height: 35px;
    border: 1px solid #d7d7d7;
    font-size: 16px;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
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
    border: 1px solid #ccc;
    height: 400px;
  }
  @media screen and (max-width: 1220px) {
    .refRow {
      font-size: 14px;
    }
  }
  .insideContent {
    height: calc(100% - 70px);
    overflow: auto;
    > div {
      min-width: 1500px;
    }
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



