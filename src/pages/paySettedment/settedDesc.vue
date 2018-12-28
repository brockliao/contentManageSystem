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
      <div class="al payManageActivedColor positionRe " style="background:#f3f3f3">
        <i class="el-icon-tan"></i>
        <div class="payManageStatusBox positionRe">
          <div>
            <span class="font16">当前资料处理状态：{{merchantInfo.statusDisplay}}</span>
          </div>
          <div :title="merchantInfo.remark">
            <el-row type="flex" class="row-bg" justify="start">
              <el-col>
                备注：{{merchantInfo.remark}}
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="payManageBtnBox">
          <el-button @click="enteringRecordClick" type="success" size="medium" plain>补录</el-button>
          <el-button @click="aduitAndRest(1)" type="success" size="medium" plain>审核</el-button>
          <el-button @click="aduitAndRest(2)" type="success" size="medium" plain>重置</el-button>
        </div>

      </div>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>商户及联系人信息</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table border :data="merchantInfoTable.tableData">
              <el-table-column v-for="(colItem, index) in merchantInfoTable.colList" :key="'merchantInfo_'+index" :prop="colItem.prop"
                :label="colItem.label"> </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </section>
      <section>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>银行账户信息</span>
        </div>
        <el-row type="flex" justify="start" class="bankAccountBox">
          <el-col>账户类型</el-col>
          <el-col>{{merchantBankInfoDto.accountType == 1 ? "对公" : "个人"}}</el-col>
          <el-col>开户许可证照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="merchantBankInfoDto.licUrl"></ImagePreview>
          </el-col>
          <el-col>省份/城市</el-col>
          <el-col>{{merchantBankInfoDto.prov}} / {{merchantBankInfoDto.city}}</el-col>
          <el-col>开户银行</el-col>
          <el-col>{{merchantBankInfoDto.bankName}}</el-col>
          <el-col>开户支行</el-col>
          <el-col>{{merchantBankInfoDto.subBank}}</el-col>
          <el-col>开户名称</el-col>
          <el-col>{{merchantBankInfoDto.userName}}</el-col>
          <el-col>银行卡照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="merchantBankInfoDto.bankCardUrl"></ImagePreview>
          </el-col>
          <el-col>银行账号</el-col>
          <el-col>{{merchantBankInfoDto.account}}</el-col>
          <el-col>组织机构代码证照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="merchantBankInfoDto.orgUrl"></ImagePreview>
          </el-col>
          <el-col>组织机构代码证有效期</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.organizationCodePeriod}}</el-col>
          <el-col v-else>
            <el-date-picker v-model="businessForm.organizationCodePeriodBegin" type="date" format="yyyy-MM-dd"
              placeholder="组织机构代码证开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="businessForm.organizationCodePeriodEnd" type="date" format="yyyy-MM-dd"
              placeholder="组织机构代码证结束日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <div class="titleStyle al">
          <i class="el-icon-bie"></i>
          <span>商户资质资料</span>
        </div>
        <el-row type="flex" justify="start" class="bankAccountBox">
          <el-col>营业执照照片</el-col>
          <el-col>
            <ImagePreview :imageUrl="merChantPayInfoDto.license"></ImagePreview>
          </el-col>
          <el-col>营业执照号</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.businessLicense}}</el-col>
          <el-col v-else>
            <el-input v-model="businessForm.businessLicense" placeholder="请输入营业执照号"></el-input>
          </el-col>
          <el-col>企业名称</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.businessName}}</el-col>
          <el-col v-else>
            <el-input v-model="businessForm.businessName" placeholder="请输入企业名称"></el-input>
          </el-col>
          <el-col>注册地址</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.addr}}</el-col>
          <el-col v-else>
            <el-input v-model="businessForm.addr" placeholder="请输入注册地址"></el-input>
          </el-col>
          <el-col>经营范围</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.businessScope}}</el-col>
          <el-col v-else>
            <el-input v-model="businessForm.businessScope" placeholder="请输入经营范围"></el-input>
          </el-col>
          <el-col>经营期限</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.businessPeriod}}</el-col>
          <el-col v-else>
            <el-date-picker v-model="businessForm.businessPeriodBegin" type="date" format="yyyy-MM-dd" placeholder="经营开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="businessForm.businessPeriodEnd" type="date" format="yyyy-MM-dd" placeholder="经营结束日期">
            </el-date-picker>
          </el-col>
          <el-col>身份证(护照)照片</el-col>
          <el-col>
            <el-row type='flex' justify="start">
              <el-col>
                <ImagePreview :imageUrl="merChantPayInfoDto.idCardFront"></ImagePreview>
              </el-col>
              <el-col>
                <ImagePreview :imageUrl="merChantPayInfoDto.idCardReverse"></ImagePreview>
              </el-col>
            </el-row>
          </el-col>
          <el-col>身份证(护照)姓名</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.idCardName}}</el-col>
          <el-col v-else>
            <el-input v-model="businessForm.idCardName" placeholder="请输入身份证(护照)姓名"></el-input>
          </el-col>
          <el-col>身份证(护照)号码</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.idCardNo}}</el-col>
          <el-col v-else>
            <el-input v-model="businessForm.idCardNo" placeholder="请输入身份证(护照)号码"></el-input>
          </el-col>
          <el-col>身份证(护照)有效期</el-col>
          <el-col v-if="!isEnteringRecordStatus">{{merChantPayInfoDto.idCardPeriod}}</el-col>
          <el-col v-else>
            <el-date-picker v-model="businessForm.idCardPeriodBegin" type="date" format="yyyy-MM-dd" placeholder=">身份证(护照)有效期开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="businessForm.idCardPeriodEnd" type="date" format="yyyy-MM-dd" placeholder=">身份证(护照)有效期结束日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <div class="recordSaveRow" v-show="isEnteringRecordStatus">
          <el-button @click="recordSave" class="recordBtn_desc">保 存</el-button>
        </div>
      </section>

      <!-- 审核 -->
      <el-dialog :title="auditAndRestFormTitle" :visible.sync="auditAndRestForm.isShow" width="600px" class="auditShopForm">
        <el-form :model="auditAndRestForm" :inline='true'>
          <el-form-item>
            <span v-if="auditAndRestForm.isAuditOrRest === 1">选择驳回原因：</span>
            <span v-else>选择重置原因：</span>
          </el-form-item>
          <!-- 根据 -->
          <el-form-item v-if="auditAndRestForm.isAuditOrRest === 1">
            <el-checkbox-group v-model="auditAndRestForm.auditReasonChecked">
              <el-checkbox v-for="item in auditAndRestForm.auditReasonList" :key="item" :label="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-else>
            <el-checkbox-group v-model="auditAndRestForm.reasonChecked">
              <el-checkbox v-for="item in auditAndRestForm.reasonList" :key="item" :label="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="其他意见: " class="remarkBox" label-width="100px" v-if="auditAndRestForm.isAuditOrRest === 2">
            <el-input type="textarea" :rows="7" v-model="auditAndRestForm.remark" maxlength="100"></el-input>
            <span class="auditStateSum">{{remarkLength}}/100</span>
          </el-form-item>
        </el-form>
        <div class="remarkAuditText" v-if="auditAndRestForm.isAuditOrRest === 1">
          注：审核驳回时，原因必选。
        </div>
        <div class="remarkText" v-else>
          注：重置后，商户需修改相关资料，再次提交到运营，才能够完成资料审核。
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="auditCancel" @click="auditAndRestFormClick(false)" type="success" plain>
            <span v-if="auditAndRestForm.isAuditOrRest === 1">审核驳回</span>
            <span v-else>取消</span>
          </el-button>
          <el-button type="success" @click="auditAndRestFormClick(true)">
            <span v-if="auditAndRestForm.isAuditOrRest === 1">审核通过</span>
            <span v-else>重置</span>
          </el-button>
        </div>
      </el-dialog>

      <!-- 补录 -->
      <el-dialog title="补录" :visible.sync="businessNameVisible" width="40%" :close-on-click-modal="false">
        <el-form :model="businessForm" :rules="recordRules" label-width="170px" class="businessName" ref="businessForm">
          <el-form-item label="企业名称">
            <el-input v-model="businessForm.businessName"></el-input>
          </el-form-item>
          <el-form-item label="注册地址">
            <el-input v-model="businessForm.addr"></el-input>
          </el-form-item>
          <el-form-item label="营业执照号" prop="businessLicense">
            <el-input v-model="businessForm.businessLicense"></el-input>
          </el-form-item>
          <el-form-item label="经营范围">
            <el-input v-model="businessForm.businessScope"></el-input>
          </el-form-item>
          <el-form-item label="经营期限">
            <el-date-picker v-model="businessForm.businessPeriodBegin" type="date" format="yyyy-MM-dd" placeholder="经营期限开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="businessForm.businessPeriodEnd" type="date" format="yyyy-MM-dd" placeholder="经营期限结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="组织机构代码有效期">
            <el-date-picker v-model="businessForm.organizationCodePeriodBegin" type="date" format="yyyy-MM-dd"
              placeholder="组织机构代码证开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="businessForm.organizationCodePeriodEnd" type="date" format="yyyy-MM-dd"
              placeholder="组织机构代码证结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="护照/身份证姓名" prop="idCardName">
            <el-input v-model="businessForm.idCardName"></el-input>
          </el-form-item>
          <el-form-item label="护照/身份证号码" prop="idCardNo">
            <el-input v-model="businessForm.idCardNo"></el-input>
          </el-form-item>
          <el-form-item label="护照/身份证有效期">
            <el-date-picker v-model="businessForm.idCardPeriodBegin" type="date" format="yyyy-MM-dd" placeholder="护照/身份证有效期开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker v-model="businessForm.idCardPeriodEnd" type="date" format="yyyy-MM-dd" placeholder="护照/身份证有效期结束时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="businessNameVisible = false">取 消</el-button>
          <el-button type="primary" @click="recordSave">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>
