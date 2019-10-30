<template>
    <a-drawer :visible="appraisalcomplaintVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="考核申诉查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label='年'>
                            {{viewData.year || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='月'>
                            {{viewData.month || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='考核计划标题'>
                            {{viewData.name || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='模板类型'>
                            {{viewData.typeName || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='所属部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='考核人员'>
                            {{viewData.inspectionpersonnelName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='申诉日期'>
                            {{viewData.createdDateTime || 0}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='申诉原因'>
                            {{viewData.description|| '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label='状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" style="margin-bottom: 24px">
                        <p class="des-label">附件</p>
                        <p class="des-content" v-if="viewData.attachmentList && viewData.attachmentList.length">
                            <a v-for="file in viewData.attachmentList" :href="file.url" target="_blank">{{file.fileName}}<br/></a>
                        </p>
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
    import {getAppraisalcomplaintDetail} from "../../../remote/dtailView";
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
        props: ['appraisalcomplaintVisible', 'handleClose', 'modifyId', 'resourceId'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
                approvalVisible: false
            };
        },
        watch: {
            appraisalcomplaintVisible() {
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getAppraisalcomplaintDetail({id: this.resourceId});
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
