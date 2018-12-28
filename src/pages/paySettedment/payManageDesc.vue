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
    <div class="payManageDescrition">
      <div class="al payManageActivedColor" style="background:#f3f3f3">
        <i class="iconfont icon-gantanhao"></i>
        <span class="font16">支付平台开通状态：微信-{{MerchantPayInfoDetail.merchantPaymentDto.wxWhether}}
          支付宝-{{MerchantPayInfoDetail.merchantPaymentDto.aliWhether}}</span>
      </div>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>商户及联系人信息</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="merchantInfoTableData">
              <el-table-column prop="id_name" label="商户ID/名称"></el-table-column>
              <el-table-column prop="sourceDisplay" label="商户来源"></el-table-column>
              <el-table-column prop="user_phone" label="联系人/联系电话"></el-table-column>
              <el-table-column prop="email" label="常用邮箱"></el-table-column>
              <el-table-column prop="saleman_phone" label="业务员姓名/手机号"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <!-- 服务商平台管理 -->
      <section class="merchantPaymentDtoTableCss">
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>服务商平台激活管理</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="merchantPaymentDtoTableData" key="merchantPaymentDtoTable">
              <el-table-column prop="platFormText" label="服务商平台">
              </el-table-column>
              <el-table-column prop="whether" label="平台开通状态">
              </el-table-column>
              <el-table-column prop="mch_id" label="子商户ID">
              </el-table-column>
              <el-table-column prop="carshAccount" label="收款码">
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-row type="flex" justify="center">
                    <el-col :span="6">
                      <el-button v-if="scope.row.status == 2" @click="showServerPayActiveDialog(scope.row, 0)" type="text"
                        size="small">激活</el-button>
                      <el-button v-if="scope.row.status == 4" @click="showServerPayActiveDialog(scope.row, 1)" type="text"
                        size="small">确认激活</el-button>
                    </el-col>
                    <!-- <el-col :span="6">
                    <el-button @click="logWatch(scope.row)" type="text" size="small">查看记录</el-button>
                  </el-col> -->
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <!-- 银行信息 商户资质资料 -->
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>银行账户信息</span>
        </div>
        <el-row type="flex" justify="start" class="bankAccountBox">
          <el-col>账户类型</el-col>
          <el-col>{{MerchantPayInfoDetail.merchantBankInfoDto.accountType == 1 ? "对公" : "个人"}}</el-col>
          <el-col>开户许可证照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="MerchantPayInfoDetail.merchantBankInfoDto.licUrl"></ImagePreview>
          </el-col>
          <el-col>省份/城市</el-col>
          <el-col>{{MerchantPayInfoDetail.merchantBankInfoDto.prov}} /
            {{MerchantPayInfoDetail.merchantBankInfoDto.city}}</el-col>
          <el-col>开户银行</el-col>
          <el-col>{{MerchantPayInfoDetail.merchantBankInfoDto.bankName}}</el-col>
          <el-col>开户支行</el-col>
          <el-col>{{MerchantPayInfoDetail.merchantBankInfoDto.subBank}}</el-col>
          <el-col>开户名称</el-col>
          <el-col>{{MerchantPayInfoDetail.merchantBankInfoDto.userName}}</el-col>
          <el-col>银行卡照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="MerchantPayInfoDetail.merchantBankInfoDto.bankCardUrl"></ImagePreview>
          </el-col>
          <el-col>银行账号</el-col>
          <el-col>{{MerchantPayInfoDetail.merchantBankInfoDto.account}}</el-col>
          <el-col>组织机构代码证照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="MerchantPayInfoDetail.merchantBankInfoDto.orgUrl"></ImagePreview>
          </el-col>
          <el-col>组织机构代码证有效期</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.organizationCodePeriod}}</el-col>
        </el-row>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>商户资质资料</span>
        </div>
        <el-row type="flex" justify="start" class="bankAccountBox">
          <el-col>营业执照照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="MerchantPayInfoDetail.merChantPayInfoDto.license"></ImagePreview>
          </el-col>
          <el-col>营业执照号</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.businessLicense}}</el-col>
          <el-col>企业名称</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.businessName}}</el-col>
          <el-col>注册地址</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.addr}}</el-col>
          <el-col>经营范围</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.businessScope}}</el-col>
          <el-col>经营期限</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.businessPeriod}}</el-col>
          <el-col>身份证(护照)照片</el-col>
          <el-col>
            <el-row type="flex" justify="start">
              <el-col>
                <ImagePreview :imageUrl="MerchantPayInfoDetail.merChantPayInfoDto.idCardFront"></ImagePreview>
              </el-col>
              <el-col>
                <ImagePreview :imageUrl="MerchantPayInfoDetail.merChantPayInfoDto.idCardReverse"></ImagePreview>
              </el-col>
            </el-row>
          </el-col>
          <el-col>身份证(护照)姓名</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.idCardName}}</el-col>
          <el-col>身份证(护照)号码</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.idCardNo}}</el-col>
          <el-col>身份证(护照)有效期</el-col>
          <el-col>{{MerchantPayInfoDetail.merChantPayInfoDto.idCardPeriod}}</el-col>

        </el-row>
      </section>
      <!-- 服务商平台管理 激活弹窗填写  -->
      <el-dialog :title="serverPayActiveDialog.title" :visible.sync="serverPayActiveDialog.isShow" width="600px" class="serverPayActiveDialogCss">
        <el-form :model="serverPayActiveDialog.formData" ref="serverPayActiveDialogForm" label-width="150px" :rules="serverPayActiveDialog.rules"
          class="serverPayActiveForm">
          <el-form-item label="商户名称">
            <el-input v-model="serverPayActiveDialog.formData.merchantName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="serverPayActiveDialog.formData.contact" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="serverPayActiveDialog.formData.contactMobile" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="常用邮箱">
            <el-input v-model="serverPayActiveDialog.formData.email" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="支付宝Token" prop="aliAuthToken" v-if="serverPayActiveDialog.platForm == 'Alipay'">
            <el-input v-model="serverPayActiveDialog.formData.aliAuthToken" :disabled="serverPayActiveDialog.type ? true : false"></el-input>
          </el-form-item>
          <el-form-item label="子商户ID" prop="sub_mch_id">
            <el-input v-model="serverPayActiveDialog.formData.sub_mch_id" :disabled="serverPayActiveDialog.type ? true : false"></el-input>
          </el-form-item>
          <!-- 再次激活 需要确认子商户ID -->
          <el-form-item label="确认子商户ID" v-if="serverPayActiveDialog.type" prop="sub_mch_id_again">
            <el-input v-model="serverPayActiveDialog.formData.sub_mch_id_again"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="serverPayActiveDialog.isShow = false">取 消</el-button>
          <el-button type="primary" @click="activePayClick">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>
