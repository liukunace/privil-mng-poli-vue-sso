<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:dept:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
       <dept-update />
    </el-form>

    <el-table
      :data="dataList"
      row-key="deptId"
      border
      style="width: 100%; ">
      <el-table-column
        prop="label"
        header-align="center"
        min-width="150"
        label="名称" >
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单">
      </el-table-column>
     
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">钉钉</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">系统</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="value"
        header-align="center"
        align="center"
        label="键值">
      </el-table-column>

      <el-table-column
        prop="dingId"
        header-align="center"
        align="center"
        label="钉钉ID">
      </el-table-column>
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:dept:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.deptId)">修改</el-button>
          <el-button v-if="isAuth('sys:dept:delete')" type="text" size="small" @click="deleteHandle(scope.row.deptId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './dept-add-or-update'
  import DeptUpdate from "./department-upload";
  import { treeDeptDataTranslate} from '@/utils'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      DeptUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$httpk({
          url: this.$httpk.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$httpk.adornParams()
        }).then(({data}) => {
          this.dataList = treeDeptDataTranslate(data, 'deptId')
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$httpk({
            url: this.$httpk.adornUrl(`/sys/dept/delete/${id}`),
            method: 'post',
            data: this.$httpk.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
