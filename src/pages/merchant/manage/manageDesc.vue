<template>
  <div class="content">
    <BreadCrumb :breadList="breadList">
      <template slot="buttonRow">
        <div class="breadButtons">
          <el-button icon="icon-refresh" size="medium" plain class="iconfont activeButton" @click="refreshCallback">刷新</el-button>
          <el-button icon="icon-close" size="medium" plain class="iconfont activeButton" @click="$router.back(-1)">关闭</el-button>
        </div>
      </template>
    </BreadCrumb>
    <div class="merchandiseDestritionContainer">
      <el-tabs v-model="activeTab" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="商户信息" name="merchandiseInfo">
          <template>
            <manageDescInfoTab :tId="id" ref="manageDescInfoTab"></manageDescInfoTab>
          </template>
        </el-tab-pane>
        <el-tab-pane label="商户设置" name="merchandiseSet" class="merchandiseSetBasic">
          <template>
            <manageDescSetTab :tId="id" ref="manageDescSetTab"></manageDescSetTab>
          </template>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
import {} from "./../../../Apis";
import BreadCrumb from "../../../components/BreadCrumb";
import manageDescInfoTab from "./manageDescInfoTab";
import manageDescSetTab from "./manageDescSetTab";
export default {
  data: () => {
    return {
      breadList: [{ label: "商户" }, { label: "商户管理" }, { label: "详情" }],
      id: 0,
      activeTab: "merchandiseInfo",
      feeType: "2"
    };
  },
  created() {
    // 通过路由 获取id
    this.id = this.$route.params.id || 0;
  },
  methods: {
    handleClick() {},
    refreshCallback() {
      this.$refs.manageDescInfoTab.GetMerChantInfoData();
      this.$refs.manageDescSetTab.GetMerChantInfoData();
    }
  },
  components: {
    BreadCrumb,
    manageDescInfoTab,
    manageDescSetTab
  }
};
</script>
<style lang="less">
.content {
  height: 100%;
  .breadButtons {
    .activeButton {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
    .el-button.is-plain:focus,
    .el-button.is-plain:hover {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
  }
}
.searchContent {
  background: #f3f3f3;
  border: 1px solid #d7d7d7;
  padding: 10px 0;
  margin-bottom: 10px;
  .el-form-item {
    margin: 0 0 0 0;
  }
  .el-form-item__content {
    text-align: left;
  }
  .el-input {
    width: 200px;
    max-width: 200px;
  }
  .el-button.is-plain:focus,
  .el-button.is-plain:hover {
    background-color: #2fc7a0;
    color: #fff;
  }
  .el-button.is-plain {
    border-color: #2fc7a0;
    color: #2fc7a0;
  }
}
.merchandiseDestritionContainer {
  height: calc(100% - 75px);
  overflow: auto;
  padding: 10px;
  border: 1px solid #f3f3f3;
  font-size: 16px;
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
    .recordButton {
      position: absolute;
      right: 20px;
      top: 10px;
      border-radius: 8px;
      border-color: #2fc7a0;
      background: #2fc7a0;
      color: #fff;
      &:hover {
        background: #33d438;
        border-color: #33d438;
      }
    }

    i.editIcon {
      color: #31c8a1;
      cursor: pointer;
      position: absolute;
      right: 20px;
      font-size: 30px;
    }
  }
  .dataBaseRow {
    text-align: left;
    height: 35px;
    line-height: 35px;
    margin: 10px 0 0;
    background: #f3f3f3;
    position: relative;
    i {
      color: #999;
      margin: 0 10px;
      font-size: 21px;
    }
    color: #333;
    font-size: 17px;
    i.editIcon {
      color: #31c8a1;
      cursor: pointer;
      position: absolute;
      right: 20px;
      font-size: 25px;
    }
  }
  .toggleTypeRow {
    background: #f3f3f3;
    text-align: left;
    padding-left: 30px;
    > div {
      padding: 10px 0;
    }
    .activeButton {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
    .el-button.is-plain:focus,
    .el-button.is-plain:hover {
      border-color: #2fc7a0;
      color: #2fc7a0;
    }
  }
  .el-table td,
  .el-table th.is-leaf {
    background: #f9fafc;
  }
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
  .confirmSwitch {
    background: rgb(220, 223, 230);
    height: 20px;
    width: 40px;
    position: relative;
    border-radius: 20px;
    margin: auto;
    cursor: pointer;
    .confirmSwitchIcon {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      position: absolute;
      background: #fff;
      left: 2px;
      top: 2px;
    }
  }
  .confirmSwitchActive {
    background: rgb(19, 206, 102);
    height: 20px;
    width: 40px;
    position: relative;
    border-radius: 20px;
    margin: auto;
    cursor: pointer;
    .confirmSwitchIcon {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      position: absolute;
      background: #fff;
      right: 2px;
      top: 2px;
    }
  }
  .merchandiseSetBasic {
    .el-row {
      height: 45px;
      line-height: 45px;
      .el-col {
        border: 1px solid #e4e4e4;
        font-size: 16px;
      }
      .el-col:nth-child(odd) {
        color: #333;
        background: #f9fafc;
      }
    }
    .saveBtn {
      right: 20px;
      width: 69px;
      height: 28px;
      line-height: 28px;
      border-radius: 7px;
      top: 3px;
      background: #31c7a0;
      color: #fff;
      cursor: pointer;
      &:hover {
        background: #33d438;
      }
    }
  }
  .rewardEidtInput {
    width: 80px;
  }
}
.recordForm .el-form-item__content {
  text-align: left;
  color: #333333;
  font-size: 16px;
}
</style>

