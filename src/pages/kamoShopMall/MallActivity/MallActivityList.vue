<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="MallActivityList">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.level" size="small" placeholder="活动级别" class="searchContentInput" @change="levelChange">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="单品级" value="1"> </el-option>
              <el-option label="店铺级" value="2"> </el-option>
            </el-select>
            <el-select v-model="searchForm.type" size="small" placeholder="活动类型" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="单品折扣" value="0" v-if="searchForm.level != '2'"> </el-option>
              <el-option label="满减" value="2" v-if="searchForm.level != '1'"></el-option>
              <el-option label="团购" value="6" v-if="searchForm.level != '2'"></el-option>
              <el-option label="秒杀" value="7" v-if="searchForm.level != '2'"></el-option>
            </el-select>
            <el-select v-model="searchForm.status" size="small" placeholder="活动状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="待开始" value="0"> </el-option>
              <el-option label="进行中" value="1"></el-option>
              <el-option label="已中止" value="3"></el-option>
              <el-option label="已结束" value="2"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.id" size="small" placeholder="活动id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30"></el-input>
            <el-input v-model="searchForm.productId" size="small" placeholder="商品id"></el-input>
            <el-input v-model="searchForm.productName" size="small" placeholder="商品名称" maxlength="30"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>订单列表
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="id" label="活动id" width="60"></el-table-column>
        <el-table-column prop="actLevel" label="活动级别" width="80"></el-table-column>
        <el-table-column prop="typeDisplay" label="活动类型" width="80"></el-table-column>
        <el-table-column prop="actRule" label="活动规则"></el-table-column>
        <el-table-column label="活动商品id/名称">
          <template slot-scope="scope">
            <div v-for="(val,index) in scope.row._products" :key="index" style="text-align:left;">{{val}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商户id / 名称" width="150">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="_createTime" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="activityTime" label="活动时间"></el-table-column>
        <el-table-column prop="statusDisplay" label="活动状态" width="80"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="descritionJump(scope.row)" type="text" size="small" class="textButton">详情</el-button>
            <el-button @click="dialogVisible = true;forceForm.activityId=scope.row.id;forceForm.statusDisplay=scope.row.statusDisplay" type="text" size="small" class="textButton"
              :disabled="scope.row.status == 3 || scope.row.status == 2">强制中止</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount"
          layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="强制中止活动" :visible.sync="dialogVisible" width="450px" label-width="80px" :before-close="handleClose">
      <el-form :model="forceForm" :rules="statusRules" ref="forceForm" class="recordForm">
        <el-form-item style="margin: 10px 0 ;">
          <div class="textColForce"><i class="iconfont icon-gantanhao" style="color:#f7ba2a;font-size: 20px;margin: 0 5px;"></i>活动处于{{forceForm.statusDisplay}}状态，操作后活动将被强制中止，是否继续此操作？</div>
        </el-form-item>
        <el-form-item label="中止原因" prop="memo">
          <div style="position:relative;">
            <el-input v-model="forceForm.memo" type="textarea" maxlength="30"></el-input>
            <span style="position:absolute;right:15px;bottom:25px;">{{`${forceForm.memo.length}/30`}}</span>
            <p style="height:25px;line-height:25px;color:#999;font-size:12px;text-align:left;">若强制中止活动，原因必填。</p>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" class="textButton">取 消</el-button>
        <el-button type="success" @click="forceStop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";

import {
  GetAllActivity,
  GetAllProductsToExcelActivity,
  ActivityAbort
} from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      searchForm: {
        level: "",
        type: "",
        status: "",
        id: "",
        productId: "",
        productName: "",
        merchantId: "",
        merchantName: "",
        beginTime: "",
        endTime: ""
      },
      tableOptions: {
        lists: [],
        currentPage: 1,
        MaxResultCount: 10,
        totalCount: 0
      },
      dialogVisible: false,
      breadList: [{ label: "卡莫商城" }, { label: "活动列表" }],
      forceForm: {
        activityId: 0,
        memo: "",
        statusDisplay:""
      },
      statusRules: {
        memo: [{ required: true, message: "不可为空", trigger: "blur" }]
      }
    };
  },
  created() {
    let listOptions = this.$store.state.listOptions;
    if (listOptions && listOptions.currentPage) {
      for (let key in this.searchForm) {
        this.searchForm[key] = listOptions.searchForm[key];
      }
      this.tableOptions.currentPage = listOptions.currentPage;
    }
    this.getLists();
  },
  methods: {
    resfreshClick() {
      this.getLists();
    },
    levelChange(val) {
      // 单品 有 单品折扣 团购 秒杀
      if (val == 1 && this.searchForm.type == 2) {
        this.searchForm.type = "";
      }
      // 店铺 只有 满减活动
      if (val == 2 && this.searchForm.type != 2) {
        this.searchForm.type = "2";
      }
      this.tableOptions.currentPage = 1;
      this.getLists();
    },
    searchData(isInit) {
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
      }
      if (
        !/^[1-9]\d*$/.test(this.searchForm.merchantId) &&
        this.searchForm.merchantId
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的商户id"
        });
      }
      if (!/^[1-9]\d*$/.test(this.searchForm.id) && this.searchForm.id) {
        return this.$message({
          type: "error",
          message: "请输入正确的活动id"
        });
      }
      if (
        !/^[1-9]\d*$/.test(this.searchForm.productId) &&
        this.searchForm.productId
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的商品id"
        });
      }
      this.tableOptions.currentPage = 1;
      this.getLists();
    },
    async exportData() {
      let params = {
        ...this.searchForm
      };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      let res = await GetAllProductsToExcelActivity(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },

    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getLists();
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/MallActivity/MallActivityDetail",
        query: {
          id: rowData.id,
          type: rowData.type
        }
      });
    },
    async getLists() {
      let params = {
        MaxResultCount: this.tableOptions.MaxResultCount,
        Filter: "", //搜索字段
        ...this.searchForm,
        Sorting: "" //排序字段
      };
      params.SkipCount =
        (this.tableOptions.currentPage - 1) * params.MaxResultCount;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      // 店铺级 只有满减
      params.level == "2" &&
        (() => {
          params.type = 2;
        })();

      let page = this.tableOptions.currentPage;
      this.tableOptions.lists = [];
      this.tableOptions.totalCount = 0;
      let res = await GetAllActivity(params);
      if (!res.success) return;
      let { items, totalCount } = res.result;
      this.tableOptions.totalCount = totalCount;
      this.tableOptions.currentPage = page;
      let lists = items.map(item => {
        let activity = item.activity;
        activity["_createTime"] = dateFrom(
          activity.createTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        activity._products = activity.products.split(",");
        return activity;
      });
      this.tableOptions.lists = lists;
    },
    handleClose() {
      this.dialogVisible = false;
      this.forceForm.activityId = 0;
      this.forceForm.memo = "";
    },
    forceStop() {
      let _this = this;
      let params = _this.forceForm;
      if (!params.activityId) return;
      _this.$refs.forceForm.validate(async valid => {
        if (valid) {
          let res = await ActivityAbort(params);
          if (!res.success) return;
          _this.$message({
            type: "success",
            message: "强制中止活动成功"
          });
          _this.handleClose();
          _this.getLists();
        }
      });
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style lang="less">
.MallActivityList {
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
    position: relative;
    i {
      margin: 0 10px;
      font-size: 20px;
      font-weight: bold;
    }
    font-size: 16px;

    .explainBtn {
      position: absolute;
      right: 20px;
    }
  }
}
.textColForce {
  text-align: left;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
}
</style>


