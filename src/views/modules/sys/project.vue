<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.projectName" placeholder="部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="tokenTest()">Token</el-button>
        <el-button v-if="isAuth('sys:project:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          v-if="isAuth('sys:project:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
        <proj-update />
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
      <el-table-column prop="projectId" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="projectName" header-align="center" align="center" label="项目名称"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:project:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.projectId)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:project:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.projectId)"
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
import AddOrUpdate from "./project-add-or-update";
import ProjUpdate from "./project-upload";
export default {
  data() {
    return {
      dataForm: {
        projectName: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },
  components: {
    AddOrUpdate,
    ProjUpdate,
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$httpk({
        url: this.$httpk.adornUrl("/sys/project/list"),
        method: "get",
        params: this.$httpk.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
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
    tokenTest() {
      this.$httpk({
        url: this.$httpk.adornUrl("/sys/token/init"),
        method: "get",
        params: this.$httpk.adornParams({
          name: "sunyuying",
          token: ""
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
        } 
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
    // 删除
    deleteHandle(id) {
      var projectIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.projectId;
          });
      this.$confirm(
        `确定对[id=${projectIds.join(",")}]进行[${
          id ? "删除" : "批量删除"
        }]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl("/sys/project/delete"),
            method: "post",
            data: this.$httpk.adornData(projectIds, false),
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
</style>
