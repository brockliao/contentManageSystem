<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="shopTrialContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.ServiceProviderType" size="small" placeholder="服务商等级" class="searchContentInput">
              <el-option label="不限" value="-1"> </el-option>
              <el-option label="卡莫" value="1"></el-option>
              <el-option label="城市" value="2"></el-option>
              <el-option label="普通" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输入搜索：" class="searchContentRow">
            <el-input size="small" v-model="searchForm.ServiceProviderId" placeholder="服务商ID"></el-input>
            <el-input size="small" v-model="searchForm.ServiceProviderName" placeholder="服务商名称"></el-input>
            <el-input size="small" v-model="searchForm.merchantId" placeholder="商户ID"></el-input>
            <el-input size="small" v-model="searchForm.merchantName" placeholder="商户名称"></el-input>
            <el-input size="small" v-model="searchForm.Id" placeholder="门店id"></el-input>
            <el-input size="small" v-model="searchForm.ShopName" placeholder="门店名称"></el-input>
            <el-input size="small" v-model="searchForm.SaleManName" placeholder="业务员名称"></el-input>
            <el-input size="small" v-model="searchForm.SaleManMobile" placeholder="业务员手机"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchClick()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="regestClick()">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportClick()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>赠送服务列表
      </div>
      <el-table :data="tabelOptions.items" border style="width: 100%" max-height="tabelOptions.height">
        <el-table-column label="门店ID/名称" min-width="150">
          <template slot-scope="scope">
            {{`${scope.row.id || ''}/${scope.row.shopName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="商户ID/名称" min-width="150">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="业务员姓名/手机号" min-width="180">
          <template slot-scope="scope">
            {{`${scope.row.salesManName || ''}/${scope.row.salesMobile || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="服务丨时长丨到期时间丨状态丨关联单号" min-width="350">
          <template slot-scope="scope">
            <ul v-if="scope.row.trialList">
              <li v-for="(item,index) in scope.row.trialList" :key="index">
                {{`${item.trialService || ''} | ${item.trialDay || ''}天 | ${item.expiredTime || ''} |
                ${item.trialStatusDisplay || ''} | ${item.orderNo || ''}` }}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="shopSet(scope.row)" type="text" v-if="!scope.row.trialList" size="small" class="textButton">设置</el-button>
            <el-button @click="shopChangeSet(scope.row)" type="text" size="small" v-else class="textButton">更改设置</el-button>
            <LogDialog dialog_title="试用设置记录" @on-get-logs="requestList(scope.row)" ref="LogDialog" :needRequest="true"
              :list="logList"></LogDialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tabelOptions.currentPage" :page-size="tabelOptions.pageSize"
          layout="total, prev, pager, next, jumper" :total="tabelOptions.totalCount">
        </el-pagination>
      </div>
      <el-dialog :title="trailDialog.dialogTiltle" :visible.sync="trailDialog.trailVisible" width="500px">
        <el-form ref="trailDialogForm" :model="trailDialog.formData" :rules="rules">
          <el-form-item>
            <p class="setLabel">
              <i class="iconfont icon-zhuyi" style="color:#f93;"></i>{{trailDialog.isSet ? '设置后，系统会直接激活服务给门店试用。' :
              '更改后，系统会直接激活或停用给门店免费使用的服务。'}}
            </p>
          </el-form-item>
          <el-form-item class="trailRow" prop="trialType">
            <p>1. {{trailDialog.isSet ? '选择试用基础服务' : `更改试用基础服务（当前该门店正在使用${trailDialog.activeType == 1 ? '会员基础服务' :
              '餐饮基础服务' })`}}</p>
            <el-radio-group v-model="trailDialog.formData.trialType">
              <el-radio :label="1">会员基础服务</el-radio>
              <el-radio :label="2">餐饮基础服务</el-radio>
            </el-radio-group>
            <p v-if="trailDialog.activeType == 1">
              <span class="noticeText">注：</span>当前该门店正使用会员基础服务，若赠送餐饮版版基础服务，则商户自动升级为餐饮版。
            </p>
          </el-form-item>
          <el-form-item class="trailRow" prop="trialDay">
            <p>2. {{trailDialog.isSet ? '设置试用时间(设置后，立即生效)' : '增加试用时间(设置后，立即生效)'}}</p>
            <div class="dayDiv">
              <el-button icon="el-icon-minus" class="dayInputBtn" @click="addDay(-1)"></el-button>
              <el-input v-model="trailDialog.formData.trialDay" class="dayInput">
                <template slot="append">
                  <span>天</span>
                </template>
              </el-input>
              <el-button icon="el-icon-plus" class="dayInputBtn" @click="addDay(1)"></el-button>
            </div>
          </el-form-item>
          <el-form-item class="trailRow" prop="remark">
            <p>3. 备注</p>
            <div class="trailRemark">
              <el-input type="textarea" v-model="trailDialog.formData.remark" :rows="3"></el-input>
              <span>{{`${trailDialog.formData.remark.length || 0}/20`}}</span>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="trailDialog.trailVisible = false">取 消</el-button>
          <el-button type="primary" @click="trailSetOrUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import BreadCrumb from "../../../components/BreadCrumb";
import LogDialog from "../../../components/LogDialog";

import { downFile, dateFrom } from "../../../utils";
import {
  GetShopTrialList,
  AddOrUpdateShopTrial,
  GetShopTrialInfo,
  GetShopTrialListToExcel,
  GetShopTrialRecording
} from "../../../Apis";

export default {
  data() {
    let dayValidate = function(rule, value, callback) {
      if (/^-?\d+$/.test(value) && value > 0) {
        callback();
      } else {
        callback(new Error("试用时间必须为正整数"));
      }
    };
    return {
      breadList: [{ label: "商户" }, { label: "赠送服务管理" }],

      searchForm: {
        ServiceProviderId: "",
        ServiceProviderName: "",
        merchantId: "",
        merchantName: "",
        Id: "",
        ShopName: "",
        SaleManName: "",
        SaleManMobile: "",
        ServiceProviderType: ""
      },
      tabelOptions: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        height: 250,
        items: []
      },
      trailDialog: {
        trailVisible: false,
        dialogTiltle: "设置",
        isSet: true,
        activeType: 1,
        formData: {
          shopId: 0,
          trialType: 1,
          trialDay: 180,
          remark: ""
        }
      },
      rules: {
        trialType: [{ required: true, message: "请选择服务", trigger: "blur" }],
        trialDay: [
          { required: true, message: "请选择服务", trigger: "blur" },
          { validator: dayValidate.bind(this), trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
          { min: 1, max: 20, message: "备注在20个字符以内", trigger: "blur" }
        ]
      },
      logList: []
    };
  },
  methods: {
    refreshCallback() {
      this.initData();
    },
    handleCurrentChange(page) {
      this.tabelOptions.currentPage = page;
      this.initData();
    },
    shopSet(rowData) {
      this.trailDialog.dialogTiltle = "试用设置";
      this.trailDialog.trailVisible = true;
      this.trailDialog.isSet = true;
      this.trailDialog.formData.shopId = rowData.id;
      this.trailDialog.formData.remark = "";
      this.trailDialog.formData.trialDay = 180;
      this.trailDialog.formData.trialType = 1;
      this.trailDialog.activeType = 1;
    },
    async shopChangeSet(rowData) {
      this.trailDialog.dialogTiltle = "更改试用设置";
      this.trailDialog.isSet = false;
      this.trailDialog.formData.shopId = rowData.id;
      let res = await GetShopTrialInfo({ id: rowData.id });
      if (res && res.success) {
        this.trailDialog.formData = res.result;
        this.trailDialog.activeType = res.result.trialType;
        this.trailDialog.formData.remark = "";
      }
      this.trailDialog.trailVisible = true;
    },
    addDay(num) {
      this.trailDialog.formData.trialDay =
        this.trailDialog.formData.trialDay - 0;
      this.trailDialog.formData.trialDay += num;
      if (this.trailDialog.formData.trialDay <= 0) {
        this.trailDialog.formData.trialDay = 0;
      }
    },
    trailSetOrUpdate() {
      let _this = this;
      let rowData = _this.trailDialog.rowData;
      this.$refs.trailDialogForm.validate(async function(valid) {
        if (valid) {
          let message = _this.trailDialog.isSet
            ? "设置门店试用成功"
            : "更改设置门店试用成功";
          let res = await AddOrUpdateShopTrial(_this.trailDialog.formData);
          if (res && res.success) {
            _this.trailDialog.trailVisible = false;
            _this.$message({
              message: message,
              type: "success"
            });
            _this.initData();
          }
        }
      });
    },
    regestClick() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.tabelOptions.currentPage = 1;
      this.initData();
    },
    searchClick() {
      this.tabelOptions.currentPage = 1;
      this.initData();
    },
    logClick(rowData) {
      // alert("门店记录查看");  功能暂不开发
    },
    async requestList(rowData) {
      let res = await GetShopTrialRecording({ Id: rowData.id });
      if (res && res.success) {
        this.logList = res.result.map(item => {
          return {
            ...item,
            _time: dateFrom(item.creationTime),
            auditUser: item.creationUser
          };
        });
      }
    },
    async exportClick() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      let res = await GetShopTrialListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    async initData() {
      let params = {
        ...this.searchForm,
        SkipCount: "",
        MaxResultCount: "",
        MaxResultCount: this.tabelOptions.pageSize
      };
      params.SkipCount =
        (this.tabelOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      this.tabelOptions.items = [];

      let res = await GetShopTrialList(params);

      if (res && res.success) {
        let { totalCount, items } = res.result;
        this.tabelOptions.totalCount = totalCount || 0;
        this.tabelOptions.items = items || [];
      }
    }
  },
  created() {
    this.initData();
  },
  components: {
    BreadCrumb,
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
    border: 1px solid #d5d5d5;
  }
  .el-button.is-disabled {
    color: #c0c4cc;
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
  }
  .searchContentInput {
    width: 200px !important;
  }
  .searchContentRow {
    .el-input {
      width: 120px;
    }
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
.shopTrialContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
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
}
.setLabel {
  text-align: left;
  > i {
    color: rgb(255, 153, 51);
    font-size: 20px;
    margin: 0 10px;
  }
}
.trailRow {
  // margin: 0;
  p {
    text-align: left;
    padding-left: 45px;
    line-height: 30px;
  }
  .noticeText {
    color: #990000;
    margin-right: 5px;
  }
  .dayInput {
    width: 150px;
  }
  .dayInputBtn {
    background: #f2f2f2;
    color: #ccc;
  }
  .dayDiv {
    padding-left: 60px;
    text-align: left;
  }
  .trailRemark {
    padding-left: 60px;
    position: relative;
    > span {
      position: absolute;
      right: 15px;
      bottom: -10px;
    }
  }
  .el-form-item__error {
    padding-left: 60px;
  }
}
</style>


