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
    <div class="serviceAddEditContainer">

      <div class="spAddAndEditContainer">
        <el-row type="flex" justify="start">
          <el-col class="titleIcon">
            <span>1</span>
            <span>{{titles.titleOne}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="24" class="formColContainer">
            <el-form class="formBox" ref="addOrEditForm1" label-position="left" :rules="rules" :model="addOrEditForm" key="formFirst" label-width="170px">
              <el-form-item label="服务商名称" prop="name">
                <el-input v-model="addOrEditForm.name"></el-input>
              </el-form-item>
              <el-form-item label="服务商等级" prop="level">
                <el-select v-model="addOrEditForm.level" placeholder="请选择服务商等级" :disabled="isEdit" @change="levelChange">
                  <!-- <el-option label="卡莫服务商" value="1"></el-option> -->
                  <el-option v-for="(item, index) in services" :key='index' :label="item.label" :value="item.value"></el-option>
                  <!-- <el-option label="城市服务商" value="2"></el-option>
                <el-option label="普通服务商" value="3"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item label="上级组织">
                <el-select v-model="addOrEditForm.superiorId" placeholder="请选择上级组织" :disabled="isEdit" @change="superiorChange">
                  <el-option v-for="item in superiorList" :key="'superiorList_'+item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="负责人姓名" prop="headName">
                <el-input v-model="addOrEditForm.headName"></el-input>
              </el-form-item>
              <el-form-item label="负责人手机号" prop="headMobile">
                <el-input v-model="addOrEditForm.headMobile"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名" prop="legalName">
                <el-input v-model="addOrEditForm.legalName"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号" prop="legalMobile">
                <el-input v-model="addOrEditForm.legalMobile"></el-input>
              </el-form-item>
              <el-form-item label="服务商地址" prop="address">
                <el-input v-model="addOrEditForm.address"></el-input>
              </el-form-item>
              <el-form-item label="负责区域" class="distprickerBox" prop="serviceArea" v-if="addOrEditForm.level !== '1'">
                <el-row type="flex" justify="center" v-model="addOrEditForm.serviceArea">
                  <el-col :span="24" v-for="(item, index) in addOrEditForm.serviceArea" :key="index">
                    <v-distpicker :key="index" :province="item.province" :city="item.city" :area="item.area" @province="distpickerChange($event,index,'province')" @city="distpickerChange($event,index,'city')" @area="distpickerChange($event,index,'district')"></v-distpicker>
                    <el-button class="distprickMinusBtn" type="danger" icon="el-icon-delete" @click="addOrRemoveDistpicker(item,index)"></el-button>
                  </el-col>
                </el-row>
                <el-button class="distprickAddBtn" icon="el-icon-plus" @click="addOrRemoveDistpicker()" v-if="addOrEditForm.level !== '3' || (addOrEditForm.level === '3' && addOrEditForm.superiorId === 1) "></el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="titleIcon">
            <span>2</span>
            <span>{{titles.titleTwo}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="24" class="formColContainer">
            <el-form class="formBoxImg" ref="addOrEditForm2" :rules="rules" label-position="left" key="formSecond" :model="addOrEditForm" label-width="170px">
              <el-form-item label="负责人身份证号码" prop="headIdCard">
                <el-input v-model="addOrEditForm.headIdCard"></el-input>
              </el-form-item>
              <el-form-item label="负责人身份证照片" prop="headImg" class="requied">
                <el-row type="flex" justify="start" v-model="headImg">
                  <el-col>
                    <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="headIdCardFrontSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addOrEditForm.headIdCardFrontUrl" :src="addOrEditForm.headIdCardFrontUrl" class="avatar">
                      <div v-else class="uploadTitle">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <span>正面</span>
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col>
                    <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="headIdCardReverseSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addOrEditForm.headIdCardReverseUrl" :src="addOrEditForm.headIdCardReverseUrl" class="avatar">
                      <div v-else class="uploadTitle">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <span>反面</span>
                      </div>
                    </el-upload>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="法人身份证号码" prop="legalIdCard">
                <el-input v-model="addOrEditForm.legalIdCard"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证照片" prop="legalImg" class="requied">
                <el-row type="flex" justify="start" v-model="legalImg">
                  <el-col>
                    <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="legalIdCardFrontSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addOrEditForm.legalIdCardFrontUrl" :src="addOrEditForm.legalIdCardFrontUrl" class="avatar">
                      <div v-else class="uploadTitle">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <span>正面</span>
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col>
                    <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="legalIdCardReverseSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addOrEditForm.legalIdCardReverseUrl" :src="addOrEditForm.legalIdCardReverseUrl" class="avatar">
                      <div v-else class="uploadTitle">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <span>反面</span>
                      </div>
                    </el-upload>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="统一社会信用代码" prop="socialCode">
                <el-input v-model="addOrEditForm.socialCode"></el-input>
              </el-form-item>
              <el-form-item label="营业执照照片" prop="licenseUrl">
                <el-row type="flex" justify="start" v-model="addOrEditForm.licenseUrl">
                  <el-col>
                    <el-upload name='formFile' class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="licenseSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="addOrEditForm.licenseUrl" :src="addOrEditForm.licenseUrl" class="avatar">
                      <div v-else class="uploadTitle">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <span>上传</span>
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col></el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="btnBox">
          <el-button plain @click="cancelClick">取消</el-button>
          <el-button plain @click="submitFormClick">确定</el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {
  GetParentServiceProvider,
  CreateOrEditServiceProvider,
  GetServiceProviderForEdit,
  UploadFile,
  GetParentServiceArea
} from "./../../../Apis";
import { MessageBox, Message } from "element-ui";
import VDistpicker from "v-distpicker";
import BreadCrumb from "../../../components/BreadCrumb";
import config from "./../../../utils/config.js";

export default {
  data: function() {
    let validatePhone = (rule, value, callback) => {
      if (!/^1[1-9]\d{9}$/.test(value)) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    let idCardValdate = function(rule, value, callback) {
      // if (this.fromParmas.id_type != 1) return callback();
      // 身份证校验
      if (value.length == 15 || value.length == 18) {
        /** 检查身份证是否合法 验证时请先验证长度是否为15为或者18位 */
        let reg = new RegExp(
          "\\d{6}(19|20)*[0-99]{2}(0[1-9]{1}|10|11|12)(0[1-9]{1}" +
            "|1[0-9]|2[0-9]|30|31)(\\w*)"
        );
        if (!reg.test(value)) {
          callback(new Error("身份证号码格式不正确"));
        } else {
          callback();
        }
      } else {
        callback(new Error("身份证号码格式不正确"));
      }
    };
    // [0-9A-Z]{2}[0-9]{6}[0-9A-Z]{9}[0-9A-Z]{1} / [^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g
    let socialCodeValdate = function(rule, value, callback) {
      if (value.length == 18) {
        if (!/^(?=.*\d)[A-Za-z\d]{18}$/.test(value)) {
          callback(new Error("统一社会信用代码格式不正确"));
        } else {
          callback();
        }
      } else {
        callback(new Error("统一社会信用代码格式不正确"));
      }
    };
    return {
      isEdit: false, //判断是新增还是编辑 在state存在服务商id为编辑状态
      Id: 0,
      uploadUrl: config.uploadUrl,
      addOrEditForm: {
        Id: 0,
        name: "",
        level: "2",
        superiorId: "1",
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
        serviceArea: []
      },
      superiorList: [], //城市服务商列表
      rules: {
        name: [
          { required: true, message: "请输入服务商名称", trigger: "blur" }
        ],
        level: [
          { required: true, message: "请选择服务商等级", trigger: "blur" }
        ],
        headName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        headMobile: [
          { required: true, message: "请输入负责人手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        legalName: [
          { required: true, message: "请输入法人姓名", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        legalMobile: [
          { required: true, message: "请输入法人手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入服务商地址", trigger: "blur" }
        ],
        serviceArea: [
          { required: true, message: "请输入服务商地址", trigger: "blur" }
        ],
        headIdCard: [
          {
            required: true,
            message: "请输入负责人身份证号码",
            trigger: "blur"
          },
          { validator: idCardValdate, trigger: "blur" }
        ],
        legalIdCard: [
          { required: true, message: "请输入法人身份证号码", trigger: "blur" },
          { validator: idCardValdate, trigger: "blur" }
        ],
        headImg: [
          {
            validator: (rule, value, callback) => {
              if (!this.addOrEditForm.headIdCardFrontUrl) {
                callback(new Error("请上传负责人身份证正面照"));
              } else if (!this.addOrEditForm.headIdCardReverseUrl) {
                callback(new Error("请上传负责人身份证反面照"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        legalImg: [
          {
            validator: (rule, value, callback) => {
              if (!this.addOrEditForm.legalIdCardFrontUrl) {
                callback(new Error("请上传法人身份证正面照"));
              } else if (!this.addOrEditForm.legalIdCardReverseUrl) {
                callback(new Error("请上传法人身份证反面照"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        socialCode: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          },
          { validator: socialCodeValdate, trigger: "blur" }
        ],
        licenseUrl: [
          { required: true, message: "请上传营业执照", trigger: "blur" }
        ]
      },
      breadList: [
        { label: "服务商" },
        { label: "服务商管理" },
        { label: "新增编辑" }
      ],
      services: []
    };
  },
  computed: {
    titles() {
      return {
        titleOne: this.isEdit ? "修改基本信息" : "设置基本信息",
        titleTwo: this.isEdit ? "修改资质信息" : "设置资质信息"
      };
    },
    headImg() {
      return this.addOrEditForm.headIdCardFrontUrl &&
        this.addOrEditForm.headIdCardReverseUrl
        ? "ddd"
        : null;
    },
    legalImg() {
      return this.addOrEditForm.legalIdCardFrontUrl &&
        this.addOrEditForm.legalIdCardReverseUrl
        ? "dddd"
        : null;
    }
  },
  methods: {
    async getSuperiorList() {
      // superiorList
      let response = await GetParentServiceProvider({
        Level: this.addOrEditForm.level
      });
      this.superiorList = [{ id: "0", name: "--" }];
      if (response && response.success) {
        if (!response.result) response.result = [];
        this.superiorList = [{ id: "0", name: "--" }];
        response.result.forEach(item => {
          item.id = item.id + "";
          this.superiorList.push(item);
        });
      }
      this.services = [
        { label: "城市服务商", value: "2" },
        { label: "普通服务商", value: "3" }
      ];
      if (this.isEdit) {
        this.services = [{ label: "卡莫服务商", value: "1" }, ...this.services];
        //编辑状态 获取服务商详细编辑信息
        let params = { Id: this.Id };
        let editReposne = await GetServiceProviderForEdit(params);
        if (editReposne.success) {
          this.addOrEditForm = editReposne.result;
          this.addOrEditForm.level = this.addOrEditForm.level + ""; //枚举值 number转 string
          if (!this.addOrEditForm.superiorId) this.addOrEditForm.superiorId = 0;
          this.addOrEditForm.superiorId = this.addOrEditForm.superiorId + ""; //枚举值 number转 string
          this.addOrEditForm.serviceArea = this.addOrEditForm.serviceArea
            ? this.addOrEditForm.serviceArea.map(item => {
                item.area = item.district;
                return item;
              })
            : [];
        } else {
          Message({
            message: "获取服务商信息失败",
            type: "error"
          });
        }
      }
    },
    headIdCardFrontSuccess(res, file) {
      this.$options.methods.setImgUrl.bind(this)(res, "headIdCardFrontUrl");
    },
    headIdCardReverseSuccess(res, file) {
      this.$options.methods.setImgUrl.bind(this)(res, "headIdCardReverseUrl");
    },
    legalIdCardFrontSuccess(res, file) {
      this.$options.methods.setImgUrl.bind(this)(res, "legalIdCardFrontUrl");
    },
    legalIdCardReverseSuccess(res, file) {
      this.$options.methods.setImgUrl.bind(this)(res, "legalIdCardReverseUrl");
    },
    licenseSuccess(res, file) {
      this.$options.methods.setImgUrl.bind(this)(res, "licenseUrl");
    },
    async beforeAvatarUpload(file, id) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      if (!isJPG && !isGIF && !isPNG) {
        this.$message.error("上传图片必须是JPG/GIF/PNG 格式!");
      }
      return isJPG || isGIF || isPNG;
    },
    setImgUrl(response, key) {
      this.addOrEditForm[key] = response.success ? response.result.Url : "";
      // this.$refs.addOrEditForm2.validate(function(valid) {});
      if (response.success) return;
      return Message({
        message: "上传图片失败",
        type: "error",
        showClose: true
      });
    },
    addOrRemoveDistpicker(item, index) {
      // 新增删除
      if (!item) {
        this.addOrEditForm.serviceArea.push({});
      } else {
        // 删除元素
        this.addOrEditForm.serviceArea.splice(index, 1);
      }
    },
    cancelClick() {
      this.backCallback();
    },
    async submitFormClick() {
      let isOk_one = false;
      let isOK_two = false;
      await this.$refs.addOrEditForm1.validate(function(valid) {
        if (valid) {
          isOk_one = true;
        } else {
          isOk_one = false;
        }
      });
      await this.$refs.addOrEditForm2.validate(function(valid) {
        if (valid) {
          isOK_two = true;
        } else {
          isOK_two = false;
        }
      });
      if (isOk_one && isOK_two) {
        let params = this.addOrEditForm;
        params.serviceArea.forEach(item => {
          item.city = item.city === "市" ? "" : item.city;
          item.district = item.district === "区" ? "" : item.district;
          item.area = item.area === "区" ? "" : item.area;
        });
        if (params.superiorId === "0") params.superiorId = "";

        params.Id = this.Id;
        if (!this.isEdit) params.Id = null; //新增id为空
        let response = await CreateOrEditServiceProvider(params);

        Message({
          message: response.success ? "提交成功" : "提交失败",
          type: response.success ? "success" : "error",
          showClose: true
        });
        if (response.success) {
          this.backCallback();
        }
      }
    },
    distpickerChange(e, index, key) {
      //更行选择 负责区域数组  index下标  key 省份城市县区
      let area = this.addOrEditForm.serviceArea[index];
      this.addOrEditForm.serviceArea[index][key] = e.value;
    },
    refreshCallback() {
      this.getSuperiorList();
    },
    backCallback() {
      this.$router.push({
        path: "/servicer/ServiceList",
        query: {
          currentPage: this.currentPage
        }
      });
    },
    async levelChange(value) {
      let response = await GetParentServiceProvider({
        Level: value
      });
      this.addOrEditForm.superiorId = "0";
      this.superiorList = [{ id: "0", name: "--" }];
      if (response && response.success) {
        this.superiorList = [{ id: "0", name: "--" }, ...response.result];
      }
      // 选择城市服务商 直接设置 上级为卡莫
      if (value == "2") {
        this.addOrEditForm.superiorId = 1;
      }
    },
    async superiorChange(value) {
      if (!value) {
        this.addOrEditForm.serviceArea = [];
        return;
      }
      let res = await GetParentServiceArea({ Id: value });
      if (res && res.success) {
        if (!res.result) {
          this.addOrEditForm.serviceArea = [];
        } else {
          this.addOrEditForm.serviceArea = [...res.result];
        }
      }
    }
  },
  created() {
    this.Id = this.$route.query.id - 0 || 0;
    this.isEdit = this.Id ? true : false;
    this.currentPage = this.$route.query.currentPage || 1;
    this.addOrEditForm.level = this.$route.query.level || "2";
    this.getSuperiorList();
  },
  components: { VDistpicker, BreadCrumb }
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
.serviceAddEditContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
}
.spAddAndEditContainer {
  margin: 20px 50px;
  -moz-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.349019607843137);
  -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.349019607843137);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.349019607843137);
  overflow: auto;
  .titleIcon {
    text-align: left;
    padding-left: 20px;
    span {
      margin: 20px 10px;
      color: #31c7a0;
      text-align: center;
      font-size: 16px;
      &:first-child {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        background: #31c7a0;
        color: #fff;
      }
      &:last-child {
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
  .uploadTitle {
    position: relative;
    width: 100%;
    height: 100%;
    line-height: 47px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.2);
    .avatar-uploader-icon {
      font-size: 16px;
      color: #fff;
      width: 150px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      display: inline-block;
      width: 20px;
      border: 1px solid rgba(49, 199, 160, 1);
      border-radius: 50%;
      background: rgba(49, 199, 160, 1);
      position: absolute;
      left: 10px;
      top: 10px;
    }
    span {
      color: rgba(49, 199, 160, 1);
    }
  }
  .el-form--label-left .el-form-item__label {
    text-align: right;
    padding-right: 20px;
  }
  .el-select {
    width: 100%;
  }
  .avatar-uploader {
    .el-upload {
      border: 2px solid rgba(49, 199, 160, 1);
      position: relative;
      overflow: hidden;
      border-radius: 6px;
      height: 47px;
      line-height: 47px;
      width: 150px;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
    }

    .el-upload:hover {
      border-style: dashed;
    }
  }
  .distprickerBox {
    .el-form-item__content {
      border: 1px solid #dcdfe6;
      padding: 5px 10px 55px 5px;
      border-radius: 4px;
    }
    .el-button {
      padding: 10px;
    }
    .el-row {
      flex-direction: column;
    }
    .el-col {
      position: relative;
      margin: 5px;
    }
    .distprickMinusBtn {
      position: absolute;
      left: 465px;
      top: 6px;
      border: 0;
      padding: 0;
      color: #f56c6c;
      background: #fff;
      font-size: 25px;
      font-weight: bold;
      &:hover {
        border: 2px solid #f56c6c;
      }
    }
    .distprickAddBtn {
      border: 2px solid rgba(49, 199, 160, 1);
      color: rgba(49, 199, 160, 1);
      position: absolute;
      left: 15px;
      bottom: 10px;
      padding: 0;
      font-size: 25px;
      font-weight: bold;
      &:hover {
        background: rgba(49, 199, 160, 1);
        color: #fff;
      }
    }
    .distpicker-address-wrapper {
      text-align: left;
      > select {
        width: 150px;
      }
    }
  }
  .formBoxImg {
    .el-col-24 {
      width: 100%;
      max-width: 150px;
      margin: 0 50px;
    }
  }
  .requied {
    .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  @media screen and (min-width: 1440px) {
    .formColContainer {
      max-width: 70% !important;
    }
  }

  .btnBox {
    height: 50px;
    line-height: 50px;
    border-top: 2px solid #eee;
    button {
      width: 69px;
      border-radius: 7px;
      padding: 5px 20px;
      text-align: center;
      border-color: #31c7a0;
      &:first-child {
        color: #31c7a0;
        background: #fff;
      }
      &:last-child {
        background: #31c7a0;
        color: #fff;
      }
      &:hover {
        background: #fff;
        color: #409eff;
      }
    }
  }
}
.rightButton {
  border: 1px solid @btnColor;
  color: @btnColor;
}
</style>


