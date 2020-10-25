<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.departmentName" placeholder="部门名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.projectName" placeholder="项目名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          v-if="isAuth('sys:user:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
        <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="importUserHandle()">批量导入</el-button> -->
        <user-update />
        <!-- <el-upload action="action" class="upload-userfile" :limit="1" :http-request="modeUpload">
          <el-button style="display: inline;" size="small" type="primary">上传</el-button>
        </el-upload>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="userId" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
      <el-table-column prop="dingName" header-align="center" align="center" label="钉钉名"></el-table-column>
      <el-table-column prop="departmentName" header-align="center" align="center" label="部门"></el-table-column>
      <el-table-column prop="roleName" header-align="center" align="center" label="角色"></el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" label="手机号"></el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" label="所属项目"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      ></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:user:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.userId)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:user:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.userId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./user-add-or-update";
import UserUpdate from "./user-upload";
export default {
  data() {
    return {
      dataForm: {
        userName: "",
        departmentName:"",
        projectName:"",
        roleName:""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      form: {
        name: "sheet1",
        userFile: null,
      },
    };
  },
  components: {
    AddOrUpdate,
    UserUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    upUserRTest() {
      this.dataListLoading = true;
      this.$httpk({
        url: this.$httpk.adornUrl("/poli/user/relate"),
        method: "post",
        data: this.$httpk.adornData({
          userIds: [10009, 10010],
          roleIds: [1],
          projectIdList: [2],
          deptIds: [272894239],
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
        }
        this.dataListLoading = false;
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$httpk({
        url: this.$httpk.adornUrl("/sys/user/list"),
        method: "get",
        params: this.$httpk.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName,
          departmentName: this.dataForm.departmentName,
          roleName: this.dataForm.roleName,
          projectName: this.dataForm.projectName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    //用户导入
    modeUpload: function (item) {
      this.form.userFile = item.file;
    },
    importUserHandle() {
      event.preventDefault();
      let formData = new FormData();
      formData.append("sheetName", this.form.name);
      formData.append("file", this.form.userFile);
      this.adornUrl;
      this.$http.post(this.$httpk.adornUrl("/exc/person/imp"), formData).then(
        (res) => {
          this.$message.success("提交成功！");
        },
        (err) => {
          this.$message.success("提交失败！");
        }
      );
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.userId;
          });
      this.$confirm(
        `确定对[id=${userIds.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl("/sys/user/delete"),
            method: "post",
            data: this.$httpk.adornData(userIds, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.upload-userfile /deep/ .el-upload--picture-card {
  height: 120px;
  width: 100px;
  line-height: 120px;
}
</style>
