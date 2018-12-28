<template>
  <div class="content">
    <div class="statusRow ">
      <i class="iconfont icon-gantanhao"></i>当前商户状态：{{status}}
      <i size="small" class="iconfont icon-edit editIcon" @click="showEditSale()"></i>
    </div>
    <div class="dataBaseRow">
      <i class="iconfont icon-database"></i>基本信息
    </div>
    <el-table :data="basicDatas" border style="width: 100%">
      <el-table-column fixed label="商户ID/名称">
        <template slot-scope="scope">
          {{`${scope.row.id}/${scope.row.merchantName}`}}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="contactMobile"></el-table-column>
      <el-table-column label="商户类型" prop="type"></el-table-column>
      <el-table-column label="推荐商户ID/账户">
        <template slot-scope="scope">
          {{`${scope.row.recommendMerChantId || ''}/${scope.row.recommendMerChantName || ''}`}}
        </template>
      </el-table-column>
      <el-table-column label="服务商ID/名称">
        <template slot-scope="scope">
          {{`${scope.row.serviciProvideId || ''}/${scope.row.serviciProvideName || ''}`}}
        </template>
      </el-table-column>
      <el-table-column label="业务员姓名/手机号">
        <template slot-scope="scope">
          {{`${scope.row.salesmanName || ''}/${scope.row.salesmanPhone || ''}`}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑基本信息 -->
    <el-dialog title="编辑服务商业务员" :visible.sync="editSaleVisible" width="500px">
      <el-form :model="saleForm" ref="saleForm" label-width="150px" :rules="saleRules">
        <el-form-item label="商户名称">
          <el-input v-model="saleForm.merchantName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="服务商ID">
          <el-input v-model="saleForm.serviciProvideId" @change="getServiceName"></el-input>
        </el-form-item>
        <el-form-item label="服务商名称">
          <span>{{saleForm.serviciProvideName}}</span>
        </el-form-item>
        <el-form-item label="业务员手机号">
          <el-input v-model="saleForm.saleManMobile" @change="getSaleName" placeholder="请输入业务员手机号"></el-input>
        </el-form-item>
        <el-form-item label="业务员姓名">
          <span>{{saleForm.saleManName}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer saleFormBtn">
        <el-button @click="editSaleVisible = false" class="textButton">取 消</el-button>
        <el-button type="success" :disabled="!editSalePhoneDisable" @click="editSalePhone">确 定</el-button>
      </div>
    </el-dialog>

    <div class="dataBaseRow">
      <i class="iconfont icon-database"></i>门店列表
    </div>
    <el-table :data="shopDatas" border style="width: 100%">
      <el-table-column label="门店ID/名称">
        <template slot-scope="scope">
          {{`${scope.row.id}/${scope.row.shopName}`}}
        </template>
      </el-table-column>
      <el-table-column label="门店资质信息" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="medium" class="textButton" @click="CertificationWatch(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="门店负责人/手机号">
        <template slot-scope="scope">
          {{`${scope.row.contacts}/${scope.row.mobile}`}}
        </template>
      </el-table-column>
      <el-table-column prop="scope" label="所属商圈"> </el-table-column>
      <el-table-column prop="address" label="门店地址"> </el-table-column>
      <el-table-column prop="shopStatus" label="门店状态"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="medium" class="textButton" :disabled="scope.row.isFrozenCancel" v-if="scope.row.shopStatus == '冻结中' || scope.row.shopStatus == '隐藏/冻结中'"
            @click="shopFrozen(scope.row,false)">取消冻结</el-button>
          <el-button type="text" size="medium" class="textButton" :disabled="scope.row.isFrozen" v-else @click="shopFrozen(scope.row,true)">冻结</el-button>
          <el-button type="text" size="medium" class="textButton" :disabled="scope.row.isHideCancel" v-if="scope.row.shopStatus === '隐藏中' || scope.row.shopStatus == '隐藏/冻结中'"
            @click="shopHide(scope.row,false)">取消隐藏</el-button>
          <el-button type="text" size="medium" class="textButton" :disabled="scope.row.isHide" v-else @click="shopHide(scope.row,true)">隐藏</el-button>
          <el-button type="text" size="medium" class="textButton" @click="shopDelete(scope.row)">注销</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 资质图片查看 -->
    <el-dialog title="门店资质信息" :visible.sync="certificationOuterVisible" :modal='false' width="400px"
      :modal-append-to-body="false" :close-on-click-modal="false">
      <el-row>
        <el-col :span="11" class="certificationCol" v-if="certification.logo">
          <div>门店Logo</div>
          <ImagePreview :imageUrl="certification.logo"></ImagePreview>
        </el-col>
        <el-col :span="11" class="certificationCol" v-if="certification.license">
          <div>营业执照</div>
          <ImagePreview :imageUrl="certification.license"></ImagePreview>
        </el-col>
        <el-col :span="11" class="certificationCol" v-if="certification.idCardFront">
          <div>身份证正面照(护照照片)</div>
          <ImagePreview :imageUrl="certification.idCardFront"></ImagePreview>
        </el-col>
        <el-col :span="11" class="certificationCol" v-if="certification.idCardReverse">
          <div>身份证反面照</div>
          <ImagePreview :imageUrl="certification.idCardReverse"></ImagePreview>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetMerChantInfo,
  SetShopFrozen,
  SetShopHide,
  ShopCancle,
  ModifyMerChantsInfo,
  ModifyMerChantServiciProvide,
  GetServiciProvideName,
  GetSaleManName,
  ModifyMerChantsRewardConfig
} from "./../../../Apis";
import { MessageBox, Message } from "element-ui";
import ImagePreview from "../../../components/ImagePreview";
export default {
  props: ["tId"],
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!/^1[1-9]\d{9}$/.test(value)) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    return {
      basicDatas: [],
      shopDatas: [],
      detaildId: this.tId,
      status: "",
      editSaleVisible: false,
      saleForm: {
        id: 0,
        merchantName: "",
        saleManName: "",
        serviciProvideId: 0,
        serviciProvideName: "",
        saleManMobile: "" //编辑业务员手机
      },
      editSalePhoneDisable: false,
      saleRules: {
        saleManMobile: [
          { required: true, message: "请输入业务员手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ]
      },
      certificationOuterVisible: false,
      certification: {
        logo: "",
        license: "",
        idCardFront: "",
        idCardReverse: "",
        preView: ""
      }
    };
  },
  created() {
    this.GetMerChantInfoData();
  },
  watch: {
    detaildId() {
      this.GetMerChantInfoData();
    }
  },
  methods: {
    showEditSale() {
      if (!this.basicDatas.length) return;
      let {
        merchantName,
        salesmanName,
        salesmanPhone,
        serviciProvideName,
        serviciProvideId
      } = this.basicDatas[0];
      this.saleForm = {
        id: this.detaildId || 0,
        merchantName: merchantName || "",
        saleManName: salesmanName || "",
        saleManMobile: salesmanPhone || "",
        serviciProvideName: serviciProvideName || "",
        serviciProvideId: serviciProvideId || 0
      };
      this.editSaleVisible = true;
    },
    async getServiceName() {
      // 清除 业务员手机号 及 名称
      this.saleForm.saleManName = "";
      this.saleForm.saleManMobile = "";
      let Id = this.saleForm.serviciProvideId;
      if (!Id) {
        this.saleForm.serviciProvideName = "";
        return;
      }
      let res = await GetServiciProvideName({ Id });
      if (res && res.success) {
        this.saleForm.serviciProvideName = res.result;
      }
    },
    async getSaleName() {
      if (!this.saleForm.saleManMobile) {
        this.editSalePhoneDisable = false;
        this.saleForm.saleManName = "";
        return;
      }
      let params = {
        mobile: this.saleForm.saleManMobile,
        ServiciProvideId: this.saleForm.serviciProvideId
      };
      let res = await GetSaleManName(params);
      if (res && res.success) {
        if (res.result) {
          this.editSalePhoneDisable = true;
          this.saleForm.saleManName = res.result;
        } else {
          this.$message({
            message: "当前服务商不存在此业务员",
            type: "error"
          });
          this.editSalePhoneDisable = false;
        }
      }
    },
    editSalePhone() {
      let _this = this;
      _this.$refs.saleForm.validate(async function(valid) {
        if (valid) {
          let { id, saleManMobile } = _this.saleForm;
          let res = await ModifyMerChantServiciProvide({ id, saleManMobile });
          if (res && res.success) {
            _this.editSaleVisible = false;
            _this.$message({
              message: "修改业务员成功",
              type: "success"
            });
            _this.GetMerChantInfoData();
          }
        }
      });
    },
    CertificationWatch(rowData) {
      this.certification = Object.assign(this.certification, rowData);
      this.certificationOuterVisible = true;
    },
    async shopFrozen(rowData, forzenBoolean) {
      let params = {
        id: rowData.id,
        type: forzenBoolean ? 1 : 2
      };
      const create = this.$createElement;
      this.$msgbox({
        title: forzenBoolean ? "门店冻结" : "取消门店冻结",
        message: create("div", null, [
          create(
            "div",
            { style: "line-height: 35px;color:#000;font-size:18px" },
            forzenBoolean
              ? `冻结后,仅支持门店下的会员使用余额支付,门店不在C端显示！`
              : `操作后，门店会员可在门店进行充值及支付操作，门店回复在C端的展示。`
          ),
          create(
            "div",
            { style: "line-height: 35px;color:#000;font-size:18px" },
            "请确认是否继续操作"
          )
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          done();
        }
      }).then(async () => {
        let response = await SetShopFrozen(params);
        if (response.success) {
          this.GetMerChantInfoData();
          Message({
            message: forzenBoolean ? "冻结成功" : "取消冻结成功",
            type: "success"
          });
        }
      });
    },
    async shopHide(rowData, hideBoolean) {
      let params = {
        id: rowData.id,
        type: hideBoolean ? 1 : 2
      };
      const create = this.$createElement;
      this.$msgbox({
        title: hideBoolean ? "隐藏门店" : "取消隐藏门店",
        message: create("div", null, [
          create(
            "div",
            { style: "line-height: 35px;color:#000;font-size:18px" },
            hideBoolean
              ? `隐藏后，门店不在C端展示。`
              : `取消门店隐藏后，门店恢复在C端展示。`
          ),
          create(
            "div",
            { style: "line-height: 35px;color:#000;font-size:18px" },
            "请确认是否继续操作"
          )
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          done();
        }
      }).then(async () => {
        let response = await SetShopHide(params);
        if (response.success) {
          this.GetMerChantInfoData();
          Message({
            message: hideBoolean ? "隐藏成功" : "取消隐藏成功",
            type: "success"
          });
        }
      });
    },
    async shopDelete(rowData) {
      let params = {
        id: rowData.id
      };
      const create = this.$createElement;
      this.$msgbox({
        title: "注销门店",
        message: create("div", null, [
          create(
            "div",
            { style: "line-height: 35px;color:#000;font-size:18px" },
            `注销之后，从运营后台删除该门店，门店不再显示到C端，门店会员不能再到门店进行在线支付及充值，也不支持使用余额支付。`
          ),
          create(
            "div",
            { style: "line-height: 35px;color:#000;font-size:18px" },
            "请确认是否继续操作"
          )
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          done();
        }
      }).then(async () => {
        let response = await ShopCancle(params);
        if (response.success) {
          this.GetMerChantInfoData();
          Message({
            message: "注销成功",
            type: "success"
          });
        }
      });
    },
    async GetMerChantInfoData() {
      let res = await GetMerChantInfo({ id: this.detaildId });
      if (res.success) {
        let { result } = res;

        let { status, shopsList } = result;
        this.status = status;
        // 处理基本信息数据
        this.basicDatas = [result];
        // 处理门店列表
        this.shopDatas = shopsList.map(item => {
          // item.shopStatus = "冻结中";
          // 根据门店门店状态显示按钮
          if (item.shopStatus.indexOf("冻结") > -1) {
            item.isHide = true;
          }
          if (item.shopStatus.indexOf("服务受限") > -1) {
            item.isFrozen = true;
          }
          item.tradeName = result.tradeName;
          return item;
        });
      }
    }
  },
  components: {
    ImagePreview
  }
};
</script>

<style lang="less">
.saleFormBtn {
  .el-button.is-disabled {
    color: #fff !important;
  }
  .el-button--success.is-disabled {
    background-color: #d5d5d5 !important;
    border-color: #d5d5d5 !important;
  }
}
</style>

