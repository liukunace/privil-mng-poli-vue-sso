<template>
  <div class="mod-user">
    <el-button v-if="isAuth('busi:sys:proj:info')" type="primary">查看</el-button>
    <el-button v-if="isAuth('busi:sys:proj:save')" type="primary">新增</el-button>
    <el-button v-if="isAuth('busi:sys:proj:update')" type="primary">修改</el-button>
    <el-button v-if="isAuth('busi:sys:proj:delete')" type="danger">删除</el-button>
  </div>
</template>