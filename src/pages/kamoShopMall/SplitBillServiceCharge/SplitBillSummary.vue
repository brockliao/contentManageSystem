<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="SplitBillSummary">
      <div class="summaryTitle">
        <i class="iconfont icon-yun yunIcon"></i><i class="iconfont icon-barsalt barIcon"></i>分账服务费统计
      </div>
      <el-row class="summaryContent" type="flex" justify="between">
        <el-col class="summaryItem" v-for="(item,index) in summaryData" :key="index" :span="4">
          <div>
            <div class="envIcon">
              <span></span>
              <i>ICON</i>
              <span></span>
            </div>
            <div class="envTitle">
              <div>{{item.label}}</div>
              <div>
                <i>{{item.acount}}</i><i> ￥{{item.money}}</i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="分账时间：">
            <el-date-picker v-model="searchForm.time" size="small" type="month" value-format="yyyy-MM" format="yyyy-MM"
              placeholder="选择时间">
            </el-date-picker>
            <!-- <el-date-picker v-model="searchForm.endTime" size="small" type="month" value-format="yyyy-MM" format="yyyy-MM"
              placeholder="选择结束时间">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>分账服务费统计
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column label="商户id/名称">
          <template slot-scope="scope">
            {{`${scope.row.id || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="spanTime" label="统计月份" width="100"></el-table-column>
        <el-table-column label="商城交易笔数 | 服务费总额">
          <template slot-scope="scope">
            {{`${scope.row.transactionCount || '0'} | ${ scope.row._serviceFee || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="test" label="待分账笔数|服务费金额">
          <template slot-scope="scope">
            {{`${scope.row.pendingCount || '0'} | ${ scope.row._pendingServiceFee || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="test" label="分账成功笔数|服务费金额">
          <template slot-scope="scope">
            {{`${scope.row.successCount || '0'} | ${ scope.row._successServiceFee || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="test" label="分账失败笔数|服务费金额">
          <template slot-scope="scope">
            {{`${scope.row.failCount || '0'} | ${ scope.row._failServiceFee || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="test" label="退款笔数|退还服务费">
          <template slot-scope="scope">
            {{`${scope.row.refundCount || '0'} | ${ scope.row._serviceFeeReturn || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="_withdrawalServiceFeeReturn" label="已提现退还服务费" width="130"></el-table-column>
        <el-table-column prop="_pendingServiceFeeReturn" label="待提现退还服务费" width="130"></el-table-column>
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

import {
  GetProfitSharingServiceFee,
  GetProfitSharingStatistical,
  GetProfitSharingStatisticalToExcel
} from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "分账服务费统计" }],
      searchForm: {
        merchantId: "",
        merchantName: "",
        time: ""
        // endTime: ""
      },
      summaryData: [
        {
          acount: 0,
          money: 0,
          label: "待分账",
          key: "pendingServiceFee",
          akey: "pendingServiceFeeCount"
        },
        {
          acount: 0,
          money: 0,
          label: "分账成功",
          key: "successServiceFee",
          akey: "successServiceFeeCount"
        },
        {
          acount: 0,
          money: 0,
          label: "分账失败",
          key: "failServiceFee",
          akey: "failServiceFeeCount"
        },
        {
          acount: 0,
          money: 0,
          label: "退还服务费",
          key: "serviceFeeReturn",
          akey: "serviceFeeReturnCount"
        },
        {
          acount: 0,
          money: 0,
          label: "已提现服务费",
          key: "withdrawalServiceFeeReturn",
          akey: "withdrawalServiceFeeReturnCount"
        },
        {
          acount: 0,
          money: 0,
          label: "待提现服务费",
          key: "pendingServiceFeeReturn",
          akey: "pendingServiceFeeReturnCount"
        }
      ],
      tableOptions: {
        currentPage: 1,
        MaxResultCount: 15,
        totalCount: 0,
        lists: []
      }
    };
  },
  async created() {
    let listOptions = this.$store.state.listOptions;
    if (listOptions && listOptions.currentPage) {
      for (let key in this.searchForm) {
        this.searchForm[key] = listOptions.searchForm[key];
      }
      this.tableOptions.currentPage = listOptions.currentPage;
    } else {
      await this.initMonths();
    }
    this.getHearder();
    this.getLists();
  },
  methods: {
    resfreshClick() {
      this.getHearder();
      this.getLists();
    },
    async searchData(isInit) {
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
        await this.initMonths();
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
      this.getLists();
      this.getHearder();
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getLists();
    },
    initMonths() {
      let date = new Date();
      let month = date.getMonth();
      this.searchForm.time = dateFrom(date, "yyyy-MM");
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetProfitSharingStatisticalToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    async getHearder() {
      let headerRes = await GetProfitSharingServiceFee({
        time: this.searchForm.time
      });
      if (headerRes.success) {
        let { result } = headerRes;
        this.summaryData.forEach(item => {
          item.money = (Math.round(result[item.key] * 100) / 100).toFixed(2);
          item.acount = result[item.akey] || 0;
        });
      }
    },
    async getLists() {
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
      const MONEYS = [
        "pendingServiceFeeReturn",
        "withdrawalServiceFeeReturn",
        "serviceFeeReturn",
        "failServiceFee",
        "successServiceFee",
        "pendingServiceFee",
        "serviceFee"
      ];
      let res = await GetProfitSharingStatistical(params);
      if (!res.success) return;
      let { items, totalCount } = res.result;
      this.tableOptions.totalCount = totalCount;
      this.tableOptions.currentPage = page;
      this.tableOptions.lists = items.map(item => {
        for (let key in item) {
          if (MONEYS.includes(key)) {
            item["_" + key] = "￥" + item[key];
          }
        }
        return item;
      });
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style lang="less">
.SplitBillSummary {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .partTitle,
  .summaryTitle {
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
    .yunIcon {
      z-index: 8;
      font-size: 22px;
    }
    .barIcon {
      color: #fff;
      position: absolute;
      left: 10px;
      z-index: 9;
      font-size: 8px;
    }
  }
  .summaryTitle {
    border-bottom: 0;
  }
  .summaryContent {
    background: #f3f3f3;
    border: 1px solid #d7d7d7;
    border-top: 0;
    margin-bottom: 10px;
    flex-wrap: wrap;
    .summaryItem {
      line-height: 55px;
      min-width: 200px;
      padding: 10px;
      > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        background: #fff;
      }
      .envIcon {
        position: relative;
        background: #f3f3f3;
        height: 35px;
        line-height: 35px;
        margin: 0 10px;
        overflow: hidden;
        border: 1px solid #999;
        > span {
          display: inline-block;
          border: 1px solid #eee;
          position: absolute;
        }
        span:nth-child(1) {
          border-left: 1px solid #999;
          width: 0;
          height: 66px;
          transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -webkit-transform: rotate(51deg);
          -o-transform: rotate(45deg);
          display: inline-block;
          position: absolute;
          z-index: 1;
          top: -13px;
          left: 17px;
        }
        > i {
          z-index: 3;
          position: relative;
          font-size: 12px;
          padding: 0 7px;
          background: #f3f3f3;
          color: #999999;
        }
        span:nth-child(3) {
          border-left: 1px solid #999;
          width: 0;
          height: 64px;
          transform: rotate(135deg);
          -ms-transform: rotate(135deg);
          -moz-transform: rotate(135deg);
          -webkit-transform: rotate(128deg);
          -o-transform: rotate(135deg);
          display: inline-block;
          position: absolute;
          z-index: 1;
          top: -12px;
          left: 25px;
        }
      }
      .envTitle {
        div:nth-child(1) {
          text-align: left;
          padding-left: 5px;
          color: #999999;
        }
        > div {
          height: 25px;
          line-height: 25px;
          i {
            margin: 0 10px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .textCol {
    text-align: left;
    height: 25px;
    line-height: 25px;
    font-size: 16px;
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
  .cirleIcon {
    display: inline-block;
    height: 6px;
    line-height: 6px;
    width: 6px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .cirleIconSuccess {
    background: #2fc7a0;
  }
  .cirleIconFail {
    background: #990000;
  }
  .cirleIconWait {
    background: #ff6600;
  }
}

.shelvesBtn {
  border-color: #2fc7a0;
  color: #2fc7a0;
}
.auditBtn {
  border-color: #2fc7a0;
  color: #fff;
  background: #2fc7a0;
}
.auditBtn:hover {
  border-color: #2fc7a0 !important;
  color: #fff !important;
  background: #2fc7a0 !important;
}
// .el-button.is-plain:focus,
// .el-button.is-plain:hover {
//   border-color: #2fc7a0;
//   color: #2fc7a0;
// }
</style>



