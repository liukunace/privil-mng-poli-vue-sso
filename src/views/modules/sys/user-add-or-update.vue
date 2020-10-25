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
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="dingName">
        <el-input v-model="dataForm.dingName" placeholder="账号名称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="部门多选" size="mini" prop="deptIdList">
        <el-checkbox-group v-model="dataForm.deptIdList">
          <el-checkbox
            v-for="dept in deptList"
            :key="dept.deptId"
            :label="dept.deptId"
          >{{ dept.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>-->

      <el-form-item label="部门" size="mini" prop="deptIdList">
        <el-cascader
          style="width:300px"
          :options="options"
          :props="props"
          v-model="selectedOptions"
          @change="handleChange"
          @active-item-change="handleChange"
          v-bind="$attrs"
          :clearable="clearable"
          :filterable="filterable"
          :change-on-select="changeOnSelect"
          :disabled="disabled"
          :show-all-levels="showAllLevels"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
          >{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="项目" size="mini" prop="projectIdList">
        <el-checkbox-group v-model="dataForm.projectIdList">
          <el-checkbox
            v-for="project in projectList"
            :key="project.projectId"
            :label="project.projectId"
          >{{ project.projectName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
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
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      roleList: [],
      deptList: [],
      projectList: [],
      dataForm: {
        id: 0,
        userName: "",
        dingName: "",
        password: "",
        comfirmPassword: "",
        salt: "",
        email: "",
        mobile: "",
        roleIdList: [],
        projectIdList: [],
        deptIdList: [],
        status: 1,
      },
      options: [],
      selectedOptions: [],
      showAllLevels: true,
      //是否可搜索选项
      filterable: false,
      //是否允许选择任意一级的选项 默认值false
      changeOnSelect: true,
      //是否禁用
      disabled: false,
      clearable: true,
      props: {
        // value: "id",
        // label: "name",
        //children: "children"
      },

      dataRule: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [{ validator: validatePassword, trigger: "blur" }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.selectedOptions = [];
      this.$httpk({
        url: this.$httpk.adornUrl("/sys/role/select"),
        method: "get",
        params: this.$httpk.adornParams(),
      })
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        })
        .then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl(`/sys/dept/select`),
            method: "get",
            params: this.$httpk.adornParams(),
          }).then(({ data }) => {
            this.deptList = data && data.code === 0 ? data.list : [];
          });
        })
        .then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl(`/sys/project/select`),
            method: "get",
            params: this.$httpk.adornParams(),
          }).then(({ data }) => {
            this.projectList = data && data.code === 0 ? data.list : [];
          });
        })
        .then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl(`/poli/dept/list`),
            method: "get",
            params: this.$httpk.adornParams(),
          }).then(({ data }) => {
            this.options = data && data.code === 0 ? data.list : [];
          });
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          let self=this;
          if (this.dataForm.id) {
            this.$httpk({
              url: this.$httpk.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: "get",
              params: this.$httpk.adornParams(),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username;
                this.dataForm.dingName = data.user.dingName;
                this.dataForm.departmentName = data.user.departmentName;
                this.dataForm.salt = data.user.salt;
                this.dataForm.email = data.user.email;
                this.dataForm.mobile = data.user.mobile;
                this.dataForm.roleIdList = data.user.roleIdList;
                this.dataForm.projectIdList = data.user.projectIdList;
                this.dataForm.deptIdList = data.user.deptIdList;
                this.dataForm.status = data.user.status;
                let userId= data.user.userId;
                this.$httpk({
                  url: this.$httpk.adornUrl(
                    `/poli/dept/cascad?id=` + data.user.userId
                  ),
                  method: "get",
                  params: this.$httpk.adornParams(),
                }).then(({ data }) => {
                  let selectedOptions =
                    data && data.code === 0 ? data.list : [];
                  if (selectedOptions == null) {
                    let deptName = this.dataForm.departmentName;
                    if (deptName != null && deptName != "") {
                      this.$httpk({
                        url: this.$httpk.adornUrl(
                          `/poli/dept/cascadname?id=` + userId + `&name=` + deptName
                        ),
                        method: "get",
                        params: this.$httpk.adornParams(),
                      }).then(({ data }) => {
                        self.selectedOptions =
                          data && data.code === 0 ? data.list : [];
                      });
                    }
                  }else{
                    self.selectedOptions =
                    data && data.code === 0 ? data.list : [];
                  }
                });
              }
            });
          }
        });
    },
    handleChange(newValue) {
      let a = newValue;
      let b = this.selectedOptions;
      let c = 9;
    },
    // 表单提交
    dataFormSubmit() {
      let aaa = this.dataForm.deptIdList;
      let bbb = this.selectedOptions;
      let deptIdListSubmit = [];

      this.$httpk({
        url: this.$httpk.adornUrl(
          `/poli/dept/getid?value=` +
            this.selectedOptions[this.selectedOptions.length - 1]
        ),
        method: "get",
        params: this.$httpk.adornParams(),
      }).then(({ data }) => {
        let deptId = 0;
        if (data.dept != null) {
          deptId = data && data.code === 0 ? data.dept.deptId : -1;
        }
        if (deptId > 0) {
          deptIdListSubmit.push(deptId);

          this.$refs["dataForm"].validate((valid) => {
            if (valid) {
              this.$httpk({
                url: this.$httpk.adornUrl(
                  `/sys/user/${!this.dataForm.id ? "save" : "update"}`
                ),
                method: "post",
                data: this.$httpk.adornData({
                  userId: this.dataForm.id || undefined,
                  username: this.dataForm.userName,
                  dingName: this.dataForm.dingName,
                  password: this.dataForm.password,
                  salt: this.dataForm.salt,
                  email: this.dataForm.email,
                  mobile: this.dataForm.mobile,
                  status: this.dataForm.status,
                  roleIdList: this.dataForm.roleIdList,
                  deptIdList: deptIdListSubmit,
                  projectIdList: this.dataForm.projectIdList,
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
        }
      });
    },
  },
};
</script>
