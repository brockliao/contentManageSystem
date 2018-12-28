<template>
  <div class="breadCrumbContainer">
    <el-row>
      <el-col tag="span" class="beforeIcon">
      </el-col>
      <el-col tag="span" :class="{'crumbItem':true,'routeCrumb':item.path}" v-for="(item,index) in breadList" :key="index">
        <div @click="goRoute(item)">{{item.label}}</div>
      </el-col>
    </el-row>
    <!--右侧按钮插槽 -->
    <el-row class="buttonRow">
      <slot name="buttonRow" ></slot>
    </el-row>
  </div>
</template>

<script>
/** breadCrumb
 * 面包屑组件
 */
export default {
  name: "breadCrumb",
  props: {
    // 面包屑路径数组
    breadList: {
      type: Array,
      default: () => {
        return [
          // {
          //   label:'显示文本 必填',
          //   path:'路由地址 需要跳转才传入 非必选'
          // }
        ];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    goRoute({ label, path }) {
      if (!path) return;
      alert("跳转=" + path);
      // this.$router.push(path);
    }
  }
};
</script>

<style lang="less" scoped>
@logoandheaderheight : 53px;
@fontGreen: #30c7a1;
@btnColor: #31c7a0;
.breadCrumbContainer {
  position: relative;
  .el-row {
    padding: 0 20px;
    background: rgba(243, 243, 243, 1);
    position: relative;
    :nth-child(2) {
      padding-left: 15px;
    }
    :last-child {
      :after {
        content: "";
      }
    }
    color: #999999;
  }
  .el-col {
    height: @logoandheaderheight;
    line-height: @logoandheaderheight;
    width: auto;
  }
  .beforeIcon {
    background: @fontGreen;
    width: 7px;
    padding: 0;
    height: 27px;
    position: absolute;
    left: 10px;
    top: 11px;
  }
  .crumbItem {
    font-size: 16px;
    :after {
      content: "/";
      padding: 0 2px;
    }
  }
  .routeCrumb {
    cursor: pointer;
    :hover {
      color: #409eff;
    }
  }
  .rightButton {
    border: 1px solid @btnColor;
    color: @btnColor;
  }
  .buttonRow {
    position: absolute;
    right: 20px;
    top: 8px;
  }
}
</style>

