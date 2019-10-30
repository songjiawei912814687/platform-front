<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              title="查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='审批人类型'>
                            {{viewData.approverTypeName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-if="String(viewData.approverType)==='1' || String(viewData.approverType)==='3'">
                        <a-form-item label='是否本部门'>
                            {{viewData.isOneName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24" v-if="String(viewData.approverType)==='1' ">
                        <a-form-item label='部门账号|部门分管领导'>
                            {{(viewData.depAccountOrLeadership || '--') !== '--' && (viewData.depAccountOrLeadership || '--') === '1' ? '部门账号' : '部门分管领导' }}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24"
                           v-if="(String(viewData.approverType)==='1' || String(viewData.approverType)==='3') && String(viewData.isOne) ==='3'">
                        <a-form-item label='组织机构'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>

                    <a-col :span="24" v-if="String(viewData.approverType)==='5'">
                        <p class="des-label">人员</p>
                        <p class="des-content">{{viewData.employeesname || '--'}}</p>
                    </a-col>
                    <a-col :span="24" v-if="String(viewData.approverType)==='3'">
                        <p class="des-label">角色</p>
                        <p class="des-content">{{viewData.roleName || '--'}}</p>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">步骤</p>
                        <p class="des-content">{{viewData.successivelyLevelName || '--'}}</p>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">描述</p>
                        <p class="des-content">{{viewData.description || '--'}}</p>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
        <div class="drawer-footer">
            <a-button @click="handleClose">关闭</a-button>
        </div>
    </a-drawer>
</template>

<script>
    import {Row, Col, Button, Form, Drawer, Spin} from 'ant-design-vue';
    import {autoDoFn} from '@/utils/util';
    import {getDetail} from '@/remote/approvalConfig';

    const {Item} = Form;
    export default {
        name: 'stepsDetailView',
        components: {
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AForm: Form,
            AFormItem: Item,
            ASelectOption: Option,
            ADrawer: Drawer,
            ASpin: Spin,
        },
        props: ['viewVisible', 'handleClose', 'modifyId'],
        data() {
            return {
                viewData: {},

                viewLoading: false,
            };
        },
        watch: {
            viewVisible() {
                if (this.modifyId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getDetail({id: this.modifyId});
                        if (res) {

                            this.viewData = {
                                ...res.data,
                                description: String(res.data.description),
                                employeesname: res.data.employeesname === undefined ? res.data.organ1Name === undefined ? '--' : res.data.organ1Name  : res.data.employeesname,
                                organizationName: String(res.data.organizationName),
                                jobsName: String(res.data.jobsName),
                                roleName: String(res.data.roleName),
                                successivelyLevelName: String(res.data.successivelyLevelName),
                                approverTypeName: String(res.data.approverTypeName),
                                depAccountOrLeadership: String(res.data.depAccountOrLeadership),

                            };
                        }
                        debugger;
                        this.viewLoading = false;
                    });
                }
            },
        },
    };
</script>

<style scoped>

</style>
