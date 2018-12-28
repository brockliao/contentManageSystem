<template>
  <div class="imgDialogContainer">
    <div @click="toggle" class="imgContent">
      <img :src="imageUrl" alt="图片加载失败" v-if="imageUrl">
      <span v-else>无</span>
    </div>
    <el-dialog title="预览" :visible.sync="dialogVisible" :modal-append-to-body="false" width="50%" height="50%">
      <div class="previewContent">
        <div>
          <img :src="imageUrl" alt="图片加载失败" class="previewImg">
        </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "imgDialog",
  props: {
    imageUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    toggle() {
      if (!this.imageUrl) return;
      this.dialogVisible = !this.dialogVisible;
    }
  }
};
</script>
<style lang="less" scoped>
.imgDialogContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  .imgContent {
    height: 100%;
    width: 100%;
    > img {
      cursor: pointer;
      width: 150px;
      height: 150px;
      padding: 10px 0;
    }
  }
  img {
    width: 100%;
    height: 100%;
    max-width: 180px;
    max-height: 180px;
  }
  .previewContent {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .previewImg {
    max-width: 540px;
    max-height: 540px;
  }
}
</style>


