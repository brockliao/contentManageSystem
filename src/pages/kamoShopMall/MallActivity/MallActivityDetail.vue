<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="resfreshClick">刷新</el-button>
          <el-button icon="icon-close" size="medium" plain class="iconfont activeButton" @click="$router.back(-1)">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="MallActivityDetail">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前活动状态: {{actInfo.statusDisplay}}
        <el-button class="recordButton" size="medium" @click="dialogVisible=true" v-if="actInfo.status==1 || actInfo.status == '0'">强制中止</el-button>
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <div class="baseMessage">
        <el-row type="flex" justify="start">
          <el-col class="textColMall">活动id</el-col>
          <el-col class="contentCol"> {{actInfo.id}}</el-col>
          <el-col class="textColMall">活动级别</el-col>
          <el-col class="contentCol"> {{actInfo.actLevel}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='2'">
          <el-col class="textColMall">活动类型</el-col>
          <el-col class="contentCol">满减</el-col>
          <el-col class="textColMall">活动时间</el-col>
          <el-col class="contentCol"> {{actInfo.activityTime}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='2'">
          <el-col class="textColMall">商户id/名称</el-col>
          <el-col class="contentCol">{{`${actInfo.merchantId || ''}/${ actInfo.merchantName || ''}`}}</el-col>
          <el-col class="textColMall">活动规则</el-col>
          <el-col class="contentCol"> {{actInfo.actRule}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='6'">
          <el-col class="textColMall">活动类型</el-col>
          <el-col class="contentCol">团购</el-col>
          <el-col class="textColMall">活动商品id/名称</el-col>
          <el-col class="contentCol">
            <div v-for="(val,index) in actInfo._products" :key="index" class="productItem" v-if="actInfo._products.length>1">{{val}}</div>
            <div v-else>{{actInfo._products[0]}}</div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='0'">
          <el-col class="textColMall">活动类型</el-col>
          <el-col class="contentCol">单品折扣</el-col>
          <el-col class="textColMall">商户id/名称</el-col>
          <el-col class="contentCol">{{`${actInfo.merchantId || ''}/${ actInfo.merchantName || ''}`}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='7'|| type=='6'">
          <el-col class="textColMall">活动商品id/名称</el-col>
          <el-col class="contentCol">
            <div v-for="(val,index) in actInfo._products" :key="index" class="productItem" v-if="actInfo._products.length>1">{{val}}</div>
            <div v-else>{{actInfo._products[0]}}</div>
          </el-col>
          <el-col class="textColMall">商户id/名称</el-col>
          <el-col class="contentCol">{{`${actInfo.merchantId || ''}/${ actInfo.merchantName || ''}`}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='7'|| type=='6'">
          <el-col class="textColMall">活动时间</el-col>
          <el-col class="contentCol" style="width:85%;text-align:left;padding-left:20px;">{{actInfo.activityTime}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='7'|| type=='6'">
          <el-col class="textColMall">活动规则</el-col>
          <el-col class="contentCol" style="width:85%;text-align:left;padding-left:20px;">{{actInfo.actRule}}</el-col>
        </el-row>
        <el-row type="flex" justify="start" v-if="type=='0'">
          <el-col class="textColMall">活动时间</el-col>
          <el-col class="contentCol" style="width:85%;text-align:left;padding-left:20px;">{{actInfo.activityTime}}</el-col>
        </el-row>
      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>
        <span v-if="type=='2'">满减活动明细</span>
        <span v-if="type=='0'">单品折扣明细</span>
        <span v-if="type=='6'">团购库存</span>
        <span v-if="type=='7'">活动库存</span>
      </div>
      <el-table :data="stockList" border style="width: 100%" v-if="type=='6' || type=='7'">
        <el-table-column v-for="(col, index) in cols" :key="index" :prop="col.prop" :label="col.label"></el-table-column>
      </el-table>
      <el-table :data="activityDanPinList" border style="width: 100%" v-if="type=='0'">
        <el-table-column label="商品id/名称">
          <template slot-scope="scope">
            {{scope.row.productId}}/{{scope.row.productName}}
          </template>
        </el-table-column>
        <el-table-column prop="_price" label="默认价格"></el-table-column>
        <el-table-column prop="_discount" label="折扣"></el-table-column>
        <el-table-column prop="_discountPrice" label="默认折后价"></el-table-column>
        <el-table-column prop="status" label="活动状态"></el-table-column>
        <el-table-column prop="actTime" label="活动时间"></el-table-column>
      </el-table>
      <el-table :data="reduceList" border style="width: 100%" v-if="type=='2'">
        <el-table-column label="商品id/名称">
          <template slot-scope="scope">
            {{scope.row.productId}}/{{scope.row.productName}}
          </template>
        </el-table-column>
        <el-table-column prop="typeDisplay" label="类目"></el-table-column>
        <el-table-column prop="_price" label="默认价格"></el-table-column>
        <el-table-column prop="status" label="活动状态"></el-table-column>
        <el-table-column prop="actTime" label="活动时间"></el-table-column>
      </el-table>
      <el-dialog title="强制中止活动" :visible.sync="dialogVisible" width="450px" label-width="80px" :before-close="handleClose">
        <el-form :model="forceForm" :rules="statusRules" ref="forceForm" class="recordForm">
          <el-form-item style="margin: 10px 0 ;">
            <div class="textColForce"><i class="iconfont icon-gantanhao" style="color:#f7ba2a;font-size: 20px;margin: 0 5px;"></i>活动处于{{actInfo.statusDisplay}}状态，操作后活动将被强制中止，是否继续此操作？</div>
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
  </div>
</template>
<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import { GetActivityDetail, ActivityAbort } from "./../../../Apis";
import { dateFrom, getStorage, setStorage } from "./../../../utils";
export default {
  data() {
    return {
      orderDetail: [],
      actInfo: {},
      cols: [],
      stockList: [],
      activityDanPinList: null,
      reduceList: [],
      type: "0",
      dialogVisible: false,
      forceForm: {
        activityId: 0,
        memo: ""
      },
      statusRules: {
        memo: [{ required: true, message: "不可为空", trigger: "blur" }]
      },
      breadList: [
        { label: "卡莫商城" },
        { label: "活动列表" },
        { label: "详情" }
      ]
    };
  },
  created() {
    this.id = this.$route.query.id || 0;
    this.type = this.$route.query.type || "0";
    this.getDeatail();
  },
  methods: {
    resfreshClick() {
      this.getDeatail();
    },
    handleClose() {
      this.dialogVisible = false;
      this.forceForm.activityId = 0;
      this.forceForm.memo = "";
    },
    forceStop() {
      let _this = this;
      let params = _this.forceForm;
      params.activityId = _this.id;
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
          _this.getDeatail();
        }
      });
    },
    async getDeatail() {
      let res = await GetActivityDetail({ id: this.id, type: this.type });
      if (!res.success) return;
      let {
        actInfo,
        reduceList,
        activityDanPinList,
        columnName,
        productAttribute
      } = res.result;
      actInfo._products = actInfo.products.split(",");
      this.actInfo = { ...actInfo };
      this.reduceList = reduceList
        ? reduceList.map(reduce => {
            reduce._price = "￥" + reduce.price;
            return reduce;
          })
        : [];
      this.activityDanPinList = activityDanPinList
        ? activityDanPinList.map(activity => {
            activity._price = "￥" + activity.price;
            activity._discount = activity.discount + "折";
            activity._discountPrice = "￥" + activity.discountPrice;
            return activity;
          })
        : [];
      this.cols = [];
      if (columnName) {
        this.cols = columnName.map((label, index) => {
          return {
            prop: "index_" + index,
            label
          };
        });
      }
      this.stockList = [];
      if (productAttribute) {
        productAttribute.forEach(item => {
          let stock = {};
          item.value.forEach((value, index) => {
            stock["index_" + index] = value;
          });
          this.stockList.push(stock);
        });
      }
    }
  },
  components: {
    BreadCrumb
  }
};
</script>
<style lang="less">
.MallActivityDetail {
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
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
  }
  .dataBaseRow {
    text-align: left;
    height: 35px;
    line-height: 35px;
    margin: 10px 0;
    i {
      color: #999;
      margin: 0 10px;
      font-size: 21px;
    }
    color: #333;
    font-size: 17px;
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
  .districtShopRow {
    background: #f2f2f2;
    color: #666;
    padding: 10px;
    > div {
      text-align: left;
      height: 25px;
      line-height: 25px;
    }
  }
  .baseMessage {
    > .el-row {
      .el-col {
        line-height: 45px;
        border: 1px solid #ccc;
      }
      .textColMall {
        background: #f2f2f2;
        text-align: center;
        width: 15%;
      }
      .contentCol {
        background: #fff;
        width: 35%;
        .imgContent {
          height: 43px;
          // text-align: left;
          // padding-left: 20px;
          img {
            height: 100%;
            padding: 0;
          }
        }
        .offerDiv {
          text-align: left;
          padding-left: 15px;
          line-height: 30px;
        }
      }
    }
  }
  .productItem {
    text-align: left;
    text-indent: 20px;
  }
}
</style>
