<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="label">
        <el-input v-model="dataForm.label" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '键值'" prop="value">
        <el-input v-model="dataForm.value" :placeholder="'key'"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="deptId"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '排序'" prop="rankn">
        <el-input v-model="dataForm.rankn" :placeholder="'9'"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDeptDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          //deptId: 2,
          type: 1,
          typeList: ['一级部门', '钉钉部门', '系统部门'],
          label: '',
          pid: 0,
          parentName: '',
          value:'',
          rankn:99
        },
        dataRule: {
          label: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级部门不能为空', trigger: 'change' }
          ]
        },
        menuList: [],
        menuListTreeProps: {
          label: 'label',
          children: 'children'
        }
      }
    },
    created () {
    },
    methods: {
      init (id) {
        this.dataForm.deptId = id || 0
        this.$httpk({
          url: this.$httpk.adornUrl('/sys/dept/select'),
          method: 'get',
          params: this.$httpk.adornParams()
        }).then(({data}) => {
          this.menuList = treeDeptDataTranslate(data.list, 'deptId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.deptId) {
            // 新增
            this.menuListTreeSetCurrentNode()
          } else {
            // 修改
            this.$httpk({
              url: this.$httpk.adornUrl(`/sys/dept/info/${this.dataForm.deptId}`),
              method: 'get',
              params: this.$httpk.adornParams()
            }).then(({data}) => {
              this.dataForm.deptId = data.department.deptId
              this.dataForm.type = data.department.type
              this.dataForm.label = data.department.label
              this.dataForm.pid = data.department.pid
              this.dataForm.value = data.department.value
              this.dataForm.rankn = data.department.rankn
              this.menuListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.pid = data.deptId
        this.dataForm.parentName = data.label
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.pid)
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['label']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$httpk({
              url: this.$httpk.adornUrl(`/sys/dept/${!this.dataForm.deptId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$httpk.adornData({
                'deptId': this.dataForm.deptId || undefined,
                'type': this.dataForm.type,
                'label': this.dataForm.label,
                'pid': this.dataForm.pid,
                'rankn': this.dataForm.rankn
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
