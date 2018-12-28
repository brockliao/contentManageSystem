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
    <div class="CashBountDescContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前奖励金审核状态: {{status == 2 ? "待审核" : "已审核"}}
        <el-button size="small" v-if="status == 2" plain class="iconfont recordButton" @click="openRecord()">审 核</el-button>
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="bountyDetail" border style="width: 100%" key="bountyTable1">
        <el-table-column prop="sn" label="提现单号"></el-table-column>
        <el-table-column label="商户id / 名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''} / ${scope.row.merchantName}`}}
          </template>
        </el-table-column>
        <el-table-column prop="contactMobile" label="联系电话"></el-table-column>
        <el-table-column prop="_totalAmount" label="应结奖励金金额"></el-table-column>
        <el-table-column prop="_refundServiceFee" label="退还商城服务费"></el-table-column>
        <el-table-column prop="_consumptionDeductibleAmount" label="消费抵扣金额"></el-table-column>
        <el-table-column prop="_commission" label="手续费"></el-table-column>
        <el-table-column prop="_actualAmount" label="待转账金额"></el-table-column>
      </el-table>
      <div class="dataBaseRow" v-if="status != 2">
        <i class="iconfont icon-database"></i>发票信息
      </div>
      <el-table :data="withdrawInvoice" border style="width: 100%" key="bountyTable2" v-if="status != 2">
        <el-table-column prop="no" label="发票号"></el-table-column>
        <el-table-column prop="amount" label="发票金额">
          <template slot-scope="scope"><span v-show="scope.row.amount">￥</span>{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column label="发票照片">
          <template slot-scope="scope">
            <ImagePreview :imageUrl="scope.row.imgUrl"></ImagePreview>
          </template>
        </el-table-column>
      </el-table>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>奖励金初审明细
      </div>
      <el-table :data="rewardCheckDetails" border style="width: 100%" key="bountyTable3">
        <el-table-column prop="sn" label="初审单号"></el-table-column>
        <el-table-column prop="timeSpan" label="初审时间区间"></el-table-column>
        <el-table-column prop="_settlementAmount" label="预计结算奖励金"></el-table-column>
        <!-- <el-table-column prop="_test" label="初审人员"></el-table-column> -->
        <el-table-column prop="_auditTime" label="初审时间"></el-table-column>
      </el-table>
      <div class="summaryRow"><span style="margin:0 10px;">奖励金提现时间区间：{{settlementTime}}</span> 合计：￥{{rewardCheckDetailsSum}}</div>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>退还商城服务费明细
      </div>
      <el-table :data="refundServiceFeeDetails" border style="width: 100%" key="bountyTable5">
        <el-table-column prop="settlementTime" label="结算时间"></el-table-column>
        <el-table-column prop="_dealTime" label="退款笔数 | 退款金额 ">
          <template slot-scope="scope">
            {{scope.row.refundCount}} | {{scope.row._refundAmount}}
          </template>
        </el-table-column>
        <el-table-column prop="_refundServiceFee" label="退还商城服务费"></el-table-column>
      </el-table>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>消费抵扣明细
      </div>
      <el-table :data="rewardConsumptionDetails" border style="width: 100%" key="bountyTable4">
        <el-table-column prop="connectedTransSn" label="关联交易单号"></el-table-column>
        <el-table-column prop="_dealTime" label="交易时间"></el-table-column>
        <el-table-column prop="_amount" label="消费金额"></el-table-column>
      </el-table>
      <div class="summaryRow"><span>总计消费金额 </span>合计：￥{{rewardConsumptionDetailsSum}}</div>
    </div>
    <el-dialog title="商户余额提现审核" :visible.sync="recordFormVisible" width="525px">
      <el-form :model="recordForm" :rules="statusRules" ref="recordCashForm" class="recordCashForm">
        <el-form-item>
          <div class="textItem" style="line-height: 25px;padding-left: 20px;font-weight: bold;">本次商户待转账金额为：{{recordForm.max_amount}}元，请在核实商户提交的发票信息后予以审核。</div>
          <div class="textItem" style="font-weight: normal;padding-left: 5px;">填写发票信息</div>
        </el-form-item>
        <el-form-item label="发票代码/发票号：" prop="no" label-width="170px" style="margin:0;">
          <el-input v-model="recordForm.no" type="text" style="width:300px" placeholder="请输入发票代码/发票号"></el-input>
        </el-form-item>
        <el-form-item label="开票金额：" prop="amount" label-width="170px">
          <el-input v-model="recordForm.amount" type="text" style="width:300px" placeholder="请输入开票金额"></el-input>
        </el-form-item>
        <el-form-item label="发票照片：" label-width="170px" prop="imgUrl">
          <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="recordForm.imgUrl" :src="recordForm.imgUrl" class="avatar">
            <i v-else class="iconfont icon-plus avatar-uploader-icon"> 上 传</i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recordFormVisible = false">取消审核</el-button>
        <el-button type="primary" @click="setRecord">同意提现</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import ImagePreview from "./../../../components/ImagePreview";
import config from "./../../../utils/config.js";
import { GetWithdrawCheckDetails, AuditWithdraw } from "./../../../Apis";
import { dateFrom, getStorage, rmStorage } from "../../../utils";
export default {
  data() {
    let amountValidate = function(rule, value, callback) {
      if (
        /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)
      ) {
        callback();
      } else {
        callback(new Error("开票金额格式不正确"));
      }
    };
    let noValidate = function(rule, value, callback) {
      if (/^[a-zA-Z0-9]*$/.test(value)) {
        callback();
      } else {
        callback(new Error("发票代码/发票号格式不正确"));
      }
    };
    return {
      breadList: [{ label: "提现审核详情" }],
      rowData: {},
      id: "",
      uploadUrl: config.uploadUrl,
      status: "",
      settlementTime: "",
      bountyDetail: [],
      rewardCheckDetails: [],
      rewardCheckDetailsSum: 0,
      withdrawInvoice: [],
      rewardConsumptionDetails: [],
      rewardConsumptionDetailsSum: 0,
      refundServiceFeeDetails: [],
      withdrawTrans: [],
      recordFormVisible: false,
      recordForm: {
        no: "",
        id: 0,
        imgUrl: "",
        amount: "",
        max_amount: 0
      },
      statusRules: {
        no: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: noValidate.bind(this), trigger: "blur" }
        ],
        amount: [
          { required: true, message: "不可为空", trigger: "blur" },
          { validator: amountValidate.bind(this), trigger: "blur" }
        ],
        imgUrl: [{ required: true, message: "不可为空", trigger: "change" }]
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    let key = this.$route.query.key || "";
    let options = getStorage(key);
    if (!options) options = "";
    this.rowData = JSON.parse(options);
    this.status = this.rowData.status || 0;
    this.initDeatils();
  },
  methods: {
    refreshCallback() {
      this.initDeatils();
    },
    openRecord() {
      let rowData = this.rowData;
      this.recordForm = {
        no: "",
        id: this.id,
        imgUrl: "",
        max_amount: rowData.actualAmount,
        amount: ""
      };
      this.recordFormVisible = true;
    },
    beforeAvatarUpload(file, id) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isGIF && !isPNG) {
        this.$message.error("上传图片必须是JPG/GIF/PNG 格式!");
      }
      return isJPG || isGIF || isPNG;
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.recordForm.imgUrl = res.result.Url;
      }
    },
    setRecord() {
      let _this = this;
      _this.$refs.recordCashForm.validate(async valid => {
        if (!valid) return;
        let params = { ..._this.recordForm };
        delete params.max_amount;
        let res = await AuditWithdraw(params);
        if (res.success) {
          _this.status = 0;
          _this.initDeatils();
          _this.recordFormVisible = false;
        }
      });
    },
    async initDeatils() {
      let res = await GetWithdrawCheckDetails({ id: this.id });
      if (res.success) {
        let {
          withdrawInvoice,
          rewardCheckDetails,
          rewardConsumptionDetails,
          refundServiceFeeDetails
        } = res.result;
        //基本信息
        this.settlementTime = refundServiceFeeDetails.settlementTime;
        this.bountyDetail = [
          {
            ...this.rowData,
            _refundServiceFee: "￥" + refundServiceFeeDetails.refundServiceFee
          }
        ];
        // 发票信息
        this.withdrawInvoice = [withdrawInvoice];

        // 奖励金初审明细
        this.rewardCheckDetailsSum = 0;
        rewardCheckDetails.map(item => {
          item["_settlementAmount"] = "￥" + item.settlementAmount;
          item["_auditTime"] = dateFrom(item.auditTime);
          this.rewardCheckDetailsSum += item.settlementAmount;
        });
        this.rewardCheckDetails = [...rewardCheckDetails];
        this.rewardCheckDetailsSum = (
          Math.round(this.rewardCheckDetailsSum * 100) / 100
        ).toFixed(2);

        // 退还商城服务费明细
        this.refundServiceFeeDetails = [
          {
            ...refundServiceFeeDetails,
            _refundAmount: "￥" + refundServiceFeeDetails.refundAmount,
            _refundServiceFee: "￥" + refundServiceFeeDetails.refundServiceFee
          }
        ];

        // 奖励金消费抵扣明细
        this.rewardConsumptionDetailsSum = 0;
        rewardConsumptionDetails.map(item => {
          item["_amount"] = "￥" + item.amount;
          item["_dealTime"] = dateFrom(item.dealTime);
          this.rewardConsumptionDetailsSum += item.amount;
        });
        this.rewardConsumptionDetailsSum = (
          Math.round(this.rewardConsumptionDetailsSum * 100) / 100
        ).toFixed(2);
        this.rewardConsumptionDetails = [...rewardConsumptionDetails];
      }
    }
  },
  components: {
    BreadCrumb,
    ImagePreview
  }
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
  .el-table th {
    color: #000;
    background-color: #f3f3f3f3;
    border: 1px solid #d5d5d5;
  }
  .avatar-uploader .el-upload {
    border: 2px solid #2fc7a0;
    color: #2fc7a0;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 0 30px;
    i {
      color: #2fc7a0;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #2fc7a0;
    color: #2fc7a0;
    .avatar-uploader-icon {
      color: #2fc7a0;
    }
  }
  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    // width: 178px;
    // height: 178px;
    // line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .textItem {
    color: #000;
    text-align: left;
    // padding-left: 10px;
    font-size: 16px;
  }
}

.CashBountDescContainer {
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
  .summaryRow {
    background: #f9fafc;
    height: 40px;
    line-height: 40px;
    text-align: right;
    padding-right: 20px;
    border: 1px solid #d5d5d5;
    color: #000;
    font-size: 18px;
  }
  .el-table th.is-leaf {
    background: #f9fafc;
  }
}
.recordCashForm {
  .el-form-item__label {
    font-weight: normal;
  }
  .el-form-item__content {
    text-align: left;
  }
}
</style>
