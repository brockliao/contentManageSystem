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
    <div class="transferRecordedDescContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前服务商提现处理状态： {{status}}
        <el-button size="medium" plain class="iconfont recordButton" @click="openRecord()">更改转账状态</el-button>
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <el-table :data="transferRecordDetailDtoData" border style="width: 100%">
        <el-table-column prop="orderNo" label="结算单号"></el-table-column>
        <el-table-column prop="timeSpan" label="结算时间区间"></el-table-column>
        <el-table-column label="服务商ID/名称">
          <template slot-scope="scope">
            {{`${scope.row.serviceProviderId || ''} / ${scope.row.serviceProviderName}`}}
          </template>
        </el-table-column>
        <el-table-column prop="_amount" label="佣金结算"></el-table-column>
      </el-table>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>佣金结算初审明细
      </div>
      <el-table :data="transferRecordDetailDtoData" border style="width: 100%">
        <el-table-column prop="orderNo" label="佣金初审单号"></el-table-column>
        <el-table-column prop="creatorUser" label="初审人员"></el-table-column>
        <el-table-column prop="_creationTime" label="初审时间"></el-table-column>
        <el-table-column prop="_amountCommission" label="初审后应结算佣金"></el-table-column>
      </el-table>
    </div>

    <el-dialog title="更改转账状态" :visible.sync="recordFormVisible" width="525px">
      <el-form :model="recordForm" :rules="statusRules" ref="recordForm" class="recordForm">
        <el-form-item>
          <div>操作后将会更改对服务商佣金的转账结算状态，请录入以下转账信息完成操作</div>
        </el-form-item>
        <el-form-item label="转账方式：" label-width="120px">
          <div>线下转账</div>
        </el-form-item>
        <el-form-item label="转账单号：" prop="orderNo" label-width="120px">
          <el-input v-model="recordForm.orderNo" type="text" style="width:250px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="转账金额：" prop="amount" label-width="120px">
          <el-input disabled="" v-model="recordForm.amount" type="text" style="width:250px"></el-input>
        </el-form-item> -->
        <el-form-item label="转账金额：" label-width="120px">
          <div>{{'￥'+recordForm.max_amount }}</div>
        </el-form-item>
        <el-form-item label="转账单照片：" label-width="120px" prop="photoUrl">
          <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="recordForm.photoUrl" :src="recordForm.photoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"> 上传 </i>
          </el-upload>
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
 * name:服务商 财务转账 详情
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import {
  GetTransferRecordeDetails,
  AddTransfer,
  UploadFile
} from "../../../Apis";
import { dateFrom } from "./../../../utils";
import config from "./../../../utils/config.js";
export default {
  data() {
    let deductionsValidate = function(rule, value, callback) {
      if (
        /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) ||
        value === 0 ||
        value === "0"
      ) {
        if (value > this.recordForm.max_amount) {
          this.recordForm.amount = this.recordForm.max_amount;
        }
        callback();
      } else {
        callback(new Error("转账金额格式不正确，如12.13"));
      }
    };
    return {
      breadList: [
        { label: "佣金结算管理" },
        { label: "财务转账" },
        { label: "详情" }
      ],
      id: 0,
      uploadUrl: config.uploadUrl,
      status: "待转账",
      transferRecordDetailDtoData: [],
      statusRules: {
        orderNo: [
          { required: true, message: "转账单号不可为空", trigger: "blur" }
        ],
        photoUrl: [
          { required: true, message: "转账单照片不可为空", trigger: "blur" }
        ],
        amount: [{ validator: deductionsValidate.bind(this), trigger: "blur" }]
      },
      recordFormVisible: false,
      recordForm: {
        amount: 0,
        max_amount: 0,
        photoUrl: "",
        orderNo: ""
      }
    };
  },
  created() {
    this.id = this.$route.query.id || 0;
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
      this.recordForm.amount = 0;
      this.recordForm.photoUrl = "";
      this.recordForm.orderNo = "";
      this.recordFormVisible = true;
    },
    setRecord() {
      let _this = this;
      _this.$refs.recordForm.validate(async function(valid) {
        if (valid) {
          let res = await AddTransfer({
            commissionId: _this.id,
            orderNo: _this.recordForm.orderNo,
            amount: _this.recordForm.max_amount,
            photoUrl: _this.recordForm.photoUrl
          });
          if (res.success) {
            _this.$message({
              message: "更改转账状态成功",
              type: "success"
            });
            // _this.initDeatils();
            _this.recordFormVisible = false;
            _this.closeCallback();
          }
        }
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.recordForm.photoUrl = res.result.Url;
      }
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
    async initDeatils() {
      let res = await GetTransferRecordeDetails({
        id: this.id
      });
      if (res.success) {
        res.result._amount = "￥" + res.result.amount;
        res.result._amountCommission = "￥" + res.result.amountCommission;
        res.result._creationTime = dateFrom(
          res.result.creationTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        this.recordForm.max_amount = res.result.amountCommission;
        this.transferRecordDetailDtoData = [res.result];
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 0 30px;
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
}
.transferRecordedDescContainer {
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
  // .el-form-item {
  //   margin: 0;
  // }
  .el-form-item__content {
    text-align: left;
    color: rgb(51, 51, 51);
    font-size: 16px;
  }
}
</style>

