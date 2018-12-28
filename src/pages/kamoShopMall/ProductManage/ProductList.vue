<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="productListContainer">
      <div class="partTitle">
        <i class="iconfont icon-search"></i>筛选查询
      </div>
      <div class="searchContent">
        <el-form ref="searchForm" :model="searchForm" label-width="120px">
          <el-form-item label="条件筛选：">
            <el-select v-model="searchForm.type" size="small" placeholder="商品类目" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="普通商品" value="1"> </el-option>
              <el-option label="兑换券" value="0"></el-option>
              <el-option label="年次卡" value="3"> </el-option>
              <el-option label="虚拟卡券" value="2"></el-option>
            </el-select>
            <el-select v-model="searchForm.shelvesStatus" size="small" placeholder="上架状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="上架中" value="0"> </el-option>
              <el-option label="下架中" value="1"></el-option>
              <el-option label="强制下架中" value="2"> </el-option>
            </el-select>
            <el-select v-model="searchForm.auditStatus" size="small" placeholder="审核状态" class="searchContentInput">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="已审核" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架时间：">
            <el-date-picker v-model="searchForm.startDate" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker v-model="searchForm.endDate" size="small" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="searchForm.id" size="small" placeholder="商品id" maxlength="30"></el-input>
            <el-input v-model="searchForm.name" size="small" placeholder="商品名称" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantId" size="small" placeholder="商户id" maxlength="30"></el-input>
            <el-input v-model="searchForm.merchantName" size="small" placeholder="商户名称" maxlength="30"></el-input>
            <el-button plain size="small" class="activeButton" @click="searchData()">搜索</el-button>
            <el-button plain size="small" class="activeButton" @click="searchData(true)">重置</el-button>
            <el-button plain size="small" class="activeButton" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="partTitle">
        <i class="iconfont icon-menu"></i>商品列表
        <el-popover placement="left-start" title="" width="410" trigger="click" v-model="explainVisible">
          <template>
            <div class="explainTitle"><span>订单状态说明</span><span class="iconfont icon-close" @click="explainVisible=false"></span></div>
            <div> 订单状态分为： 待支付、交易关闭、进行中、交易成功四种</div>
            <div class="explainText">① 待支付：提交订单半小时内未支付的订单</div>
            <div class="explainText">② 进行中：已经支付，订单中有商品尚处于拼团中、待发货或待收货状态的订单</div>
            <div class="explainText">③ 交易关闭：提交订单超半小时未支付或整单退款成功的订单</div>
            <div class="explainText">④ 交易成功：订单已完成或部分退款成功的订单</div>
          </template>
          <el-button slot="reference" type="text" size="medium" class="explainBtn">订单状态说明</el-button>
        </el-popover>
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%">
        <el-table-column label="商品id/名称">
          <template slot-scope="scope">
            {{`${scope.row.id || ''}/${ scope.row.name || ''}`}}
          </template>
        </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <div class="contentCol">
              <ImagePreview :imageUrl="scope.row.img"></ImagePreview>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="typeDisplay" label="类目" width="80"></el-table-column>
        <el-table-column prop="_oldPrice" label="原价" width="80"></el-table-column>
        <el-table-column prop="_price" label='现价' width="80"></el-table-column>
        <el-table-column prop="remain" label="库存" width="80"></el-table-column>
        <el-table-column prop="_onlineTime" label="上架时间" width="150"></el-table-column>
        <el-table-column prop="saleTime" label="销售时间" width="180"></el-table-column>
        <el-table-column label="商户id/名称">
          <template slot-scope="scope">
            {{`${scope.row.merchantId || ''}/${ scope.row.merchantName || ''}`}}
          </template>
        </el-table-column>
        <el-table-column prop="shelvesStatusDisplay" label="上架状态" width="100"></el-table-column>
        <el-table-column prop="auditStatusDisplay" label="审核状态" width="80"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="detailGo(scope.row)" type="text" size="small" class="textButton">详情</el-button>
            <el-button type="text" size="small" :disabled="scope.row.auditStatus !== 0" class="textButton" @click="auditFrom.id=scope.row.id;auditVisible=true;">审核</el-button>
            <el-button type="text" size="small" :disabled="!(scope.row.shelvesStatus === 0 && scope.row.auditStatus === 1)"
              class="textButton" @click="shelvesForm.id=scope.row.id;shelvesVisible=true;">强制下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="togglePageRow">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="tableOptions.currentPage" :page-size="tableOptions.MaxResultCount"
          layout="total, prev, pager, next, jumper" :total="tableOptions.totalCount">
        </el-pagination>
      </div>
      <el-dialog title="审核商品" :visible.sync="auditVisible" width="450px" label-width="80px">
        <el-form :model="auditFrom" :rules="statusRules" ref="auditFrom" class="recordForm">
          <el-form-item style="margin: 10px 0 ;">
            <div class="textCol">审核操作后，商品的审核状态改为已审核。</div>
            <div class="textCol">若审核通过，商品的上架状态不变；若强制下架，商品的上架状态改为强制下架中。</div>
          </el-form-item>
          <el-form-item label="意见">
            <div style="position:relative;">
              <el-input v-model="auditFrom.auditMemo" type="textarea" maxlength="100"></el-input>
              <span style="position:absolute;right:15px;bottom:25px;">{{`${auditFrom.auditMemo.length}/100`}}</span>
              <p style="height:25px;line-height:25px;color:#999;font-size:12px;text-align:left;">若强制下架，意见必填。</p>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div class="breadButtons">
            <el-button size="medium" plain class="shelvesBtn" @click="auditProduct(true);">强制下架</el-button>
            <el-button size="medium" class="auditBtn" @click="auditProduct();">审核通过</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="强制下架商品" :visible.sync="shelvesVisible" width="450px" label-width="80px">
        <el-form :model="shelvesForm" :rules="statusRules" ref="shelvesForm" class="recordForm">
          <el-form-item style="margin: 10px 0 ;">
            <div class="textCol"><i class="iconfont icon-gantanhao" style="color:#f7ba2a;font-size: 20px;margin: 0 5px;"></i>当前商品处于上架中状态，强制下架后商户将不能在卡莫商城售卖此商品，是否继续？</div>
          </el-form-item>
          <el-form-item label="原因" prop="auditMemo">
            <div style="position:relative;">
              <el-input v-model="shelvesForm.auditMemo" type="textarea" maxlength="100"></el-input>
              <span style="position:absolute;right:15px;bottom:25px;">{{`${shelvesForm.auditMemo.length}/100`}}</span>
              <p style="height:25px;line-height:25px;color:#999;font-size:12px;text-align:left;">若强制下架，原因必填。</p>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button plain @click="shelvesVisible = false">取 消</el-button>
          <el-button size="medium" class="auditBtn" @click="shelvesProduct();">强制下架</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import ImagePreview from "./../../../components/ImagePreview";

