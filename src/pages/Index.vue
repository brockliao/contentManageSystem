<template>
  <el-container class="indexContainer">
    <el-aside class="asideContainer" width="200px">
      <el-row class="logoRow">
        <el-col :span="24">卡莫运营管理后台</el-col>
      </el-row>
      <el-row class="menuContainer">
        <!-- 一级菜单 导航过滤 显隐控制 -->
        <el-col v-for="menu in menus" :key="menu.id" v-if="menu.navId == activeNavId && !menu.isHide">
          <div class="menuItem" @click="menuItemOpen(menu)" :class="{'menuActive':activeMenuId == menu.id}">
            <div>{{menu.label}}</div>
            <i v-if="menu.children.length" :class="{'el-icon-arrow-down':menu.isOpen , 'el-icon-arrow-up':!menu.isOpen}"></i>
          </div>
          <!-- 存在二级菜单才显示 -->
          <transition name="el-fade-in">
            <el-row class="menuChildren" v-show="menu.children.length && menu.isOpen">
              <el-col :span="24" v-for="menuChild in menu.children" :key="menuChild.id" v-show="!menuChild.isHide">
                <div @click="menuChildClick(menuChild)" :class="{'menuActive':activeMenuId == menuChild.id}">{{menuChild.label}}</div>
              </el-col>
            </el-row>
          </transition>

        </el-col>
      </el-row>
    </el-aside>
    <el-container class="indexContent">
      <el-header height="53px">
        <el-row>
          <el-col :span="19" style="width:calc(100% - 370px)">
            <el-row type="flex" justify="start" class="navRow">
              <el-col v-for="nav in topNavs" :key="nav.id" :class="{'isNavActive':nav.id == activeNavId}" v-if="!nav.isHide">
                <div @click="navClick(nav)">{{nav.label}}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5" style="width:330px">
            <el-row class="userInfoRow" type="flex" justify="end" align='middle' v-if="userInfo.user_id">
              <el-col title="系统通知">
                <el-badge :value="userInfo.messageCount" :hidden="!userInfo.messageCount">
                  <i class="iconfont icon-message1" @click="watchMessage"></i>
                </el-badge>
              </el-col>
              <el-col class="lineAfter">|</el-col>
              <el-col>{{userInfo.worker}}</el-col>
              <el-col class="lineAfter">|</el-col>
              <el-col>{{userInfo.account}}</el-col>
              <el-col class="lineAfter">|</el-col>
              <el-col title="注销">
                <i class="iconfont icon-Logout" @click="logout"></i>
              </el-col>
              <el-col class="lineAfter">|</el-col>
              <el-col title="修改密码">
                <i class="iconfont icon-lockopenalt" @click="changePassword">修改密码</i>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <div class="routerContainer" style="height:calc(100% - 53px)">
        <router-view/>
      </div>

      <!-- <el-main style="height:calc(100% - 53px)">
        <div class="routerContainer" style="height:100%;">
          <router-view/>
        </div>
      </el-main> -->
    </el-container>
  </el-container>
</template>

<script>
/***
 * 运营首页视图
 *
 */
import { getStorage, clearStorage } from "./../utils";
import { NAVS, MENUS } from "./../utils/navAndMenu.js"; //导航 菜单 配置数据

