<template>
    <Drawer v-model="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form v-if="addVisible" @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item
                                label='菜单名称'
                                fieldDecoratorId="name"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入菜单名称!' },{ max: 105, message: '最多105个字符!' }]}"
                        >
                            <a-input placeholder='请输入名称'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='英文名'
                                fieldDecoratorId="ename"
                        >
                            <a-input placeholder='请输入英文名' style="width: 100%;" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" >
                        <a-form-item
                                label='菜单编号'
                                fieldDecoratorId="code"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写组织编号!' }]}"
                        >
                            <a-input placeholder='请输入菜单编号' />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                                label='上级菜单'
                                fieldDecoratorId="parentId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择上级菜单!' }]}"
                        >
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择上级菜单'
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='是否展示'
                                fieldDecoratorId="isShow"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择是否展示!' }]}"
                        >
                            <a-select placeholder='请选择'>
                                <a-select-option value='0'>展示</a-select-option>
                                <a-select-option value='1'>不展示</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                                label='排序'
                                fieldDecoratorId="disPlayOrderBy"
                        >
                            <a-input-number placeholder='请输入排序' style="width: 100%;" :min="1"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='路径'
                                fieldDecoratorId="path"
                        >
                            <a-input placeholder='请输入路径' style="width: 100%;" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='图标'
                                fieldDecoratorId="icon"
                        >
                            <a-input placeholder='请输入图标' style="width: 100%;" />
                        </a-form-item>
                    </a-col>


                    <a-col :span="12">
                        <a-form-item
                                label='描述'
                                fieldDecoratorId="description"
                        >
                            <a-input placeholder='请输入描述内容' />
                        </a-form-item>
                    </a-col>

                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>

    </Drawer>
</template>

<script>
import { Row, Col, Input, Button, Form, Select, Drawer, Spin, TreeSelect, InputNumber } from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/menu';
import { autoDoFn } from '@/utils/util';
import Index from './index';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Add',
  components: {
    Index,
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    AForm: Form,
    AFormItem: Item,
    ASelect: Select,
    ASelectOption: Option,
    ATextArea: TextArea,
    ADrawer: Drawer,
    ASpin: Spin,
    ATreeSelect: TreeSelect,
    AInputNumber: InputNumber,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'orgTreeData'],
  data() {
    return {
      addLoading: false,
      selectStaffVisible: false,
      staffType: '',
      selection: {},
      selectedRowKeys: [],
      resData: {},
    };
  },
  computed: {
    title() {
      return this.modifyId ? '菜单编辑' : '菜单录入';
    },
  },
  watch: {
    addVisible() {
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
                name,code,parentId,isShow,disPlayOrderBy,description,icon,path,ename
            } = res.data;
            this.resData = res.data;
            this.form.setFieldsValue({
              code,
              name,
                ename,
                path,
                icon,
              description,
              disPlayOrderBy,
              isShow: isShow !== undefined ? String(isShow) : '',
              parentId: parentId !== undefined ? String(parentId) : '',

            });
          }
          this.addLoading = false;
        });
      }else {
        this.resData = {};
      }
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
          debugger
        if (!err) {
          if (String(this.modifyId) === String(values.parentId)) {
            this.$message.error('上级组织机构不可以是当前组织机构');
            return false;
          }
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              ...values,
              parentId: values.parentId,
            });
            if (res) {
              this.$message.success('操作成功');
              this.$emit('successCallback');
            }
            this.addLoading = false;
          });
        }
      });
    },
    handleUpdateData(name, value) {
      this[name] = value;
    },
    handleSelectStaffOk(selectedRowKeys, selections) {
      this.resData[this.staffType] = selections[0].id;
      this.form.setFieldsValue({
        [this.staffType]: selections[0].name,
      });
      this.handleUpdateData('selectStaffVisible', false);
    },
    leadershipSelect() {
      const { leadership } = this.resData;
      this.selectedRowKeys = leadership ? [String(leadership)] : [];
      this.handleUpdateData('selectStaffVisible', true);
      this.staffType = 'leadership';
    },
    departmentalManagerSelect() {
      const { departmentalManager } = this.resData;
      this.selectedRowKeys = departmentalManager ? [String(departmentalManager)] : [];
      this.handleUpdateData('selectStaffVisible', true);
      this.staffType = 'departmentalManager';
    },
  },
};
</script>

<style scoped>

</style>
