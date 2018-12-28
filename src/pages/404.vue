<template>
    <div class="page-404">
        <div class="img-404"><img src="../assets/images/404.png" alt=""></div>
        <p>功能正在开发中,敬请期待</p>
        <div class="btn">
            <router-link to="/">
                <el-button type="primary" size="medium">回到主页</el-button>
            </router-link>
        </div>
    </div>

</template>

<script>
</script>

<style  lang="less" >
.page-404 {
  text-align: center;
  .img-404 {
    width: 500px;
    margin: 150px auto 20px auto;

    img {
      width: 100%;
    }
  }
  button {
  }
  .btn {
    padding: 10px 0;
  }
}
</style>
