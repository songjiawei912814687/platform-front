<template>
    <a-modal  title="修改密码"
              :visible="updatePasswordVisible"
              @cancel="handleCancel"
              @ok="handleOk"
              :destroyOnClose="true"
              :width="560"
    >
        <a-spin tip="正在加载中..." :spinning="addLoading">

                <a-row :gutter="24">
                    <a-col class="inputName" :span="24">
                        <span><span style="color: red">*</span>旧密码：</span>
                            <a-input  v-model="old" type="password" placeholder='请输入旧密码'/>
                    </a-col>
                    <a-col class="inputName" :span="24">
                        <span><span style="color: red">*</span>新密码：</span>
                            <a-input  v-model="newPassword" type="password" placeholder='请输入新密码'/>
                    </a-col>

                    <a-col class="inputName" :span="24">
                        <span><span style="color: red">*</span>确认密码：</span>
                            <a-input  v-model="newPassword1" type="password" placeholder='确认新密码'/>
                    </a-col>
                </a-row>
        </a-spin>
    </a-modal>
</template>

<script>
    import { Modal, Row, Col, Form, Input, message} from 'ant-design-vue';
    const {Item} = Form;
    export default {
        name: "index",
        components: {
            AModal: Modal,
            ARow: Row,
            ACol: Col,
            AForm: Form,
            AInput: Input,
            AFormItem: Item,
        },
        data() {
          return {
              addLoading:false,
              old: '',
              newPassword: '',
              newPassword1: ''
          }
        },
        props: ['updatePasswordVisible', 'handleClose'],
        watch: {
            updatePasswordVisible() {

            },
        },
        methods:{
            handleCancel(){
                this.$emit('cancel');
            },
            handleOk() {
                if(this.old === ''){
                    message.error("请输入旧密码")
                    return
                }
                if(this.newPassword === ''){
                    message.error("请输入新密码")
                    return
                }
                if(this.newPassword.length < 6){
                    message.error("密码不能小于6个字符")
                    return
                }
                if(this.newPassword1 === ''){
                    message.error("请确认新密码")
                    return
                }
                if(this.newPassword === this.newPassword1){
                    this.$emit('ok', this.old,this.newPassword);
                }else {
                    message.error("两次输入的密码不一致")
                }
            },

        }
    }
</script>

<style scoped>
.inputName{
    margin: 10px;
}
</style>