import {
  GetAllProducts,
  AuditOrShelvesProduct,
  GetAllProductsToExcel
} from "./../../../Apis";
import { dateFrom, getStorage, setStorage, downFile } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [{ label: "卡莫商城" }, { label: "商品列表" }],
      searchForm: {
        type: "",
        shelvesStatus: "",
        auditStatus: "",
        startDate: "",
        endDate: "",
        id: "",
        name: "",
        merchantId: "",
        merchantName: ""
      },
      tableOptions: {
        currentPage: 1,
        MaxResultCount: 15,
        totalCount: 0,
        lists: []
      },

      auditVisible: false,
      auditFrom: {
        id: 0,
        type: 2,
        auditMemo: ""
      },
      shelvesForm: {
        id: 0,
        type: 1,
        auditMemo: ""
      },
      shelvesVisible: false,
      statusRules: {
        auditMemo: [{ required: true, message: "不可为空", trigger: "blur" }]
      },
      explainVisible: false
    };
  },
  async created() {
    let listOptions = this.$store.state.listOptions;
    if (listOptions && listOptions.currentPage) {
      for (let key in this.searchForm) {
        this.searchForm[key] = listOptions.searchForm[key];
      }
      this.tableOptions.currentPage = listOptions.currentPage;
    } else {
      await this.initTimes();
    }
    this.getLists();
  },
  methods: {
    resfreshClick() {
      this.getLists();
    },
    async searchData(isInit) {
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
          message: "请输入正确的商品id"
        });
      }
      if (isInit) {
        for (let key in this.searchForm) {
          this.searchForm[key] = "";
        }
        await this.initTimes();
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
      let res = await GetAllProductsToExcel(params);
      if (res && res.success) {
        downFile(res.result);
      }
    },
    detailGo(rowData) {
      setStorage("ProductListRow", JSON.stringify(rowData));
      this.$store.commit("setListOptions", {
        searchForm: this.searchForm,
        currentPage: this.tableOptions.currentPage
      });
      this.$router.push({
        path: "/ProductManage/ProductDetail",
        query: {
          id: rowData.id,
          type: rowData.type,
          auditStatus: rowData.auditStatus,
          shelvesStatus: rowData.shelvesStatus,
          preSalePrice: rowData.preSalePrice || 0
        }
      });
    },
    handleCurrentChange(page) {
      this.tableOptions.currentPage = page;
      this.getLists();
    },
    initTimes() {
      let now = new Date(); //当前日期
      let nowDay = now.getDate(); //当前日
      let nowMonth = now.getMonth(); //当前月
      let Year = now.getYear(); //当前年
      Year += Year < 2000 ? 1900 : 0; //
      // 获取上月时间
      now.setDate(1); //变成这个月一号
      now.setMonth(now.getMonth());
      now.setMonth(now.getMonth());
      let lastMonth = now.getMonth();
      let beginTime = new Date(Year, lastMonth, 1);
      this.searchForm.startDate = dateFrom(beginTime, "yyyy-MM-dd");
      // 获取上个月天数 通过本月1号-上月1号获取天数
      let monthStartDate = new Date(Year, lastMonth, 1);
      let monthEndDate = new Date(Year, lastMonth + 1, 1);
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      // 上个月结束日期
      this.searchForm.endDate = dateFrom(now.setDate(days), "yyyy-MM-dd");
    },
    async getLists() {
      let params = {
        ...this.searchForm,
        MaxResultCount: this.tableOptions.MaxResultCount
      };
      params.SkipCount =
        (this.tableOptions.currentPage - 1) * params.MaxResultCount;
      let page = this.tableOptions.currentPage;
      // 空字段不发送
      for (let key in params) {
        if (!params[key] || params[key] == "-1") delete params[key];
      }
      this.tableOptions.lists = [];
      let res = await GetAllProducts(params);
      if (res.success) {
        this.tableOptions.currentPage = page;
        this.tableOptions.totalCount = res.result.totalCount;
        let lists = res.result.items;
        this.tableOptions.lists = lists.map(item => {
          let product = item.product;
          product["_onlineTime"] = dateFrom(
            product.onlineTime,
            "yyyy-MM-dd HH:mm:ss"
          );
          product["_oldPrice"] = "￥" + product.oldPrice;
          product["_price"] = "￥" + product.price;
          return product;
        });
      }
    },
    auditProduct(isShelves) {
      let _this = this;
      _this.$refs.auditFrom.validate(async valid => {
        if (valid) {
          let params = {
            ..._this.auditFrom
          };
          if (isShelves) {
            params.type = 1;
            if (!params.auditMemo) {
              return _this.$message({
                type: "error",
                message: "强制下架，意见必填。"
              });
            }
          }
          let res = await AuditOrShelvesProduct(params);
          if (res.success) {
            _this.$message({
              type: "success",
              message: "设置成功"
            });
            _this.auditVisible = false;
            _this.getLists();
          }
        } else {
          return false;
        }
      });
    },
    shelvesProduct() {
      let _this = this;
      _this.$refs.shelvesForm.validate(async valid => {
        if (valid) {
          let params = {
            ..._this.shelvesForm
          };
          let res = await AuditOrShelvesProduct(params);
          if (res.success) {
            _this.$message({
              type: "success",
              message: "设置成功"
            });
            _this.shelvesVisible = false;
            _this.getLists();
          }
        } else {
          return false;
        }
      });
    }
  },
  components: {
    BreadCrumb,
    ImagePreview
  }
};
</script>
<style lang="less">
.productListContainer {
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
</style>



