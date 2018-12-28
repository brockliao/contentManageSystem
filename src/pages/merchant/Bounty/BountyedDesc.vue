<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" size="medium" plain class="iconfont activeButton" @click="$router.back(-1)">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="UnBountyDescContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前奖励金初审状态: {{status == 0 ? "已初审" : "待初审"}}
        <el-button size="small" v-show="status == 2" plain class="iconfont recordButton" @click="openRecord()">初 审</el-button>
      </div>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="bountyDetail" border style="width: 100%">
        <el-table-column prop="sn" label="初审单号"></el-table-column>
        <el-table-column label="商户id / 名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merchantName}`}}
          </template>
        </el-table-column>
        <el-table-column prop="contactMobile" label="联系电话"></el-table-column>
        <el-table-column prop="timeSpan" label="初审时间区间"></el-table-column>
        <el-table-column prop="_amount" label="充值/消费产生奖励金"></el-table-column>
        <el-table-column v-if="status == 0 " prop="_deductAmount" label="取消交易奖励"></el-table-column>
        <el-table-column v-if="status == 0 " prop="_notAllowAmount" label="不予提现奖励金"></el-table-column>
        <el-table-column v-if="status == 0 " prop="_manualDeductAmount" label="手动扣除奖励金"></el-table-column>
        <el-table-column v-if="status == 0 " prop="_settlementAmount" label="本月应结奖励金"></el-table-column>
        <el-table-column v-if="status == 2 " prop="_settlementAmount" label="本月预计奖励金"></el-table-column>
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
            <el-select v-model="searchForm.payType" size="small" placeholder="支付平台" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="支付宝" value="1">
              </el-option>
              <el-option label="微信" value="2">
              </el-option>
            </el-select>
            <el-select v-model="searchForm.dealType" size="small" placeholder="交易类型" class="searchContentInput">
              <el-option label="不限" value="-1">
              </el-option>
              <el-option label="线下支付" value="1">
              </el-option>
              <el-option label="线下充值" value="2">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" format="yyyy-MM-dd" placeholder="选择开始日期">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" format="yyyy-MM-dd" placeholder="选择结束日期">
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
      <el-table :data="tableOptions.lists" border style="width: 100%" v-if="status == 0" key="auditTableOne">
        <el-table-column prop="dealSn" label="卡莫单号"></el-table-column>
        <el-table-column prop="dealType" label="交易类型" width="100"></el-table-column>
        <el-table-column prop="payType" label="支付平台" width="100"></el-table-column>
        <el-table-column prop="paidPlatformTranId" label="支付单号"></el-table-column>
        <el-table-column prop="userId" label="消费者id" width="100"></el-table-column>
        <el-table-column prop="_payTime" label="交易时间"></el-table-column>
        <el-table-column prop="_payAmount" label="交易金额" width="100"></el-table-column>
        <el-table-column prop="commissionRate" label="结算费率" width="100"> </el-table-column>
        <el-table-column prop="_rewardAmount" label="可得奖励金" width="100"></el-table-column>
        <el-table-column prop="isRewardDisplay" label="提现资格" width="100"></el-table-column>
        <el-table-column prop="reason" label="备注"></el-table-column>
      </el-table>

      <el-table :data="tableOptions.lists" border style="width: 100%" v-if="status == 2" key="auditTableTwo">
        <el-table-column prop="dealSn" label="卡莫单号"></el-table-column>
        <el-table-column prop="dealType" label="交易类型" width="100"></el-table-column>
        <el-table-column prop="payType" label="支付平台" width="100"></el-table-column>
        <el-table-column prop="paidPlatformTranId" label="支付单号"></el-table-column>
        <el-table-column prop="userId" label="消费者id" width="100"></el-table-column>
        <el-table-column prop="_payTime" label="交易时间"></el-table-column>
        <el-table-column prop="_payAmount" label="交易金额" width="100"></el-table-column>
        <el-table-column prop="commissionRate" label="结算费率" width="100"> </el-table-column>
        <el-table-column prop="_rewardAmount" label="可得奖励金" width="100"></el-table-column>
        <el-table-column label="提现资格">
          <template slot-scope="scope">
            <div :class="{'confirmSwitchActive':scope.row._isReward, 'confirmSwitch':!scope.row._isReward}" @click="openStatusDialog(scope.row)">
              <i class="confirmSwitchIcon"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount" layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="商户奖励金结算初审" :visible.sync="recordFormVisible" width="525px">
      <el-form :model="recordForm" :rules="statusRules" ref="recordForm" class="recordForm">
        <el-form-item style="margin:0;">
          <div>本月商户预计结算奖励金总额为：￥{{recordForm.settlementAmount}}，其中：</div>
        </el-form-item>
        <el-form-item style="margin:0;">
          <div>充值/消费产生奖励金金额为：￥{{recordForm.amount}}</div>
        </el-form-item>
        <el-form-item style="margin:0;">
          <div>取消交易扣除奖励金为：￥{{recordForm.deductAmount}}</div>
        </el-form-item>
        <el-form-item style="margin:0;">
          <div>不予提现奖励金金额为：￥{{recordForm.notAllowAmount}}</div>
        </el-form-item>
        <el-form-item prop="manualDeductAmount" style="margin:0;">
          <div>手动扣回奖励金金额为：￥<el-input type="text" v-model="recordForm.manualDeductAmount" size="small" style="width:100px" @blur="()=>{recordForm.isAll=false;calcAmount()}"></el-input>
            <el-checkbox v-model="recordForm.isAll" @change="calcAmount">全部扣回</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item style="margin:22px 0 0 0;">
          <div>则本月商户最终可提现奖励金金额为：￥{{recordForm.amountCommission}}</div>
        </el-form-item>
        <el-form-item label="初审意见：" prop="auditMemo">
          <div style="position:relative;">
            <el-input v-model="recordForm.auditMemo" type="textarea" maxlength="100"></el-input>
            <span style="position:absolute;right:15px;bottom:25px;">{{`${recordForm.auditMemo.length}/100`}}</span>
            <p style="height:25px;line-height:25px;color:#999;font-size:12px;">有手动扣回奖励金时，审核意见必填。</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRecord">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="cashFrom.title" :visible.sync="cashFromVisible" width="525px">
      <el-form :model="cashFrom" :rules="statusRules" ref="cashFrom" class="recordForm">
        <el-form-item>
          <div v-if="cashFrom.isReward === 2"><i class="iconfont icon-gantanhao"></i> 操作后，将不结算该笔交易产生的商户奖励金和服务商佣金，是否继续？</div>
          <div v-if="cashFrom.isReward === 1"><i class="iconfont icon-gantanhao"></i> 操作后，将结算该笔交易产生的商户奖励金和服务商佣金，是否继续？</div>
        </el-form-item>
        <el-form-item :label="cashFrom.reasonLabel" prop="reason" style="margin:0;">
          <div style="position:relative;">
            <el-input v-model="cashFrom.reason" type="textarea" maxlength="30"></el-input>
            <span style="position:absolute;right:15px;bottom:0;">{{`${cashFrom.reason.length}/30`}}</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cashFromVisible = false">取 消</el-button>
        <el-button type="primary" @click="setCash">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import { downFile, dateFrom, getStorage, rmStorage } from "./../../../utils";
