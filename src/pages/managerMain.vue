<template>
  <el-container class="managerMainContainer">
    <el-header>
      <header-vue key="headBread"></header-vue>
    </el-header>
    <el-container class="content">
      <el-aside class="asideContainer">
        <aside-vue></aside-vue>
      </el-aside>
      <el-main>
        <bread-crumb-vue class="breadCrumbComponent"></bread-crumb-vue>
        <div class="routerContainer">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped lang="less">
.managerMainContainer {
  height: 100%;
  width: 100%;
  .el-header {
    padding: 0;
    height: 50px !important;
    width: 100%;
    line-height: 50px;
  }
  .content {
    height: calc(100% - 50px);
    width: 100%;
    .asideContainer {
      width: 250px !important;
      border: 1px solid #eee;
      background: rgba(249, 250, 252, 1);
    }
    .el-main {
      padding: 0;
      background: rgba(249, 250, 252, 1);
      width: calc(100% - 250px);
      .breadCrumbComponent{
        height: 50px;
        line-height: 50px;
      }
      .routerContainer {
        height: calc(100% - 50px);
        overflow: auto;
        width: 100%;
      }
    }
  }
}
</style>
<script>
import headerVue from "./header";
import asideVue from "./aside";
import breadCrumbVue from "./breadCrumb";

export default {
  name: "mangerMain",
  data: () => {
    return {};
  },
  components: {
    headerVue,
    asideVue,
    breadCrumbVue
  },
  created: function() {},
  mounted() {},
  methods: {}
};
</script>

