<template>
    <div class="passWordChangeContainer">
        <div class="passWordChangeBox">
            <el-row>
                <el-col>
                    <el-input placeholder="请输入手机号码" v-model="telphone">
                        <template slot="prepend">手机号码</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-input placeholder="请输入图形验证码" v-model="pictureCode">
                        <template slot="prepend">图形码</template>
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <div>此处应是后台拿回图形验证码</div>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-input placeholder="请输入短信验证码" v-model="telphoneCode">
                        <template slot="prepend">短信码</template>
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="sendMessageRequest">获取短信验证码</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-input placeholder="请输入密码" v-model="passwordFirst" type="password">
                        <template slot="prepend">输入密码</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-input placeholder="请输入密码" v-model="passwordSecond" type="password">
                        <template slot="prepend">确认密码</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" @click="changPasswordRequest">确认</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style lang="less" scoped>
.passWordChangeContainer {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .passWordChangeBox {
    width: 400px;
    height: 50%;
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
        .el-button {
          width: 100%;
          background: #31c7a0;
          &:hover {
            background: #34af8f;
          }
        }
      }
    }

    .el-col {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>

<script>
export default {
  data: () => {
    return {
      telphone: "",
      pictureCode: "",
      telphoneCode: "",
      passwordFirst: "",
      passwordSecond: ""
    };
  },
  methods: {
    sendMessageRequest() {
    //   debugger;
    },
    changPasswordRequest() {
    //   debugger;
    }
  }
};
</script>
