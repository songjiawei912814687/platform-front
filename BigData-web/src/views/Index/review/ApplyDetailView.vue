<template>
    <a-drawer :visible="applyVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="350"
              title="请假申请查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='类型'>
                            {{viewData.applicationTypeName}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='开始时间'>
                            {{viewData.startDate + ' ' + viewData.startTime}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='结束时间'>
                            {{viewData.endDate + ' ' + viewData.endTime}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='替岗人员'>
                            {{viewData.replacePerson}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='最后修改时间'>
                            {{viewData.lastUpdateDateTime || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">请假原因</p>
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
    import {getApplyDetail} from '@/remote/dtailView';
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
        props: ['applyVisible', 'handleClose', 'modifyId', 'applicationTypeArr', 'resourceId'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
                approvalVisible: false
            };
        },
        watch: {
            applyVisible() {
                this.applyVisible
                if (this.resourceId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getApplyDetail({id: this.resourceId});
                        if (res) {
                            this.viewData = {
                                ...res.data,
                            };
                        }
                        this.viewLoading = false;
                    });
                }
            },
        },
        methods: {
            handleViewShow(){
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
