
<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="getDeatails()">刷新</el-button>
          <el-button icon="icon-close" size="medium" plain class="iconfont activeButton" @click="$router.back(-1)">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="ProductDetailContainer">
      <div class="statusRow">
        <i class="iconfont icon-gantanhao"></i>当前商品状态: {{shelvesStatus ? (shelvesStatus === 2 ? "强制下架中" : "下架中") :
        "上架中" }} {{auditStatus ? "已审核" : "待审核" }}
        <div class="BtnDiv">
          <el-button size="small" v-if="shelvesStatus === 0 && auditStatus === 1" plain class="iconfont aduitButton"
            @click="shelvesForm.id=id;shelvesVisible=true;">强制下架</el-button>
          <el-button size="small" v-if="!auditStatus" plain class="iconfont aduitButton" @click="auditFrom.id=id;auditVisible=true;">审
            核</el-button>
        </div>

      </div>
      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>基本信息
      </div>
      <!-- 普通商品  v-if="type=='1'"-->
      <div class="baseMessage" v-if="type=='1'">
        <el-row type="flex" justify="start">
          <el-col class="textCol">商品id/名称</el-col>
          <el-col class="contentCol">{{`${ProductDetailDto.id || ''}/${ ProductDetailDto.name || ''}`}}</el-col>
          <el-col class="textCol">封面图片</el-col>
          <el-col class="contentCol">
            <ImagePreview :imageUrl="ProductDetailDto.img"></ImagePreview>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">类目</el-col>
          <el-col class="contentCol">{{ProductDetailDto.typeDisplay}}</el-col>
          <el-col class="textCol">分类</el-col>
          <el-col class="contentCol">{{ProductDetailDto.productCategory}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">原价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.oldPrice}}</el-col>
          <el-col class="textCol">现价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.price}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">库存</el-col>
          <el-col class="contentCol">{{ProductDetailDto.remain}}</el-col>
          <el-col class="textCol">销售时间</el-col>
          <el-col class="contentCol">{{ProductDetailDto.saleTime}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">购买限制</el-col>
          <el-col class="contentCol">{{ProductDetailDto.maxBuyNum}}</el-col>
          <el-col class="textCol">运费信息</el-col>
          <el-col class="contentCol">{{ProductDetailDto.freightTemplateName }}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">首页推荐</el-col>
          <el-col class="contentCol" style="width:85%;text-align:left;padding-left:20px;">{{ProductDetailDto.isRecommend
            ? "推荐" : "否"}}</el-col>
        </el-row>
      </div>

      <!-- 兑换券  v-if="type=='0'" -->
      <div class="baseMessage" v-if="type=='0' ">
        <el-row type="flex" justify="start">
          <el-col class="textCol">商品id/名称</el-col>
          <el-col class="contentCol">{{`${ProductDetailDto.id || ''}/${ ProductDetailDto.name || ''}`}}</el-col>
          <el-col class="textCol">封面图片</el-col>
          <el-col class="contentCol">
            <ImagePreview :imageUrl="ProductDetailDto.img"></ImagePreview>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">类目</el-col>
          <el-col class="contentCol">{{ProductDetailDto.typeDisplay}}</el-col>
          <el-col class="textCol">分类</el-col>
          <el-col class="contentCol">{{ProductDetailDto.productCategory}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">原价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.oldPrice}}</el-col>
          <el-col class="textCol">现价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.price}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">库存</el-col>
          <el-col class="contentCol">{{ProductDetailDto.remain}}</el-col>
          <el-col class="textCol">预售价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.preSalePrice }}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">销售时间</el-col>
          <el-col class="contentCol">{{ProductDetailDto.saleTime}}</el-col>
          <el-col class="textCol">购买限制</el-col>
          <el-col class="contentCol">{{ProductDetailDto.maxBuyNum}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">兑换有效期</el-col>
          <el-col class="contentCol">{{ProductDetailDto.exchangeDate}}</el-col>
          <el-col class="textCol">可用时段</el-col>
          <el-col class="contentCol">
            <div v-for="(week,index) in ProductDetailDto.useWeekdays" :key="index">
              {{week}} {{ProductDetailDto.useTime || ""}}
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">首页推荐</el-col>
          <el-col class="contentCol">{{ProductDetailDto.isRecommend ? "推荐" : "否"}}</el-col>
          <el-col class="textCol">使用说明</el-col>
          <el-col class="contentCol">{{ProductDetailDto.useDesc}}</el-col>
        </el-row>
      </div>
      <!-- 虚拟卡券  v-if="type=='2'"-->
      <div class="baseMessage" v-if="type=='2' ">
        <el-row type="flex" justify="start">
          <el-col class="textCol">商品id/名称</el-col>
          <el-col class="contentCol">{{`${ProductDetailDto.id || ''}/${ ProductDetailDto.name || ''}`}}</el-col>
          <el-col class="textCol">封面图片</el-col>
          <el-col class="contentCol">
            <ImagePreview :imageUrl="ProductDetailDto.img"></ImagePreview>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">类目</el-col>
          <el-col class="contentCol">{{ProductDetailDto.typeDisplay}}</el-col>
          <el-col class="textCol">分类</el-col>
          <el-col class="contentCol">{{ProductDetailDto.productCategory}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">原价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.oldPrice}}</el-col>
          <el-col class="textCol">现价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.price}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">库存</el-col>
          <el-col class="contentCol">{{ProductDetailDto.remain}}</el-col>
          <el-col class="textCol">销售时间</el-col>
          <el-col class="contentCol">{{ProductDetailDto.saleTime}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">购买限制</el-col>
          <el-col class="contentCol">{{ProductDetailDto.maxBuyNum}}</el-col>
          <el-col class="textCol">使用有效期</el-col>
          <el-col class="contentCol">{{ProductDetailDto.exchangeDate}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">首页推荐</el-col>
          <el-col class="contentCol">{{ProductDetailDto.isRecommend ? "推荐" : "否"}}</el-col>
          <el-col class="textCol">使用说明</el-col>
          <el-col class="contentCol">{{ProductDetailDto.useDesc}}</el-col>
        </el-row>
      </div>
      <!-- 年次卡 v-if="type=='3'"-->
      <div class="baseMessage" v-if="type=='3' ">
        <el-row type="flex" justify="start">
          <el-col class="textCol">商品id/名称</el-col>
          <el-col class="contentCol">{{`${ProductDetailDto.id || ''}/${ ProductDetailDto.name || ''}`}}</el-col>
          <el-col class="textCol">封面图片</el-col>
          <el-col class="contentCol">
            <ImagePreview :imageUrl="ProductDetailDto.img"></ImagePreview>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">类目</el-col>
          <el-col class="contentCol">{{ProductDetailDto.typeDisplay}}</el-col>
          <el-col class="textCol">分类</el-col>
          <el-col class="contentCol">{{ProductDetailDto.productCategory}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">原价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.oldPrice}}</el-col>
          <el-col class="textCol">现价</el-col>
          <el-col class="contentCol">￥{{ProductDetailDto.price}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">库存</el-col>
          <el-col class="contentCol">{{ProductDetailDto.remain}}</el-col>
          <el-col class="textCol">销售时间</el-col>
          <el-col class="contentCol">{{ProductDetailDto.saleTime}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">购买限制</el-col>
          <el-col class="contentCol">{{ProductDetailDto.maxBuyNum}}</el-col>
          <el-col class="textCol">使用有效期</el-col>
          <el-col class="contentCol">{{ProductDetailDto.exchangeDate}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">使用次数</el-col>
          <el-col class="contentCol">{{ProductDetailDto.exchangeDate}}</el-col>
          <el-col class="textCol">首页推荐</el-col>
          <el-col class="contentCol">{{ProductDetailDto.isRecommend ? "推荐" : "否"}}</el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col class="textCol">使用说明</el-col>
          <el-col class="contentCol" style="width:85%;text-align:left;padding-left:20px;">{{ProductDetailDto.useDesc}}</el-col>
        </el-row>
      </div>

      <div class="dataBaseRow" v-if="type=='1'">
        <i class="iconfont icon-database"></i>规格信息
      </div>
      <el-table :data="tableOptions.lists" border style="width: 100%" v-if="type=='1'" key="tableFormat">
        <el-table-column v-for="(formmat, index) in tableOptions.formtLists" :prop="'formt_'+ index" :key='index'
          :label="formmat+''"></el-table-column>
      </el-table>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>优惠信息
      </div>
      <el-table :data="productOfferList" border style="width: 100%" key="districtFormat">
        <el-table-column prop="type" label="类型" width="150"></el-table-column>
        <el-table-column label="优惠详情">
          <template slot-scope="scope">
            <div v-for="(val,index) in scope.row.details" :key='index'>
              {{val}}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="dataBaseRow">
        <i class="iconfont icon-database"></i>商品详情
      </div>
      <div class="textEditContent" v-html="ProductDetailDto.discription">
      </div>
    </div>
    <el-dialog title="审核商品" :visible.sync="auditVisible" width="450px" label-width="80px">
      <el-form :model="auditFrom" ref="auditFrom" class="recordForm">
        <el-form-item style="margin: 10px 0 ;">
          <div style="text-align: left;height: 25px;line-height: 25px;font-size: 16px;">审核操作后，商品的审核状态改为已审核。</div>
          <div style="text-align: left;height: 25px;line-height: 25px;font-size: 16px;">若审核通过，商品的上架状态不变；若强制下架，商品的上架状态改为强制下架中。</div>
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
          <div style="text-align: left;height: 25px;line-height: 25px;font-size: 16px;"><i class="iconfont icon-gantanhao"
              style="color:#f7ba2a;font-size: 20px;margin: 0 5px;"></i>当前商品处于上架中状态，强制下架后商户将不能在卡莫商城售卖此商品，是否继续？</div>
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
</template>
<script>
import BreadCrumb from "./../../../components/BreadCrumb";
import ImagePreview from "./../../../components/ImagePreview";

import { GetProductDetail, AuditOrShelvesProduct } from "./../../../Apis";
import { dateFrom, getStorage, setStorage } from "./../../../utils";
export default {
  data() {
    return {
      breadList: [
        { label: "卡莫商城" },
        { label: "商品列表" },
        { label: "详情" }
      ],
      tableOptions: {
        lists: [],
        formtLists: []
      },
      id: 0,
      type: 0,
      ProductDetailDto: {},
      productOfferList: [],
      auditStatus: 0,
      shelvesStatus: 0,
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
      }
    };
  },
  created() {
    this.id = this.$route.query.id || "";
    this.type = this.$route.query.type;
    this.auditStatus = Number(this.$route.query.auditStatus) || 0;
    this.shelvesStatus = Number(this.$route.query.shelvesStatus) || 0;
    this.getDeatails();
  },
  mounted() {},
  methods: {
    async getDeatails() {
      let res = await GetProductDetail({
        type: this.type,
        id: this.id
      });
      if (res.success) {
        if (res.result.useWeekday) {
          res.result.useWeekdays = [];
          let days = res.result.useWeekday.split(",");
          let weeks = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
          ];
          days.forEach(val => {
            res.result.useWeekdays.push(weeks[val]);
          });
        }
        this.ProductDetailDto = res.result;
        res.result.productOfferList = res.result.productOfferList
          ? res.result.productOfferList
          : [];
        this.productOfferList = res.result.productOfferList.map(item => {
          item.details = item.detail ? item.detail.split(" ") : [];
          return item;
        });
        if (this.type === 0) {
          this.ProductDetailDto.preSalePrice = this.$route.query.preSalePrice;
        }
        this.tableOptions.formtLists = res.result.columnName;
        let lists = [];
        if (!res.result.productAttribute) res.result.productAttribute = [];
        res.result.productAttribute.forEach(item => {
          let obj = {};
          item.value.forEach((val, index) => {
            obj["formt_" + index] = val;
          });
          lists.push(obj);
        });
        this.tableOptions.lists = [...lists];
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
            _this.auditStatus = 1;
            _this.$message({
              type: "success",
              message: "设置成功"
            });
            _this.auditVisible = false;
            _this.getDeatails();
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
            _this.shelvesStatus = 1;
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
.ProductDetailContainer {
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
    .BtnDiv {
      position: absolute;
      right: 20px;
      top: 0;
      .aduitButton {
        border-color: #2fc7a0;
        color: #2fc7a0;
      }
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
  .baseMessage {
    > .el-row {
      .el-col {
        line-height: 45px;
        border: 1px solid #ccc;
      }
      .textCol {
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
  .textEditContent {
    border: 1px solid #ccc;
    padding: 10px;
  }
}
</style>


