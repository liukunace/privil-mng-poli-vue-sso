<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from "@/utils/validate";
export default {
  data() {
    return {
      visible: false,
      projectList: [],
      dataForm: {
        id: 0,
        projectName: "",
        remark: "",
      },
      options: [],
      dataRule: {
        projectName: [
          { required: true, message: "项目名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.selectedOptions = [];
      this.$httpk({
        url: this.$httpk.adornUrl("/sys/project/select"),
        method: "get",
        params: this.$httpk.adornParams(),
      })
        .then(({ data }) => {
          //this.projectList = data && data.code === 0 ? data.list : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$httpk({
              url: this.$httpk.adornUrl(
                `/sys/project/info/${this.dataForm.id}`
              ),
              method: "get",
              params: this.$httpk.adornParams(),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.projectName = data.project.projectName;
                this.dataForm.remark = data.project.remark;
              }
            });
          }
        });
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$httpk({
            url: this.$httpk.adornUrl(
              `/sys/project/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$httpk.adornData({
              projectId: this.dataForm.id || undefined,
              projectName: this.dataForm.projectName,
              remark: this.dataForm.remark,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