<script>
import {
  GetSettleDetail,
  AuditMerchantPayInfo,
  ActivePay,
  EnteringRecord
} from "./../../Apis";
import { MessageBox, Message } from "element-ui";
import BreadCrumb from "../../components/BreadCrumb";
import ImagePreview from "../../components/ImagePreview";
import { dateFrom } from "../../utils";
export default {
  data: function() {
    let idCardValdate = function(rule, value, callback) {
      // 身份证护照校验
      if (/^[a-zA-Z0-9]+$/.test(value)) {
        callback();
      } else {
        callback(new Error("身份证(护照)号码格式不正确"));
      }
    };

    let businesslicenceValdate = function(rule, value, callback) {
      let reg = new RegExp(/^[0-9A-Za-z]{1,30}$/);
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("营业执照号码格式不正确"));
      }
    };

    return {
      id: 0, //全局通用ID
      currentPage: 0,
      source: "", //来源
      activeDataState: "审核驳回/审核驳回/审核通过",
      waitRecord: "",
      unqualifiedReason: "",
      merchantInfo: {
        id: "",
        merchantName: "",
        contact: "",
        contactMobile: "",
        email: "",
        status: "",
        pfStatus: "",
        wxStatus: "",
        aliStatus: ""
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
        merchantId: "",
        status: "",
        businessName: "",
        addr: "",
        businessLicense: "",
        businessScope: "",
        operating_period: "",
        organizationCodePeriod: "",
        organizationCodePeriodBeginTime: "", //组织机构代码证有效期开始时间
        organizationCodePeriodEndTime: "", //组织机构代码证有效期结束时间
        idCardName: "",
        idCardPeriod: "",
        idCardPeriodBeginTime: "",
        idCardPeriodEndTime: "",
        idCardNo: "",
        bank: "",
        bank_card_name: "",
        bank_card_id: "",
        sub_wxaccount: "",
        union_mch_status: "",
        wx_mch_status: "",
        pf_mch_status: "",
        sub_pfaccount: "",
        alipay_mch_status: "",
        sub_alipayaccount: "",
        alipay_auth_token: "",
        businessPeriod: "", //经营期限
        businessPeriodBeginTime: "",
        businessPeriodEndTime: "",
        reject_reason: "",
        reset_reason: ""
      },
      merchantPaymentDto: {
        merchant_id: "",
        wx_mch_id: "",
        pf_mch_id: "",
        ali_mch_id: "",
        ali_auth_token: "",
        id: ""
      },
      isEnteringRecordStatus: false, //默认不是补录编辑状态
      auditAndRestForm: {
        isShow: false,
        isAuditOrRest: 1, //1 审核 2 重置
        auditReasonList: [
          "银行账户信息有误",
          "护照/身份证照片不合规",
          "组织机构代码证照片不合规",
          "营业执照照片不合规",
          "护照/身份证已过期",
          "组织机构代码证已过期",
          "营业执照已过期",
          "营业执照在国家企业信息系统中无记录",
          "营业执照与身份证不一致"
        ],
        auditReasonChecked: [],
        reasonList: [
          "开户许可证错误",
          "企业名称填写错误",
          "注册地址填写错误",
          "经营范围与营业执照不一致",
          "经营期限填写错误",
          "护照/身份证姓名填写错误",
          "护照/身份证有效期填写错误"
        ],
        reasonChecked: [],
        remark: ""
      },
      breadList: [
        { label: "支付结算" },
        { label: "结算资料管理" },
        { label: "详情" }
      ],
      businessNameVisible: false,
      businessForm: {
        businessName: "",
        addr: "",
        businessLicense: "",
        businessScope: "",
        organizationCodePeriod: "",
        organizationCodePeriodBegin: "",
        organizationCodePeriodEnd: "",
        idCardName: "",
        idCardPeriod: "",
        idCardPeriodBegin: "",
        idCardPeriodEnd: "",
        idCardNo: "",
        businessPeriod: "",
        businessPeriodBegin: "",
        businessPeriodEnd: "",
        source: ""
      },
      recordRules: {
        idCardName: [
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        idCardNo: [{ validator: idCardValdate, trigger: "blur" }],
        businessLicense: [
          { validator: businesslicenceValdate, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    merchantPaymentDtoTable() {
      // 根据merchantPaymentDto 返回值
      return {
        items: (() => {
          return [this.merchantPaymentDto];
        })(),
        colList: [
          { prop: "1", label: "服务商平台" },
          { prop: "2", label: "平台开通状态" },
          { prop: "3", label: "子商户ID" },
          { prop: "4", label: "收款码" }
        ]
      };
    },
    auditAndRestFormTitle() {
      return this.auditAndRestForm.isAuditOrRest === 1
        ? "审核商户资料"
        : "重置商户资料";
    },
    merchantInfoTable() {
      // 根据 merchantInfo 返回值
      return {
        tableData: (() => {
          let item = { ...this.merchantInfo };
          item.id_name = item.id + " / " + item.merchantName;
          item.user_phone = item.contact + " / " + item.contactMobile;
          item.saleman_phone =
            (item.salesManName || "") + " / " + (item.salesMobile || "");
          return [item];
        })(),
        colList: [
          { prop: "id_name", label: "商户ID/名称" },
          { prop: "sourceDisplay", label: "商户来源" },
          { prop: "user_phone", label: "联系人/联系电话" },
          { prop: "email", label: "常用邮箱" },
          { prop: "saleman_phone", label: "业务员姓名/手机号" }
        ]
      };
    },
    remarkLength() {
      return this.auditAndRestForm.remark
        ? this.auditAndRestForm.remark.length
        : 0;
    }
  },
  methods: {
    payManageBtnClick(type) {},
    async getPlatFormDescritionData() {
      this.isEnteringRecordStatus = false;
      let response = await GetSettleDetail({
        id: this.id,
        source: this.source
      });
      if (response && response.success) {
        for (let key in response.result) {
          this[key] = Object.assign(this[key], response.result[key]);
        }
        // 处理组织机构代码证有效期
        let merChantPayInfoDto = this.merChantPayInfoDto;
        if (merChantPayInfoDto.organizationCodePeriod) {
          let timeList = merChantPayInfoDto.organizationCodePeriod.split("至");
          merChantPayInfoDto.organizationCodePeriodBeginTime = new Date(
            timeList[0]
          ); //组织机构代码证有效期开始时间
          merChantPayInfoDto.organizationCodePeriodEndTime = new Date(
            timeList[1]
          ); //组织机构代码证有效期结束时间
        }
        // 处理身份证护照有限期
        if (merChantPayInfoDto.idCardPeriod) {
          let timeList = merChantPayInfoDto.idCardPeriod.split("至");
          merChantPayInfoDto.idCardPeriodBeginTime = new Date(timeList[0]); //组织机构代码证有效期开始时间
          merChantPayInfoDto.idCardPeriodEndTime = new Date(timeList[1]); //组织机构代码证有效期结束时间
        }
        if (merChantPayInfoDto.businessPeriod) {
          let timeList = merChantPayInfoDto.businessPeriod.split("至");
          merChantPayInfoDto.businessPeriodBeginTime = new Date(timeList[0]); //组织机构代码证有效期开始时间
          merChantPayInfoDto.businessPeriodEndTime = new Date(timeList[1]); //组织机构代码证有效期结束时间
        }
      }
    },
    enteringRecordClick(bollean) {
      // 绑定补录表单对应值
      let merChantPayInfoDto = this.merChantPayInfoDto;
      this.businessForm = {
        id: merChantPayInfoDto.id,
        businessName: merChantPayInfoDto.businessName,
        addr: merChantPayInfoDto.addr,
        businessLicense: merChantPayInfoDto.businessLicense,
        businessScope: merChantPayInfoDto.businessScope,
        organizationCodePeriod: merChantPayInfoDto.organizationCodePeriod,
        organizationCodePeriodBegin: "",
        organizationCodePeriodEnd: "",
        idCardName: merChantPayInfoDto.idCardName,
        idCardPeriod: merChantPayInfoDto.idCardPeriod,
        idCardPeriodBegin: "",
        idCardPeriodEnd: "",
        idCardNo: merChantPayInfoDto.idCardNo,
        businessPeriod: merChantPayInfoDto.businessPeriod,
        businessPeriodBegin: "",
        businessPeriodEnd: "",
        source: this.source
      };
      if (merChantPayInfoDto.organizationCodePeriod) {
        let timeList = merChantPayInfoDto.organizationCodePeriod.split("至");
        this.businessForm.organizationCodePeriodBegin = new Date(timeList[0]); //组织机构代码证有效期开始时间
        this.businessForm.organizationCodePeriodEnd = new Date(timeList[1]); //组织机构代码证有效期结束时间
      }
      // 处理身份证护照有限期
      if (merChantPayInfoDto.idCardPeriod) {
        let timeList = merChantPayInfoDto.idCardPeriod.split("至");
        this.businessForm.idCardPeriodBegin = new Date(timeList[0]); //身份证有效期
        this.businessForm.idCardPeriodEnd = new Date(timeList[1]); //身份证有效期
      }
      if (merChantPayInfoDto.businessPeriod) {
        let timeList = merChantPayInfoDto.businessPeriod.split("至");
        this.businessForm.businessPeriodBegin = new Date(timeList[0]); //经营期限开始时间
        this.businessForm.businessPeriodEnd = new Date(timeList[1]); //经营期限开始时间
      }
      // this.businessNameVisible = true;
      this.isEnteringRecordStatus = true;
    },
    async recordSave() {
      // 处理时间 合并成字符串
      // let businessName = this.businessName;
      let businessForm = this.businessForm;
      let params = { ...this.businessForm, merchantId: this.id };
      if (
        !params.organizationCodePeriodBegin ||
        !params.organizationCodePeriodEnd
      ) {
        return this.$message({
          message: "组织机构代码证有效期不可为空",
          type: "error"
        });
      }
      if (!params.businessPeriodBegin || !params.businessPeriodEnd) {
        return this.$message({
          message: "经营期限不可为空",
          type: "error"
        });
      }
      if (!params.idCardPeriodBegin || !params.idCardPeriodEnd) {
        return this.$message({
          message: "身份证(护照)有效期不可为空",
          type: "error"
        });
      }

      params.organizationCodePeriod = `${dateFrom(
        params.organizationCodePeriodBegin,
        "yyyy-MM-dd"
      )}至${dateFrom(params.organizationCodePeriodEnd, "yyyy-MM-dd")} `;

      params.businessPeriod = `${dateFrom(
        params.businessPeriodBegin,
        "yyyy-MM-dd"
      )}至${dateFrom(params.businessPeriodEnd, "yyyy-MM-dd")} `;

      params.idCardPeriod = `${dateFrom(
        params.idCardPeriodBegin,
        "yyyy-MM-dd"
      )}至${dateFrom(params.idCardPeriodEnd, "yyyy-MM-dd")} `;

      if (!/^[a-zA-Z0-9]+$/.test(params.idCardNo)) {
        return this.$message({
          message: "身份证(护照)号码格式不正确",
          type: "error"
        });
      }
      let res = await EnteringRecord(params);
      if (res && res.success) {
        this.$message({
          message: "补录成功",
          type: "success"
        });
        this.refreshCallback();
        this.businessNameVisible = false;
      }

      // this.$refs.businessForm.validate(async valid => {
      //   if (valid) {
      //     let res = await EnteringRecord(params);
      //     if (res && res.success) {
      //       this.$message({
      //         message: "补录成功",
      //         type: "success"
      //       });
      //       this.refreshCallback();
      //       this.businessNameVisible = false;
      //     }
      //   } else {
      //     return false;
      //   }
      // });
    },
    aduitAndRest(type) {
      // type 确定是 审核 还是 重置
      this.auditAndRestForm.isAuditOrRest = type;
      this.auditAndRestForm.isShow = true;
      this.auditAndRestForm.remark = "";
      this.auditAndRestForm.reasonChecked = [];
      this.auditAndRestForm.auditReasonChecked = [];
    },
    async auditAndRestFormClick(bollean) {
      let auditAndRestForm = this.auditAndRestForm;
      let params = {
        id: this.id,
        auditType: "",
        reject_reason: "",
        source: this.source,
        reset_reason: ""
      };
      if (auditAndRestForm.isAuditOrRest === 1) {
        //审核
        if (!bollean && !auditAndRestForm.auditReasonChecked.length) {
          return Message({
            message: "审核驳回原因不可为空",
            type: "error",
            showClose: true
          });
        }
        params.auditType = bollean ? "pass" : "reject";
        params.reject_reason = bollean
          ? ""
          : auditAndRestForm.auditReasonChecked.toString();
      }
      if (auditAndRestForm.isAuditOrRest === 2) {
        //重置
        if (bollean) {
          params.auditType = "reset";
          params.reset_reason = auditAndRestForm.reasonChecked.toString();
        } else {
          auditAndRestForm.isShow = false;
          return; //重置取消 不做任何操作
        }
      }
      if (!params.reset_reason && auditAndRestForm.isAuditOrRest === 2) {
        return this.$message({
          message: "重置原因不可为空",
          type: "error"
        });
      }
      auditAndRestForm.isShow = false;
      let response = await AuditMerchantPayInfo(params);
      if (response.success) {
        this.getPlatFormDescritionData();
        return Message({
          message: (() => {
            return auditAndRestForm.isAuditOrRest === 2
              ? "重置成功"
              : bollean
              ? "审核通过成功"
              : "审核驳回成功";
          })(),
          type: "success",
          showClose: true
        });
      } else {
      }
    },
    refreshCallback() {
      this.getPlatFormDescritionData();
    }
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.currentPage = this.$route.query.currentPage || 1;
    this.source = this.$route.query.source;
    if (!this.source && this.source !== 0) {
      this.source = "";
    }
    this.getPlatFormDescritionData();
  },
  components: {
    BreadCrumb,
    ImagePreview
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
@btnColor: #31c7a0;
.payManageDescrition {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  // section {
  //   margin: 0 10px;
  // }
  .payManageActivedColor {
    height: 60px;
    line-height: 60px;
    margin-bottom: 20px;
    // margin: 10px;
    .el-col {
      width: auto;
      font-size: 16px;
      margin-right: 20px;
      max-width: 25%;
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
      font-size: 16px;
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
  .enteringRecordBtn {
    position: absolute;
    right: 20px;
    top: 5px;
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
    height: 45px;
    width: 45px;
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
  .el-form--inline .el-form-item {
    width: 100%;
    padding-left: 10px;
    text-align: left;
  }

  .rightButton {
    border: 1px solid @btnColor;
    color: @btnColor;
  }
  .businessName {
    .el-form-item__content {
      text-align: left;
    }
    .el-input {
      max-width: 250px;
    }
  }

  .el-input__inner {
    width: 80%;
  }
  .recordSaveRow {
    background: #f2f2f2;
    text-align: right;
    padding-right: 30px;
    padding-top: 10px;
    padding-bottom: 20px;
    .recordBtn_desc {
      background: @btnColor;
      color: #fff;
    }
  }
}
</style>

