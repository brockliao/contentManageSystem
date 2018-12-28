<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="SplitBillPowerList">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.authStatus" size="small" placeholder="分账授权状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="待授权" value="0"> </el-option>
              <el-option label="已授权" value="1"></el-option>
              <el-option label="已取消" value="2"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>分账授权管理
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column label="商户id/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="微信分账授权状态">
          <template slot-scope="scope">
            <i :class="{'cirleIcon':true, 'cirleIconSuccess':scope.row.authStatus=='1','cirleIconFail':scope.row.authStatus=='2','cirleIconWait':scope.row.authStatus=='0'}"></i>
            <span>{{scope.row.authStatusDisplay}}</span>
            <el-button type="text" class="textButton" @click="showDialog(scope.row)">更改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="textButton" @click="showLogDialog(scope.row)">记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount"
          layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
      <el-dialog title="更改微信分账授权状态" :visible.sync="dialogVisible" width="450px" label-width="80px">
        <div style="text-align:left;line-height:35px; margin:10px;">
          <i class="iconfont icon-gantanhao" style="color:#f7ba2a;font-size: 20px;margin: 0 5px;"></i><span style="color:#000;font-size:18px;">请在服务商管理后台确认商户更改了授权状态后，
            再到运营后台中更改对应状态</span><span style="color:#aaa;font-size:14px;">（此处只记录，不能直接更改商户对卡莫的分账授权状态）</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="textButton">取消操作</el-button>
          <el-button type="success" @click="editAuthStatus">
            {{editAuthItem.authStatus == 1 ? "改为取消授权" : "改为已授权"}}
          </el-button>
        </span>
      </el-dialog>
      <el-dialog title="操作记录" :visible.sync="logVisible" width="600px" label-width="80px" class="logDialog">
        <el-table :data="logItems" border style="width: 100%">
          <el-table-column prop="auditUser" label="审核人"></el-table-column>
          <el-table-column prop="message" label="审核信息"> </el-table-column>
          <el-table-column prop="_creationTime" label="审核时间"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";

import {
  GetProfitSharingAuth,
  ChangeProfitSharingAuthStatus,
  GetProfitSharingAuthToExcel
} from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "分账授权管理" }],
      searchForm: {
        authStatus: "",
        merchantId: "",
        merchantName: ""
      },
      tableOptions: {
        currentPage: 1,
        MaxResultCount: 15,
        totalCount: 0,
        lists: []
      },
      editAuthItem: {
        authStatus: 0,
        merchantId: 0
      },
      dialogVisible: false,
      logItems: [],
      logVisible: false
    };
  },
  async created() {
    this.getLists();
  },
  methods: {
    resfreshClick() {
      this.getLists();
    },
    searchData(isInit) {
      if (
        !/^[1-9]\d*$/.test(this.searchForm.merchantId) &&
        this.searchForm.merchantId
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的商户id"
        });
      }
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
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
      let res = await GetProfitSharingAuthToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    showDialog(rowData) {
      this.dialogVisible = true;
      this.editAuthItem = rowData;
    },
    showLogDialog(rowData) {
      this.logVisible = true;
      let logItems = rowData.profitSharingAuthLogs || [];
      logItems = this.$underscore.sortBy(logItems, "creationTime");
      logItems = logItems.reverse();
      this.logItems = logItems.map(item => {
        item._creationTime = dateFrom(item.creationTime, "yyyy-MM-dd HH:mm:ss");
        return item;
      });
    },
    async editAuthStatus() {
      let params = { ...this.editAuthItem };
      params.authStatus = params.authStatus == "1" ? 2 : 1;
      let res = await ChangeProfitSharingAuthStatus(params);
      if (res.success) {
        this.dialogVisible = false;
        this.getLists();
        return this.$message({
          type: "success",
          message: "更改微信分账授权状态成功"
        });
      }
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getLists();
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
      let page = this.tableOptions.currentPage;
      this.tableOptions.lists = [];
      this.tableOptions.totalCount = 0;
      let res = await GetProfitSharingAuth(params);
      if (!res.success) return;
      let { items, totalCount } = res.result;
      this.tableOptions.totalCount = totalCount;
      this.tableOptions.currentPage = page;
      this.tableOptions.lists = items;
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style lang="less">
.SplitBillPowerList {
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
  .textCol {
    text-align: left;
    height: 25px;
    line-height: 25px;
    font-size: 16px;
  }
  .contentCol {
    height: 43px;
    .imgContent {
      img {
        height: 100% !important;
        padding: 0 !important;
      }
    }
  }
  .cirleIcon {
    display: inline-block;
    height: 6px;
    line-height: 6px;
    width: 6px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .cirleIconSuccess {
    background: #2fc7a0;
  }
  .cirleIconFail {
    background: #990000;
  }
  .cirleIconWait {
    background: #ff6600;
  }
}

.shelvesBtn {
  border-color: #2fc7a0;
  color: #2fc7a0;
}
.auditBtn {
  border-color: #2fc7a0;
  color: #fff;
  background: #2fc7a0;
}
.auditBtn:hover {
  border-color: #2fc7a0 !important;
  color: #fff !important;
  background: #2fc7a0 !important;
}
.logDialog {
  .el-dialog__body {
    padding: 0;
    padding-bottom: 20px;
  }
  .el-table th {
    color: #000;
    background-color: #f3f3f3f3;
    border: 1px solid #d5d5d5;
  }
}
</style>



