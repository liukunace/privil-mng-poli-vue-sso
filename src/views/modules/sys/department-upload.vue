<template>
  <div class="filebox">
    <span class="labeltext"></span>
    <input type="text" class="inputtext" disabled v-model="filename" />
    <el-button type="success" icon="el-icon-plus" class="selectbutton" circle></el-button>
    <input
      type="file"
      multiple="multiple"
      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      class="selectfile"
      @change="handleFileChange"
      ref="selectfile"
    />
    <el-button
      class="submitbutton"
      :disabled="disabled"
      type="primary"
      @click="handleSubmitFile"
    >更新钉钉部门</el-button>
    <el-button type="success" icon="el-icon-download" @click="download" circle></el-button>
  </div>
</template>

<style scoped>
.filebox {
  display: inline;
}
.inputtext {
  position: relative;
  left: 40px;
}
/* 覆盖按钮 */
.selectbutton {
  /* width: 85px; */
  position: relative;
  left: 40px;
  z-index: 90;
  pointer-events: none;
}
/* 上传组件主体 */
.selectfile {
  width: 30px;
  position: relative;
  left: 0px;
}
.submitbutton {
  position: relative;
  left: 8px;
}
</style>

<script>
export default {
  name: "File",
  props: {
    isdisabled: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  watch: {
    isdisabled(val) {
      this.disabled = true;
    },
  },
  data() {
    return {
      filename: "",
      disabled: this.isdisabled,
      form: {
        name: "sheet1",
        deptFile: null,
      },
    };
  },
  methods: {
    handleFileChange(e) {
      // 首先获取该DOM元素
      let inputDOM = this.$refs.selectfile;
      // 通过DOM元素取文件数据
      this.file = inputDOM.files[0];
      // 获取文件的名字
      this.filename = this.file.name;
      if (this.filename) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    handleSubmitFile() {
      event.preventDefault();
      let formData = new FormData();
      formData.append("sheetName", this.form.name);
      formData.append("file", this.file);
      this.adornUrl;
      this.$http.post(this.$httpk.adornUrl("/exc/dept/imp"), formData).then(
        (res) => {
          this.$message.success("提交成功！");
        },
        (err) => {
          this.$message.success("提交失败！");
        }
      );
    },
    download() {
      let url = this.$httpk.adornUrl("/exc/dept/exp"),
        options = {};
      return new Promise((resolve, reject) => {
        console.log(`${url} 请求数据，参数=>`, JSON.stringify(options));
        this.$ajax.defaults.headers["content-type"] =
          "application/json;charset=UTF-8";
        this.$ajax({
          method: "post",
          url: url, // 请求地址
          data: options, // 参数
          responseType: "blob", // 表明返回服务器返回的数据类型
        }).then(
          (response) => {
            resolve(response.data);
            let blob = new Blob([response.data], {
              type: "application/vnd.ms-excel",
            });
            //console.log(blob);
            let fileName = "部门模板"+Date.parse(new Date()) + ".xlsx";
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              var link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              //释放内存
              window.URL.revokeObjectURL(link.href);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
  },
};
</script>