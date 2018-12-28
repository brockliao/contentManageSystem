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
    <div class="merchandiseDestritionContainer">
      <el-tabs v-model="activeTab" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="商户信息" name="merchandiseInfo">
          <template>
            <div class="statusRow ">
              <i class="iconfont icon-gantanhao"></i>当前商户状态：{{merchandiseActived}}
              <i size="small" class="iconfont icon-edit editIcon" @click="showEditSale()"></i>
            </div>
            <div class="dataBaseRow">
              <i class="iconfont icon-database"></i>基本信息
            </div>
            <el-table :data="merchandiseInfoTable.basicData" border style="width: 100%" :max-height="merchandiseInfoTable.height">
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
            <div class="dataBaseRow">
              <i class="iconfont icon-database"></i>门店列表
            </div>
            <el-table :data="merchandiseInfoTable.shopData" border style="width: 100%" :max-height="merchandiseInfoTable.height">
              <el-table-column label="门店ID/名称">
                <template slot-scope="scope">
                  {{`${scope.row.id}/${scope.row.shopName}`}}
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
              <el-table-column fixed="right" label="门店资质信息" width="100">
                <template slot-scope="scope">
                  <el-button @click="CertificationWatch(scope.row)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button @click="shopListRowClick(scope.row, 'frozen',true)" :disabled="scope.row.isFrozen" v-if="scope.row.shopStatus !== '冻结中'"
                    type="text" size="small">冻结</el-button>
                  <el-button @click="shopListRowClick(scope.row, 'frozen' ,false)" :disabled="scope.row.isFrozenCancel"
                    v-if="scope.row.shopStatus === '冻结中'" type="text" size="small">取消冻结</el-button>
                  <el-button @click="shopListRowClick(scope.row,'hide' , true)" :disabled="scope.row.isHide" v-if="scope.row.shopStatus !== '隐藏中'"
                    type="text" size="small">隐藏</el-button>
                  <el-button @click="shopListRowClick(scope.row, 'hide' ,false)" :disabled="scope.row.isHideCancel"
                    v-if="scope.row.shopStatus === '隐藏中'" type="text" size="small">取消隐藏</el-button>
                  <el-button @click="shopListRowClick(scope.row, 'cancel' )" type="text" size="small">注销</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>

        <!--  tab 分界线 -->
        <el-tab-pane label="商户设置" name="merchandiseSet" class="merchandiseSetBasic">
          <template>
            <div class="statusRow ">
              <i class="iconfont icon-gantanhao"></i>当前商户状态：{{merchandiseActived}}

            </div>
            <div class="dataBaseRow">
              <i class="iconfont icon-database"></i>基本信息
              <i size="small" class="iconfont icon-edit editIcon" @click="merchantSetBasicEdit()"></i>
            </div>
            <el-row type="flex" justify="felx-start" align="center">
              <el-col :span="4">所属行业</el-col>
              <el-col :span="4">{{merchantSetBasicInfo.tradeName}}</el-col>
              <el-col :span="4">单会员账户余额上限</el-col>
              <el-col :span="4">
                <span>￥5000.00</span>
              </el-col>
              <el-col :span="4">商户预收余额上限</el-col>
              <el-col :span="4">
                <span v-show="!merchantSetBasicInfo.isEdit">￥{{merchantSetBasicInfo.limitBalance || 0}}</span>
                <el-input v-show="merchantSetBasicInfo.isEdit" v-model="merchantSetBasicInfo.limitBalance" placeholder="请输入商户预收余额上限">
                  <span slot="prepend">￥</span>
                </el-input>
              </el-col>
            </el-row>
            <el-row type="flex" justify="felx-start" align="center">
              <el-col :span="4">单店现金充值上限</el-col>
              <el-col :span="4">
                <span v-show="!merchantSetBasicInfo.isEdit">￥{{merchantSetBasicInfo.cashlimit || 0}} / 月</span>
                <el-input v-show="merchantSetBasicInfo.isEdit" v-model="merchantSetBasicInfo.cashlimit" placeholder="请输入单店现金充值上限">
                  <span slot="prepend">￥</span>
                  <span slot="append">/ 月</span>
                </el-input>
              </el-col>
              <el-col :span="4">商户余额提现下限</el-col>
              <el-col :span="4">
                <span v-show="!merchantSetBasicInfo.isEdit">￥{{merchantSetBasicInfo.limitReward}}</span>
                <el-input v-show="merchantSetBasicInfo.isEdit" v-model="merchantSetBasicInfo.limitReward" placeholder="请输入商户奖励金提现上限">
                  <span slot="prepend">￥</span>
                </el-input>
              </el-col>
              <el-col :span="4">商城服务费费率</el-col>
              <el-col :span="4">
                <span v-show="!merchantSetBasicInfo.isEdit">{{merchantSetBasicInfo.mallRate || 0}} %</span>
                <el-input v-show="merchantSetBasicInfo.isEdit" v-model="merchantSetBasicInfo.mallRate" placeholder="请输入商城服务费费率">
                  <span slot="append">%</span>
                </el-input>
              </el-col>

            </el-row>
            <div class="statusRow">
              <!-- 基本信息设置保存 -->
              <el-button size="small" plain class="iconfont recordButton" @click="merchantSetBasicSave()">保 存</el-button>
            </div>
            <div class="dataBaseRow">
              <i class="iconfont icon-database"></i>奖励金设置
              <i size="small" class="iconfont icon-edit editIcon" @click="rewardEidt=true"></i>
            </div>
            <el-table :data="rewardConfigList" border style="width: 100%">
              <el-table-column prop="payType" label="支付平台"></el-table-column>
              <el-table-column label="奖励金参与权限">
                <template slot-scope="scope">
                  <span v-show="!rewardEidt">{{scope.row.isRewardDisplay}}</span>
                  <el-switch v-show="rewardEidt" v-model="scope.row.isReward" active-color="#13ce66" inactive-color="#ff4949"
                    active-value="1" inactive-value="0">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="参与奖励金活动费率" v-show="rewardEidt">
                <template slot-scope="scope">
                  <span v-show="!rewardEidt"> {{`${scope.row.lowerLimitRate}‰ - ${scope.row.upperLimitRate}‰`}}</span>
                  <div v-show="rewardEidt">
                    <el-input class="rewardEidtInput" v-model="scope.row.lowerLimitRate" @blur="validateReward()"></el-input>‰
                    - <el-input class="rewardEidtInput" v-model="scope.row.upperLimitRate" @blur="validateReward()"></el-input>‰
                  </div>
                  <div v-if="scope.row.isError" style="color:rgb(255, 73, 73)">{{scope.row.errorMsg}}</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="statusRow">
              <el-button size="small" plain class="iconfont recordButton" @click="rewardSave()">保 存</el-button>
            </div>
          </template>
        </el-tab-pane>

      </el-tabs>
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
            <el-input v-model="saleForm.saleManMobile" @change="getSaleName"></el-input>
          </el-form-item>
          <el-form-item label="业务员姓名">
            <span>{{saleForm.saleManName}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:center;">
          <el-button @click="editSaleVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSalePhone" :disabled="!isCanSubmit">确 定</el-button>
        </div>
      </el-dialog>

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
import BreadCrumb from "../../../components/BreadCrumb";
import ImagePreview from "../../../components/ImagePreview";
export default {
  data: () => {
    let validatePhone = (rule, value, callback) => {
      if (!/^1[1-9]\d{9}$/.test(value)) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    return {
      breadList: [{ label: "商户" }, { label: "商户管理" }, { label: "详情" }],
      id: 0,
      currentPage: 1, //列表页当前页码
      activeTab: "merchandiseInfo",
      merchandiseActived: "",
      editSaleVisible: false,
      feeType: "2",
      isCanSubmit: false, //是否可以提交
      saleForm: {
        id: 0,
        merchantName: "",
        saleManName: "",
        serviciProvideId: 0,
        serviciProvideName: "",
        saleManMobile: "" //编辑业务员手机
      },
      saleRules: {
        saleManMobile: [
          { required: true, message: "请输入业务员手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ]
      },
      MerChantInfo: {},
      merchandiseInfoTable: {
        height: 480,
        basicData: [],
        shopData: []
      },
      merchantSetBasicInfo: {
        isEdit: false
      },
      certification: {
        logo: "",
        license: "",
        idCardFront: "",
        idCardReverse: "",
        preView: ""
      },
      certificationOuterVisible: false,
      ertificationInnerVisible: false,
      rewardConfigList: [],
      rewardEidt: false
    };
  },
  created() {
    // 通过路由 获取id
    this.id = this.$route.params.id || 0;
    this.currentPage = this.$route.params.currentPage || 1;
    this.GetMerChantInfoData();
  },
  methods: {
    handleClick() {},
    async GetMerChantInfoData() {
      // 获取商户详情数据
      let Id = this.id;
      let res = await GetMerChantInfo({ Id });
      // 商户设置 基础信息 赋值

      let { result } = res;
      const MONEYS = ["limitBalance", "limitReward"];

      MONEYS.forEach(key => {
        result[key] = (Math.round(result[key] * 100) / 100).toFixed(2);
      });
      this.merchantSetBasicInfo = Object.assign(
        this.merchantSetBasicInfo,
        result
      );

      this.MerChantInfo = result;
      this.merchandiseActived = result.status;
      this.merchandiseInfoTable.basicData = [result];

      this.merchandiseInfoTable.shopData = result.shopsList.map(item => {
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
      this.rewardConfigList = result.rewardConfigList.map(item => {
        item.isReward = item.isReward + "";
        item.isError = false;
        return item;
      });
    },
    async shopListRowClick(row, type, isBol) {
      let params = { id: row.id };
      if (type === "frozen") {
        // 冻结/取消冻结事件
        if (isBol) {
          params.type = 1; //冻结
          this.$confirm(
            "冻结后,仅支持门店下的会员使用余额支付,门店不在C端显示！",
            "门店冻结",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(async () => {
              let response = await SetShopFrozen(params);
              if (response.success) {
                this.GetMerChantInfoData();
                Message({
                  message: "冻结成功",
                  type: "success"
                });
              }
            })
            .catch(() => {});
        } else {
          params.type = 2; //取消冻结
          let response = await SetShopFrozen(params);
          if (response.success) {
            this.GetMerChantInfoData();
            Message({
              message: "取消冻结成功",
              type: "success"
            });
          }
        }
      }
      if (type === "hide") {
        // 隐藏/取消隐藏事件
        if (isBol) {
          params.type = 1; //隐藏
          this.$confirm("隐藏后,门店不在C端显示！", "隐藏门店", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              let response = await SetShopHide(params);
              if (response.success) {
                this.GetMerChantInfoData();
                Message({
                  message: "隐藏成功",
                  type: "success"
                });
              }
            })
            .catch(() => {});
        } else {
          params.type = 2; //取消隐藏
          let response = await SetShopHide(params);
          if (response.success) {
            this.GetMerChantInfoData();
            Message({
              message: "取消隐藏成功",
              type: "success"
            });
          }
        }
      }
      if (type === "cancel") {
        this.$confirm(
          "注销之后，从运营后台删除该门店，门店不再显示到C端，门店会员不能再到门店进行在线支付及充值，也不支持使用余额支付。",
          "注销门店",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            let response = await ShopCancle(params);
            if (response.success) {
              this.GetMerChantInfoData();
              Message({
                message: "注销成功",
                type: "success"
              });
            }
          })
          .catch(() => {});
        //  注销事件
      }
    },
    merchantSetBasicEdit() {
      this.merchantSetBasicInfo.isEdit = true;
    },
    async merchantSetBasicSave() {
      if (!this.merchantSetBasicInfo.isEdit) return;
      let merchantSetBasicInfo = this.merchantSetBasicInfo;
      let {
        limitBalance,
        limitReward,
        cashlimit,
        mallRate
      } = merchantSetBasicInfo;
      let params = {
        id: this.id,
        limitBalance: Number(limitBalance),
        limitReward: Number(limitReward),
        cashlimit: Number(cashlimit),
        mallRate: Number(mallRate),
        feeType: this.feeType
      };
      if (!/^[1-9]\d*$/.test(params.limitBalance) && params.limitBalance) {
        return this.$message({
          type: "error",
          message: "请输入正确的商户预收余额上限"
        });
      }
      if (!/^[1-9]\d*$/.test(params.limitReward) && params.limitReward) {
        return this.$message({
          type: "error",
          message: "请输入正确的商户奖励金提现下限"
        });
      }
      if (!/^[1-9]\d*$/.test(params.cashlimit) && params.cashlimit) {
        return this.$message({
          type: "error",
          message: "请输入正确的单店现金充值上限"
        });
      }
      if (!/^[1-9]\d*$/.test(params.mallRate) && params.mallRate) {
        return this.$message({
          type: "error",
          message: "请输入正确的商城服务费费率"
        });
      }

      let response = await ModifyMerChantsInfo(params);

      if (response.success) {
        merchantSetBasicInfo.isEdit = false;
        return this.$message({
          type: "success",
          message: "保存成功"
        });
      }
    },
    refreshCallback() {
      this.GetMerChantInfoData();
    },
    showEditSale() {
      let MerChantInfo = this.MerChantInfo;
      this.saleForm = {
        id: MerChantInfo.id || 0,
        merchantName: MerChantInfo.merchantName || "",
        saleManName: MerChantInfo.salesmanName || "",
        saleManMobile: MerChantInfo.salesmanPhone || "",
        serviciProvideName: MerChantInfo.serviciProvideName || "",
        serviciProvideId: MerChantInfo.serviciProvideId || 0
      };
      this.editSaleVisible = true;
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
        this.isCanSubmit = false;
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
          this.isCanSubmit = true;
          this.saleForm.saleManName = res.result;
        } else {
          this.$message({
            message: "当前服务商不存在此业务员",
            type: "error"
          });
          this.isCanSubmit = false;
        }
      }
    },
    CertificationWatch(rowData) {
      this.certificationOuterVisible = true;
      this.certification = Object.assign(this.certification, rowData);
    },
    certificationPreView(key) {
      if (!this.certification[key]) return;
      this.ertificationInnerVisible = true;
      this.certification.preView = this.certification[key];
    },
    validateReward() {
      let lists = this.rewardConfigList;
      let hasError = false;
      lists.forEach(item => {
        item.isError = false;
        item.errorMsg = "";
        if (
          !/^[0-9]+(.[0-9]{0,2})?$/.test(item.lowerLimitRate) ||
          !/^[0-9]+(.[0-9]{0,2})?$/.test(item.upperLimitRate)
        ) {
          item.isError = true;
          item.errorMsg = "参与奖励金活动费率格式不正确";
          hasError = true;
          return;
        }
        if (item.lowerLimitRate < 0 || item.lowerLimitRate > 1000) {
          item.isError = true;
          item.errorMsg = "参与奖励金活动费率下限范围为0-1000";
          hasError = true;
          return;
        }
        if (item.upperLimitRate < 0 || item.upperLimitRate > 1000) {
          item.isError = true;
          item.errorMsg = "参与奖励金活动费率上限为0-1000";
          hasError = true;
          return;
        }
        if (Number(item.lowerLimitRate) > Number(item.upperLimitRate)) {
          item.isError = true;
          item.errorMsg =
            "参与奖励金活动费率下限 不可大于 参与奖励金活动费率上限";
          hasError = true;
          return;
        }
      });
      this.rewardConfigList = [...lists];
      return hasError;
    },
    async rewardSave() {
      let lists = this.rewardConfigList;
      if (!lists.length) return;
      let hasError = await this.validateReward();
      if (hasError) return;
      let isOk = true;
      lists.forEach(async item => {
        let params = {
          ...item
        };
        delete params.isError;
        delete params.errorMsg;
        let res = await ModifyMerChantsRewardConfig(params);
        if (!res.success) isOk = false;
      });
      if (isOk) {
        this.$message({
          type: "success",
          message: "奖励金设置成功"
        });
        this.rewardEidt = false;
        this.GetMerChantInfoData();
      }
    }
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
.searchContent {
  background: #f3f3f3;
  border: 1px solid #d7d7d7;
  padding: 10px 0;
  margin-bottom: 10px;
  .el-form-item {
    margin: 0 0 0 0;
  }
  .el-form-item__content {
    text-align: left;
  }
  .el-input {
    width: 200px;
    max-width: 200px;
  }
  .el-button.is-plain:focus,
  .el-button.is-plain:hover {
    background-color: #2fc7a0;
    color: #fff;
  }
  .el-button.is-plain {
    border-color: #2fc7a0;
    color: #2fc7a0;
  }
}
.merchandiseDestritionContainer {
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
      border-radius: 8px;
      border-color: #2fc7a0;
      background: #2fc7a0;
      color: #fff;
      &:hover {
        background: #33d438;
        border-color: #33d438;
      }
    }

    i.editIcon {
      color: #31c8a1;
      cursor: pointer;
      position: absolute;
      right: 20px;
      font-size: 30px;
    }
  }
  .dataBaseRow {
    text-align: left;
    height: 35px;
    line-height: 35px;
    margin: 10px 0 0;
    background: #f3f3f3;
    position: relative;
    i {
      color: #999;
      margin: 0 10px;
      font-size: 21px;
    }
    color: #333;
    font-size: 17px;
    i.editIcon {
      color: #31c8a1;
      cursor: pointer;
      position: absolute;
      right: 20px;
      font-size: 25px;
    }
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
  .el-table td,
  .el-table th.is-leaf {
    background: #f9fafc;
  }
  .partTitle {
    text-align: left;
    background: #f3f3f3;
    height: 35px;
    line-height: 35px;
    border: 1px solid #d7d7d7;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    font-size: 16px;
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
  .merchandiseSetBasic {
    .el-row {
      height: 45px;
      line-height: 45px;
      .el-col {
        border: 1px solid #e4e4e4;
        font-size: 16px;
      }
      .el-col:nth-child(odd) {
        color: #333;
        background: #f9fafc;
      }
    }
    .saveBtn {
      right: 20px;
      width: 69px;
      height: 28px;
      line-height: 28px;
      border-radius: 7px;
      top: 3px;
      background: #31c7a0;
      color: #fff;
      cursor: pointer;
      &:hover {
        background: #33d438;
      }
    }
  }
  .rewardEidtInput {
    width: 80px;
  }
}
.recordForm .el-form-item__content {
  text-align: left;
  color: #333333;
  font-size: 16px;
}
</style>

