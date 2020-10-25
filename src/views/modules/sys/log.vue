<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名／用户操作" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <zmap-button type="warning" shape="circle" size="large" @click="mybuttontest()">qweqwqwqweqw</zmap-button>
        <el-button @click="show2=true">自定义弹窗</el-button>

        <zmap-select v-model="data" multiple class="blaba">
          <zmap-option label="测试1" value="test1"></zmap-option>
          <zmap-option label="测试2" value="test2"></zmap-option>
          <zmap-option label="测试3" value="test3"></zmap-option>
          <zmap-option label="测试5" value="test5"></zmap-option>
        </zmap-select>

      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="用户操作">
      </el-table-column>
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求方法">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求参数">
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="执行时长(毫秒)">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <zmap-modal
      @on-ok="show2=false"
      @on-cancel="show2=false"
      :isShow="show2">
      <template>自定义文字</template>
      <template slot="modal-title">
        <p>Hello World!</p>
      </template>
      <template slot="modal-body">
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </template>
      <template slot="modal-footer">
        <zmap-button type="warning" @click="show2=false">取消</zmap-button>
      </template>
    </zmap-modal>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: [],
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        size: '',
        data: ['test1'],
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      mybuttontest(event){
        console.log("test using");
      },
      getDataList () {
        this.dataListLoading = true
        this.$httpk({
          url: this.$httpk.adornUrl('/sys/log/list'),
          method: 'get',
          params: this.$httpk.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>
