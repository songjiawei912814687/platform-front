<template>
    <Drawer :value="addVisible1"
            @on-close="handleClose"
            :mask-closable="false"
            :width="650"
            class-name="addViewWrap"
            :title="title">
        <a-spin tip="正在加载中..." :spinning="addLoading">
            <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
                <a-row :gutter="24">
                    <!--<a-col :span="24">
                        <a-form-item
                                label='权力事项'
                                fieldDecoratorId="parentId"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择权力事项!'}]}">

                            <a-tree-select
                                    :rowKey="record => String(record.key)"
                                    @change="treeSelectChange"
                                    style="width: 100%"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="QlTreeData"
                                    treeDefaultExpandAll
                                    placeholder='请选择权力事项'
                            ></a-tree-select>
                        </a-form-item>
                    </a-col>-->
                    <a-col :span="24">
                        <a-form-item
                                label='材料清单'
                                fieldDecoratorId="materialList"
                                :fieldDecoratorOptions="{rules: [{ required: false, message: '请选择材料清单!'}]}">
                            <a-select mode="multiple"
                                      optionFilterProp="children"
                                      :filterOption="filterOption"
                                      style="width: 100%">
                                <a-select-option
                                        :key="item.id"
                                        v-for="item in materialListData"
                                        :value="item.id">{{item.name}}</a-select-option>
                            </a-select>
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
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  Checkbox,
  Drawer,
  Spin,
  TreeSelect,
  Upload,
  Icon,
  DatePicker,
} from 'ant-design-vue';
import { autoDoFn } from '@/utils/util';
import StaffModal from '@/components/StaffModal/StaffModal';
import { findaterialInfo } from '@/remote/materials';
import { addMaterialInBatch } from '@/remote/grain';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
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
    ACheckbox: Checkbox,
    ACheckboxGroup: CheckboxGroup,
    StaffModal,
  },
  props: ['addVisible1', 'handleClose', 'qullFullId', 'grainId'],
  data() {
    return {
      addLoading: false,
      materialListData: [],
    };
  },
  computed: {
    title() {
      return '材料清单选择';
    },
  },
  watch: {
    addVisible1() {
      this.form.setFieldsValue({
        materialList: [],
      });
      if (this.grainId) {
        autoDoFn(async () => {
          this.addLoading = true;
          const res = await findaterialInfo({ minimumParticleId: this.grainId });
          if(res){
            this.materialListData = res.data;
          }
          this.addLoading = false;
        });
      }
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await addMaterialInBatch({
              id: this.grainId,
              materialList: values.materialList.join(","),
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
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  },
};
</script>

<style lang="less">
    .addViewWrap{
        z-index: 1049;
    }
</style>
