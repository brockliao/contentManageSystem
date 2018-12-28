<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="getReport()">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="MallActivitySummary">
      <el-row type="flex" justify="start" class="refRow">
        <el-col :span="5" style="padding-left:15px;">活动参与人次排行
          <!--  -->
        </el-col>
        <el-col :span="19">
          <el-form ref="searchForm" :inline="true" :model="searchForm" class="refForm">
            <el-form-item>
              <el-select v-model="searchForm.type" size="small" placeholder="请选择活动类型" style="width:150px;">
                <el-option label="不限" value="-1"></el-option>
                <el-option label="团购" value="6"> </el-option>
                <el-option label="秒杀" value="7"></el-option>
                <el-option label="单品折扣" value="0"> </el-option>
                <el-option label="满减" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
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
          <i class="iconfont icon-menu"></i>活动参与人次报表
        </div>
        <el-table :data="tableOptions.lists" border style="width: 100%">
          <el-table-column prop="id" label="活动id"></el-table-column>
          <el-table-column prop="actLevel" label="活动级别"></el-table-column>
          <el-table-column prop="typeDisplay" label="活动类型"></el-table-column>
          <el-table-column label="商户id/名称">
            <template slot-scope="scope">
              {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="活动时长"></el-table-column>
          <el-table-column prop="number" label="参与人次"></el-table-column>
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
import { GetProductActivityStatistical } from "./../../../Apis";
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
      chartTitle: "活\n动\n参\n与\n人\n次",
      tableOptions: {
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0,
        lists: []
      },
      ids: [],
      chartItemsX: [],
      payAmounts: [],
      hots: [],
      checkedKey: "salesVolum",
      explainVisible: false
    };
  },
  watch: {},
  created() {
    this.getReport();
  },
  methods: {
    searchData() {
      this.tableOptions.currentPage = 1;
      if (
        !/^[1-9]\d*$/.test(this.searchForm.merchantId) &&
        this.searchForm.merchantId
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的商户id"
        });
      }
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
            let { times, duration, id } = params.data;
            let toolTitle = `<div style='text-align:left;padding-left:10px;'>${times}</div>
            <div style='text-align:left;padding-left:10px;'>活动id:  ${id}</div>
            <div style='text-align:left;padding-left:10px;'>活动时长:  ${duration}</div>
            <div style='text-align:left;padding-left:10px;'>参与人次:  ${value}</div>
            `;
            return toolTitle;
          }
        },
        // grid: {
        //   //直角坐标系内绘图网格
        //   // show: true, //是否显示直角坐标系网格。[ default: false ]
        //   bottom: "25%" //
        // },
        xAxis: {
          data: [..._this.ids],
          axisLabel: {
            interval: 0,
            top: 10,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 10; //每项显示文字个数
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
            name: "参与人次",
            type: "bar",
            data: [..._this.chartItemsX],
            rawdate: [],
            itemStyle: {
              color: "#3385ff"
            },
            barMinHeight: 10
          }
        ]
      });
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getReport();
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
      this.ids = [];
      this.chartItemsX = [];
      this.tableOptions.totalCount = 0;
      let res = await GetProductActivityStatistical(params);
      if (res.success) {
        this.tableOptions.currentPage = page;
        this.tableOptions.totalCount = res.result.totalCount;
        let lists = res.result.items;
        // 从大到小排序
        lists = this.$underscore.sortBy(lists, "number");
        lists = lists.reverse();
        this.tableOptions.lists = lists.map(item => {
          item["_payAmount"] = "￥" + item.payAmount;
          item["times"] = `${dateFrom(
            item.startDate,
            "yyyy-MM-dd"
          )} 至 ${dateFrom(item.endDate, "yyyy-MM-dd")}`;
          this.ids.push(item.id);
          this.chartItemsX.push({
            id: item.id,
            value: item.number,
            times: item.times,
            duration: item.duration
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
    BreadCrumb
  }
};
</script>
<style lang="less">
.MallActivitySummary {
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



