<template>
    <div class="staff-modal">
        <a-modal
                title="补充市民卡"
                :visible="PhysicalAddressVisible"
                @cancel="handleCancel"
                @ok="handleOk"
                :destroyOnClose="true"
                :width="760"
        >
            <span>市民卡物理地址：</span>
            <a-input v-model="citizenCardPhysicalAddress" placeholder='请输入市民卡物理地址'
                     />

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
    } from 'ant-design-vue';
    import {physicalAddress, getDetail} from '@/remote/staff';

    import {autoDoFn} from '@/utils/util';


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

        },

        props: ['PhysicalAddressVisible', 'handleClose', 'modifyId'],
        data: () => ({
            citizenCardPhysicalAddress: ''
        }),


        watch: {
            PhysicalAddressVisible() {
                console.log("1233"+(!!this.modifyId && String(this.adminLevel) === '9'))
                this.imageUrl = '';
                if (this.modifyId) {
                    console.log("2"+(this.modifyId || String(this.adminLevel) !== '9'))
                    autoDoFn(async () => {
                        this.addLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res) {
                            const {
                                citizenCardPhysicalAddress
                            } = res.data;

                            this.citizenCardPhysicalAddress = citizenCardPhysicalAddress !== undefined ? String(citizenCardPhysicalAddress) : "";

                        }
                        this.addLoading = false;
                    });
                } else {
                    this.workingState = '';
                }
            },
        },
        methods: {
            handleSubmit() {
                autoDoFn(async () => {
                    const res = await physicalAddress(this.modifyId, {
                        id: this.modifyId,
                        physicalAddress: this.citizenCardPhysicalAddress,
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
