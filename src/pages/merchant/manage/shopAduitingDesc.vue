<template>
  <div class="shopAuditDescrition">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <el-button icon="icon-refresh" size="medium" :class="{'rightButton':true,'rightButtonAndClose':true,'iconfont':true}"
          @click="refreshCallback">刷新</el-button>
        <el-button icon="icon-close" size="medium" :class="{'rightButton':true,'rightButtonAndClose':true,'iconfont':true}"
          @click="backCallback">关闭</el-button>
      </template>
    </BreadCrumb>
    <div class="al merchandiseActivedColor positionRe " style="background:#f3f3f3">
      <i class="el-icon-tan"></i>
      <div class="auditStatusBox positionRe">
        <div>
          <span class="font16">审核状态：{{auditStatus}}</span>
          <LogDialog :list="shopAuditLogs"></LogDialog>
        </div>
        <div>
          <span class="font16">审核意见：{{auditSuggestion}}</span>
        </div>
      </div>
      <el-button class="auditBtn" @click="auditClick" type="success" plain>审核</el-button>
    </div>
    <section>
      <div class="titleStyle al">
        <i class="el-icon-bie"></i>
        <span>商户基本信息</span>
      </div>
      <el-row>
        <el-col :span="24">
          <el-table border :data="tableData" min-height="100">
            <el-table-column prop="id_shopName" label="门店ID/名称"> </el-table-column>
            <el-table-column prop="merchant" label="商户ID/名称"> </el-table-column>
            <el-table-column prop="type" label="商户类型"> </el-table-column>
            <el-table-column label="门店图标">
              <template slot-scope="scope">
                <ImagePreview :imageUrl="scope.row.shopImg"></ImagePreview>
              </template>
            </el-table-column>
            <el-table-column prop="workTime" label="营业时间"> </el-table-column>
            <el-table-column prop="telephone" label="门店电话"> </el-table-column>
            <el-table-column prop="city" label="所属城市"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table border :data="tableData" min-height="100">
            <el-table-column prop="scope" label="所属商圈"> </el-table-column>
            <el-table-column prop="shopAddr1" label="门店地址"> </el-table-column>
            <el-table-column prop="trade" label="所属行业"> </el-table-column>
            <el-table-column prop="intro" label="门店介绍"> </el-table-column>
            <el-table-column prop="serviciProvide" label="服务商ID/名称"> </el-table-column>
            <el-table-column prop="saleMan" label="业务员姓名/手机号"> </el-table-column>
            <el-table-column prop="recommendMerChant" label="推荐商户ID/账户"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
    <section>
      <div class="titleStyle al">
        <i class="el-icon-bie"></i>
        <span>门店资质信息</span>
      </div>
      <el-row>
        <el-col :span="24">
          <el-table border :data="tableData">
            <el-table-column label="身份证(护照)照片">
              <template slot-scope="scope" class="cardImgBox">
                <ImagePreview :imageUrl="scope.row.idCardFront"></ImagePreview>
                <ImagePreview :imageUrl="scope.row.idCardReverse"></ImagePreview>
              </template>
            </el-table-column>
            <el-table-column prop="idCardNo" label="身份证(护照)编号"> </el-table-column>
            <el-table-column prop="license" label="营业执照照片">
              <template slot-scope="scope">
                <ImagePreview :imageUrl="scope.row.license"></ImagePreview>
              </template>
            </el-table-column>
            <el-table-column prop="licenseNo" label="营业执照号"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
    <!-- 审核弹窗 -->
    <el-dialog title="门店审核" :visible.sync="auditDialog" width="450px" class="auditShopForm">
      <el-form :model="form" :inline='form.inline'>
        <el-form-item class="dialogRemark">
          审核通过后，门店即可开始使用，购买的服务可被激活。
        </el-form-item>
        <el-form-item class="dialogRemark">
          请确认是否予以审核通过。
        </el-form-item>
        <el-form-item label="审核意见: " :label-width="formLabelWidth" style="text-align:left;">
          <el-input type="textarea" :rows="5" v-model="form.auditRemark" maxlength="100"></el-input>
          <span class="auditStateSum">{{auditRemarkLength}}/100</span>
          <span>审核驳回,审核意见必填.</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="auditCancel" @click="auditFormSubmit(false)" type="success" plain>审核驳回</el-button>
        <el-button type="success" @click="auditFormSubmit(true)">审核通过</el-button>
      </div>
    </el-dialog>
    <!-- 记录弹窗 -->
    <!-- <el-dialog title="商户审核记录" :visible.sync="auditLogVisiable" width="450px">
      <div style="height: 300px;margin:10px 0;">
        <el-steps :active="0" direction="vertical">
          <el-step v-for="(log, index) in shopAuditLogs" :key="index+'_step'" :title="log.message+'     '+log._time+'   '+log.auditUser" :class="{ 'stepDian': index == 0}"></el-step>
        </el-steps>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { GetAuditList, GetShopAuditDetail, AuditShop } from "./../../../Apis";
