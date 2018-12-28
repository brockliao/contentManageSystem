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
    <transition name="el-fade-in-linear">
      <div class="serviceProviderDescrition">
        <el-tabs v-model="activeTab" @tab-click="handleClick" type="border-card">
          <el-tab-pane label="基础信息" name="basicInfo">
            <div class="al spActivedColor positionRe " style="background:#f3f3f3">
              <i class="el-icon-tan"></i>
              <span class="font16 pdLeft20">微信支付平台开通状态：{{remark}}</span>
            </div>
            <section>
              <div class="titleStyle al">
                <i class="el-icon-bie"></i>
                <span>基本信息</span>
              </div>
              <el-row>
                <el-col :span="24">
                  <el-table border :data="serviceProviceDtoTableData">
                    <el-table-column label="服务商ID / 名称">
                      <template slot-scope="scope">
                        {{scope.row.id + " / " + scope.row.name}}
                      </template>
                    </el-table-column>
                    <el-table-column label="服务商等级">
                      <template slot-scope="scope">
                        <span v-if="scope.row.level === 1">卡莫服务商</span>
                        <span v-else-if="scope.row.level === 2">城市服务商</span>
                        <span v-else>普通服务商</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="serviceProviceDto.level === 3" label="上级组织" prop="superiorName"></el-table-column>
                    <el-table-column label="负责人/手机号">
                      <template slot-scope="scope">
                        {{scope.row.headName + " / " + scope.row.headMobile}}
                      </template>
                    </el-table-column>
                    <el-table-column label="法人/手机号">
                      <template slot-scope="scope">
                        {{scope.row.legalName + " / " + scope.row.legalMobile}}
                      </template>
                    </el-table-column>
                    <el-table-column label="服务商地址" prop="address"></el-table-column>
                    <el-table-column label="负责区域">
                      <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.serviceAreas" :key="index">{{`${item.province || ''}${item.city || ''}${item.district || ''} `}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </section>
            <section>
              <div class="titleStyle al">
                <i class="el-icon-bie"></i>
                <span>资质信息</span>
              </div>
              <el-row>
                <el-col :span="24">
                  <el-table border :data="serviceProviceDtoTableData">
                    <el-table-column prop="headIdCard" label="负责人身份证号码"> </el-table-column>
                    <el-table-column label="负责人身份证照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.headIdCardFrontUrl"></ImagePreview>
                        <ImagePreview :imageUrl="scope.row.headIdCardReverseUrl"></ImagePreview>
                      </template>
                    </el-table-column>
                    <el-table-column prop="legalIdCard" label="法人身份证号码"> </el-table-column>
                    <el-table-column label="法人身份证照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.legalIdCardFrontUrl"></ImagePreview>
                        <ImagePreview :imageUrl="scope.row.legalIdCardReverseUrl"></ImagePreview>
                      </template>
                    </el-table-column>
                    <el-table-column prop="socialCode" label="统一社会信用代码"> </el-table-column>
                    <el-table-column label="营业执照照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.licenseUrl"></ImagePreview>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </section>
            <section>
              <div class="titleStyle al">
                <i class="el-icon-bie"></i>
                <span>银行账户信息</span>
              </div>
              <!-- 根据账户类型显示 默认显示对公账户  -->
              <el-row>
                <el-col :span="24" key="commFirst" style="width:100%">
                  <el-table :border="true" :data="bankInfoTableData" style="width:100%">
                    <el-table-column label="账户类型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.accountType == 1">对公</span>
                        <span v-else>个体工商户</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="开户许可证照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.authPhoto"></ImagePreview>
                      </template>
                    </el-table-column>
                    <el-table-column prop="provinceCity" label="开户省份城市">
                      <template slot-scope="scope">
                        {{scope.row.province+scope.row.city}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="bankName" label="开户银行"> </el-table-column>
                    <el-table-column prop="subBankName" label="开户支行"> </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" key="commSecond" style="width:100%">
                  <el-table :border="true" :data="bankInfoTableData" style="width:100%">
                    <el-table-column prop="name" label="开户名称"></el-table-column>
                    <el-table-column prop="account" label="银行账号"></el-table-column>
                    <el-table-column label="银行卡照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.bankPhoto"></ImagePreview>
                      </template>
                    </el-table-column>
                    <el-table-column label="组织机构代码证照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.orgUrl"></ImagePreview>
                      </template>
                    </el-table-column>
                    <el-table-column prop="orgCodePeriod" label="组织机构代码证有效期"> </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row v-if="!isaccountType">
                <el-col :span="24" key="personFirst">
                  <el-table border :data="bankInfoTableData">
                    <el-table-column label="账户类型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.accountType == 1">对公</span>
                        <span v-else>个体工商户</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="开户省份城市">
                      <template slot-scope="scope">
                        {{scope.row.province+scope.row.city}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="bankName" label="开户银行"> </el-table-column>
                    <el-table-column prop="subBankName" label="开户支行"> </el-table-column>
                    <el-table-column prop="name" label="开户名称"> </el-table-column>
                    <el-table-column prop="account" label="银行账号"> </el-table-column>
                    <el-table-column label="银行卡照片">
                      <template slot-scope="scope">
                        <ImagePreview :imageUrl="scope.row.bankPhoto"></ImagePreview>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </section>
          </el-tab-pane>

          <el-tab-pane label="普通服务商" name="comServicePro" v-if="isCityLevel">

            <div class="al spActivedColor positionRe " style="background:#f3f3f3">
              <i class="el-icon-tan"></i>
              <span class="font16 pdLeft20">当前服务商下属普通服务商共{{subServiceProvider.length}}个</span>
            </div>
            <section>
              <div class="titleStyle al">
                <i class="el-icon-bie"></i>
                <span>下属普通服务商列表</span>
              </div>
              <el-row>
                <el-col :span="24">
                  <el-table border :data="subServiceProvider">
                    <el-table-column label="服务商ID/名称">
                      <template slot-scope="scope">
                        {{scope.row.id + ' / ' + scope.row.name}}
                      </template>
                    </el-table-column>
                    <el-table-column label="负责人/手机号">
                      <template slot-scope="scope">
                        {{scope.row.headName + ' / ' + scope.row.headMobile}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" label="服务商地址"> </el-table-column>
                    <el-table-column label="负责区域">
                      <template slot-scope="scope">
                        <ul>
                          <li v-for="item in scope.row.serviceAreas" :key="item.serviceProviderId">
                            {{item.province+item.city+item.district}}
                          </li>
                        </ul>
                      </template>
                    </el-table-column>
                    <el-table-column label="启用状态">
                      <template slot-scope="scope">
                        <span>启用</span>
                        <!-- <span else>停用</span> -->
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </section>

          </el-tab-pane>
        </el-tabs>

      </div>
    </transition>
  </div>

</template>
<script>
import { GetServiceProviderDetail } from "./../../../Apis";
import { MessageBox, Message } from "element-ui";
import BreadCrumb from "../../../components/BreadCrumb";
import ImagePreview from "../../../components/ImagePreview";

export default {
  data: function() {
    return {
      id: 0, //从服务商管理列表id
      currentPage: 1, //从服务商管理列表页码
      activeTab: "basicInfo",
      dialogImgUrl: "",
      activeDataState: "",
      remark: "",
      serviceProviceDto: {
        name: "",
        level: 0,
        superiorId: 0,
        headName: "",
        headMobile: "",
        headIdCard: "",
        headIdCardFrontUrl: "",
        headIdCardReverseUrl: "",
        legalName: "",
        legalMobile: "",
        legalIdCard: "",
        legalIdCardFrontUrl: "",
        legalIdCardReverseUrl: "",
        address: "",
        licenseUrl: "",
        socialCode: "",
        serviceArea: [
          // {
          //   serviceProviderId: 0,
          //   province: "",
          //   city: "",
          //   district: "",
          //   id: 0
          // }
        ],
        id: 0
      },
      bankInfo: {
        serviceProviderId: 0,
        accountType: 0,
        authPhoto: "",
        province: "",
        city: "",
        bankName: "",
        subBankName: "",
        name: "",
        bankPhoto: "",
        account: "",
        orgUrl: "",
        orgCodePeriod: "",
        id: 0
      },
      subServiceProvider: [
        // {
        //   name: "",
        //   headName: "",
        //   headMobile: "",
        //   address: "",
        //   serviceAreas: [
        //     {
        //       serviceProviderId: 0,
        //       province: "",
        //       city: "",
        //       district: "",
        //       id: 0
        //     }
        //   ],
        //   enable: 0,
        //   id: 0
        // }
      ],
      breadList: [
        { label: "服务商" },
        { label: "服务商管理" },
        { label: "详情" }
      ]
    };
  },
  computed: {
    isCityLevel: function() {
      // 监听服务商等级  是否显示  基本信息  城市服务商列 /  切换标签 区域服务商 1卡莫 2城市 3普通
      return this.type === 3 ? false : true;
    },
    isaccountType: function() {
      // 根据 账户类型 对公 1  还是 个体工商户 2  显示不一样 银行账户信息
      return this.bankInfo.accountType === 1 ? true : false;
    },
    serviceProviceDtoTableData() {
      return [this.serviceProviceDto];
    },
    bankInfoTableData() {
      if (!this.bankInfo.id) {
        return [];
      }
      return [this.bankInfo];
    }
    // bankInfoTableDataTwo(){
    //    return [this.bankInfo];
    // },
    // bankInfoTableDataThree(){
    //    return [this.bankInfo];
    // }
  },
  methods: {
    async getDetailData() {
      let params = {
        type: this.type,
        Id: this.id
      };
      let response = await GetServiceProviderDetail(params);
      if (response.success) {
        this.serviceProviceDto = Object.assign(
          this.serviceProviceDto,
          response.result.serviceProviceDto
        );
        if (response.result.bankInfo) {
          this.bankInfo = Object.assign(
            this.bankInfo,
            response.result.bankInfo
          );
        }
        if (!response.result.subServiceProvider)
          response.result.subServiceProvider = [];
        this.subServiceProvider = [...response.result.subServiceProvider];
      }
    },
    handleClick() {},
    editClick() {
      //直接切换编辑页签 serviceProviderIdAndType 已经在 spList中缓存了
      // this.$router.push("/serviceProvider/spAddAndEdit");
      this.$router.push({
        path: "/servicer/ServiceAddEdit",
        query: {
          // type: this.type,
          id: this.id,
          currentPage: this.currentPage,
          level: this.serviceProviceDto.level
        }
      });
    },
    refreshCallback() {
      this.getDetailData();
    },
    backCallback() {
      this.$router.push({
        path: "/servicer/ServiceList",
        query: {
          currentPage: this.currentPage
        }
      });
    }
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.type = this.$route.query.type || "";
    this.currentPage = this.$route.query.currentPage || 1;
    this.getDetailData();
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
.serviceProviderDescrition {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
  .el-tabs--border-card {
    margin: 5px 10px;
  }
  .spActivedColor {
    height: 60px;
    line-height: 60px;
    margin-bottom: 20px;
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
  .pdLeft20 {
    padding-left: 20px;
  }
  .bankAccountBox {
    flex-wrap: wrap;
    > div {
      height: 45px;
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
  .spStatusBox {
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
    span {
      font-size: 20px;
      font-weight: bold;
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
  .spBtnBox {
    position: absolute;
    right: 20px;
    top: 0;
    font-size: 15px;
    button {
      background: #30c7a1;
      font-size: 16px;
      padding: 5px 20px;
      &:hover {
        background: #67c23a;
      }
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
  .el-input__inner {
    border: 1px solid #000;
  }
  .rightButton {
    border: 1px solid @btnColor;
    color: @btnColor;
  }
}
</style>

