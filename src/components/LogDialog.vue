<template>
  <div class="logContainer">
    <el-button @click="showLog" type="text" size="small">{{button_text}}</el-button>
    <el-dialog :title="dialog_title" :visible.sync="logVisiable" :modal-append-to-body="false">
      <div class="logContent">
        <el-steps :active="0" direction="vertical" space="50px" v-if="list.length">
          <el-step v-for="(log, index) in list" :key="index" icon="none">
            <template slot="icon">
              <div class="stepIcon"></div>
            </template>
            <template slot="title">
              <el-row>
                <el-col :span="15" class="logRemark" :title="log.message">{{log.message}}</el-col>
                <el-col :span="6">{{log._time}}</el-col>
                <el-col :span="3">{{log.auditUser}}</el-col>
              </el-row>
            </template>
          </el-step>
        </el-steps>
        <div v-else>
          暂无数据
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 *  记录查阅 弹窗组件
 */
export default {
  name: "logDialog",
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dialog_title: {
      type: String,
      default: "记录"
    },
    button_text: {
      type: String,
      default: "记录"
    },
    needRequest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logVisiable: false,
      logs: this.list || []
    };
  },
  created() {},
  methods: {
    showLog() {
      this.logVisiable = true;
    }
  },
  watch: {
    logVisiable(val) {
      // 需要重新请求数据
      if (val && this.needRequest) this.$emit("on-get-logs", {});
    }
  }
};
</script>

<style lang="less">
.logContainer {
  display: inline-block;
  .el-button--text {
    color: #31c8a1;
  }
  .el-step__main {
    width: 100%;
  }
  .logRemark {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .logContent {
    padding: 15px 0 30px 20px;
    max-height: 300px;
    overflow: auto;
  }
  .el-dialog__body {
    padding: 0;
  }
  .stepIcon {
    width: 24px;
    height: 24px;
    border: 1px solid #ddd;
    border-radius: 50%;
  }
  .el-step__head.is-process {
    .stepIcon {
      background: #31c8a1;
    }
  }
  .el-step__title.is-process,
  .el-step__title.is-wait {
    color: #333;
    font-weight: normal;
  }
}
</style>


