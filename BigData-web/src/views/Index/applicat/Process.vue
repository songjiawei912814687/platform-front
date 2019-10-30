<template>
    <a-drawer :visible="processVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="350"
              title="流程查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-steps v-for="item in viewData" direction="vertical" :current="3">
                <a-step :title="String(item.approvalType) === '1' ? '部门' : String(item.approvalType) === '3' ? '角色' : '账号'"
                        :status="item.status === 3  ? 'finish' : item.status === 1 ? 'process' : 'wait'"

                >
                    <p slot="description">

                        <b>审批人：</b>{{item.approverName}}<br/>
                        <b>审批意见：</b>{{item.resultDescrition}}<br/>
                        <b>审批时间：</b>{{item.auditDateTime}}<br/>
                    </p>
                </a-step>

            </a-steps>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
    import { Row, Col, Button, Form, Drawer, Spin, Steps } from 'ant-design-vue';
    import { getProcess } from '@/remote/audit';
    import { autoDoFn } from '@/utils/util';
    const { Item } = Form;
    const {Step} = Steps;

    export default {
        name: "Process",
        components: {
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AForm: Form,
            AFormItem: Item,
            ASelectOption: Option,
            ADrawer: Drawer,
            ASpin: Spin,
            ASteps: Steps,
            AStep: Step
        },
        props: ['processVisible', 'handleClose', 'modifyId','resourceId','applicantId','approvalType'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
            };
        },
        watch: {
            processVisible() {
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getProcess({
                            resourceId: this.resourceId,
                            applicantId: this.applicantId,
                            approvalType: this.approvalType
                        });
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
    }
</script>

<style scoped>

</style>