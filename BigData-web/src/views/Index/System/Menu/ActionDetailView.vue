<template>
    <a-modal :visible="actionDetailView"
             @cancel="handleCancel"
             @ok="handleOk"
              :loading="viewLoading"
              :destroyOnClose="true"
              :maskClosable="false"
              :width="320"
              footer=""
              title="查看">
        <a-spin tip="正在加载中..." :spinning="viewLoading">
            <a-form layout="vertical" class="detail-view">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label='名称'>
                            {{viewData.name || '--'}}
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <p class="des-label">编码</p>
                        <p class="des-content">{{viewData.code || '--'}}</p>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>

    </a-modal>
</template>

<script>
    import { Row, Col, Button, Form, Modal, Spin } from 'ant-design-vue';
    import { getDetail } from '@/remote/action';
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
            AModal: Modal,
            ASpin: Spin,
        },
        props: ['actionDetailView', 'handleClose', 'modifyId'],
        data() {
            return {
                viewData: {},
                viewLoading: false,
            };
        },
        watch: {
            actionDetailView() {
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
        methods: {
            handleCancel(){
                this.$emit('cancel');
            },
            handleOk(){
                this.$emit('cancel');
            }
        }
    };
</script>