export default {
  name: "Index",
  data: () => {
    return {
      topNavs: NAVS,
      activeNavId: 1,
      userInfo: {
        user_id: 1, //存在用户信息才显示
        messageCount: 5,
        worker: "总部运营",
        account: "" //手机号码需要隐藏中间4位
      },
      /*
      菜单模型
        {
          navId：匹配导航id 按照导航过滤菜单
          label：文本
          id：唯一标识
          isHide:控制菜单显隐 隐藏 赋值true
          children:子集  不存在赋值 []
          isOpen：控制存在子集的菜单显隐,
          path:路由路径  子集为[]时必须赋值 ，子集存在 置空
        }
      二级菜单模型 
       {
         label:文本
         isHide：显隐控制 隐藏 true
         id：唯一标识
         path:路由路径 必填
       }
      */

      menus: MENUS,
      activeMenuId: 0
    };
  },
  methods: {
    // 头部导航点击切换 左侧菜单
    navClick(nav) {
      this.activeNavId = nav.id;
      if (nav.disabled) {
        this.$message({
          message: "功能正在开发，敬请期待",
          type: "success"
        });
        return;
      }
      // 获取对应的一个菜单
      // 如果不在子集 直接跳转 存在子集 跳转第一个子集的路由
      this.menus.forEach(menu => {
        // 菜单默认全展开
        menu.isOpen = true;
        if (menu.navId === this.activeNavId) {
          //隐藏不需要
          let path = "";
          path = menu.path;
          if (!path) {
            // 获取当前可用的第一个地址即可
            menu.children.forEach(child => {
              if (path || child.isHide) return;
              path = child.path;
            });
          }
          if (!path) {
            // this.$message({
            //   message:'功能正在开发中',
            //   type:'success'
            // })
            return;
          }
          // 清空列表页 筛选条件
          this.$store.commit("setListOptions", {});
          this.$router.push({
            path: path
          });
        }
      });
      // alert(nav.id);
    },
    logout() {
      this.$confirm("此操作将退出当前账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "注销成功!"
          });
          clearStorage();
          this.$router.push("/Login");
        })
        .catch(() => {});
    },
    changePassword() {
      this.$message({
        message: "功能正在开发，敬请期待",
        type: "success"
      });
      // this.$router.push('/PasswordChange');
    },
    watchMessage() {
      this.$message({
        message: "功能正在开发，敬请期待",
        type: "success"
      });
      // alert("系统通知,跳转系统管理系统通知");
    },
    menuItemOpen(menuItem) {
      // 一级菜单 点击 存在 子集菜单 打开关闭  不存在 跳转对应页面
      if (menuItem.children && menuItem.children.length) {
        menuItem.isOpen = !menuItem.isOpen;
      } else {
        if (!menuItem.path) {
          this.$message({
            message: "功能正在开发，敬请期待",
            type: "success"
          });
          return;
        }
        // 清空列表页 筛选条件
        this.$store.commit("setListOptions", {});
        this.$router.push({
          path: menuItem.path
        });
      }
    },
    menuChildClick(menuChild) {
      if (!menuChild.path) {
        this.$message({
          message: "功能正在开发，敬请期待",
          type: "success"
        });
        return;
      }
      // 清空列表页 筛选条件
      this.$store.commit("setListOptions", {});
      this.$router.push({
        path: menuChild.path
      });
    },
    // 处理导航 和 菜单高亮 选项
    navAndMenuActive(route) {
      this.activeNavId = getStorage("navId");
      this.activeMenuId = getStorage("menuId");
      // 根据路由 meta参数判断
    }
  },
  components: {},
  created: function() {
    this.activeNavId = getStorage("navId");
    this.activeMenuId = getStorage("menuId");
    let userInfo = getStorage("userInfo") || "";

    this.userInfo.account = JSON.parse(userInfo).userName || "";
  },
  beforeRouteUpdate(to, from, next) {
    // 处理高亮菜单
    this.navAndMenuActive(to);
    // console.count("this is route change");
    next();
  }
};
</script>

<style  lang="less">
@logoandheaderheight : 53px;
@nav_active_color: #79d5b9;
@fontGreen: #30c7a1;
.indexContainer {
  height: 100%;
  width: 100%;
  .el-header {
    .isNavActive {
      background: @nav_active_color;
    }
    .navRow {
      > div {
        cursor: pointer;
        font-size: 14px;
        height: @logoandheaderheight;
        max-width: 30%;
        :hover {
          background: @nav_active_color;
        }
      }
    }
    @media screen and (max-width: 1440px) {
      .navRow {
        > div {
          width: auto;
          padding: 0 10px;
          font-size: 12px;
        }
      }
    }
    .userInfoRow {
      .el-col {
        width: auto;
        margin: 0 0 0 5px;
        height: @logoandheaderheight;
        line-height: @logoandheaderheight;
        .iconfont {
          font-size: 14px;
          cursor: pointer;
        }
        .icon-message1 {
          font-size: 25px;
        }
        .icon-Logout {
          font-size: 20px;
        }
        .lineAfter:after {
          content: "|";
        }
      }
      .el-badge__content.is-fixed {
        top: 15px;
        right: 10px;
        padding: 0;
        background: #fff;
        color: #f56c6c;
        border-radius: 50%;
        font-weight: bold;
      }
      .el-badge__content {
        height: 15px;
        line-height: 15px;
      }
    }
  }
  .el-header,
  .logoRow {
    padding: 0;
    background: rgba(49, 199, 160, 1);
    height: @logoandheaderheight;
    line-height: @logoandheaderheight;
    color: #fff;
  }
  .logoRow {
    border-right: 2px solid rgba(49, 199, 160, 1);
    .el-col {
      font-size: 20px;
      font-weight: bold;
    }
  }
  /*左侧菜单栏 样式*/
  .menuContainer {
    border-right: 2px solid rgba(228, 228, 228, 1);
    height: calc(100% - @logoandheaderheight);
    overflow-x: hidden;
    overflow-y: auto;
    .menuItem {
      height: 50px;
      line-height: 50px;
      // text-align: center;
      background: rgba(242, 242, 242, 1);
      border: 1px solid rgba(228, 228, 228, 1);
      color: #333;
      font-size: 16px;
      font-weight: bold;
      text-indent: 2em;
      text-align: left;
      position: relative;
      cursor: pointer;
      > i {
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 25px;
        font-weight: bold;
      }
    }
    .menuChildren {
      .el-col {
        cursor: pointer;
        text-indent: 2em;
        text-align: left;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background: rgba(234, 237, 241, 1);
        border: 1px solid rgba(228, 228, 228, 1);
        :hover {
          background: rgba(255, 255, 255, 1);
          color: @fontGreen;
        }
        :before {
          content: "·";
          font-size: 16px;
          font-weight: bold;
          margin: 0 5px;
        }
      }
    }
    .menuActive {
      background: rgba(255, 255, 255, 1);
      color: @fontGreen;
    }
  }

  .indexContent {
    background: #fff;
    width: calc(100% - 250px);
  }
  .routerContainer{
    >div{
      height: 100%;
      overflow: auto;
    }
  }
  .el-main {
    padding: 0;
    width: 100%;
  }
}
</style>

