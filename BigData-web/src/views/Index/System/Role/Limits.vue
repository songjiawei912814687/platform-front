<template>
    <a-drawer :visible="visible"
              @close="handleClose"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="权限设置">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-tree
                    style="width: 100%"
                    :treeNodes="permissionsData"
                    checkable
                    :defaultExpandAll="false"
                    @check="this.onCheck"
                    :checkedKeys="checkedKeys"
            >
            </a-tree>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
    </a-drawer>
</template>

<script>
  import {
    Button,
    Select,
    Drawer,
    Spin,
    Tree,
  } from 'ant-design-vue';
  import {savePermissions} from '@/remote/roleAction'
  import {getPermissionsByRoleId} from '@/remote/system-role'
  import {autoDoFn, transformTree1} from '@/utils/util';

  export default {
    name: "limits",
    components: {
      AButton: Button,
      ADrawer: Drawer,
      ASpin: Spin,
      ATree: Tree,
    },
    props: ['visible', 'roleId'],
    data() {
      return {
        addLoading: false,
        checkedKeys: [],
        roleMenuIntputs: [],
        halfCheckedKeys: [],
        permissionsData: [],
      }
    },
    watch: {
      visible() {
        if(this.visible){
          this.getPermissions();
        }
      },
    },
    methods: {
      getPermissions(){
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getPermissionsByRoleId({roleId: this.roleId});
          if(res){
            let checkedKeys = [];
            let halfCheckedKeys = [];
            this.permissionsData = transformTree1(res.data, checkedKeys, halfCheckedKeys);
            this.checkedKeys = checkedKeys;
            this.halfCheckedKeys = halfCheckedKeys;
          }
          this.addLoading = false;
        })
      },
      onCheck(checkedKeys, e) {
        console.log(e.halfCheckedKeys);
        console.log(e.checkedNodes.map(item => item.key));
        console.log(checkedKeys);
        this.checkedKeys = checkedKeys;
        this.halfCheckedKeys = e.halfCheckedKeys;
        // this.roleMenuIntputs = [...checkedKeys, ...e.halfCheckedKeys];
      },
      handleClose(){
        this.$emit('cancel')
      },
      handleSubmit() {
        autoDoFn(async () => {
          this.addLoading = true;
          let roleMenuIntputs = [...this.checkedKeys, ...this.halfCheckedKeys];
          const res = await savePermissions({
            roleId: this.roleId,
            roleMenuIntputs: roleMenuIntputs.map(item => {
              let itemArr = item.split('_');
              return {
                id: itemArr[0],
                type: itemArr[1],
                parentId: itemArr[2],
              }
            })
          });
          if (res) {
            this.$message.success('操作成功');
            this.$emit('successCallback');
          }
          this.addLoading = false;
        });
      }
    }
  }
</script>

<style scoped>

</style>