<script>
import {
  GetMerchantPayInfoDetail,
  AuditMerchantPayInfo,
  ActivePay,
  EnteringRecord
} from "./../../Apis";

import { MessageBox, Message } from "element-ui";

import BreadCrumb from "../../components/BreadCrumb";

import ImagePreview from "../../components/ImagePreview";

export default {
  data: function() {
    let validateMchId = (rule, value, callback) => {
      if (
        Number(value) != Number(this.serverPayActiveDialog.formData.sub_mch_id)
      ) {
        callback(new Error("两次输入子商户ID不一致!"));
      } else {
        callback();
      }
    };
    let numerValid = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(Number(value))) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      id: 0, //全局通用ID
      currentPage: 1,
      source: "",
      breadList: [
        { label: "支付结算" },
        { label: "支付平台管理" },
        { label: "详情" }
      ],
      MerchantPayInfoDetail: {
        merchantInfo: {
          merchantName: "",
          source: "",
          sourceDisplay: "",
          contact: "",
          contactMobile: "",
          email: "",
          status: "",
          statusDisplay: "",
          remark: "",
          createTime: "",
          id: ""
        },
        merchantBankInfoDto: {
          merchantId: "",
          accountType: "",
          prov: "",
          city: "",
          bankName: "",
          subBank: "",
          userName: "",
          account: "",
          orgUrl: "",
          licUrl: "",
          bankCardUrl: "",
          remark: "",
          id: ""
        },
        merChantPayInfoDto: {
          id: "",
          source: "",
          merchantId: "",
          businessName: "",
          addr: "",
          businessLicense: "",
          businessScope: "",
          organizationCodePeriod: "",
          idCardName: "",
          idCardPeriod: "",
          idCardNo: "",
          businessPeriod: ""
        },
        merchantPaymentDto: {
          merchantId: "",
          wxMchId: "",
          aliMchId: "",
          aliAuthToken: "",
          wxWhether: "",
          wxstatus: "",
          alipayStatus: "",
          aliWhether: "",
          id: ""
        },
        merchantPaymentActivationDto: {
          merchantId: "",
          source: "",
          wxstatus: "",
          subWxaccount: "",
          alipayStatus: "",
          subAlipayaccount: "",
          alipayAuthToken: "",
          id: ""
        }
      },
      merchantInfoTableData: [],
      merchantPaymentDtoTableData: [],
      serverPayActiveDialog: {
        isShow: false,
        title: "",
        type: 0, //默认激活 0 确认激活 1
        platform: "",
        formData: {
          merchantName: "",
          contact: "",
          contactMobile: "",
          sub_mch_id: "",
          sub_mch_id_again: "",
          platForm: "",
          alipay_token: "",
          id: ""
        },
        rules: {
          sub_mch_id: [
            { required: true, message: "请输入子商户ID", trigger: "blur" },
            { validator: numerValid, trigger: "blur" }
          ],
          sub_mch_id_again: [
            { required: true, message: "请确认子商户ID", trigger: "blur" },
            { validator: numerValid, trigger: "blur" },
            { validator: validateMchId, trigger: "blur" }
          ],
          aliAuthToken: [
            { required: true, message: "请输入支付宝Token", trigger: "blur" }
          ]
        }
      }
    };
  },
  computed: {},
  methods: {
    async initData() {
      // 初始化数据
      let response = await GetMerchantPayInfoDetail({
        id: this.id,
        source: this.source
      });
      let MerchantPayInfoDetail = this.MerchantPayInfoDetail;
      if (response && response.success) {
        for (let key in MerchantPayInfoDetail) {
          MerchantPayInfoDetail[key] = Object.assign(
            MerchantPayInfoDetail[key],
            response.result[key]
          );
        }
        this.initInfoData();
        this.initServerPayActive();
      }
    },
    initInfoData() {
      let info = this.MerchantPayInfoDetail.merchantInfo;
      this.merchantInfoTableData = [
        {
          id_name: `${info.id || ""}/${info.merchantName || ""}`,
          sourceDisplay: info.sourceDisplay,
          user_phone: `${info.contact || ""}/${info.contactMobile || ""}`,
          email: info.email,
          saleman_phone: `${info.salesManName || ""}/${info.salesMobile || ""}`
        }
      ];
    },
    initServerPayActive() {
      // 处理服务商激活管理表格数
      let merchantPaymentDto = this.MerchantPayInfoDetail.merchantPaymentDto;
      this.merchantPaymentDtoTableData = [
        {
          platFormText: "微信",
          platForm: "Wx",
          mch_id: merchantPaymentDto.wxMchId || "",
          whether: merchantPaymentDto.wxWhether,
          status: (() => {
            if (merchantPaymentDto.wxWhether === "待开通") {
              return 2;
            }
            if (merchantPaymentDto.wxWhether === "已激活") {
              return 4;
            }
            return "";
          })() //根据id及状态枚举显示 激活 确认激活 或显示
        },
        {
          platFormText: "支付宝",
          platForm: "Alipay",
          mch_id: merchantPaymentDto.aliMchId || "",
          whether: merchantPaymentDto.aliWhether,
          status: (() => {
            if (merchantPaymentDto.aliWhether === "待开通") {
              return 2;
            }
            if (merchantPaymentDto.aliWhether === "已激活") {
              return 4;
            }
            return "";
          })()
        }
      ];
    },

    refreshCallback() {
      this.initData();
    },
    backCallback() {
      this.$router.back(-1);
    },
    showServerPayActiveDialog(rowData, type) {
      this.serverPayActiveDialog.type = type;
      this.serverPayActiveDialog.title = type ? "确认激活" : "激活";

      //合并商户及联系人信息 平台激活信息
      this.serverPayActiveDialog.formData = Object.assign(
        this.serverPayActiveDialog.formData,
        rowData,
        this.MerchantPayInfoDetail.merchantInfo
      );
      this.serverPayActiveDialog.platForm = rowData.platForm;
      //  绑定子商户id
      this.serverPayActiveDialog.formData.sub_mch_id = rowData.mch_id || "";
      if (this.serverPayActiveDialog.type) {
        this.serverPayActiveDialog.formData.sub_mch_id_again = "";
        this.serverPayActiveDialog.formData.aliAuthToken = this.MerchantPayInfoDetail.merchantPaymentDto.aliAuthToken;
      }

      this.serverPayActiveDialog.isShow = true;
    },
    activePayClick(rowData) {
      rowData = this.serverPayActiveDialog.formData;
      // 校验
      this.$refs.serverPayActiveDialogForm.validate(async valid => {
        if (valid) {
          //服务平台激活
          let params = {
            id: this.id,
            platform: rowData.platForm,
            sub_mch_id: rowData.sub_mch_id,
            source: this.source
          };
          // 支付宝 需要传入 token
          if (this.serverPayActiveDialog.platForm == "Alipay") {
            params.alipay_token = rowData.aliAuthToken;
          }
          let response = await ActivePay(params);
          if (response.success) {
            Message({
              message: "激活成功",
              type: "success",
              showClose: true
            });
            this.serverPayActiveDialog.isShow = false;
            this.initData();
          }
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.currentPage = this.$route.query.currentPage || 1;
    this.source = this.$route.query.source;
    this.initData();
  },
  components: {
    BreadCrumb,
    ImagePreview
  }
};
function periodTime(start, end) {
  //时间合并成字符串 "2018-01-11 至 2018-08-04"
  let sDate = new Date(start);
  let eDate = new Date(end);
  start =
    sDate.getFullYear() + "-" + (sDate.getMonth() + 1) + "-" + sDate.getDate();
  end =
    eDate.getFullYear() + "-" + (eDate.getMonth() + 1) + "-" + eDate.getDate();
  return start + " 至 " + end;
}
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
  .textButton {
    color: #2fc7a0;
  }
  .togglePageRow {
    background: #f3f3f3;
    padding: 5px 0;
  }
  .el-table th {
    color: #000;
    background-color: #f3f3f3f3;
    border-right: 1px solid #d5d5d5;
    border-left: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
  }
  .el-button.is-disabled {
    color: #c0c4cc;
  }
}
.payManageDescrition {
  @btnColor: #31c7a0;
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  // section {
  //   margin: 10px;
  // }
  .payManageActivedColor {
    height: 45px;
    line-height: 45px;
    margin: 10px 0;
    padding-left: 10px;
    .el-col {
      width: auto;
      font-size: 16px;
      margin-right: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .bankAccountBox {
    flex-wrap: wrap;
    > div {
      // height: 45px;
      line-height: 45px;
      border: 1px solid #e4e4e4;
      &:nth-child(odd) {
        background: #f2f2f2;
        text-align: right;
        width: 15%;
        padding-right: 10px;
      }
      &:nth-child(even) {
        background: #fff;
        width: 35%;
      }
    }
  }
  .payManageStatusBox {
    display: flex;
    flex-direction: column;
    > div {
      height: 20px;
      line-height: 20px;
      margin: 5px;
    }
  }
  .merchantPaymentDtoTableCss {
    .el-table td,
    .el-table th {
      padding: 5px 0;
    }
  }
  .titleStyle {
    background-color: #f2f2f2;
    height: 45px;
    line-height: 45px;
    padding-left: 35px;
    position: relative;
    // margin-bottom: 10px;
    i {
      color: #a9a7a7;
      top: 5px;
    }
  }
  .recordBtn {
    position: absolute;
    right: 25px;
    top: 6px;
    padding: 10px 20px;
  }
  .positionRe {
    padding-left: 15px;
  }
  section {
    margin-bottom: 20px;
  }
  .payManageBtnBox {
    position: absolute;
    right: 20px;
    top: 0;
    font-size: 15px;
    button {
      background: #fff;
    }
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
      bottom: 0;
    }
    .el-form-item {
      margin: 0;
      &:first-child {
        font-size: 16px;
        font-weight: bold;
        height: 25px;
        line-height: 25px;
      }
    }
    .el-checkbox-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      > label {
        display: block;
        width: 45%;
        margin: 0 10px;
        height: 30px;
        line-height: 30px;
      }
    }
    .remarkBox {
      .el-form-item__content {
        width: 450px;
      }
    }
    .remarkText {
      font-size: 12px;
      color: #aeaeae;
      text-align: right;
    }
    .remarkAuditText {
      font-size: 12px;
      color: #aeaeae;
      text-align: left;
    }
  }
  .activeBtnBox {
    display: flex;
    justify-content: center;
    align-items: center;
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
  }
  .el-step__title is-process,
  .el-step__title.is-wait {
    color: #333;
    border-color: #fff;
  }
  .el-form--inline .el-form-item {
    width: 100%;
    padding-left: 10px;
    text-align: left;
  }
  // 激活弹窗样式
  .serverPayActiveDialogCss {
    .el-dialog__body {
      padding: 0 20px;
    }
    .serverPayActiveForm {
      padding: 20px 0;
      .el-form-item {
        // margin: 5px;
        .el-form-item__label {
          text-align: center;
        }
      }
    }
  }
  .rightButton {
    border: 1px solid @btnColor;
    color: @btnColor;
  }
}
</style>

