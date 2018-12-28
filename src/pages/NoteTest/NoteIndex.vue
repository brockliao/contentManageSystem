<template>
  <div id="noteIndexContainer">
    <el-container>
      <el-aside>
        <NoteIndex></NoteIndex>
      </el-aside>
      <el-container>
        <el-header>笔记练习主页</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import NoteIndex from "./NoteAside";
export default {
  data() {},
  components: {
    NoteIndex
  }
};
</script>



<style lang="less">
#noteIndexContainer {
  padding: 0;
  margin: 0;
  height: 100%;
  > .el-container {
    margin-bottom: 40px;
    height: 100%;
  }
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    //   line-height: 60px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
  }
}
</style>
