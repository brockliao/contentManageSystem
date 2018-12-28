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
        <div class="settledRecordedDescContainer">
            <div class="statusRow">
                <i class="iconfont icon-gantanhao"></i>当前服务商提现处理状态： {{status}}
                <!-- <LogDialog></LogDialog> -->
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
                <i class="iconfont icon-database"></i>转账信息
            </div>
            <el-table :data="transferRecordDetailDtoData" border style="width: 100%">
                <el-table-column label="转账方式">
                    <template slot-scope="scope">
                        {{scope.row.type === 0 ? '线下转账' : ""}}
                    </template>
                </el-table-column>
                <el-table-column prop="transferNo" label="转账单号"></el-table-column>
                <el-table-column prop="_transferAmount" label="转账金额"></el-table-column>
                <el-table-column label="转账单照片">
                    <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.transferPhotoUrl"></ImagePreview>
                    </template>
                </el-table-column>
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
    </div>
</template>
<script>
/**
 * name:服务商 财务转账 详情
 * creator: liaoqiaowen
 * time:2018/10/11
 */
import BreadCrumb from "./../../../components/BreadCrumb";
import ImagePreview from "./../../../components/ImagePreview";
import LogDialog from "./../../../components/LogDialog";

import { GetSettledRecordeDetails } from "../../../Apis";
import { dateFrom } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [
        { label: "佣金结算管理" },
        { label: "已结算查询" },
        { label: "详情" }
      ],
      id: 0,
      status: "已结算",
      transferRecordDetailDtoData: []
    };
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.initDeatils();
  },
  methods: {
    refreshCallback() {
      this.transferRecordDetailDtoData = [];
      this.initDeatils();
    },
    closeCallback() {
      this.$router.back(-1);
    },
    async initDeatils() {
      let res = await GetSettledRecordeDetails({
        id: this.id
      });
      if (res.success) {
        res.result._amount = "￥" + res.result.amount;
        res.result._amountCommission = "￥" + res.result.amountCommission;
        res.result._transferAmount = "￥" + res.result.transferAmount;
        res.result._creationTime = dateFrom(
          res.result.creationTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        this.transferRecordDetailDtoData = [res.result];
      }
    }
  },

  components: {
    BreadCrumb,
    ImagePreview,
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
.settledRecordedDescContainer {
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