import BreadCrumb from "../../../components/BreadCrumb";
import ImagePreview from "../../../components/ImagePreview";
import LogDialog from "../../../components/LogDialog";
import { MessageBox, Message } from "element-ui";
import { dateFrom } from "../../../utils";
export default {
  data: function() {
    return {
      breadList: [{ label: "商户" }, { label: "门店审核" }, { label: "详情" }],
      id: 0, //常量  门店id || 商户id
      type: 0, //常量 门店 || 商户
      currentPage: 1, //列表页码

      tableData: [],
      auditDialog: false, //审核弹窗控制
      inline: true,
      form: {
        auditRemark: ""
      },
      formLabelWidth: "100px",
      auditLogVisiable: false, //审核记录弹窗
      shopAuditLogs: [],
      auditStatus: "",
      auditSuggestion: ""
    };
  },
  computed: {
    auditRemarkLength: function() {
      return this.form.auditRemark ? this.form.auditRemark.length : 0;
    }
  },
  methods: {
    async getAuditData() {
      // 获取审核详情数据
      if (!this.id || !this.type) return;
      let response = await GetShopAuditDetail({ id: this.id, type: this.type });
      if (response.success) {
        // 重置审核详情数据
        this.tableData = [];
        let shopItem = response.result.getShopAuditDetail;
        // 审核记录
        this.shopAuditLogs = shopItem.shopAuditLogs;
        // 处理时间
        this.shopAuditLogs.forEach((log, index) => {
          let time = dateFrom(
            new Date(log.creationTime),
            "yyyy-MM-dd HH:mm:ss"
          );
          log._time = time;
        });
        this.auditStatus = shopItem.status || "";
        this.auditSuggestion = this.shopAuditLogs.length
          ? this.shopAuditLogs[0].remark
          : "无";
        // 处理双拼列
        shopItem.id_shopName =
          (shopItem.id || "") + "/" + (shopItem.shopName || "");
        shopItem.merchant =
          (shopItem.merchantId || "") + "/" + (shopItem.merchantName || "");
        shopItem.saleMan =
          (shopItem.saleManName || "") + "/" + (shopItem.saleManPhone || "");
        shopItem.serviciProvide =
          (shopItem.serviciProvideId || "") +
          "/" +
          (shopItem.serviciProvideName || "");
        shopItem.recommendMerChant =
          (shopItem.recommendMerChantId || "") +
          "/" +
          (shopItem.recommendMerChantName || "");
        this.tableData.push(shopItem);
      }
    },
    auditClick() {
      // 审核审核弹出
      this.form.auditRemark = "";
      this.auditDialog = true;
    },
    async auditFormSubmit(isSubmit = false) {
      // 默认是驳回
      if (!isSubmit && !this.form.auditRemark) {
        return Message({
          showClose: true,
          message: "审核意见不可为空",
          type: "error"
        });
      }
      this.auditDialog = false; //关闭弹窗
      let params = {
        id: this.id,
        type: this.type,
        remark: this.form.auditRemark,
        auditState: isSubmit ? 1 : 2
      };
      let response = await AuditShop(params);
      if (response.success) {
        Message({
          showClose: true,
          message: "审核成功",
          type: "success"
        });
        this.refreshCallback();
      } else {
        Message({
          showClose: true,
          message: response.error.message,
          type: "error"
        });
      }
    },
    auditLogClick() {
      this.auditLogVisiable = true;
      // 显示审核记录
    },
    backCallback() {
      this.$router.push({
        name: "ShopAduiting",
        params: {
          currentPage: this.currentPage
        }
      });
    },
    refreshCallback() {
      this.getAuditData();
    }
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.type = this.$route.query.type || 0;
    this.currentPage = this.$route.query.currentPage || 1;
    this.getAuditData();
  },
  components: {
    BreadCrumb,
    ImagePreview,
    LogDialog
  }
};
</script>
<style lang="less">
@btnColor: #31c7a0;
.shopAuditDescrition {
  // margin: 0 10px;
  border: 1px solid #e4e4e4;
  height: calc(100% - 40px);
  .merchandiseActivedColor {
    height: 60px;
    line-height: 60px;
  }
  .merchandiseActivedColor,
  section {
    margin: 10px;
  }
  .auditStatusBox {
    display: flex;
    flex-direction: column;
    > div {
      height: 20px;
      line-height: 20px;
      margin: 5px;
    }
  }
  .titleStyle {
    background-color: #f3f3f3;
    height: 35px;
    line-height: 35px;
    padding-left: 35px;
    position: relative;
    // margin-bottom: 10px;
    i {
      color: #a9a7a7;
    }
    span {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .positionRe {
    padding-left: 15px;
  }
  section {
    margin-bottom: 20px;
  }
  .auditBtn {
    position: absolute;
    right: 20px;
    top: 10px;
    background: #fff;
    font-size: 15px;
  }
  .auditCancel {
    background: #fff;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border: 1px solid #e4e4e4;
  }
  .el-table td {
    padding: 20px 0;
    // line-height: 50px;
  }
  .el-table th {
    background-color: #f9fafc;
    text-align: center;
    color: #000;
    // font-size: 16px;
  }
  .el-table__row {
    line-height: 50px;
  }
  img {
    height: 100%;
    width: 100%;
  }
  .cardImgBox {
    img {
      width: 40%;
      height: 100%;
    }
  }
  .auditShopForm {
    .dialogRemark {
      font-size: 16px;
      color: #333;
      margin: 0;
      text-align: left;
      font-weight: 600;
      height: 25px;
      line-height: 25px;
    }
    .auditStateSum {
      position: absolute;
      right: 10px;
      bottom: 35px;
    }
  }
  .stepDian {
    // background: #e34;
    .el-step__icon.is-text {
      background: #31c8a1;
      // box-shadow: 0px 0px 12px #d4cdcd;
    }
  }
  .el-button--text {
    color: #31c8a1;
  }

  .el-step__icon-inner {
    // width: 100%;
    // height: 100%;
    border-radius: 50%;
  }
  .el-step__icon.is-text {
    background: #cccccc;
    box-shadow: 0px 0px 12px #d4cdcd;
  }
  .el-step__head.is-process,
  .el-step__head.is-wait {
    color: transparent;
    border-color: #fff;
    // box-shadow:2px 2px 3px #e34;
    // broder-color:grey;
  }
  .el-step__title is-process,
  .el-step__title.is-wait {
    color: #333;
    border-color: #fff;
  }
  .rightButton {
    // position: absolute;
    // right: 30px;
    // top: 5px;
    border: 1px solid @btnColor;
    color: @btnColor;
  }
}
</style>

