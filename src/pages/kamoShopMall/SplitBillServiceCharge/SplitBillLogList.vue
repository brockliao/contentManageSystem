<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="SplitBillLogList">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.status" size="small" placeholder="分账状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="待分账" value="0"></el-option>
              <el-option label="分账成功" value="1"></el-option>
              <el-option label="分账失败" value="2"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分账时间：">
            <el-date-picker v-model="searchForm.beginTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endTime" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30"></el-input>
            <el-input v-model="searchForm.orderSn" size="small" placeholder="关联订单号"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>分账记录查询
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column prop="profitSharingSn" label="分账单号"></el-table-column>
        <el-table-column prop="orderSn" label="关联订单号"></el-table-column>
        <el-table-column prop="_profitSharingTime" label="分账时间"></el-table-column>
        <el-table-column label="商户id/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="contactMobile" label="联系方式"></el-table-column>
        <el-table-column prop="_payAmount" label="实付总额" width="100"></el-table-column>
        <el-table-column prop="_receiveAmount" label="分账给商户" width="100"></el-table-column>
        <el-table-column prop="_serviceFee" label="商城服务费" width="100"></el-table-column>
        <el-table-column prop="_empCommission" label="员工提成" width="100"></el-table-column>
        <el-table-column prop="_userCommission" label="会员奖励" width="100"></el-table-column>
        <el-table-column label="分账状态">
          <template slot-scope="scope">
            <span>{{scope.row.statusDisplay || ""}}</span>
            <el-popover placement="left-start" title="" width="410" trigger="hover" v-model="scope.row.explainVisible"
              :key="scope.row.id" v-if="scope.row.status=='2'">
              <template>
                <div class="explainTitle"><span>分账失败原因</span><span class="iconfont icon-close" @click="scope.row.explainVisible=false"></span></div>
                <div class="explainText">{{scope.row.failReason || "分账失败"}}</div>
              </template>
              <div slot="reference" class="reasonBtn">原因</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="textButton" :disabled="scope.row.status!='2'" @click="splitBiLLRequest(scope.row)">分账</el-button>
            <el-button type="text" size="small" class="textButton" @click="descritionJump(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount"
          layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import {
  GetProfitSharingList,
  ProfitSharing,
  GetProfitSharingListToExcel
} from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "分账记录查询" }],
      searchForm: {
        status: "",
        beginTime: (() => {
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24);
          return new Date(start);
        })(),
        endTime: new Date(),
        merchantId: "",
        merchantName: "",
        orderSn: ""
      },
      tableOptions: {
        currentPage: 1,
        MaxResultCount: 15,
        totalCount: 0,
        lists: []
      },
      dialogVisible: false
    };
  },
  async created() {
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
      if (
        !/^[0-9a-zA-Z]*$/.test(this.searchForm.orderSn) &&
        this.searchForm.orderSn
      ) {
        return this.$message({
          type: "error",
          message: "请输入正确的关联订单号"
        });
      }
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
        this.searchForm.beginTime = (() => {
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24);
          return new Date(start);
        })();
        this.searchForm.endTime = new Date();
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
      let res = await GetProfitSharingListToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getLists();
    },
    async splitBiLLRequest({ id }) {
      let res = await ProfitSharing({ id });
      if (res.success) {
        return this.$message({
          type: "success",
          message: "分账请求发送成功！"
        });
      }
    },
    descritionJump(rowData) {
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/SplitBillServiceCharge/OrderDetail",
        query: { id: rowData.orderId, statusDisplay: rowData.statusDisplay }
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
      let page = this.tableOptions.currentPage;
      this.tableOptions.lists = [];
      this.tableOptions.totalCount = 0;
      let res = await GetProfitSharingList(params);
      if (!res.success) return;
      let { items, totalCount } = res.result;
      this.tableOptions.totalCount = totalCount;
      this.tableOptions.currentPage = page;
      const MONEYS = [
        "receiveAmount",
        "serviceFee",
        "payAmount",
        "userCommission",
        "empCommission"
      ];
      this.tableOptions.lists = items.map(item => {
        item._profitSharingTime = dateFrom(
          item.profitSharingTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        for (let key in item) {
          if (MONEYS.includes(key)) {
            if (key == "serviceFee") {
              item["_" + key] = item[key] ? "￥" + item[key] : "--";
            } else {
              item["_" + key] = "￥" + item[key];
            }
          }
        }
        return item;
      });
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style lang="less">
.SplitBillLogList {
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
.explainTitle {
  position: relative;
  padding-bottom: 10px;
  :first-child {
    font-weight: bold;
    font-size: 18px;
    color: #000;
  }
  .icon-close {
    position: absolute;
    right: 10px;
    color: #ccc;
    cursor: pointer;
  }
}
.explainText {
  text-indent: 20px;
  line-height: 30px;
}
.reasonBtn {
  color: #e34;
  cursor: pointer;
}
</style>