import {
  GetRewardDetail,
  GetRewardDetailToExcel,
  AuditReward,
  SetDealIsReward,
  GetRewardRecordedList
} from "./../../../Apis";
export default {
  data() {
    let remarkValidate = function(rule, value, callback) {
      // 存在手动扣回 必填
      let recordForm = this.recordForm;
      if (
        recordForm.manualDeductAmount &&
        recordForm.manualDeductAmount !== "0"
      ) {
        recordForm.auditMemo
          ? callback()
          : callback(new Error("审核意见不可以为空"));
      } else {
        callback();
      }
    };
    let manualValidate = function(rule, value, callback) {
      let recordForm = this.recordForm;

      if (!value) {
        recordForm.manualDeductAmount = 0;
        this.calcAmount();
        callback();
      }

      if (value > recordForm.maxManual) {
        recordForm.manualDeductAmount = recordForm.maxManual;
        this.calcAmount();
        callback();
      }
      if (
        /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) ||
        value == "0"
      ) {
        callback();
      } else {
        callback(new Error("手动扣回奖励金金额格式不正确"));
      }
    };
    return {
      breadList: [
        { label: "商户奖励金结算" },
        { label: "奖励金初审" },
        { label: "详情" }
      ],
      status: "",
      merchantId: "",
      type: 1,
      rowData: {},
      bountyDetail: [],
      searchForm: {
        dealType: "",
        payType: "",
        beginTime: "",
        endTime: "",
        dealSn: "",
        platformNo: ""
      },
      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0
      },
      recordFormVisible: false,
      recordForm: {
        settleId: "",
        amount: 0,
        settlementAmount: 0,
        deductAmount: 0,
        maxManual: 0,
        manualDeductAmount: 0,
        notAllowAmount: 0,
        amountCommission: 0,
        isAll: false,
        auditMemo: ""
      },
      statusRules: {
        auditMemo: [{ validator: remarkValidate.bind(this), trigger: "blur" }],
        manualDeductAmount: [
          { validator: manualValidate.bind(this), trigger: "blur" }
        ],
        reason: [{ required: true, message: "原因不可为空", trigger: "change" }]
      },
      cashFromVisible: false,
      cashFrom: {
        title: "提现",
        reasonLabel: "",
        reason: "",
        isReward: "",
        id: ""
      }
    };
  },
  async created() {
    this.merchantId = this.$route.query.merchantId || "";
    let key = this.$route.query.key || "";
    let options = getStorage(key);
    if (!options) options = "";
    this.rowData = JSON.parse(options);
    await this.initTimes();
    this.initDetail();
    this.initBusinessLists();
  },
  methods: {
    refreshCallback() {
      this.initDetail();
      this.initBusinessLists();
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.initBusinessLists();
    },
    async searchData(isInit) {
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
        await this.initTimes();
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
    openRecord() {
      let rowData = this.rowData;
      let recordForm = this.recordForm;
      recordForm.amount = rowData.amount || 0;
      recordForm.settlementAmount = rowData.settlementAmount || 0;
      recordForm.deductAmount = rowData.deductAmount || 0;
      recordForm.manualDeductAmount = rowData.manualDeductAmount || 0;
      recordForm.notAllowAmount = rowData.notAllowAmount || 0;
      recordForm.settleId = rowData.id;
      recordForm.maxManual =
        rowData.amount - rowData.deductAmount - rowData.notAllowAmount;
      recordForm.maxManual =
        recordForm.maxManual > 0 ? recordForm.maxManual : 0;
      recordForm.maxManual = (
        Math.round(recordForm.maxManual * 100) / 100
      ).toFixed(2);
      // 可提现 本月 - 取消 - 不予 - 手动
      recordForm.amountCommission =
        rowData.amount -
        rowData.deductAmount -
        rowData.notAllowAmount -
        rowData.manualDeductAmount;
      recordForm.amountCommission =
        recordForm.amountCommission > 0 ? recordForm.amountCommission : 0;
      recordForm.amountCommission = (
        Math.round(recordForm.amountCommission * 100) / 100
      ).toFixed(2);
      this.recordFormVisible = true;
    },
    calcAmount() {
      let recordForm = this.recordForm;
      if (recordForm.isAll) {
        recordForm.manualDeductAmount = recordForm.maxManual;
        recordForm.amountCommission = 0;
        recordForm.amountCommission = (
          Math.round(recordForm.amountCommission * 100) / 100
        ).toFixed(2);
      } else {
        recordForm.amountCommission =
          recordForm.amount -
          recordForm.deductAmount -
          recordForm.notAllowAmount -
          recordForm.manualDeductAmount;
        recordForm.amountCommission =
          recordForm.amountCommission > 0 ? recordForm.amountCommission : 0;
        recordForm.amountCommission = (
          Math.round(recordForm.amountCommission * 100) / 100
        ).toFixed(2);
      }
    },
    setRecord() {
      let _this = this;
      _this.$refs.recordForm.validate(async valid => {
        if (valid) {
          let params = {
            settleId: _this.recordForm.settleId,
            auditMemo: _this.recordForm.auditMemo,
            manualDeductAmount: _this.recordForm.manualDeductAmount
          };
          let res = await AuditReward(params);
          if (res.success) {
            _this.$message({
              type: "success",
              message: "初审成功"
            });
            _this.recordFormVisible = false;
            _this.status = 0;
            _this.initBusinessLists();
            _this.refreshCommon();
          }
        } else {
          return false;
        }
      });
    },
    async exportData() {
      let params = {
        merchantId: this.merchantId,
        type: this.type,
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }

      let res = await GetRewardDetailToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    openStatusDialog(rowData) {
      let _isReward = !rowData._isReward;
      let cashFrom = this.cashFrom;
      cashFrom.title = _isReward ? "提现" : "不予提现";
      cashFrom.reasonLabel = _isReward ? "提现意见" : "不予提现意见";
      cashFrom.isReward = _isReward ? 1 : 2;
      cashFrom.id = rowData.id;
      this.cashFromVisible = true;
    },
    setCash() {
      let _this = this;
      _this.$refs.cashFrom.validate(async valid => {
        if (valid) {
          let params = {
            id: _this.cashFrom.id,
            isReward: _this.cashFrom.isReward,
            reason: _this.cashFrom.reason
          };
          let res = await SetDealIsReward(params);
          if (res.success) {
            _this.$message("设置成功");
            _this.cashFromVisible = false;
            _this.initBusinessLists();
          }
        } else {
          return false;
        }
      });
    },
    async initBusinessLists() {
      let _this = this;
      let params = {
        merchantId: this.merchantId,
        type: this.type,
        ..._this.searchForm,
        MaxResultCount: _this.tableOptions.MaxResultCount
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
            item["_isReward"] = item.isReward === 1 ? true : false;
          }
        });
        _this.tableOptions.lists = [...lists];
      }
    },
    async initDetail() {
      let details = this.rowData;
      this.status = details.status || 0;
      this.bountyDetail = [details];
    },
    async refreshCommon() {
      let { currentPage, searchForm } = this.$store.state.listOptions;
      let _this = this;
      let params = {
        ...searchForm,
        MaxResultCount: 10
      };
      params.SkipCount = (currentPage - 1) * params.MaxResultCount;
      params.beginTime = await _this.setMonthDay(false, params.beginTime);
      params.endTime = await _this.setMonthDay(true, params.endTime);
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetRewardRecordedList(params);
      if (res.success) {
        let lists = res.result.items;
        let options = getStorage("BountyedListRow");
        if (!options) return;
        let rowData = JSON.parse(options);
        lists.forEach(item => {
          if (item.merchantId === rowData.merchantId) {
            item["_amount"] = "￥" + item.amount;
            item["_deductAmount"] = "￥" + item.deductAmount;
            item["_settlementAmount"] = "￥" + item.settlementAmount;
            item["_auditTime"] = dateFrom(item.auditTime);
            item["_manualDeductAmount"] = "￥ " + item.manualDeductAmount;
            item["_notAllowAmount"] = "￥ " + item.notAllowAmount;
            _this.rowData = item;
            _this.status = item.status;
            _this.bountyDetail = [item];
          }
        });
      }
    },
    setMonthDay(isEnd, time) {
      // 处理时间 开始时间，1号， 结束月底
      if (isEnd) {
        if (!time) return "";
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let monthStartDate = new Date(year, month - 1, 1);
        let monthEndDate = new Date(year, month, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        if (month < 10) month = "0" + month;
        if (days < 10) days = "0" + days;
        return year + "-" + month + "-" + days;
      } else {
        if (!time) return "";
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) month = "0" + month;
        return year + "-" + month + "-01";
      }
    },
    initTimes() {
      if (!this.rowData.beginTime) {
        this.searchForm.beginTime = "";
      } else {
        this.searchForm.beginTime = new Date(this.rowData.beginTime);
      }
      if (!this.rowData.endTime) {
        this.searchForm.endTime = "";
      } else {
        let date = new Date(this.rowData.endTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let monthStartDate = new Date(year, month - 1, 1);
        let monthEndDate = new Date(year, month, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        if (month < 10) month = "0" + month;
        if (days < 10) days = "0" + days;
        this.searchForm.endTime = year + "-" + month + "-" + days;
      }
    }
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
.UnBountyDescContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .el-table th {
    text-align: center;
    color: #000;
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
    position: relative;
    .recordButton {
      position: absolute;
      right: 20px;
      top: 10px;
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
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
  .confirmSwitch {
    background: rgb(220, 223, 230);
    height: 20px;
    width: 40px;
    position: relative;
    border-radius: 20px;
    margin: auto;
    cursor: pointer;
    .confirmSwitchIcon {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      position: absolute;
      background: #fff;
      left: 2px;
      top: 2px;
    }
  }
  .confirmSwitchActive {
    background: rgb(19, 206, 102);
    height: 20px;
    width: 40px;
    position: relative;
    border-radius: 20px;
    margin: auto;
    cursor: pointer;
    .confirmSwitchIcon {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      position: absolute;
      background: #fff;
      right: 2px;
      top: 2px;
    }
  }
}
.recordForm .el-form-item__content {
  text-align: left;
  color: #333333;
  font-size: 16px;
}
</style>
