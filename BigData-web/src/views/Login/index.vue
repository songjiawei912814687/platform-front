<template>
  <div class="login">
    <div class="login__main">
      <h1 class="login__title">
        杭州市富阳区行政服务中心<br/>
        <span>大数据平台</span>
      </h1>
      <a-form @submit="handleLogin" :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
                fieldDecoratorId="username"
                :fieldDecoratorOptions="{rules: rules.userNameRules}">
          <a-input placeholder='请输入用户名' @keyup.enter.native="handleLogin" auto-complete="off">
            <a-icon slot="prefix" type="user"></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item
                fieldDecoratorId="password"
                :fieldDecoratorOptions="{rules: rules.passwordRules}">
          <a-input placeholder='请输入密码' :type="passwordType" @keyup.enter.native="handleLogin" auto-complete="off">
            <a-icon slot="prefix" type="lock"></a-icon>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="loading" @click.native.prevent="handleLogin" class="login__submit">登录</a-button>
        </a-form-item>
          <a-form-item>
              <div style="text-align: right">
                  <router-link to="/forget">忘记密码</router-link>
              </div>
          </a-form-item>
      </a-form>
    </div>
  </div>

</template>

<script>
import { Form, Button, Input, Checkbox, Icon } from 'ant-design-vue';
import { login } from '@/remote/user';

const { Item } = Form;
const userNameRules = [{
  required: true,
  message: '请输入用户名!',
}, {
  max: 50,
  message: '最多50个字符!',
}];
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
export default {
  name: 'loginIndex',
  components: {
    AForm: Form,
    AButton: Button,
    AInput: Input,
    ACheckbox: Checkbox,
    AFormItem: Item,
    AIcon: Icon,
  },
  data() {
    return {
      loading: false,
      passwordType: 'password',
      rules: {
        userNameRules,
        passwordRules,
      },
    };
  },
  created() {
  },
  mounted() {},
  computed: {
  },
  props: [],
  methods: {
    showPassword() {
      if (this.passwordType = 'password') {
        this.passwordType = 'text';
      } else {
        this.passwordType = 'password';
      }
    },
    handleLogin(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          login(values).then((res) => {
            if (res) {
              this.$message.success('登录成功');
              console.log(res.data)
              this.$router.push(res.data.path);
              const {
                employeeId, employeesName, jobId, jobName, organId, organName, userName, icon,
                menuOutputs, actions, adminLevel
              } = res.data;
              localStorage.setItem('employeeId', employeeId);
              localStorage.setItem('employeesName', employeesName);
              localStorage.setItem('jobId', jobId);
              localStorage.setItem('jobName', jobName);
              localStorage.setItem('organId', organId);
              localStorage.setItem('organName', organName);
              localStorage.setItem('userName', userName);
              localStorage.setItem('icon', icon);
              localStorage.setItem('authorityMenuList', JSON.stringify(menuOutputs.map(item => item.code)));
              localStorage.setItem('authorityActionList', JSON.stringify(Object.keys(actions)));
              localStorage.setItem('adminLevel', adminLevel);
            }
            this.loading = false;
          });
        }
      });
    },
  },
};
</script>
<style lang="less">
  @import "../../common/base.less";
  .login{
    background-image: url("../../assets/login_bg.jpg");
    background-size: cover;
    background-position: center top;
    height: 100%;
    width: 100%;
    position: relative;
    .login__main{
      background-color: rgba(255,255,255, .6);
      padding: 30px;
      position: absolute;
      width: 400px;
      height: 350px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 15px;
    }
    .login__title{
      font-size: 24px;
      color: @main-color;
      text-align: center;
      margin-bottom: 10px;
      span{
        font-size: 18px;
      }
    }
    .login__submit{
      width: 100%;
    }
  }


</style>
