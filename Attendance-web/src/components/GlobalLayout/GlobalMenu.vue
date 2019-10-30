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
        <a-menu
                mode="inline"
                :selectedKeys="[currentPath]"
                :defaultOpenKeys="openKeys"
                style="width: 200px"
        >
            <template v-for="item1 in menuInitData">
                <a-sub-menu v-show="item1.isShow === 0" v-if="(item1.children && item1.children.length)" :key="item1.ename">
                    <span slot="title">
                        <a-icon :type="item1.icon" />
                        {{item1.name}}
                    </span>
                    <a-menu-item v-for="item in item1.children" v-show="item.isShow === 0" :key="item.path">
                        <router-link :to="'/' + item.path" @click.native="refresh(item.path)">
                            <a-icon :type="item.icon"/>
                            {{item.name}}
                        </router-link>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item v-else :key="item1.path" v-show="item1.isShow === 0">
                    <router-link :to="'/' + item1.path" @click.native="refresh(item1.path)">
                        <a-icon :type="item1.icon"/>
                        {{item1.name}}
                    </router-link>
                </a-menu-item>
            </template>
        </a-menu>
    </a-sider>
</template>

<script>
import { Layout, Menu, Icon } from 'ant-design-vue';
import menuData from '@/common/menuData';
import { mapState } from 'vuex'
import { getMenuInit} from "../../remote/base";
import {autoDoFn} from "../../utils/util";

const { Sider } = Layout;
const { Item, SubMenu } = Menu;
const subKeys = ['attendance', 'leave', 'report'];
export default {
  name: 'GlobalMenu',
  components: {
    ASider: Sider,
    AMenu: Menu,
    AMenuItem: Item,
    AIcon: Icon,
    ASubMenu: SubMenu,
  },
  data() {
    return {
      currentPath: '',
      menuData,
        menuInitData: [],
        addLoading: false,
      openKeys: [],
      icon: localStorage.getItem('icon'),
        employeesName: localStorage.getItem('employeesName') === undefined || localStorage.getItem('employeesName') === 'undefined'  ? '您好，'+localStorage.getItem('userName') : '您好，'+localStorage.getItem('employeesName'),
        jobName: localStorage.getItem('jobName') === undefined || localStorage.getItem('jobName') === 'undefined' ?  '' : localStorage.getItem('jobName'),
        organName:localStorage.getItem('organName') === undefined || localStorage.getItem('organName') === 'undefined' ? '' : localStorage.getItem('organName'),
      // useAuthority: window.defaultConfig.useAuthority
    };
  },
  watch: {
    $route() {
      const { history: { current: { path } } } = this.$router;
      this.currentPath = path.slice(1);
    },
  },
  created() {
      this.menuInit();
    const { history: { current: { path } } } = this.$router;
    this.currentPath = path.slice(1);
    this.openKeys = subKeys.filter(item => this.currentPath.indexOf(item) > -1);
  },
  computed:{
    ...mapState({
      useAuthority: (state) => {
        if(state.useAuthority === !undefined){
          this.$store.commit('getDataFormLocalStorage');
          return window.defaultConfig.useAuthority;
        }
        return state.useAuthority;
      }
    }),
  },
  methods: {
    refresh(path) {
      if (this.currentPath === path) {
        this.$router.go(0);
      }
    },
      menuInit(){
          autoDoFn(async () => {
              this.addLoading = true;
              const res = await getMenuInit();
              if (res) {
                  this.menuInitData = res.data
                  console.log('menuData:'+this.menuData)
                  console.log('res:'+res.data[0].id)
              }
              this.addLoading = false;
          });
      }
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
                    border: 1px solid #eee;
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
        .ant-menu-root.ant-menu-inline{
            padding: 0 15px;
            border-right: none;
            .ant-menu-submenu-title{
                font-size: 16px;
                padding-left: 20px!important;
                color: #333;
            }
        }
        .ant-menu-sub.ant-menu-inline > .ant-menu-item{
            padding-left: 30px!important;
        }
        .ant-menu-item {
            font-size: 16px;
            outline: none;
            border-radius: 20px;
            padding-left: 20px !important;
            &.ant-menu-item-selected{
                background-color: @main-color;
                &:after{
                    border: none;
                }
                >a {
                    color: #fff;
                }
            }
        }
    }
</style>
