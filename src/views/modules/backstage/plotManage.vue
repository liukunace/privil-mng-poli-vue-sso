<template>
  <div class="mod-user">
    <el-button v-if="isAuth('busi:sys:plot:info')" type="primary">查看</el-button>
    <el-button v-if="isAuth('busi:sys:plot:save')" type="primary">新增</el-button>
    <el-button v-if="isAuth('busi:sys:plot:update')" type="primary">修改</el-button>
    <el-button v-if="isAuth('busi:sys:plot:delete')" type="danger">删除</el-button>
  </div>
</template>