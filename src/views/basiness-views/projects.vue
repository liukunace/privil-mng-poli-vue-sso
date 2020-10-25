<template>
  <div class="mod-user">
    <el-button v-if="isAuth('sys:user:info')" type="primary">查看</el-button>
    <el-button v-if="isAuth('sys:user:save')" type="primary">新增</el-button>
    <el-button v-if="isAuth('sys:user:update')" type="primary">修改</el-button>
    <el-button v-if="isAuth('sys:user:delete')" type="danger">删除</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        userName: ""
      }
    };
  },
  components: {},
  activated() {},
  methods: {}
};
</script>
