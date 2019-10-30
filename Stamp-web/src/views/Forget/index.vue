<template>
    <div class="login_u">
        <router-link class="back-login" to="/login">返回登录</router-link>
        <div class="forget-form">
            <h1>找回密码</h1>
            <a-form ref="formRegister" :autoFormCreate="(form)=>{this.form = form}" id="formRegister">
                <a-form-item
                        label="登陆账号"
                        fieldDecoratorId="userName"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入登录账户'}], validateTrigger: 'blur'}">
                    <a-input size="large" autocomplete="false" placeholder="请输入登录账户"></a-input>
                </a-form-item>
                <a-form-item
                        label="手机号码"
                        fieldDecoratorId="phoneNo"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }], validateTrigger: 'blur' }">
                    <a-input size="large" placeholder="11 位手机号"></a-input>
                </a-form-item>
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="15">
                        <a-form-item
                                label="验证码"
                                fieldDecoratorId="code"
                                :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码'}], validateTrigger: 'blur'}">
                            <a-input size="large" type="text" placeholder="验证码"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                        <a-button
                                style="margin-top: 38px"
                                size="large"
                                :disabled="smsSendBtn"
                                @click.stop.prevent="getCaptcha"
                                v-text="!smsSendBtn && '获取验证码'||(time+' s')"></a-button>
                    </a-col>
                </a-row>
                <a-form-item
                        label="新密码"
                        fieldDecoratorId="password"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码'},{max: 50,message: '最多50个字符!'}, {min: 6,message: '最少6个字符!',}], validateTrigger: 'blur'}">
                    <a-input size="large" type="password" autocomplete="false" placeholder="至少6位密码"></a-input>
                </a-form-item>
                <a-form-item
                        label="确认密码"
                        fieldDecoratorId="passwordConfirm"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码'},{max: 50,message: '最多50个字符!'}, {min: 6,message: '最少6个字符!',}], validateTrigger: 'blur'}">
                    <a-input size="large" type="password" autocomplete="false" placeholder="至少6位密码"></a-input>
                </a-form-item>
                <a-form-item>
                    <a-button
                            size="large"
                            :loading="loading"
                            @click="handleSubmit">确认提交</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
  import {
    Col, Row, Form, Select, Input, Icon,
    Button,
  } from 'ant-design-vue';

  import { sendVerificationCode, changePassword } from '@/remote/user'
  import {autoDoFn} from "../../utils/util";

  const FormItem = Form.Item;
  const {SelectOption} = Select;
  const passwordRules = [{
  required: true,
  message: '请输入密码!',
}, {
  max: 50,
  message: '最多50个字符!',
}, {
  min: 6,
  message: '最少6个字符!',
}];
const confirmPasswordRules = [{
  required: true,
  message: '请输入确认密码!',
}, {
  max: 50,
  message: '最多50个字符!',
}, {
  min: 6,
  message: '最少6个字符!',
}];

  export default {
    name: "index",
    data() {
      return {
        time: 120,
        loading: false,
        smsSendBtn: false,
        rules: {
          passwordRules,
          confirmPasswordRules,
        },
      }
    },
    components: {
      ACol: Col,
      ARow: Row,
      AForm: Form,
      AFormItem: FormItem,
      ASelect: Select,
      ASelectOption: SelectOption,
      AInput: Input,
      AIcon: Icon,
      AButton: Button,
    },
    methods: {
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if(values.password !== values.passwordConfirm){
              this.$message.error('两次输入密码不一致！');
              return false;
            }
            autoDoFn(async () => {
              this.loading = true;
              const res = await changePassword({
                userName: values.userName,
                code: values.code,
                password: values.password,
              });
              if(res){
                this.$message.success('修改成功！');
                this.$router.push({path: '/'});
              }
              this.loading = false;
            });
          }
        })
      },
      getCaptcha(e) {
        e.preventDefault()
        const that = this
        this.form.validateFields(['userName', 'phoneNo'], {force: true},
          (err, values) => {
            if (!err) {
              this.smsSendBtn = true;
              const hide = this.$message.loading('验证码发送中..', 0);

              autoDoFn(async () => {
                const res = await sendVerificationCode({
                  phoneNo: values.phoneNo,
                  userName: values.userName,
                });
                if(res && res.success){
                  const interval = window.setInterval(() => {
                    if (that.time-- <= 0) {
                      that.time = 60;
                      that.smsSendBtn = false;
                      window.clearInterval(interval)
                    }
                  }, 1000);
                  this.$message.success('验证码发送成功！');
                }else{
                  this.smsSendBtn = false;
                }
                setTimeout(hide, 0);
              });
            }
          }
        )
      },
    }
  }
</script>

<style lang="less" scoped>
    .login_u {
        background-image: url("../../assets/login_bg.jpg");
        background-size: cover;
        background-position: center top;
        height: 100%;
        width: 100%;
        position: relative;
        h1 {
            text-align: center;
            color: #666;
            margin-bottom: 10px;
            font-size: 70px;
        }

        .forget-form {
            padding: 30px;
            position: absolute;
            width: 400px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%);
            border-radius: 15px;
        }

        .back-login {
            position: fixed;
            top: 20px;
            left: 20px;
        }

    }


</style>
