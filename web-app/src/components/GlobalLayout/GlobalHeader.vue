<template>
    <a-header class="header">
        <div class="logo">
            <!-- <img src="../../assets/logo.png"/> -->
            <span>杭州富阳大数据平台自助服务系统</span>
        </div>
         <div class="action">
             <a-button @click="linkToIndex">首页</a-button>
            <!--<div class="icon">
                <a-icon type="bell" />
            </div>
            <div class="icon">
                <a-dropdown placement="bottomCenter" :trigger="['click']">
                    <a-icon type="setting" />
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a href="javascript:;" @click="logout">退出</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>-->
        </div> 
    </a-header>
</template>

<script>
import { Layout, Icon, Dropdown, Menu, Button } from 'ant-design-vue';


import { logout } from '@/remote/user';
import { autoDoFn } from "../../utils/util";

const { Header } = Layout;
const {Item} = Menu;

export default {
  name: 'GlobalHeader',
  components: {
    AHeader: Header,
    AIcon: Icon,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Item,
    AButton: Button
  },
  methods: {
    logout(){
      autoDoFn(async () => {
        let res = await logout();
        if(res){
          localStorage.clear();
          window.location.href="http://10.32.250.84:80";
          // this.$router.push('/login');
        }
      });
    },

    linkToIndex(){
        this.$router.push('/index');
    }
  }
};
</script>

<style lang="less">
    @import "../../common/base.less";
    .header{
        position: relative;
        background-color: @main-color;
        padding-top: 20px;
        padding-left: 20px;
        height: 80px;
        .logo{
            font-size: 34px;
            height: 40px;
            line-height: 40px;
            color: #fff;
            img{
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }
        .action{
            position: absolute;
            right: 20px;
            top: 10px;
            height: 40px;
            button{
                color:#333;
            }
            .icon{
                vertical-align: top;
                height: 40px;
                display: inline-block;
                .anticon{
                    font-size: 24px;
                    color: #fff;
                    margin-right: 20px;
                    cursor: pointer;
                }
            }
        }
    }

</style>
