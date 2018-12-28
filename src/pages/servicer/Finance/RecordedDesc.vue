<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" plain size="medium" class="iconfont activeButton" @click="closeCallback">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="recordedDescContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前佣金处理状态: {{status ? '已初审' :'待初审'}}
        <!-- <LogDialog></LogDialog> -->
        <el-button size="medium" plain class="iconfont recordButton" v-if="!status" @click="openRecord()">初 审</el-button>
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="serviceProviderInfoData" border style="width: 100%">
        <el-table-column label="初审单号">
          <template slot-scope="scope">
            <div>{{orderNo}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="timeSpn" label="时间区间"></el-table-column>
        <el-table-column label="服务商ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.id || ''} / ${scope.row.name}`}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="服务商等级">
          <template slot-scope="scope">
            <div><span v-if="level==1">卡莫</span><span v-else-if="level==2">城市</span><span v-else-if="level==3">普通</span></div>
          </template>
        </el-table-column> -->
        <el-table-column prop="headMobile" label="联系电话"></el-table-column>
        <el-table-column prop="softWareCommission" label="软件服务费分润"></el-table-column>
      </el-table>
      <el-table :data="serviceProviderInfoData" border style="width: 100%">
        <el-table-column prop="onlinePaymentCommission" label="线下支付充值分润"></el-table-column>
        <el-table-column prop="mallTransactionCommission" label="卡莫商城交易分润"></el-table-column>
        <el-table-column prop="smsCommission" label="短信推广分润"></el-table-column>
        <el-table-column prop="notSettledCommission" label="不予结算佣金"></el-table-column>
        <el-table-column prop="deductionsCommission" label="手动扣回佣金"></el-table-column>
        <el-table-column label="最终结算佣金">
          <template slot-scope="scope">
            <div style="color:#e34;font-weight: bold;font-size:18px;">{{scope.row.amountCommission}}</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>佣金分润明细
      </div>
      <div class="toggleTypeRow">
        <div>
          <el-button plain size="medium" :class="{'activeButton':activeType==0}" @click="toggleTable(0)">软件服务</el-button>
          <el-button plain size="medium" :class="{'activeButton':activeType==2}" @click="toggleTable(2)">线下支付充值</el-button>
          <el-button plain size="medium" :class="{'activeButton':activeType==1}" @click="toggleTable(1)">卡莫商城交易</el-button>
          <el-button plain size="medium" :class="{'activeButton':activeType==3}" @click="toggleTable(3)">短信推广</el-button>
        </div>
        <div>
          <span v-show="activeType!==2">关联订单：{{commissionList.orderCount || 0}}笔</span>
        </div>
      </div>
      <el-table :data="commissionList.lists" border style="width: 100%" v-if="activeType==0">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联交易单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="可得佣金"></el-table-column>
        <el-table-column v-if="!status" label="结算资格">
          <template slot-scope="scope">
            <div :class="{'confirmSwitchActive':!scope.row.status, 'confirmSwitch':scope.row.status}" @click="openStatusDialog(scope.row)">
              <i class="confirmSwitchIcon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="status" prop="statusDispaly" label="结算资格"></el-table-column>
        <el-table-column prop="remark" v-if="status" label="备注"></el-table-column>
      </el-table>
      <el-table :data="commissionList.lists" border key="commissionList_1" style="width: 100%" v-if="activeType==2">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联初审单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="有效交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="可得佣金"></el-table-column>
        <el-table-column v-if="!status" label="结算资格">
          <template slot-scope="scope">
            <div :class="{'confirmSwitchActive':!scope.row.status, 'confirmSwitch':scope.row.status}" @click="openStatusDialog(scope.row)">
              <i class="confirmSwitchIcon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="status" prop="statusDispaly" label="结算资格"></el-table-column>
        <el-table-column prop="remark" v-if="status" label="备注"></el-table-column>
      </el-table>
      <el-table :data="commissionList.lists" border key="commissionList_2" style="width: 100%" v-if="activeType==1">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联结算单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="结算金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="可得佣金"></el-table-column>
        <el-table-column v-if="!status" label="结算资格">
          <template slot-scope="scope">
            <div :class="{'confirmSwitchActive':!scope.row.status, 'confirmSwitch':scope.row.status}" @click="openStatusDialog(scope.row)">
              <i class="confirmSwitchIcon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="status" prop="statusDispaly" label="结算资格"></el-table-column>
        <el-table-column prop="remark" v-if="status" label="备注"></el-table-column>
      </el-table>
      <el-table :data="commissionList.lists" border key="commissionList_3" style="width: 100%" v-if="activeType==3">
        <el-table-column label="商户ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merChantName}`}}
          </template>
        </el-table-column>
        <el-table-column label="关联交易单号">
          <template slot-scope="scope">
            <div v-for="(value,index) in scope.row.orderList" :key="index">
              {{value}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额"></el-table-column>
        <el-table-column prop="commissionRate" label="分润比例"></el-table-column>
        <el-table-column prop="commissionAmount" label="可得佣金"></el-table-column>
        <el-table-column v-if="!status" label="结算资格">
          <template slot-scope="scope">
            <div :class="{'confirmSwitchActive':!scope.row.status, 'confirmSwitch':scope.row.status}" @click="openStatusDialog(scope.row)">
              <i class="confirmSwitchIcon"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="status" prop="statusDispaly" label="结算资格"></el-table-column>
        <el-table-column prop="remark" v-if="status" label="备注"></el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="commissionList.currentPage" :page-size="commissionList.MaxResultCount" layout="total, prev, pager, next, jumper" :total="commissionList.totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="statusForm.title" :visible.sync="statusFormVisible" width="450px">
      <el-form :model="statusForm" :rules="statusRules" ref="statusForm">
        <el-form-item>
          <div style="text-align:left;"><i style="color:#f7ba2a;margin-right:10px;font-size:18px;fotn-weight:blod;" class="iconfont icon-gantanhao"></i>{{statusForm.message}}</div>
        </el-form-item>
        <el-form-item :label="statusForm.label" prop="reason" style="margin:0;">
          <div style="position:relative;">
            <el-input v-model="statusForm.reason" type="textarea" maxlength="50"></el-input>
            <span style="position:absolute;right:15px;bottom:0;">{{`${statusForm.reason.length}/50`}}</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setStatus">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="佣金结算初审" :visible.sync="recordFormVisible" width="525px">
      <el-form :model="recordForm" :rules="statusRules" ref="recordForm" class="recordForm">
        <el-form-item>
          <div>本月服务商预计应结算佣金总额为：￥{{recordForm.total}}，其中：</div>
        </el-form-item>
        <el-form-item>
          <div>软件服务费用分成金额为：￥{{recordForm.softWareCommission}}</div>
        </el-form-item>
        <el-form-item>
          <div>线下支付充值分润金额为：￥{{recordForm.onlinePaymentCommission}}</div>
        </el-form-item>
        <el-form-item>
          <div>卡莫商城交易分成金额为：￥{{recordForm.mallTransactionCommission}}</div>
        </el-form-item>
        <el-form-item>
          <div>商户短信推广分成金额为：￥{{recordForm.smsCommission}}</div>
        </el-form-item>
        <el-form-item>
          <div>不予结算分成佣金金额为：￥{{recordForm.notSettledCommission}}</div>
        </el-form-item>
        <el-form-item prop="deductionsCommission">
          <div>运营手动扣回佣金金额为：￥<el-input type="text" v-model="recordForm.deductionsCommission" size="small" style="width:100px" @blur="()=>{recordForm.isAll=false;calcAmount()}"></el-input>
            <el-checkbox v-model="recordForm.isAll" @change="calcAmount">全部扣回</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item style="margin:22px 0 0 0;">
          <div>则本月最终结算给服务商的佣金为：￥{{recordForm.amountCommission}}</div>
        </el-form-item>
        <el-form-item label="初审意见：" prop="remark">
          <div style="position:relative;">
            <el-input v-model="recordForm.remark" type="textarea" maxlength="100"></el-input>
            <span style="position:absolute;right:15px;bottom:25px;">{{`${recordForm.remark.length}/100`}}</span>
            <p style="height:25px;line-height:25px;color:#999;font-size:12px;">有不予结算或手动扣回佣金时,审核意见必填。</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRecord">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/**
 * name:服务商 佣金初审 详情
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import LogDialog from "./../../../components/LogDialog";
import {
  GetRecordeDetails,
  GetCommissionListByType,
  SetSettlementStatus,
  FirstTrialCommission
} from "../../../Apis";

export default {
  data() {
    let deductionsValidate = function(rule, value, callback) {
      if (
        /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) ||
        value === 0 ||
        value === "0"
      ) {
        if (value > this.recordForm.maxDeductions) {
          this.recordForm.deductionsCommission = this.recordForm.maxDeductions;
          this.calcAmount();
          // callback(
          //   new Error("手动扣回佣金不得大于￥" + this.recordForm.maxDeductions)
          // );
          callback();
        } else {
          callback();
        }
      } else {
        callback(
          new Error(
            value
              ? "运营手动扣回佣金格式不正确，如12.13"
              : "运营手动扣回佣金不可为空,最小值为0"
          )
        );
      }
    };
    let remarkValidate = function(rule, value, callback) {
      if (!value) {
        if (
          this.recordForm.notSettledCommission > 0 ||
          this.recordForm.deductionsCommission > 0
        ) {
          callback(new Error("审核意见不可为空"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      breadList: [
        { label: "佣金结算管理" },
        { label: "佣金初审" },
        { label: "详情" }
      ],
      level: 0,
      id: 0,
      orderNo: 0,
      year: "",
      month: "",
      status: "",
      serviceProviderInfoData: [],
      activeType: 0,
      commissionList: {
        lists: [],
        currentPage: 1,
        loading: false,
        MaxResultCount: 10,
        totalCount: 0,
        orderCount: 0
      },
      statusFormVisible: false,
      statusForm: {
        title: "开通结算",
        message: "操作后，将给服务商结算该笔交易产生的佣金，是否继续？",
        label: "开通提现原因：",
        reason: "",
        rowData: {}
      },
      recordForm: {
        title: "开通结算",
        message: "操作后，将给服务商结算该笔交易产生的佣金，是否继续？",
        label: "开通提现原因：",
        reason: "",
        rowData: {}
      },
      statusRules: {
        reason: [
          { required: true, message: "请输入原因", trigger: "blur" },
          { min: 1, max: 50, message: "原因在50个字符以内", trigger: "blur" }
        ],
        deductionsCommission: [
          { validator: deductionsValidate.bind(this), trigger: "blur" }
        ],
        remark: [{ validator: remarkValidate.bind(this), trigger: "blur" }]
      },
      recordFormVisible: false,
      recordForm: {
        total: 0,
        softWareCommission: 0,
        onlinePaymentCommission: 0,
        mallTransactionCommission: 0,
        smsCommission: 0,
        notSettledCommission: 0,
        deductionsCommission: 0,
        maxDeductions: 0,
        amountCommission: 0,
        isAll: false,
        remark: ""
      }
    };
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.year = this.$route.query.year || "";
    this.month = this.$route.query.month || "";
    this.level = this.$route.query.level || 0;
    this.orderNo = this.$route.query.orderNo || "";
    this.initDeatils();
  },
  methods: {
    refreshCallback() {
      this.initDeatils();
    },
    closeCallback() {
      this.$router.back(-1);
    },
    openRecord() {
      let {
        total,
        softWareCommission,
        onlinePaymentCommission,
        mallTransactionCommission,
        smsCommission,
        deductionsCommission,
        notSettledCommission,
        amountCommission
      } = this.recordForm;
      this.recordForm.total =
        softWareCommission +
        onlinePaymentCommission +
        mallTransactionCommission +
        smsCommission;
      deductionsCommission = 0;
      // if (this.recordForm.total < this.recordForm.notSettledCommission) {
      //   this.recordForm.deductionsCommission = 0;
      //   this.recordForm.amountCommission = 0;
      // } else {
      this.recordForm.amountCommission = Number(
        Math.round(
          (this.recordForm.total -
            notSettledCommission -
            deductionsCommission) *
            100
        ) / 100
      );
      // }

      this.recordForm.maxDeductions =
        this.recordForm.total - notSettledCommission;
      this.recordForm.isAll = false;
      this.recordFormVisible = true;
    },
    calcAmount() {
      if (this.recordForm.isAll) {
        this.recordForm.deductionsCommission = this.recordForm.maxDeductions;
      }
      // if (this.recordForm.total < this.recordForm.notSettledCommission) {
      //   this.recordForm.deductionsCommission = 0;
      //   this.recordForm.amountCommission = 0;
      //   return;
      // }
      this.recordForm.amountCommission = Number(
        Math.round(
          (this.recordForm.total -
            this.recordForm.notSettledCommission -
            this.recordForm.deductionsCommission) *
            100
        ) / 100
      );
    },
    setRecord() {
      let _this = this;
      _this.$refs.recordForm.validate(async function(valid) {
        if (valid) {
          let res = await FirstTrialCommission({
            serviceProviderId: _this.id,
            year: _this.year,
            month: _this.month,
            notSettledCommission: _this.recordForm.notSettledCommission,
            deductionsCommission: _this.recordForm.deductionsCommission,
            remark: _this.recordForm.remark
          });
          if (res.success) {
            _this.$message({
              message: "初审成功",
              type: "success"
            });
            _this.initDeatils();
            _this.recordFormVisible = false;
          }
        }
      });
    },
    openStatusDialog(row) {
      let isSet = row.status === 0 ? false : true;
      this.statusForm.rowData = row;
      this.statusForm.title = isSet ? "开通结算" : "不予结算";
      this.statusForm.message = isSet
        ? "操作后，将给服务商结算该笔交易产生的佣金，是否继续？"
        : "操作后，将不给服务商结算该笔交易产生的佣金，是否继续？";
      this.statusForm.label = isSet ? "开通结算原因：" : "不予结算原因：";
      this.statusForm.reason = "";
      this.statusFormVisible = true;
    },
    setStatus() {
      let statusForm = this.statusForm;
      let _this = this;
      _this.$refs.statusForm.validate(async function(valid) {
        if (valid) {
          let params = {
            serviceProviderId: _this.id,
            merChantId: statusForm.rowData.merchantId,
            year: _this.year,
            month: _this.month,
            type: statusForm.rowData.commissionType,
            commissionAmount: statusForm.rowData.commissionAmount.substring(1),
            settlement: statusForm.rowData.status === 0 ? false : true,
            remark: statusForm.reason
          };
          let res = await SetSettlementStatus(params);
          if (res.success) {
            _this.statusFormVisible = false;
            _this.initDeatils();
            _this.$message({
              message:
                statusForm.rowData.status === 0
                  ? "不予结算设置成功"
                  : "开通结算设置成功",
              type: "success"
            });
          }
        }
      });
    },
    async handleCurrentChange(page) {
      this.commissionList.currentPage = page;
      this.commissionList.lists = [];
      let res = await GetCommissionListByType({
        serviceProviderId: this.id,
        commissionType: this.activeType,
        year: this.year,
        month: this.month,
        SkipCount:
          (this.commissionList.currentPage - 1) *
          this.commissionList.MaxResultCount,
        MaxResultCount: this.commissionList.MaxResultCount
      });
      if (res.success) {
        this.setCommissionLists(res.result);
      } else {
        this.setCommissionLists([]);
      }
    },
    setCommissionLists({ totalCount, items, orderCount }) {
      this.commissionList.orderCount = orderCount;
      this.commissionList.totalCount = totalCount;
      let lists = items;
      lists.forEach(item => {
        for (let key in item) {
          if (key == "amount" || key == "commissionAmount") {
            item[key] = "￥" + item[key];
          }
          if (key == "commissionRate") {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (item.orderSn) {
            let orderList = item.orderSn.split(",");
            item.orderList = orderList;
          } else {
            item.orderList = [];
          }
        }
      });
      this.commissionList.lists = lists;
    },
    async toggleTable(type) {
      this.activeType = type;
      if (type == 3) {
        this.setCommissionLists({
          totalCount: 0,
          items: []
        });
        return;
      }
      this.commissionList.lists = [];

      let res = await GetCommissionListByType({
        serviceProviderId: this.id,
        commissionType: this.activeType,
        year: this.year,
        month: this.month,
        SkipCount:
          (this.commissionList.currentPage - 1) *
          this.commissionList.MaxResultCount,
        MaxResultCount: this.commissionList.MaxResultCount
      });
      if (res.success) {
        this.setCommissionLists(res.result);
      } else {
        this.setCommissionLists([]);
      }
    },
    async initDeatils() {
      let res = await GetRecordeDetails({
        serviceProviderId: this.id,
        year: this.year,
        month: this.month
      });
      if (res.success) {
        let {
          softWareCommissionList,
          serviceProviderInfo,
          status
        } = res.result;
        this.status = status;
        this.recordForm = Object.assign(this.recordForm, serviceProviderInfo);

        for (let key in serviceProviderInfo) {
          if (
            key == "softWareCommission" ||
            key == "onlinePaymentCommission" ||
            key == "mallTransactionCommission" ||
            key == "smsCommission" ||
            key == "notSettledCommission" ||
            key == "deductionsCommission" ||
            key == "amountCommission"
          ) {
            serviceProviderInfo[key] = "￥" + serviceProviderInfo[key];
          }
        }
        this.serviceProviderInfoData = [serviceProviderInfo];
        if (this.activeType === 0) {
          this.setCommissionLists(softWareCommissionList);
        } else {
          this.toggleTable(this.activeType);
        }
      }
    }
  },

  components: {
    BreadCrumb,
    LogDialog
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
.recordedDescContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  //   border: 1px solid #d7d7d7;
  font-size: 16px;
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
    padding: 10px 0;
    border: 1px solid #f3f3f3;
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
  .el-table th.is-leaf {
    background: #f9fafc;
  }
  .togglePageRow {
    background: #f3f3f3;
    padding: 5px 0;
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
.recordForm {
  .el-form-item {
    margin: 0;
  }
  .el-form-item__content {
    text-align: left;
    color: rgb(51, 51, 51);
    font-size: 16px;
  }
}
</style>

