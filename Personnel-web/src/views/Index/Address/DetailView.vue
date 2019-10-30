<template>
    <a-drawer :visible="viewVisible"
              @close="handleClose"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="350"
              title="通讯录查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='姓名'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='性别'>
                            {{viewData.sexName || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='手机号'>
                            {{viewData.phoneNumber || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label='车牌号'>
                            {{viewData.plateNo || '--'}}
                        </a-form-item>
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
    import { Row, Col, Button, Form, Drawer, Spin, Tooltip } from 'ant-design-vue';
    import { getDetail } from '@/remote/address';
    import { autoDoFn } from '@/utils/util';

    const { Item } = Form;

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
                        const res = await getDetail({ id: this.modifyId });
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
    };
</script>