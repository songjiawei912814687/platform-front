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
                                label='员工'
                                fieldDecoratorId="employeesname"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择人员!' }]}">
                            <a-input :disabled="true" placeholder='请选择人员'
                                     style="width: 200px;margin-right: 15px"></a-input>
                        </a-form-item>
                        <a-button style="position: absolute; right: 12px; top: 28px;" type="primary" @click="staffSelect">选择</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='原部门'
                                fieldDecoratorId="originalOrganizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择原部门!'}]}">
                            <a-tree-select
                                    style="width: 100%"
                                    :disabled="true"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择原部门'
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='原职务'
                                fieldDecoratorId="originalJobId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择原职务!'}]}">
                            <a-select placeholder='请选择原职务' :disabled="true">
                            <!--<a-select placeholder='请选择原职务'>-->
                                <a-select-option v-for="item in roleList"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='现部门'
                                fieldDecoratorId="nowOrganizationId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择现部门!' }]}">
                            <a-tree-select
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="orgTreeData"
                                    placeholder='请选择现部门'
                                    showSearch
                                    treeNodeFilterProp="title"
                                    treeDefaultExpandAll
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                                label='现职位'
                                fieldDecoratorId="nowJobId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择现职位!'}]}">
                            <a-select placeholder='请选择现职位'>
                                <a-select-option v-for="item in roleList"
                                                 :getPopupContainer="triggerNode => triggerNode.parentNode"
                                                 :value='String(item.id)' :key="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item
                                label='调动原因'
                                fieldDecoratorId="description"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入调动原因!'},{max:255,message:'最多255个字符！'}]}">
                            <a-text-area placeholder='请输入调动原因' style="height: 150px"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">取消</a-button>
            <a-button @click="handleSubmit" type="primary" :loading="addLoading">保存</a-button>
        </div>
        <staff-modal :membersVisible="selectStaffVisible"
                     :propsSelectedRowKeys="selectedRowKeys"
                     :organTree="orgTreeData"
                     @cancel="handleUpdateData('selectStaffVisible', false)"
                     @ok="handleSelectStaffOk"
                     type="radio"
        ></staff-modal>
    </Drawer>
</template>

<script>
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  Drawer,
  Spin,
  TreeSelect,
  Upload,
  Icon,
  DatePicker,
} from 'ant-design-vue';
import { formPost, getDetail } from '@/remote/post';
import {getOrgTreeWithOutAuthority} from '@/remote/base'
import { autoDoFn, transformTree2 } from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: 'Add',
  components: {
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
    AUpload: Upload,
    AIcon: Icon,
    ADatePicker: DatePicker,
    StaffModal,
  },
  props: ['addVisible', 'handleClose', 'modifyId', 'staffList', 'orgTreeData', 'roleList'],
  data() {
    return {
      addLoading: false,
      selectedRowKeys: [],
      selection: {},
      orgTreeData: [],
      selectStaffVisible: false,
    };
  },
  computed: {
    title() {
      return this.modifyId ? '人员岗位变动编辑' : '人员岗位变动录入';
    },
  },
  watch: {
    addVisible() {
        console.log(this.roleList)
        this.initOrganData()
      if (this.modifyId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await getDetail({ id: this.modifyId });
          if (res) {
            const {
              originalOrganizationId, originalJobId,
              nowOrganizationId, nowJobId, description, employeesname,
            } = res.data;
            this.selection = {
              id: res.data.employeeId,
              name: res.data.employeesname,
            };
            this.form.setFieldsValue({
              employeesname,
              originalOrganizationId: originalOrganizationId !== undefined ? String(originalOrganizationId) : '',
              originalJobId: originalJobId !== undefined ? String(originalJobId) : '',
              nowOrganizationId: nowOrganizationId !== undefined ? String(nowOrganizationId) : '',
              nowJobId: nowJobId !== undefined ? String(nowJobId) : '' ,
              description,
            });
          }
          this.addLoading = false;
        });
      } else {
        this.selection = {};
      }
    },
  },
  methods: {
      initOrganData() {
          autoDoFn(async () => {
              // const orgRes = await getOrgTreeWithOutAuthority();
              // if (orgRes) {
              //     this.orgTreeData = [
              //         {
              //             label: '无',
              //             value: '0',
              //             key: '0',
              //             children: transformTree2(orgRes.data),
              //         },
              //     ];
              //
              // }

          });
      },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              ...values,
              employeeId: this.selection.id,
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
      this.selection = selections[0];
      this.form.setFieldsValue({
        employeesname: selections[0].name,
        originalOrganizationId: selections[0].organizationId !== undefined ? String(selections[0].organizationId) : '',
        originalJobId: selections[0].jobsId !== undefined ? String(selections[0].jobsId) : '',
      });
      this.handleUpdateData('selectStaffVisible', false);
    },
    staffSelect() {
      const { id } = this.selection;
      this.selectedRowKeys = id ? [String(id)] : [];
      this.handleUpdateData('selectStaffVisible', true);
    },
  },
};
</script>

<style lang="less">

</style>
