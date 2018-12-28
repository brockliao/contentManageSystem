<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" size="medium" plain class="iconfont activeButton" @click="backCallBack">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="UnBountyDescContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前奖励金出账状态: {{status}}
      </div>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="bountyDetail" border style="width: 100%">
        <el-table-column label="商户id / 名称">
          <template slot-scope="scope">
            {{`${scope.row.merChantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column prop="contactMobile" label="联系电话"></el-table-column>
        <el-table-column prop="_onlineAmount" label="充值/消费产生奖励金"></el-table-column>
        <el-table-column prop="_invalidAmount" label="无效交易奖励"></el-table-column>
        <el-table-column prop="_rewardAmount" label="本月预计结算奖励金"></el-table-column>
      </el-table>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>线下充值支付明细
      </div>
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.payType" size="small" placeholder="支付平台" key="payType" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="微信" value="2">
              </el-option>
              <el-option label="支付宝" value="1">
              </el-option>
            </el-select>
            <el-select v-model="searchForm.dealType" size="small" placeholder="交易类型" key="dealType" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="线下支付" value="1">
              </el-option>
              <el-option label="线下充值" value="2">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择开始日期">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.dealSn" size="small" placeholder="卡莫单号"></el-input>
            <el-input v-model="searchForm.platformNo" size="small" placeholder="支付平台单号"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>交易明细列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="dealSn" label="卡莫单号"></el-table-column>
        <el-table-column prop="dealType" label="交易类型" width="100"></el-table-column>
        <el-table-column prop="payType" label="支付平台" width="100"></el-table-column>
        <el-table-column prop="paidPlatformTranId" label="支付单号"></el-table-column>
        <el-table-column prop="userId" label="消费者ID" width="100"></el-table-column>
        <el-table-column prop="_payTime" label="交易时间"></el-table-column>
        <el-table-column prop="_payAmount" label="交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="结算费率" width="100"></el-table-column>
        <el-table-column prop="_rewardAmount" label="可得奖励金"></el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount" layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import { downFile, dateFrom, getStorage, rmStorage } from "./../../../utils";
import { GetRewardDetail, GetRewardDetailToExcel } from "./../../../Apis";
export default {
  data() {
    return {
      breadList: [
        { label: "商户奖励金结算" },
        { label: "未出账查询" },
        { label: "详情" }
      ],
      rowData: {},
      status: "",
      type: 0,
      merChantId: "",
      bountyDetail: [],
      searchForm: {
        payType: "",
        dealType: "",
        beginTime: "",
        endTime: "",
        dealSn: "",
        platformNo: ""
      },
      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 15,
        totalCount: 0
      }
    };
  },
  created() {
    this.merChantId = this.$route.query.merChantId || 0;
    let key = this.$route.query.key;
    let options = getStorage(key);
    if (!options) options = "";
    this.rowData = JSON.parse(options);
    this.initDetail();
    this.initBusinessLists();
  },
  methods: {
    refreshCallback() {
      this.initDetail();
      this.initBusinessLists();
    },
    backCallBack() {
      this.$router.back(-1);
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initBusinessLists();
    },
    searchData(isInit) {
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
      }
      if (
        !/^[1-9]\d*$/.test(this.searchForm.dealSn) &&
        this.searchForm.dealSn
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的卡莫单号"
        });
      }
      if (
        !/^[1-9]\d*$/.test(this.searchForm.platformNo) &&
        this.searchForm.platformNo
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的支付平台单号"
        });
      }
      this.tableOptions.currentPage = 1;
      this.initBusinessLists();
    },
    async exportData() {
      let params = {
        merChantId: this.merChantId,
        type: this.type,
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetRewardDetailToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    async initBusinessLists() {
      let _this = this;
      let params = {
        ..._this.searchForm,
        merChantId: this.merChantId,
        MaxResultCount: _this.tableOptions.MaxResultCount,
        type: _this.type
      };
      let page = this.tableOptions.currentPage;
      params.SkipCount =
        (_this.tableOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetRewardDetail(params);
      this.tableOptions.currentPage = page;
      if (res.success) {
        _this.tableOptions.totalCount = res.result.totalCount;
        let lists = res.result.items;
        lists.forEach(item => {
          for (let key in item) {
            item["_payTime"] = dateFrom(item.payTime, "yyyy-MM-dd HH:mm:ss");
            item["_payAmount"] = "￥" + item.payAmount;
            item["_rewardAmount"] = "￥" + item.rewardAmount;
            item["_commissionRate"] = item.commissionRate + "%";
          }
        });
        _this.tableOptions.lists = [...lists];
      }
    },
    async initDetail() {
      let rowData = this.rowData;
      if (rowData) {
        this.bountyDetail = [rowData];
        this.status = rowData.status;
      }
    }
  },
  components: {
    BreadCrumb
  },
  // beforeRouteLeave(to, from, next) {
  //   let key = this.$route.query.key;
  //   if (key) rmStorage(key);
  //   next();
  // }
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
.UnBountyDescContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .el-table th {
    text-align: center;
    color: #000;
    background-color: #f3f3f3f3;
    border: 1px solid #d5d5d5;
  }

  .statusRow {
    text-align: left;
    background: #f3f3f3;
    height: 60px;
    line-height: 60px;
    i {
      margin: 0 10px;
      font-size: 20px;
    }
    font-size: 16px;
  }
  .dataBaseRow {
    text-align: left;
    height: 35px;
    line-height: 35px;
    margin: 10px 0;
    i {
      color: #999;
      margin: 0 10px;
      font-size: 21px;
    }
    color: #333;
    font-size: 17px;
  }
  .toggleTypeRow {
    background: #f3f3f3;
    text-align: left;
    padding-left: 30px;
    > div {
      padding: 10px 0;
    }
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
  .el-table td,
  .el-table th.is-leaf {
    background: #f9fafc;
  }
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
