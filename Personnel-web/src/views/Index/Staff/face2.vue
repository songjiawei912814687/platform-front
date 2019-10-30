<template>
    <a-modal class="model"
            :visible="doolVisible"
             :loading="viewLoading"
             @cancel="handleCancel"
             :destroyOnClose="true"
             :width="1300"
             :footer="null"
             >
        <div style="padding: 0px">
            <div style="position:absolute;left: 0px;top:45px;z-index:1000;height: 100px;width: 1300px;background-color: white">
                <h1 style="margin: 20px">落地式人脸</h1>
            </div>
            <iframe
                    :src=systemUrl.hkPlatefromFace2+token
                    id="mobsf" scrolling="no" frameborder="0"
                    style="position:absolute;left: 0px;top:45px;z-index:999;height: 800px;width: 1300px"></iframe>
        </div>
    </a-modal>
</template>

<script>
    import {Row, Col, Button, Form, Modal, Spin} from 'ant-design-vue';
    import {getDetail} from '@/remote/staff';
    import {autoDoFn} from '@/utils/util';

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
            AModal: Modal,
            ASpin: Spin,
        },
        props: ['doolVisible', 'token'],
        data() {
            return {
                systemUrl: window.defaultConfig.systemUrl,
                viewLoading: false,
                partyMemberStateState: ''
            };
        },
        watch: {

        },
        methods: {

            handleCancel() {
                this.$emit('cancel');
            },
        }
    };
</script>
<style lang="less" scoped>
    .ant-modal-content{
        height: 1400px;
        width: 1400px;
    }
    .ant-modal-body{
        padding: 0px;
    }

</style>
