<template>
  <div class="indexLoginConatiner">
    <div class="loginBox">
      <el-row>
        <el-col class="loginTitle">
          卡莫运营管理中心
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-input placeholder="请输入账户名" v-model="userNameOrEmailAddress">
            <i slot="prepend" class="for_userName"></i>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-input placeholder="请输入密码" v-model="password" type="password" @keyup.enter.native="login()">
            <i slot="prepend" class="for_passWord"></i>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <button class="indexLoginBtn" @click.prevent="login">登录</button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14" :offset="10" class="passwordText">
          <!-- <router-link to="/passwordChange">忘记密码?</router-link> -->
        </el-col>
      </el-row>
    </div>

  </div>
</template>



<script>
import { Authenticate } from "./../Apis";
import { MessageBox, Message } from "element-ui";
import { setStorage, getStorage,rmStorage } from "../utils";
export default {
  data: function() {
    return {
      userNameOrEmailAddress: "",
      password: ""
    };
  },
  methods: {
    async login() {
      let params = {
        userNameOrEmailAddress: this.userNameOrEmailAddress,
        password: this.password
      };
      let response = await Authenticate(params);
      if (response.success) {
        let AUTH_TOKEN = "Bearer " + response.result.accessToken;

        setStorage(
          "userInfo",
          JSON.stringify({
            userName: this.userNameOrEmailAddress, //response.result.userName,
            userId: response.result.userId
          })
        );
        // sessionStorage.setItem("AUTH_TOKEN", AUTH_TOKEN);
        setStorage("AUTH_TOKEN", AUTH_TOKEN);
        this.$router.push("/");
      } else {
        // sessionStorage.removeItem("AUTH_TOKEN");
        rmStorage('AUTH_TOKEN')
        Message({
          message: response.error.message ? response.error.message : "登陆失败",
          type: "error"
        });
      }
    }
  },
  mounted: function() {
    // productCode(1000, 5000, "ddd");
  }
};
</script>


<style scoped lang="less">
.indexLoginConatiner {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    &:first-child {
      margin-bottom: 0;
    }
  }

  .loginTitle {
    font-size: 18px;
    font-weight: bold;
  }
  .el-col {
    height: 40px;
    line-height: 40px;
  }
  a {
    color: blue;
  }
  .loginBox {
    height: 50%;
    width: 400px;
  }
  .passwordText {
    text-align: right;
  }
}
.indexLoginBtn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #fff;
  background: #31c7a0;
  border: 0;
  cursor: pointer;
  &:hover {
    background: #34af8f;
  }
}
</style>
