<template>
    <a-drawer :visible="meetingVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="650"
              title="会议预约查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="12">
<!--                        <a-form-item label='会议主题'>-->
<!--                            {{viewData.theme || '&#45;&#45;'}}-->
<!--                        </a-form-item>-->
                        <p class="des-label">会议主题</p>
                        <p class="des-content">{{viewData.theme || '--'}}</p>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='会议室'>
                            {{viewData.roomName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约日期'>
                            {{viewData.appointmentDate || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='开始时间'>
                            {{meetingTime[viewData.startDateTime] ? meetingTime[viewData.startDateTime].name : '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='结束时间'>
                            {{meetingTime[viewData.endDateTime] ? meetingTime[viewData.endDateTime].name : '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='主办单位'>
                            {{viewData.hostUnit || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约部门'>
                            {{viewData.organizationName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约人'>
                            {{viewData.employeesName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='预约人电话'>
                            {{viewData.phoneNumber || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='审核状态'>
                            {{viewData.stateName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <p class="des-label">与会人员</p>
                        <p class="des-content">{{ attendantsName || '--'}}</p>
                    </a-col>
                    <a-col :span="12">
                        <p class="des-label">与会人员数</p>
                        <p class="des-content">{{ viewData.meetingNumber || '--'}}</p>
                    </a-col>
                    <a-col :span="12">
                        <p class="des-label">描述</p>
                        <p class="des-content">{{viewData.description || '--'}}</p>
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
    import {Row, Col, Button, Form, Drawer, Spin, Tooltip} from 'ant-design-vue';
    import {getMeetingDetail} from '@/remote/dtailView';
    import {autoDoFn} from '@/utils/util';
    import {meetingTime} from '@/common/dictData';
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
            ATooltip: Tooltip,
            Approval
        },
        props: ['meetingVisible', 'handleClose', 'modifyId', 'resourceId'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
                meetingTime,
                approvalVisible: false
            };
        },
        computed: {
            attendantsName() {
                return this.viewData.attendantsName ? this.viewData.attendantsName.split(';').map(item => {
                    return item.split(",")[1]
                }).join(',') : '--';
            }
        },
        watch: {
            meetingVisible() {
                if (this.resourceId) {
                    autoDoFn(async () => {
                        this.viewLoading = true;
                        const res = await getMeetingDetail({id: this.resourceId});
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
