<template>
    <a-sider class="slider">
        <div class="user">
            <div class="avatar">
                <img v-if="String(icon).length <= 30" src="../../assets/defaultAvatar.png"/>
                <img :src="icon" v-else/>
            </div>
            <div class="name">
                您好，
                <span>{{employeesName}}</span>
            </div>
            <div class="role">{{jobName}}</div>
        </div>
        <a-menu
                mode="inline"
                :selectedKeys="[currentPath]"
                :defaultOpenKeys="openKeys"
                style="width: 200px"
        >
            <a-menu-item v-for="item in menuData" v-if="!useAuthority || item.isShow" :key="item.path">
                <router-link :to="'/' + item.path" @click.native="refresh(item.path)">
                    <a-icon :type="item.icon"/>
                    {{item.label}}
                </router-link>
            </a-menu-item>
        </a-menu>
    </a-sider>
</template>

<script>
import { Layout, Menu, Icon } from 'ant-design-vue';
import menuData from '@/common/menuData';
import { mapState } from 'vuex'

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

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
      openKeys: [],
      icon: localStorage.getItem('icon'),
      employeesName: localStorage.getItem('employeesName'),
      jobName: localStorage.getItem('jobName'),
    };
  },
  watch: {
    $route() {
      const { history: { current: { path } } } = this.$router;
      this.currentPath = path.slice(1);
    },
  },
  created() {
    const { history: { current: { path } } } = this.$router;
    this.currentPath = path.slice(1);
  },
  methods: {
    ...mapState({
      useAuthority: (state) => {
        if(state.useAuthority === !undefined){
          this.$store.commit('getDataFormLocalStorage');
        }
        return window.defaultConfig.useAuthority;
      }
    }),
    refresh(path) {
      if (this.currentPath === path) {
        this.$router.go(0);
      }
    },
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
        .ant-menu-root.ant-menu-inline{
            padding: 0 15px;
            border-right: none;
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
