<template>
    <a-drawer :visible="dismissionVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="350"
              title="离职申请查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='离职原因'>
                            {{viewData.reason}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24 ">
                        <a-form-item label='附件'>
                            <ui v-for="item in viewData.attachmentList">
                                <li><a :href="item.url">{{item.fileName}}</a></li>
                            </ui>
                        </a-form-item>
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
    import {getDismissionDetail} from '@/remote/dtailView';
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
        props: ['dismissionVisible', 'handleClose', 'modifyId', 'resourceId'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
                approvalVisible: false
            };
        },
        watch: {
            dismissionVisible() {
                if (this.resourceId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getDismissionDetail({id: this.resourceId});
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
