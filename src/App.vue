<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  created: function() {}
};
</script>

<style lang="less">
@import url("./assets/css/common.less"); //基础样式
@import url("./assets/css/login.less"); //登陆页签样式
</style>
