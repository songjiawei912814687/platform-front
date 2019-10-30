<template>
    <a-sider class="slider">
        <div class="user">
            <div class="avatar">
                <img v-if="String(icon).length <= 30" src="../../assets/defaultAvatar.png"/>
                <img :src="icon" v-else/>
            </div>
            <div class="name">
                <span>{{employeesName}}</span>
            </div>
            <div class="role">{{organName}}</div>
            <div class="role">{{jobName}}</div>
        </div>
        <!-- <a-anchor v-for="item in menuInitData" :key="item.code" style="width: 200px">
            <a-anchor-link :href="'#'+item.code" :title="item.name" />
        </a-anchor> -->
        <a-menu mode="inline" style="width: 200px">
            <a-menu-item v-for="item in menuInitData" :key="item.code" >
                <router-link :to="{query:{'code':item.code}}" :id="item.code+'1'">
                    <a-icon :type="item.icon"/>
                    {{item.name}}
                </router-link>
            </a-menu-item>
        </a-menu>
    </a-sider>
</template>

<script>
  import { Layout, Menu, Icon,Anchor } from 'ant-design-vue';
  import menuData from '@/common/menuData';
  import { getMenuInit } from '../../remote/base';
  import { autoDoFn } from '../../utils/util';

  const { Sider } = Layout;
  const { Item, SubMenu } = Menu;
  const { AnchorLink } = Anchor;

  export default {
    name: 'GlobalMenu',
    components: {
      ASider: Sider,
      AMenu: Menu,
      AMenuItem: Item,
      AIcon: Icon,
      ASubMenu: SubMenu,
      AAnchorlink:AnchorLink,
      AAnchor:Anchor,
    },
    data() {
      return {
        currentPath: '',
        menuData,
        menuInitData: [{
          path: '/index/staff',
          code: 'staff',
          name: '人员考勤管理',
          icon: 'user-add',
        }, {
          path: '/index/department',
          code: 'department',
          name: '部门业务管理',
          icon: 'bank'
        }, {
          path: '/index/window',
          code: 'window',
          name: '窗口服务管理',
          icon: 'windows',
        }, {
          path: '/index/complaint',
          code: 'complaint',
          name: '投诉建议反馈',
          icon: 'question-circle'
        }],
        addLoading: '',
        openKeys: [],
        icon: localStorage.getItem('icon'),
        employeesName: localStorage.getItem('employeesName') === undefined || localStorage.getItem('employeesName') === 'undefined' ? '您好，' + localStorage.getItem('userName') : '您好，' + localStorage.getItem('employeesName'),
        jobName: localStorage.getItem('jobName') === undefined || localStorage.getItem('jobName') === 'undefined' ? '' : localStorage.getItem('jobName'),
        organName: localStorage.getItem('organName') === undefined || localStorage.getItem('organName') === 'undefined' ? '' : localStorage.getItem('organName'),
        useAuthority: window.defaultConfig.useAuthority
      };
    },
    methods: {
        
    },
  };
</script>

<style lang="less">
    @import "../../common/base";

    .slider {
        height: 100%;
        overflow: auto;
        background-color: #fff;
        position: relative;
        .user {
            text-align: center;
            padding: 27px 10px;
            .avatar {
                img {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #a1a1a1;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                }
            }
            .name {
                font-size: 20px;
                color: #333;
                line-height: 30px;
                margin-top: 20px;
            }
            .role {
                font-size: 14px;
                color: #666666;
                margin-top: 15px;
            }
        }
        .ant-menu-root.ant-menu-inline {
            padding: 0 15px;
            border-right: none;
        }
        .ant-menu-item {
            font-size: 16px;
            outline: none;
            border-radius: 20px;
            padding-left: 20px !important;
            &.ant-menu-item-selected {
                background-color: @main-color;
                &:after {
                    border: none;
                }
                > a {
                    color: #fff;
                }

            }
        }
    }
</style>
