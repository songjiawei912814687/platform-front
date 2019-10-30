<template>
    <a-drawer :visible="adjustVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="350"
              title="调休申请查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='所属机构'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='人员'>
                            {{viewData.employeesName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='加班日期'>
                            {{viewData.overTimeDate || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='调休日期'>
                            {{viewData.restTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='最后修改时间'>
                            {{viewData.lastUpdateDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">调休原因</p>
                        <p class="des-content">{{viewData.description || '--'}}</p>
                    </a-col>

                    <a-col :span="24">
                        <p class="des-label">审批状态</p>
                        <p class="des-content">{{viewData.statusName || '--'}}</p>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button type="primary" @click="handleViewShow">审批</a-button>
            <a-button @click="handleClose">关闭</a-button>
        </div>
        <approval :approvalVisible="approvalVisible"
                  :modifyId="modifyId"
                  @successCallback="handleAddSuccess"
                  :handleClose="() => handleDrawerToggle('approvalVisible', false)"></approval>
    </a-drawer>
</template>

<script>
    import {Row, Col, Button, Form, Drawer, Spin} from 'ant-design-vue';
    import {getAdjustDetail} from '@/remote/dtailView';
    import {autoDoFn} from '@/utils/util';
    import Approval from './approval'

    const {Item} = Form;

    export default {
        name: 'DetailView',
        components: {
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AForm: Form,
            AFormItem: Item,
            ASelectOption: Option,
            ADrawer: Drawer,
            ASpin: Spin,
            Approval
        },
        props: ['adjustVisible', 'handleClose', 'modifyId', 'resourceId'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
                approvalVisible: false
            };
        },
        watch: {
            adjustVisible() {
                if (this.resourceId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getAdjustDetail({id: this.resourceId});
                        if (res) {
                            this.viewData = {
                                ...res.data,
                                state: String(res.data.state),
                            };
                        }
                        this.viewLoading = false;
                    });
                }
            },
        },
        methods: {
            handleViewShow() {
                this.approvalVisible = true
            },
            handleAddSuccess() {
                this.handleDrawerToggle('approvalVisible', false);
                this.initList();
            },
            handleDrawerToggle(type, isVisible) {
                this[type] = isVisible;
            },
        }
    };
</script>

<style lang="less">

</style>
