<template>
  <Drawer
    :value="addVisible"
    @on-close="handleClose"
    :mask-closable="false"
    :width="320"
    class-name="addViewWrap"
    :title="title"
  >
    <a-spin tip="正在加载中..." :spinning="addLoading">
      <a-form @submit="handleSubmit" layout="vertical" :autoFormCreate="(form)=>{this.form = form}">
        <a-row :gutter="24">
          <a-col :span="24" v-if>
            <a-form-item
              v-if="parentId !== '0'"
              label="上级最小颗粒"
              fieldDecoratorId="parentId"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择上级最小颗粒!'}]}"
            >
              <a-tree-select
                :rowKey="record => String(record.key)"
                @change="treeSelectChange"
                :showSearch="true"
                :filterTreeNode="filterTreeNode"
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="QlTreeData"
                treeDefaultExpandAll
                placeholder="请选择上级最小颗粒"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="情况分类"
              fieldDecoratorId="happeningType"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入情况分类!'}]}"
            >
              <a-input placeholder="请输入情况分类"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="适用范围"
              fieldDecoratorId="process"
              :fieldDecoratorOptions="{rules: [{ required: false}]}"
            >
              <a-text-area style="height: 150px"></a-text-area>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              v-if="this.modifyId=== undefined || this.modifyId === ''"
              label="是否继承父类材料清单"
              fieldDecoratorId="selectAll"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择启用状态!'}]}"
            >
              <a-select placeholder="请选择启用状态">
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
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
    <!--<staff-modal :membersVisible="selectStaffVisible"-->
    <!--:propsSelectedRowKeys="selectedRowKeys"-->
    <!--@cancel="() => this.selectStaffVisible = false"-->
    <!--@ok="handleSelectStaffOk"-->
    <!--type="checkbox"-->
    <!--&gt;</staff-modal>-->
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
  DatePicker
} from "ant-design-vue";
import { autoDoFn } from "@/utils/util";
import StaffModal from "@/components/StaffModal/StaffModal";
import { getDetail, formPost } from "@/remote/grain";

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

export default {
  name: "Add",
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
    StaffModal
  },
  props: ["addVisible", "handleClose", "modifyId", "QlTreeData"],
  data() {
    return {
      organizationId: localStorage.getItem("organId"),
      username: localStorage.getItem("userName"),
      addLoading: false,
      qlsxId: "",
      options: [
        { label: "承诺件", value: "Apple" },
        { label: "即办件", value: "Pear" },
        { label: "其他", value: "Orange" }
      ],
      selectStaffVisible: false,
      parentId: ""
    };
  },
  computed: {
    title() {
      return this.modifyId ? "最小颗粒编辑" : "最小颗粒录入";
    }
  },
  watch: {
    addVisible() {
      if (this.addVisible) {
        this.parentId = "";
        this.form.resetFields();
        if (this.modifyId) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await getDetail({ id: this.modifyId });
            if (res) {
              const { happeningType, process, parentId, qlsxId } = res.data;
              this.form.setFieldsValue({
                parentId: String(parentId),
                happeningType,
                process
              });
              this.qlsxId = qlsxId;
              this.parentId = String(parentId);
            }

            this.addLoading = false;
          });
        }
      }
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          autoDoFn(async () => {
            this.addLoading = true;
            const res = await formPost(this.modifyId, {
              parentId:
                values.parentId === undefined || values.parentId === ""
                  ? 0
                  : values.parentId,
              qlsxId: this.qlsxId,
              happeningType: values.happeningType,
              process:
                values.process === undefined || values.process === ""
                  ? ""
                  : values.process,
              selectAll: values.selectAll
            });
            if (res) {
              this.$message.success("操作成功");
              this.$emit("successCallback");
            }
            this.addLoading = false;
          });
        }
      });
    },
    treeSelectChange(value, label, extra) {
      this.qlsxId = extra.triggerNode.$vnode.data.props.qlsxId;
    },
    filterTreeNode(inputValue, treeNode) {
      return treeNode.data.props.title.indexOf(inputValue) > -1;
    }
  }
};
</script>

<style lang="less">
</style>
