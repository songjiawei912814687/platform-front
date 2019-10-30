<template>
    <a-header class="header">
        <div class="logo">
             <img src="../../assets/logo.png"/>
            <span>杭州富阳大数据平台自助服务系统</span>
        </div>
         <div class="action">
             <span>{{nowTime}}</span>
             <!--<a-button @click="linkToIndex">首页</a-button>-->
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
import moment from 'moment';

const { Header } = Layout;
const {Item} = Menu;

const format = 'YYYY-MM-DD HH:mm';

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
  data() {
    return{
      nowTime: moment().format(format),
      timer: null,
    }
  },
  created() {
    timer = setInterval(() => {
      this.getNowTime();
    }, 20 * 1000)
  },
  methods: {
    getNowTime() {
      this.nowTime = moment().format(format);
    }
  }
};
</script>

<style lang="less">
    @import "../../common/base.less";
    .header{
        position: relative;
        background-color: #10457a;
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
            span{
                color: #fff;
                font-size: 30px;
            }
        }
    }

</style>
