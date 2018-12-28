<template>
  <div class="">
    <div class="tbd">
      <span>新增活动</span>
    </div>
    <div class="headerqiye">
      <el-form :model="ruleForm" :rules="rules" label-position='top' ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="divy">
          <el-form-item label="活动名称" prop="activityTitle">
            <el-input size="small" v-model="ruleForm.activityTitle"></el-input>
          </el-form-item>
          <el-form-item label="选择活动开始时间" prop="startTime">
            <el-date-picker size="small" v-model="ruleForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="divy">
          <div>
            <el-form-item label="活动封面" prop="cover">
              <div class="butimg">
                <span>请上传400px*200px的比例图片<i class="el-icon-upload2"></i></span>
                <el-upload :show-file-list="false" class="hei1" id="logoy" action="123" :http-request="requestImg1" :before-upload="beforeAvatarUpload1" enctype="multipart/form-data" accept="image/jpg,image/png" list-type="picture-card">
                </el-upload>
                <img style="z-index:2;" class="nimei" :src="imageUrl1" alt="">
                <div class="zhengmian">
                </div>
              </div>
            </el-form-item>
          </div>
          <div class="twodiv">
            <el-form-item label="选择活动结束时间" prop="endTime">
              <el-date-picker size="small" v-model="ruleForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动首页推荐选择" prop="recommend">
              <el-select size="small" v-model="ruleForm.recommend" placeholder="请选择">
                <el-option v-for="(item,index) in option" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div>
          <el-form-item label="活动简介" prop="briefing">
            <el-input size="small" type="textarea" :rows="5" placeholder="请输入内容" v-model="ruleForm.briefing">
            </el-input>
          </el-form-item>
        </div>
        <quill-editor class="bianjiqi" v-model="ruleForm.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)">
        </quill-editor>
        <div class="atlas">
          <el-checkbox v-model="checked" @change="checkedy">活动图集</el-checkbox>
          <ul v-show="tuji">
            <li v-for="(domain,index) in ruleForm.atlaslist" @click="changy(index)" :key="index">
              <el-upload class="avatar-uploader" :action="httpurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="domain.imageUrl" :src="domain.imageUrl" class="avatar">
                <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
              </el-upload>
              <i @click="del(domain)" class="el-icon-close"></i>
              <el-input placeholder="请添加图片描述" v-model="domain.atlas" style="margin-top:10px;" type="textarea" :rows="2"></el-input>
            </li>
            <li @click="addDomain" class="add">
              <i class="el-icon-plus"></i>
            </li>
          </ul>
        </div>
        <div>
          <el-form-item class="but">
            <el-button @click="confirm('ruleForm')" v-show="confirmyy" type="primary">确认</el-button>
            <el-button @click="confirmy('ruleForm')" v-show="!confirmyy" type="primary">确认</el-button>
            <el-button @click="route()" type="primary">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <el-upload class="shangchuang" :show-file-list="false" action="123" :http-request="requestImg2" :before-upload="beforeAvatarUpload2" enctype="multipart/form-data" accept="image/jpg,image/png" list-type="picture-card">
        <el-button>点击上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
