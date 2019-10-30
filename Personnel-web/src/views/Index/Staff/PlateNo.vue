<template>
    <div class="staff-modal">
        <a-modal
                title="补充车牌号"
                :visible="PlateNoVisible"
                @cancel="handleCancel"
                @ok="handleOk"
                :destroyOnClose="true"
                :width="760"
        >
            <span>车牌号：</span>
            <a-select
                    mode="tags"
                    style="width: 100%"
                    v-model="plateNoList"
                    @change="handleselectChange"
                    placeholder="请输入您的车牌号，按回车键确认"
            >
                <a-select-option v-for="i in 0" :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) +
                    i}}
                </a-select-option>
            </a-select>

        </a-modal>
    </div>
</template>

<script>
    import {
        Input,
        Button,
        Table,
        Modal,
        Row,
        Col,
        TreeSelect,
        Select,
    } from 'ant-design-vue';
    import {plateNo, getDetail} from '@/remote/staff';
    import {autoDoFn} from '@/utils/util';

    const {Option} = Select;


    export default {
        name: 'StaffModal',
        components: {
            AInput: Input,
            AButton: Button,
            ATable: Table,
            AModal: Modal,
            ARow: Row,
            ACol: Col,
            ATreeSelect: TreeSelect,
            ASelect: Select,
            ASelectOption: Option,

        },
        props: ['PlateNoVisible', 'handleClose', 'modifyId'],

        data: () => ({
            plateNoList: []
        }),
        watch: {
            PlateNoVisible() {
                if (this.modifyId) {
                    autoDoFn(async () => {
                        const res = await getDetail({id: this.modifyId});
                        if (res) {
                            const {
                                plateNo
                            } = res.data;

                            this.plateNoList = plateNo === undefined || plateNo === '' ? undefined : plateNo.split(',');
                        }
                    });
                } else {
                    this.workingState = '';
                }
            },
        },
        methods: {
            handleSubmit() {
                autoDoFn(async () => {
                    const res = await plateNo(this.modifyId, {
                        id: this.modifyId,
                        plateNoList: this.plateNoList,
                    });
                    if (res) {
                        this.$message.success('操作成功');
                        this.$emit('cancel');
                    }
                });
            },
            handleCancel() {
                this.$emit('cancel');
            },
            handleOk() {
                this.handleSubmit();

            },

        },
    };
</script>

<style lang="less" scoped>
    .header__label {
        text-align: right;
        line-height: 32px;
    }
</style>
