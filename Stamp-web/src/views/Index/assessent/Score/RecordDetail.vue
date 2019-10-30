<template>
    <Drawer :value="addVisible"
            @on-close="handleClose1"
            :mask-closable="false"
            :width="600"
            :title="'考核记录日志'"
            id='table'
            >
        <div :style="{height: scroll.y + 60 + 'px', overflow: 'auto'}" >
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     bordered
                     :rowKey="record => String(record.id)"
                     :pagination="false">
            </a-table>
        </div>
        <div class="drawer-footer">
            <a-button @click="handleClose1" style="margin-right: 8px">关闭</a-button>
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
    Drawer,
    Spin,
    TreeSelect,
    Table,
    Upload,
    Icon,
    DatePicker,
    InputNumber,
  } from 'ant-design-vue';
  import { selectAll } from '@/remote/recordLog';
  import {autoDoFn} from '@/utils/util';
  import StaffModal from '@/components/StaffModal/StaffModal';
  import moment from 'moment';
  import _ from 'lodash';

  const {Item} = Form;
  const {Option} = Select;
  const {TextArea} = Input;

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
      ATable: Table,
      AInputNumber: InputNumber,
      StaffModal,
    },
    props: ['addVisible', 'handleClose', 'modifyId',],
    data() {
      const columns = [
        {
          title: '日志内容',
          dataIndex: 'description',
          width: 400,
        },

      ];
      return {
        addLoading: false,
        columns,
        itemId: '',
        data: [],
        viewVisible: false,
        loading: false,
        scroll: {
          y: document.documentElement.clientHeight - 200,
        },
      };
    },
    computed: {},
    watch: {
      addVisible() {
        if (this.modifyId && this.addVisible) {
          autoDoFn(async () => {
            this.loading = true;
            const res = await selectAll({appraisalRecordId: this.modifyId});
            if (res) {
              this.data = res.data;
            }
            this.loading = false;
          });
        }
      },
    },
    methods: {
      handleClose1() {
        this.$emit('successCallback');
      },
      handleDrawerToggle(type, isVisible) {
        this[type] = isVisible;
        if (!isVisible) {
          this.modifyId = '';
        }
      },
      handleDrawerAdditionToggle(type, isVisible) {
        this[type] = isVisible;
        if (!isVisible) {
          this.itemId = '';
          // this.state = '';
          // this.permission = '';
        }
      },
      handleAdditionViewShow(rowData) {
        this.handleDrawerAdditionToggle('viewVisible', true);
        this.itemId = rowData.id;
        // this.state = state;
        this.permission = permission;
      },
      handleAddSuccess() {
        this.handleDrawerAdditionToggle('viewVisible', false);
        // autoDoFn(async () => {
        //   this.loading = true;
        //   const res = await getDetail({planId: this.modifyId});
        //   if (res) {
        //     this.data = res.data;
        //     this.numberList = res.data.map(item => ({
        //       [String(item.id)]: item.quantity,
        //     }));
        //   }
        //   this.loading = false;
        // });
      },

    },
  };
</script>

<style lang="less">
    

</style>