import * as apiRequest from "../../../api/api";
export default {
  data() {
    return {
      content: "",
      atlasStatus: 0, //是否启用图集 0否 1是 默认0
      checked: false,
      tuji: false,
      httpurl:'',
      ruleForm: {
        activityTitle: "",
        endTime: "", //选择结束播放时间
        startTime: "", //选择开始播放时间
        recommend: "", //活动首页推荐选择
        content: "",
        briefing: "",
        atlaslist: [{ atlas: "", imageUrl: "" }] //活动图集
      },
      centerDialogVisible: false,
      option: [
        { label: "无", value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 }
      ],
      confirmyy: true,
      rules: {
        activityTitle: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "选择结束播放时间", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "选择开始播放时间", trigger: "blur" }
        ],
        recommend: [
          { required: true, message: "活动首页推荐选择", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入活动简介", trigger: "blur" }
        ],
        briefing: [
          { required: true, message: "请编辑活动内容", trigger: "blur" }
        ]
      },
      imageUrl1: "",
      imageUrl2: "",
      activityId: "",
      indexy: "",
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: value => {
                if (value) {
                  console.log(value);
                  // this.which = "富文本";
                  // this.flag = true;
                  // this.urls = [];
                  this.getInfoPic();
                } else {
                  // this.quill.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    checkedy(index) {
      this.tuji = index;
      this.atlasStatus = index == false ? 0 : 1;
    },
    changy(index) {
      this.indexy = index;
    },
    del(item) {
      var index = this.ruleForm.atlaslist.indexOf(item);
      if (index !== -1) {
        this.ruleForm.atlaslist.splice(index, 1);
      }
    },
    addDomain() {
      this.ruleForm.atlaslist.push({
        imageUrl: "",
        atlas: ""
      });
    },
    handleAvatarSuccess(res, file, index) {
      this.ruleForm.atlaslist[this.indexy].imageUrl = res.data.imgUrl;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    getInfoPic() {
      this.centerDialogVisible = true;
    },
    route() {
      this.$router.go(-1);
    },
    list() {
      this.activityId = this.$route.query.activityId;
      if (this.activityId != undefined) {
        this.confirmyy = false;
        apiRequest
          .hractivityinfo({
            activityId: this.activityId
          })
          .then(data => {
            if (data.code == 0) {
              var res = data.hrActivity;
              this.ruleForm.activityTitle = res.activityTitle;
              this.ruleForm.content = res.activityContent;
              this.ruleForm.activityTitle = res.activityTitle;
              this.imageUrl1 = res.activityLogo;
              this.ruleForm.briefing = res.activityIntroduction;
              this.ruleForm.startTime = res.startTime;
              this.ruleForm.endTime = res.endTime;
              this.ruleForm.recommend = res.activityWeight;
              this.checked = res.atlasStatus == 1 ? true : false;
              if (this.checked == false) {
                this.tuji = false;
              } else {
                this.tuji = true;
              }
              console.log(this.checked);
              if (res.activityAtlas == null) {
              } else {
                var huod = JSON.parse(res.activityAtlas);
                this.ruleForm.atlaslist = huod;
              }
            }
          });
      } else {
        this.confirmyy = true;
      }
    },
    onEditorChange({ editor, html, text }) {
      //内容改变事件
    },
    confirmy(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var kaishi = this.ruleForm.startTime;
          var jieshu = this.ruleForm.endTime;
          if (this.imageUrl1 == "") {
            this.$alert("请选择LOGO");
          }
          if (new Date(kaishi).getTime() > new Date(jieshu).getTime()) {
            this.$alert("结束时间不能小于结束时间");
            return false;
          } else {
            var atlaslist = this.ruleForm.atlaslist;
            var activityAtlas = [];
            var nully = null;
            atlaslist.forEach(res => {
              activityAtlas.push({
                imageUrl: res.imageUrl,
                atlas: res.atlas
              });
              if (res.imageUrl == "") {
                nully = 1;
              } else {
                nully = 0;
              }
            });
            if (this.checked == false) {
              apiRequest
                .hractivityupdate({
                  activityId: this.activityId,
                  activityTitle: this.ruleForm.activityTitle,
                  activityContent: this.ruleForm.content,
                  activityLogo: this.imageUrl1,
                  activityIntroduction: this.ruleForm.briefing,
                  startTime: this.ruleForm.startTime,
                  endTime: this.ruleForm.endTime,
                  activityWeight: this.ruleForm.recommend,
                  activityAtlas: JSON.stringify(activityAtlas),
                  atlasStatus: this.checked == true ? 1 : 0
                })
                .then(data => {
                  if (data.code == 0) {
                    this.$router.go(-1);
                  } else {
                    this.$alert("提交失败");
                  }
                });
            } else {
              if (nully == 1) {
                this.$alert("你已启动图集，图集不能为空");
              } else {
                console.log(this.atlasStatus);
                apiRequest
                  .hractivityupdate({
                    activityId: this.activityId,
                    activityTitle: this.ruleForm.activityTitle,
                    activityContent: this.ruleForm.content,
                    activityLogo: this.imageUrl1,
                    activityIntroduction: this.ruleForm.briefing,
                    startTime: this.ruleForm.startTime,
                    endTime: this.ruleForm.endTime,
                    activityWeight: this.ruleForm.recommend,
                    activityAtlas: JSON.stringify(activityAtlas),
                    atlasStatus: this.checked == true ? 1 : 0
                  })
                  .then(data => {
                    if (data.code == 0) {
                      this.$router.go(-1);
                    } else {
                      this.$alert("提交失败");
                    }
                  });
              }
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var kaishi = this.ruleForm.startTime;
          var jieshu = this.ruleForm.endTime;

          if (new Date(kaishi).getTime() > new Date(jieshu).getTime()) {
            this.$alert("结束时间不能小于结束时间");
            return false;
          } else {
            var atlaslist = this.ruleForm.atlaslist;
            var activityAtlas = [];
            var nully = "";
            atlaslist.forEach(res => {
              activityAtlas.push({
                imageUrl: res.imageUrl,
                atlas: res.atlas
              });
              if (res.imageUrl == "") {
                nully = 1;
              } else {
                nully = 0;
              }
            });
            if (this.checked == false) {
              apiRequest
                .hractivitysave({
                  activityTitle: this.ruleForm.activityTitle,
                  activityContent: this.ruleForm.content,
                  activityLogo: this.imageUrl1,
                  activityIntroduction: this.ruleForm.briefing,
                  startTime: this.ruleForm.startTime,
                  endTime: this.ruleForm.endTime,
                  activityWeight: this.ruleForm.recommend,
                  activityAtlas: JSON.stringify(activityAtlas),
                  atlasStatus: this.checked == true ? 1 : 0
                })
                .then(data => {
                  if (data.code == 0) {
                    this.$router.go(-1);
                  } else {
                    this.$alert("提交失败");
                  }
                });
            } else {
              if (nully == 1) {
                this.$alert("你已启动图集，图集不能为空");
              } else {
                apiRequest
                  .hractivitysave({
                    activityTitle: this.ruleForm.activityTitle,
                    activityContent: this.ruleForm.content,
                    activityLogo: this.imageUrl1,
                    activityIntroduction: this.ruleForm.briefing,
                    startTime: this.ruleForm.startTime,
                    endTime: this.ruleForm.endTime,
                    activityWeight: this.ruleForm.recommend,
                    activityAtlas: JSON.stringify(activityAtlas),
                    atlasStatus: this.checked == true ? 1 : 0
                  })
                  .then(data => {
                    if (data.code == 0) {
                      this.$router.go(-1);
                    } else {
                      this.$alert("提交失败");
                    }
                  });
              }
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    beforeAvatarUpload1(file) {
      this.imgFile1 = file;
    },
    requestImg1() {
      let token = localStorage.getItem("Authorization");
      var fileValue = document.querySelector(".el-upload .el-upload__input");
      var url =''

      var formData = new FormData();
      var imgData = new FormData(fileValue.files[0]);
      formData.append("file", this.imgFile1);
      formData.append("token", localStorage.getItem("Authorization"));
      // formData.append("comId", this.qiyeid);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.send(formData);
      xhr.onload = () => {
        if (xhr.status === 200) {
          let responseText = xhr.responseText;
          var responseData = JSON.parse(responseText);
          console.log(responseData);
          this.imageUrl1 = responseData.data.imgUrl;
        }
      };
    },
    beforeAvatarUpload2(file) {
      this.imgFile2 = file;
    },
    requestImg2() {
      let token = localStorage.getItem("Authorization");
      var fileValue = document.querySelector(".el-upload .el-upload__input");
      var url =''

      var formData = new FormData();
      var imgData = new FormData(fileValue.files[0]);
      formData.append("file", this.imgFile2);
      formData.append("token", localStorage.getItem("Authorization"));
      // formData.append("comId", this.qiyeid);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.send(formData);
      xhr.onload = () => {
        if (xhr.status === 200) {
          let responseText = xhr.responseText;
          var responseData = JSON.parse(responseText);
          console.log(responseData);
          this.imageUrl2 = responseData.data.imgUrl;
          ///-------
          let quill = this.$refs.myQuillEditor.quill;
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  第二个参数为服务器返回的图片地址
          quill.insertEmbed(length, "image", this.imageUrl2);
          // 调整光标到最后
          quill.setSelection(length + 1);
          this.centerDialogVisible = false;
        }
      };
    }
  }
};
</script>

<style lang="less" scoped>
.tbd {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 10px 30px;
  span {
    line-height: 40px;
  }
}

.bianjiqi {
  height: 300px;
}
.but {
  text-align: center;
  margin-top: 40px;
}

.headerqiye {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  padding: 20px 30px;
  margin-top: 10px;
}
.divy {
  display: flex;
  justify-content: space-between;
  div {
    width: 300px;
  }
}
.demo-ruleForm {
  padding: 0 145px;
}
.butimg {
  width: 260px;
  height: 230px;
  background: rgba(216, 216, 216, 1);
  border-radius: 4px;
  text-align: center;
  line-height: 230px;
  font-size: 15px;
  position: relative;
}
.nimei {
  width: 300px;
  height: 230px;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 5px;
}
.hei1 {
  position: absolute;
  left: 0;
  right: none;
}
//活动图集
.add {
  height: 178px !important;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fafafa;
  text-align: center;
  line-height: 178px;
  font-size: 32px;
  color: #3575f8;
  cursor: pointer;
}
.atlas {
  margin-top: 30px;
  ul {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 300px;
      margin-bottom: 10px;
      position: relative;
      height: 250px;
    }
  }
}
.atlas ul:after {
  content: "";
  width: 300px;
}
.atlas ul:after {
  display: block;
  content: "";
  clear: both;
}
.atlas li > div {
  border: 1px solid #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  background: #fafafa;
  overflow: hidden;
  width: 100%;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 300px;
  height: 100%;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 300px;
  height: 178px;
  display: block;
}
.el-icon-close {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  font-size: 28px;
  cursor: pointer;
}
</style>
