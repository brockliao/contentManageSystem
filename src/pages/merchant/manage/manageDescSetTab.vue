<template>
  <div class="content">
    <div class="statusRow ">
      <i class="iconfont icon-gantanhao"></i>当前商户状态：{{status}}
    </div>
    <div class="dataBaseRow">
      <i class="iconfont icon-database"></i>基本信息
      <i size="small" class="iconfont icon-edit editIcon" @click="basicEdit()"></i>
    </div>
    <el-row type="flex" justify="felx-start" align="center">
      <el-col :span="4">所属行业</el-col>
      <el-col :span="4">{{basicInfo.tradeName}}</el-col>
      <el-col :span="4">单会员账户余额上限</el-col>
      <el-col :span="4">
        <span>￥5000.00</span>
      </el-col>
      <el-col :span="4">商户预收余额上限</el-col>
      <el-col :span="4">
        <span v-show="!basicEditBoolean">￥{{basicInfo.limitBalance || 0}}</span>
        <el-input v-show="basicEditBoolean" v-model="basicInfo.limitBalance" placeholder="请输入商户预收余额上限">
          <span slot="prepend">￥</span>
        </el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="felx-start" align="center">
      <el-col :span="4">单店现金充值上限</el-col>
      <el-col :span="4">
        <span v-show="!basicEditBoolean">￥{{basicInfo.cashLimit || 0}} / 月</span>
        <el-input v-show="basicEditBoolean" v-model="basicInfo.cashLimit" placeholder="请输入单店现金充值上限">
          <span slot="prepend">￥</span>
          <span slot="append">/ 月</span>
        </el-input>
      </el-col>
      <el-col :span="4">商户余额提现下限</el-col>
      <el-col :span="4">
        <span v-show="!basicEditBoolean">￥{{basicInfo.limitReward}}</span>
        <el-input v-show="basicEditBoolean" v-model="basicInfo.limitReward" placeholder="请输入商户奖励金提现上限">
          <span slot="prepend">￥</span>
        </el-input>
      </el-col>
      <el-col :span="4">商城服务费费率</el-col>
      <el-col :span="4">
        <span v-show="!basicEditBoolean">{{basicInfo.mallRate || 0}} %</span>
        <el-input v-show="basicEditBoolean" v-model="basicInfo.mallRate" placeholder="请输入商城服务费费率">
          <span slot="append">%</span>
        </el-input>
      </el-col>
    </el-row>
    <div class="statusRow" v-if="basicEditBoolean">
      <el-button size="small" plain class="iconfont recordButton" @click="basicEditSave()">保 存</el-button>
    </div>

    <div class="dataBaseRow">
      <i class="iconfont icon-database"></i>奖励金设置
      <i size="small" class="iconfont icon-edit editIcon" v-if="rewardConfigList.length" @click="showRewardEidt"></i>
    </div>
    <el-table :data="rewardConfigList" border style="width: 100%">
      <el-table-column prop="payType" label="支付平台"></el-table-column>
      <el-table-column label="奖励金参与权限">
        <template slot-scope="scope">
          <span v-show="!rewardEidtBoolean">{{scope.row.isRewardDisplay}}</span>
          <el-switch v-show="rewardEidtBoolean" v-model="scope.row.isReward" active-color="#13ce66" inactive-color="#ff4949"
            active-value="1" inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="参与奖励金活动费率" v-show="rewardEidtBoolean">
        <template slot-scope="scope">
          <span v-show="!rewardEidtBoolean"> {{`${scope.row.lowerLimitRate}‰ - ${scope.row.upperLimitRate}‰`}}</span>
          <div v-show="rewardEidtBoolean">
            <el-input class="rewardEidtInput" v-model="scope.row.lowerLimitRate" @blur="validateReward()"></el-input>‰
            - <el-input class="rewardEidtInput" v-model="scope.row.upperLimitRate" @blur="validateReward()"></el-input>‰
          </div>
          <div v-if="scope.row.isError" style="color:rgb(255, 73, 73)">{{scope.row.errorMsg}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="statusRow" v-if="rewardEidtBoolean">
      <el-button size="small" plain class="iconfont recordButton" @click="rewardSave()">保 存</el-button>
    </div>
  </div>
</template>

<script>
import {
  GetMerChantInfo,
  ModifyMerChantsInfo,
  ModifyMerChantsRewardConfig
} from "./../../../Apis";
export default {
  props: ["tId"],
  data() {
    return {
      id: this.tId,
      status: "",
      feeType: 2,
      basicInfo: {},
      basicEditBoolean: false,
      rewardEidtBoolean: false,
      rewardConfigList: []
    };
  },
  created() {
    this.GetMerChantInfoData();
  },
  methods: {
    basicEdit() {
      this.basicEditBoolean = !this.basicEditBoolean;
    },
    async basicEditSave() {
      if (!this.basicEditBoolean) return;
      let basicInfo = this.basicInfo;
      let { limitBalance, limitReward, cashLimit, mallRate } = basicInfo;
      let params = {
        id: this.id,
        limitBalance: Number(limitBalance),
        limitReward: Number(limitReward),
        cashLimit: Number(cashLimit),
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
      if (!/^[1-9]\d*$/.test(params.cashLimit) && params.cashLimit) {
        return this.$message({
          type: "error",
          message: "请输入正确的单店现金充值上限"
        });
      }
      if (
        !/^100$|^(\d|[1-9]\d)(\.\d{1,2})*$/.test(params.mallRate) &&
        params.mallRate
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的商城服务费费率"
        });
      }

      let response = await ModifyMerChantsInfo(params);
      if (response.success) {
        this.basicEditBoolean = false;
        return this.$message({
          type: "success",
          message: "保存成功"
        });
      }
    },
    showRewardEidt() {
      if (!this.rewardConfigList.length)
        return this.$message({
          // type: "warn",
          message: "奖励金无可设置数据"
        });
      this.rewardEidtBoolean = !this.rewardEidtBoolean;
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
      if (!lists.length) {
        return;
      }
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
        this.rewardEidtBoolean = false;
        this.GetMerChantInfoData();
      }
    },
    async GetMerChantInfoData() {
      // 获取商户详情数据
      let Id = this.id;
      let res = await GetMerChantInfo({ Id });
      // 商户设置 基础信息 赋值
      let { result } = res;
      let { status } = result;
      this.status = status;
      const MONEYS = ["limitBalance", "limitReward"];
      MONEYS.forEach(key => {
        result[key] = (Math.round(result[key] * 100) / 100).toFixed(2);
      });
      this.basicInfo = Object.assign(this.basicInfo, result);
      this.rewardConfigList = result.rewardConfigList.map(item => {
        item.isReward = item.isReward + "";
        item.isError = false;
        return item;
      });
    }
  }
};
</script>
<style lang="less">
</style>


