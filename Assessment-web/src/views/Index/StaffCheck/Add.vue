<template>
    <Drawer :value="addVisible"
            @on-close="handleClose"
            :mask-closable="false"
            :width="1500"
            :title="'员工考核计划明细'">
        <div :style="{height: scroll.y + 60 + 'px', overflow: 'auto'}">
            <a-table :columns="columns"
                     :dataSource="data"
                     :loading="loading"
                     :scroll="scroll"
                     bordered
                     :rowKey="record => String(record.id)"
                     :pagination="false">
                <template slot="input" slot-scope="text, record">
                    <editable-cell :text="record.quantity" @change="value => onCellChange(record, value)"/>
                </template>
            </a-table>
        </div>
        <div class="drawer-footer">
            <a-button @click="handleClose" style="margin-right: 8px">关闭</a-button>
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
    import {formPost, getDetail, detailEdit} from '@/remote/staffCheck';
    import {autoDoFn} from '@/utils/util';
    import StaffModal from '@/components/StaffModal/StaffModal';
    import moment from 'moment';
    import EditableCell from './EditableCell';

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
            EditableCell,
        },
        props: ['addVisible', 'handleClose', 'modifyId', 'staffList', 'orgTreeData', 'roleList'],
        data() {
          const columns = [
            {
              title: '指数项',
              dataIndex: 'indexName',
              width: 100,
              customRender: this.customRender,
            },
            {
              title: '基准分',
              dataIndex: 'datumValue',
              width: 100,
              customRender: this.customRender,
            },
            {
              title: '最高加分',
              dataIndex: 'maxBonus',
              width: 100,
              customRender: this.customRender,
            },
            {
              title: '得分',
              dataIndex: 'indexScore',
              width: 100,
              customRender: this.customRender,
            },
            {
              title: '效能指标评价标准',
              dataIndex: 'description',
              width: 150,
            },
            {
              title: '打分设置',
              dataIndex: 'scoreSourceName',
              width: 100,
            },
            {
              title: '计分公式',
              dataIndex: 'scoreTypeName',
              width: 100,
            },
            {
              title: '限额',
              dataIndex: 'cumulativeLimit',
              width: 100,
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              width: 150,
              // scopedSlots: { customRender: 'input' },
            },
            {
              title: '分值',
              dataIndex: 'score',
              width: 100,
            },
            {
              title: '打分',
              dataIndex: 'ruleScore',
              width: 150,
            },
            {
              title: '评分说明',
              dataIndex: 'ratingDescription',
              width: 200,
            },
          ];
            return {
                addLoading: false,
                columns,
                data: [],
                searchParams: {
                    year: new Date(moment().subtract(1, 'months').valueOf()),
                    month: moment().subtract(1, 'months'),
                    name: '',
                    organizationId: '',
                },
                loading: false,
                scroll: {
                    y: document.documentElement.clientHeight - 200,
                },
                pagination: {
                    defaultCurrent: 1,
                    total: 0,
                    row: 10,
                    page: 0,
                },
                numberList: [],
              groupByData: {},
            };
        },
        computed: {},
        watch: {
            addVisible() {
                if (this.modifyId && this.addVisible) {
                    autoDoFn(async () => {
                        this.loading = true;
                        const res = await getDetail({planId: this.modifyId});
                        if (res) {
                            this.data = res.data;
                          this.groupByData = _.groupBy(res.data, 'indexId');
                            this.numberList = res.data.map(item => ({
                                [String(item.id)]: item.quantity,
                            }));
                        }
                        this.loading = false;
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
            onCellChange(record, value) {
                autoDoFn(async () => {
                    this.loading = true;
                    const res1 = await detailEdit({
                        id: record.id,
                    }, {
                        ...record,
                        quantity: value,
                    });
                    if (res1) {
                        this.$message.success('操作成功!');
                    }
                    const res = await getDetail({planId: this.modifyId});
                    if (res) {
                        this.data = res.data;
                        this.numberList = res.data.map(item => ({
                            [String(item.id)]: item.quantity,
                        }));
                    }
                    this.loading = false;
                });
            },
          customRender (value, row, index) {
            const obj = {
              children: value,
              attrs: {},
            };
            if(this.groupByData[row.indexId] && this.groupByData[row.indexId].length){
              const index = this.groupByData[row.indexId].findIndex(item => item.id === row.id);
              if(index === 0){
                obj.attrs.rowSpan = this.groupByData[row.indexId].length;
              }else{
                obj.attrs.rowSpan = 0;
              }
            }
            return obj;
          }
        },
    };
</script>

<style lang="less">

</style>
